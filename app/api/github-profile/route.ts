import { NextResponse } from "next/server";

const githubGraphqlQuery = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          months {
            firstDay
            name
            totalWeeks
            year
          }
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

const githubRequestHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("user");

  if (!username) {
    return NextResponse.json(
      { error: "Missing GitHub username." },
      { status: 400 },
    );
  }

  try {
    const contributionPromise = process.env.GITHUB_TOKEN
      ? fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            ...githubRequestHeaders,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            query: githubGraphqlQuery,
            variables: { login: username },
          }),
        })
      : Promise.resolve(null);

    const [profileResponse, reposResponse, contributionResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: githubRequestHeaders,
        cache: "no-store",
      }),
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: githubRequestHeaders,
        cache: "no-store",
      }),
      contributionPromise,
    ]);

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Unable to fetch GitHub profile." },
        { status: profileResponse.status },
      );
    }

    if (!reposResponse.ok) {
      return NextResponse.json(
        { error: "Unable to fetch GitHub repositories." },
        { status: reposResponse.status },
      );
    }

    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    const contributionData = contributionResponse?.ok
      ? await contributionResponse.json()
      : null;

    return NextResponse.json({
      profile: {
        login: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        email: profile.email,
        phone: null,
        blog: profile.blog,
        twitter_username: profile.twitter_username,
        followers: profile.followers,
        following: profile.following,
        public_repos: profile.public_repos,
        public_gists: profile.public_gists,
        html_url: profile.html_url,
      },
      contributionCalendar:
        contributionData?.data?.user?.contributionsCollection?.contributionCalendar ??
        null,
      repos,
    });
  } catch (error) {
    console.log("Error fetching GitHub profile route:", error);

    return NextResponse.json(
      { error: "Unexpected error fetching GitHub data." },
      { status: 500 },
    );
  }
}

export const previewContent = {
  hero: {
    eyebrow: "Portfolio",
    titleSuffix: "Portfolio",
    subtitle: "Developer Portfolio",
    emptyBio:
      "Building thoughtful software and turning ideas into production-ready products.",
    contactTitle: "Contact",
    githubLabel: "GitHub",
    emailLabel: "Email",
    phoneLabel: "Phone",
    githubButtonLabel: "View GitHub",
    emailFallback: "No public email",
    phoneFallback: "No public number",
  },
  skills: {
    title: "Skills & Focus",
    description: "",
    emptyLanguages: "No languages detected yet.",
    emptyRoles: "No role suggestions available yet.",
    rolesTitle: "Roles",
  },
  featuredProject: {
    title: "Featured Project",
    descriptionLabel: "Project Overview",
    imageLabel: "Featured Project Visual",
    ctaLabel: "View Project",
  },
  projects: {
    title: "Selected Projects",
    imageLabel: "Project Preview",
    ctaLabel: "Open Repository",
  },
  contact: {
    title: "Contact",
    description:
      "Interested in collaborating, hiring, or learning more about this work? Reach out directly or explore the full GitHub profile.",
    emailLabel: "Email",
    githubLabel: "GitHub",
    phoneLabel: "Phone",
    phoneFallback: "No public number available.",
    emailFallback: "No public email available.",
  },
  contributions: {
    title: "Contributions",
    description:
      "A snapshot of public GitHub footprint pulled from the profile.",
    reposLabel: "Public repos",
    followersLabel: "Followers",
    followingLabel: "Following",
    gistsLabel: "Public gists",
  },
  contributionActivity: {
    title: "Contribution Activity",
    description:
      "Recent public activity based on repositories, stars, and update cadence.",
    totalStarsLabel: "Total stars",
    activeReposLabel: "Active repos",
    latestUpdateLabel: "Latest update",
    languagesLabel: "Languages used",
  },
  socials: {
    title: "Socials & Links",
    description:
      "Public websites and linked social handles from the GitHub profile.",
    githubLabel: "GitHub",
    websiteLabel: "Website",
    twitterLabel: "X / Twitter",
    websiteFallback: "No public website linked.",
    twitterFallback: "No public social handle linked.",
  },
  shared: {
    fallbackProjectDescription:
      "A production-minded repository that reflects hands-on iteration, architecture decisions, and ongoing improvement.",
    learnedLabel: "What I learned",
    updatedLabel: "Last updated",
    languageFallback: "Mixed",
  },
} as const;

export const previewRoleMap: Record<string, string[]> = {
  TypeScript: ["Frontend Developer", "Full-Stack Developer"],
  JavaScript: ["Frontend Developer", "Full-Stack Developer"],
  HTML: ["Frontend Developer"],
  CSS: ["Frontend Developer", "UI Engineer"],
  Python: ["Backend Developer", "Automation Engineer"],
  Java: ["Backend Developer"],
  Kotlin: ["Backend Developer", "Mobile Developer"],
  Go: ["Backend Developer", "Platform Engineer"],
  Rust: ["Systems Developer", "Backend Developer"],
  C: ["Systems Developer"],
  "C++": ["Systems Developer"],
  CSharp: ["Backend Developer"],
  "C#": ["Backend Developer"],
  PHP: ["Backend Developer", "Full-Stack Developer"],
  Ruby: ["Backend Developer"],
  Swift: ["Mobile Developer"],
  Dart: ["Mobile Developer"],
  Shell: ["DevOps Engineer"],
  Dockerfile: ["DevOps Engineer", "Platform Engineer"],
};

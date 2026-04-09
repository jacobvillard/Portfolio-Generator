"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [link, setLink] = useState("");
    const router = useRouter();

    const handleGenerate = () => {
        try {
            const url = new URL(link);
            const pathParts = url.pathname.split("/");
            const username = pathParts[1];

            if (!username) {
                console.log("No username found");
                return;
            }

            router.push(`/preview?user=${username}`);
        } catch (err) {
            console.log("Invalid GitHub URL");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-xl text-center">
                <h1 className="text-4xl font-bold">Portfolio Generator</h1>
                <p className="mt-4 text-gray-600">
                    Paste a GitHub profile and generate a portfolio preview.
                </p>

                <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="mt-6 w-full rounded border p-3"
                />

                <button
                    onClick={handleGenerate}
                    className="mt-4 rounded bg-black px-6 py-3 text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800"
                >
                    Generate
                </button>
            </div>
        </main>
    );
}
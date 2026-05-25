import { NextResponse } from "next/server";
import { searchRepos } from "@/lib/github";

export const revalidate = 43200; //here I have added intentionally more cache time cause trending repositories on github do not change frequently and it will help to reduce the number of API calls to github and also improve the performance of the application.

export async function GET() {
  try {
    const categories = [
      {
        id: "productivity",
        title: "Productivity",
        query: "topic:productivity",
      },
      {
        id: "development",
        title: "Developer Tools",
        query: "topic:developer-tools",
      },
      {
        id: "media",
        title: "Media & Entertainment",
        query: "topic:media",
      },
      {
        id: "gaming",
        title: "Gaming",
        query: "topic:gaming",
      },
      {
        id: "ai",
        title: "Artificial Intelligence",
        query: "topic:ai",
      },
      {
        id: "utilities",
        title: "Utilities & Tools",
        query: "topic:utilities",
      },
    ];

    const results = await Promise.all(
      categories.map((cat) => searchRepos(cat.query)),
    );

    const payload = categories.map((cat, index) => ({
      id: cat.id,
      title: cat.title,
      items: results[index].slice(0, 10),
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trending repositories." },
      { status: 500 },
    );
  }
}

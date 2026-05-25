import { NextRequest, NextResponse } from "next/server";
import { searchRepos } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Search query 'q' is required." },
        { status: 400 },
      );
    }

    const results = await searchRepos(query.trim());

    return NextResponse.json(results, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error during search." },
      { status: 500 },
    );
  }
}

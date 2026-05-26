import { Suspense } from "react";
import { SearchX, ChevronLeft } from "lucide-react";
import Link from "next/link";
import AppCard from "@/components/AppCard";
import AppCardSkeleton from "@/components/AppCardSkeleton";
import SearchBar from "@/components/SearchBar";

interface RepoItem {
  owner: string;
  avatar: string | null;
  name: string;
  description: string;
  stars: number;
  forks: number;
}

async function fetchResults(query: string): Promise<RepoItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/search?q=${encodeURIComponent(query)}`,
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — GitShelf Search` : "Search — GitShelf",
  };
}

async function Results({ query }: { query: string }) {
  const items = await fetchResults(query);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
        <SearchX className="h-12 w-12 opacity-40" />
        <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <AppCard
          key={`${item.owner}/${item.name}`}
          name={item.name}
          owner={item.owner ?? ""}
          description={item.description}
          avatarUrl={item.avatar ?? `https://avatars.githubusercontent.com/${item.owner}`}
          stars={item.stars}
          forks={item.forks}
          platforms={[]}
        />
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div
            className="hidden lg:block absolute top-0 bottom-0 border-l border-border"
            style={{ left: "calc(1.5rem + 2px)" }}
          />
          <div
            className="hidden lg:block absolute top-0 bottom-0 border-r border-border"
            style={{ right: "calc(1.5rem + 2px)" }}
          />
          <div className="lg:px-9 flex items-center gap-3">
            <Link
              href="/"
              className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-2 transition-colors bg-background hover:bg-muted/50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <SearchBar initialValue={query} />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto flex-1 w-full">
        <div
          className="hidden lg:block absolute top-0 bottom-0 border-l border-border"
          style={{ left: "calc(1.5rem + 2px)" }}
        />
        <div
          className="hidden lg:block absolute top-0 bottom-0 border-r border-border"
          style={{ right: "calc(1.5rem + 2px)" }}
        />

        <div className="px-4 sm:px-6 lg:px-14 pt-8 pb-16">
          {query ? (
            <>
              <h1 className="text-sm text-muted-foreground mb-6">
                Results for{" "}
                <span className="text-foreground font-semibold">&ldquo;{query}&rdquo;</span>
              </h1>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <AppCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <Results query={query} />
              </Suspense>
            </>
          ) : (
            <p className="text-muted-foreground text-sm text-center mt-20">
              Type something in the search bar and press Enter.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

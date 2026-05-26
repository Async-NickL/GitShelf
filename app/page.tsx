import SearchBar from "@/components/SearchBar";
import CategoryRow from "@/components/CategoryRow";

interface RepoItem {
  owner: string;
  avatar: string | null;
  name: string;
  description: string;
  stars: number;
  forks: number;
}

interface Category {
  id: string;
  title: string;
  items: RepoItem[];
}

async function getTrending(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/trending`,
      { next: { revalidate: 43200 } },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const categories = await getTrending();

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
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
          <div className="lg:px-9">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div
          className="hidden lg:block absolute top-0 bottom-0 border-l border-border"
          style={{ left: "calc(1.5rem + 2px)" }}
        />
        <div
          className="hidden lg:block absolute top-0 bottom-0 border-r border-border"
          style={{ right: "calc(1.5rem + 2px)" }}
        />

        <div className="sm:px-6 lg:px-14 pt-8 pb-16">
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center mt-20">
              No trending apps found.
            </p>
          ) : (
            categories.map((cat, idx) => (
              <div key={cat.id}>
                <CategoryRow
                  title={cat.title}
                  items={cat.items.map((item) => ({
                    name: item.name,
                    owner: item.owner ?? "",
                    description: item.description,
                    avatarUrl: item.avatar ?? `https://avatars.githubusercontent.com/${item.owner}`,
                    stars: item.stars,
                    forks: item.forks ?? 0,
                    platforms: [],
                  }))}
                />
                {idx < categories.length - 1 && (
                  <hr className="border-border mb-14 -mt-6 lg:-mx-[37px]" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}


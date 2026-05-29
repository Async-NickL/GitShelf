import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, GitFork, Calendar, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import DownloadSection from "@/components/DownloadSection";
import CollapsibleReadme from "@/components/CollapsibleReadme";
import { marked } from "marked";

interface Asset {
  name: string;
  download_url: string;
}

interface Release {
  version: string;
  title: string;
  isLatest: boolean;
  assets: Asset[];
}

interface StoreData {
  type: string;
  repo: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    lastUpdated: string;
  };
  store: {
    name?: string;
    short_description?: string;
    category?: string;
    platforms?: string[];
    tags?: string[];
    license?: string;
  } | null;
  readme: string | null;
  changelog: string | null;
  assets: {
    icon: string | null;
    screenshots: { name: string; download_url: string }[];
  };
  releases: Release[];
  website?: string | null;
  webapp?: string | null;
}

async function fetchStoreData(owner: string, repo: string): Promise<StoreData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/store/${owner}/${repo}`,
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const data = await fetchStoreData(owner, repo);
  const appName = data?.store?.name || data?.repo?.name || repo;
  const desc = data?.store?.short_description || data?.repo?.description || "";
  return {
    title: `${appName} — GitShelf`,
    description: desc,
    openGraph: {
      title: `${appName} — GitShelf`,
      description: desc,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const data = await fetchStoreData(owner, repo);

  if (!data) notFound();

  const appName = data.store?.name || data.repo.name;
  const shortDesc = data.store?.short_description || data.repo.description;
  const iconUrl = data.assets.icon || `https://avatars.githubusercontent.com/${owner}`;

  const latestRelease = data.releases.find((r) => r.isLatest) || data.releases[0];
  const platforms = data.store?.platforms || [];
  const tags = data.store?.tags || [];
  const category = data.store?.category || null;

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-2 transition-colors bg-background hover:bg-muted/50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs text-muted-foreground truncate">{owner}</span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs text-foreground font-medium truncate">{data.repo.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex-1">
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shrink-0 ring-1 ring-border/50">
                  <AvatarImage src={iconUrl} alt={appName} />
                  <AvatarFallback className="rounded-2xl text-lg font-bold bg-primary/10 text-primary">
                    {appName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 pt-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    {appName}
                  </h1>
                  <Link
                    href={`https://github.com/${owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {owner}
                  </Link>
                  {shortDesc && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                      {shortDesc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {formatCount(data.repo.stars)} stars
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="h-3.5 w-3.5" />
                  {formatCount(data.repo.forks)} forks
                </span>
                {latestRelease && (
                  <span className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {latestRelease.version}
                    </Badge>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(data.repo.lastUpdated)}
                </span>
              </div>

              {platforms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {platforms.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px] capitalize">
                      {p}
                    </Badge>
                  ))}
                </div>
              )}

              {data.assets.screenshots && data.assets.screenshots.length > 0 && (
                <div className="mb-8 -mx-4 sm:mx-0">
                  <h2 className="text-sm font-semibold text-foreground mb-3 px-4 sm:px-0">Screenshots</h2>
                  <ScreenshotGallery screenshots={data.assets.screenshots} />
                </div>
              )}

              <div className="mb-8 lg:hidden">
                <DownloadSection releases={data.releases} appIcon={iconUrl} />
              </div>

              {data.readme && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-foreground mb-3">About</h2>
                  <CollapsibleReadme html={marked.parse(data.readme, { async: false }) as string} />
                </div>
              )}

              {data.changelog && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-foreground mb-3">Changelog</h2>
                  <div className="rounded-xl border border-border/50 bg-muted/10 p-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                    {data.changelog}
                  </div>
                </div>
              )}
            </div>

            <aside className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-20 space-y-6">
                <div className="hidden lg:block">
                  <DownloadSection releases={data.releases} appIcon={iconUrl} />
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Info</h3>

                  {data.store?.license && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">License</span>
                      <span className="text-foreground">{data.store.license}</span>
                    </div>
                  )}

                  {category && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline" className="text-[10px] capitalize">{category}</Badge>
                    </div>
                  )}

                  {data.website && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Official Website</span>
                      <a
                        href={data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-medium truncate max-w-[150px]"
                      >
                        Visit Site <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {data.webapp && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Web Application</span>
                      <a
                        href={data.webapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        Open App <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1.5">Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/40 space-y-2">
                    <a
                      href={`https://github.com/${owner}/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View on GitHub
                    </a>
                  </div>
                </div>


              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

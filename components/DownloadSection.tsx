"use client";
import { useEffect, useState } from "react";
import { Download, Monitor, Smartphone, Apple, Terminal, ChevronDown } from "lucide-react";

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

interface DownloadSectionProps {
  releases: Release[];
}

type Platform = "windows" | "mac" | "linux" | "android" | "unknown";

const PLATFORM_CONFIG: Record<
  Exclude<Platform, "unknown">,
  { label: string; icon: typeof Monitor; extensions: string[] }
> = {
  windows: { label: "Windows", icon: Monitor, extensions: [".exe", ".msi", ".msix", ".appx", ".zip"] },
  mac: { label: "macOS", icon: Apple, extensions: [".dmg", ".pkg", ".app"] },
  linux: { label: "Linux", icon: Terminal, extensions: [".deb", ".rpm", ".appimage", ".snap", ".tar.gz", ".tar.xz"] },
  android: { label: "Android", icon: Smartphone, extensions: [".apk", ".aab"] },
};

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/mac|iphone|ipad/.test(ua)) return "mac";
  if (/win/.test(ua)) return "windows";
  if (/linux/.test(ua)) return "linux";
  return "unknown";
}

function classifyAsset(name: string): Platform | null {
  const lower = name.toLowerCase();
  for (const [platform, config] of Object.entries(PLATFORM_CONFIG)) {
    if (config.extensions.some((ext) => lower.endsWith(ext))) {
      return platform as Platform;
    }
  }
  return null;
}

export default function DownloadSection({ releases }: DownloadSectionProps) {
  const [userPlatform, setUserPlatform] = useState<Platform>("unknown");
  const [showAll, setShowAll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setUserPlatform(detectPlatform());
  }, []);

  if (!releases || releases.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-muted/10 p-6 text-center">
        <p className="text-sm text-muted-foreground">No releases available yet.</p>
      </div>
    );
  }

  const activeRelease = releases[selectedIndex];
  if (!activeRelease || activeRelease.assets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Download</h2>
          <ReleaseDropdown
            releases={releases}
            selectedIndex={selectedIndex}
            open={dropdownOpen}
            onToggle={() => setDropdownOpen((v) => !v)}
            onSelect={(i) => {
              setSelectedIndex(i);
              setDropdownOpen(false);
              setShowAll(false);
            }}
          />
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">No assets in this release.</p>
        </div>
      </div>
    );
  }

  const grouped: Record<string, Asset[]> = {};
  const ungrouped: Asset[] = [];
  for (const asset of activeRelease.assets) {
    const platform = classifyAsset(asset.name);
    if (platform) {
      if (!grouped[platform]) grouped[platform] = [];
      grouped[platform].push(asset);
    } else {
      ungrouped.push(asset);
    }
  }

  const recommended = userPlatform !== "unknown" ? grouped[userPlatform] : undefined;
  const platformConfig = userPlatform !== "unknown" ? PLATFORM_CONFIG[userPlatform] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Download</h2>
        <ReleaseDropdown
          releases={releases}
          selectedIndex={selectedIndex}
          open={dropdownOpen}
          onToggle={() => setDropdownOpen((v) => !v)}
          onSelect={(i) => {
            setSelectedIndex(i);
            setDropdownOpen(false);
            setShowAll(false);
          }}
        />
      </div>

      {recommended && recommended.length > 0 && platformConfig && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Recommended for your device</p>
          {recommended.map((asset) => {
            const Icon = platformConfig.icon;
            return (
              <a
                key={asset.name}
                href={asset.download_url}
                className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 transition-all hover:bg-primary/10 hover:border-primary/50 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{platformConfig.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{asset.name}</p>
                </div>
                <Download className="h-4 w-4 text-primary shrink-0 group-hover:translate-y-0.5 transition-transform" />
              </a>
            );
          })}
        </div>
      )}

      {Object.keys(grouped).length > 0 && (
        <div>
          {(!recommended || recommended.length === 0) && (
            <p className="text-xs text-muted-foreground mb-2">Available platforms</p>
          )}
          {(recommended && recommended.length > 0) && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-xs text-primary hover:underline underline-offset-4 mb-2"
            >
              {showAll ? "Hide other platforms" : "Show all platforms"}
            </button>
          )}
          {(showAll || !recommended || recommended.length === 0) && (
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(grouped)
                .filter(([platform]) => platform !== userPlatform)
                .map(([platform, assets]) => {
                  const config = PLATFORM_CONFIG[platform as Exclude<Platform, "unknown">];
                  const Icon = config.icon;
                  return assets.map((asset) => (
                    <a
                      key={asset.name}
                      href={asset.download_url}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-all hover:bg-muted/40 hover:border-border group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{config.label}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{asset.name}</p>
                      </div>
                      <Download className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  ));
                })}
            </div>
          )}
        </div>
      )}

      {ungrouped.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Other files</p>
          {ungrouped.map((asset) => (
            <a
              key={asset.name}
              href={asset.download_url}
              className="flex items-center gap-3 rounded-lg border border-border/30 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <Download className="h-3 w-3 shrink-0" />
              <span className="truncate">{asset.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ReleaseDropdown({
  releases,
  selectedIndex,
  open,
  onToggle,
  onSelect,
}: {
  releases: Release[];
  selectedIndex: number;
  open: boolean;
  onToggle: () => void;
  onSelect: (i: number) => void;
}) {
  if (releases.length <= 1) {
    return (
      <span className="text-xs text-muted-foreground">
        {releases[0]?.version}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 transition-colors bg-background hover:bg-muted/50"
      >
        {releases[selectedIndex]?.version}
        {releases[selectedIndex]?.isLatest && (
          <span className="text-[9px] text-primary font-semibold">latest</span>
        )}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-48 rounded-xl border border-border bg-popover shadow-xl shadow-black/20 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-150">
            <div className="max-h-52 overflow-y-auto py-1">
              {releases.map((release, i) => (
                <button
                  key={release.version}
                  type="button"
                  onClick={() => onSelect(i)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    i === selectedIndex
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <span className="font-medium">{release.version}</span>
                  <span className="flex items-center gap-1.5">
                    {release.isLatest && (
                      <span className="text-[9px] text-primary font-semibold">latest</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {release.assets.length} file{release.assets.length !== 1 ? "s" : ""}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

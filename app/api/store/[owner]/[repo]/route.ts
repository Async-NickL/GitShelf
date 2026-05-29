import { NextResponse } from "next/server";
import {
  getRepo,
  getReleases,
  getReadme,
  getStoreYml,
  getFileMetadata,
  getFolderAssets,
  getFileContent,
} from "@/lib/github";

export const revalidate = 600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  try {
    const { owner, repo } = await params;

    const [repoData, releases, readme, storeYml] = await Promise.all([
      getRepo(owner, repo),
      getReleases(owner, repo),
      getReadme(owner, repo),
      getStoreYml(owner, repo),
    ]);

    if (!repoData) {
      return NextResponse.json(
        { error: "Repository not found." },
        { status: 404 },
      );
    }

    let listingType = "basic";
    let iconPath = ".StoreAssets/icon.png";
    let screensPath = ".StoreAssets/Screens";
    let changelogPath = null;
    let website = null;
    let webapp = null;

    if (storeYml && typeof storeYml === "object") {
      const store = storeYml as Record<string, unknown>;

      const hasRequiredFields =
        Boolean(store.name) &&
        Boolean(store.category) &&
        Boolean(store.platforms) &&
        Boolean(store.short_description);

      listingType = hasRequiredFields ? "verified" : "incomplete";

      if (typeof store.icon === "string") iconPath = store.icon;
      if (typeof store.screenshots === "string")
        screensPath = store.screenshots;
      if (typeof store.changelog === "string") changelogPath = store.changelog;
      if (typeof store.website === "string") website = store.website;
      if (typeof store.webapp === "string") webapp = store.webapp;
    }

    const [iconMeta, screenshots, changelog] = await Promise.all([
      getFileMetadata(owner, repo, iconPath),
      getFolderAssets(owner, repo, screensPath),
      changelogPath
        ? getFileContent(owner, repo, changelogPath)
        : Promise.resolve(null),
    ]);

    const payload = {
      type: listingType,
      repo: repoData,
      store: storeYml || null,
      readme: readme,
      changelog: changelog,
      assets: {
        icon: iconMeta?.download_url || repoData.avatar || `https://avatars.githubusercontent.com/${owner}`,
        screenshots: screenshots,
      },
      releases: releases,
      website: website || repoData?.homepage || null,
      webapp: webapp || null,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

import { Octokit } from "@octokit/rest";
import yaml from "js-yaml";

type ReleaseAsset = { name: string; browser_download_url: string };
type Release = {
  tag_name: string;
  name: string | null;
  assets: ReleaseAsset[];
};
type RepoFile = { name: string; download_url: string };
type SearchRepo = {
  owner?: { login: string; avatar_url: string } | null;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    fetch: (url: string, options: RequestInit) => {
      return fetch(url, { ...options, next: { revalidate: 600 } });
    },
  },
});

export async function getRepo(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return {
      name: data.name,
      description: data.description || "",
      stars: data.stargazers_count,
      forks: data.forks_count,
      lastUpdated: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function getReleases(
  owner: string,
  repo: string,
  limit: number = 5,
) {
  try {
    const { data } = await octokit.rest.repos.listReleases({
      owner,
      repo,
      per_page: limit,
    });
    if (!data || data.length === 0) return [];
    return (data as Release[]).map((release, index) => ({
      version: release.tag_name,
      title: release.name || release.tag_name,
      isLatest: index === 0,
      assets: release.assets.map((asset) => ({
        name: asset.name,
        download_url: asset.browser_download_url,
      })),
    }));
  } catch {
    return [];
  }
}

export async function getReadme(owner: string, repo: string) {
  return getFileContent(owner, repo, "README.md");
}

export async function getStoreYml(owner: string, repo: string) {
  try {
    const content = await getFileContent(owner, repo, "store.yml");
    return content ? yaml.load(content) : null;
  } catch {
    return null;
  }
}

export async function searchRepos(query: string) {
  try {
    const { data } = await octokit.rest.search.repos({
      q: `${query} has:releases`,
      sort: "stars",
      order: "desc",
      per_page: 30,
    });
    return (data.items as SearchRepo[]).map((repo) => ({
      owner: repo.owner?.login,
      avatar: repo.owner?.avatar_url || null,
      name: repo.name,
      description: repo.description || "",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));
  } catch {
    return [];
  }
}

export async function getFileMetadata(
  owner: string,
  repo: string,
  path: string,
) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if (!Array.isArray(data) && data.type === "file") {
      return { name: data.name, download_url: data.download_url };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getFolderAssets(
  owner: string,
  repo: string,
  path: string,
) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if (Array.isArray(data)) {
      return (data as RepoFile[]).map((file) => ({
        name: file.name,
        download_url: file.download_url,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if (
      !Array.isArray(data) &&
      data.type === "file" &&
      "content" in data &&
      typeof data.content === "string"
    ) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

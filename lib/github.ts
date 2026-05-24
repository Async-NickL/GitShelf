import { Octokit } from "@octokit/rest";
import yaml from "js-yaml";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    fetch: (url: string, options: any) => {
      return fetch(url, {
        ...options,
        next: { revalidate: 600 },
      });
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

    return data.map((release: any, index: number) => ({
      version: release.tag_name,
      title: release.name || release.tag_name,
      isLatest: index === 0,
      assets: release.assets.map((asset: any) => ({
        name: asset.name,
        download_url: asset.browser_download_url,
      })),
    }));
  } catch {
    return [];
  }
}

export async function getReadme(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.getReadme({ owner, repo });
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export async function getStoreAssets(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ".StoreAssets",
    });

    if (Array.isArray(data)) {
      return data.map((file: any) => ({
        name: file.name,
        download_url: file.download_url,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function getStoreYml(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: "store.yml",
    });

    if (!Array.isArray(data) && data.type === "file" && data.content) {
      const decoded = Buffer.from(data.content, "base64").toString("utf-8");
      return yaml.load(decoded);
    }
    return null;
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

    return data.items.map((repo: any) => ({
      owner: repo.owner?.login,
      name: repo.name,
      description: repo.description || "",
      stars: repo.stargazers_count,
    }));
  } catch {
    return [];
  }
}

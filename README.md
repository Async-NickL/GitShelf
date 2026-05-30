# GitShelf

A human-friendly front-end for GitHub releases. GitShelf presents GitHub repositories as clean, browsable app listings so that non-technical users can find, understand, and download apps without ever navigating a repository.

---

## Overview

GitHub releases are the standard way developers ship downloadable software, including Windows installers, Android APKs, and Linux binaries. The problem is that GitHub itself is built for developers. When a developer shares a GitHub link with a non-technical person, that person sees a wall of code, branches, and commit history with no clear path to the actual download.

GitShelf solves this by sitting on top of the GitHub API and rendering repositories as app store-style listings. A user opens GitShelf, finds the app, reads a description, sees screenshots, and clicks a single download button for their platform. No GitHub account required, no repository navigation, no confusion.

GitShelf never hosts any files itself. All downloads link directly to release assets on GitHub.

---

## How It Works

GitShelf reads data from three sources for each repository:

1. **GitHub Repository API** - name, description, stars, forks, last updated date
2. **GitHub Releases API** - latest release tag and downloadable assets per platform
3. **`store.yml` and `.StoreAssets`** - optional metadata and media files added by the developer (explained below)

Any repository with a GitHub release will appear on GitShelf as a basic listing. Developers who want a richer listing with an icon, screenshots, category, and a verified badge can add a `store.yml` file and a `.StoreAssets` folder to their repository.

---

## For Developers - Opting In

To get a verified listing on GitShelf, add the following to your repository root:

```
your-repo/
├── store.yml
├── README.md
└── .StoreAssets/
    ├── icon.png
    ├── screen1.png
    ├── screen2.png
    └── screen3.png
```

### store.yml

`store.yml` is a metadata file that tells GitShelf how to display your app. Place it in the root of your repository.

```yaml
name: "Your App Name"
icon: ".StoreAssets/icon.png"
category: "productivity"
platforms:
  - windows
  - android
  - linux
short_description: "One line that describes what your app does."
tags:
  - tag1
  - tag2
changelog: "CHANGELOG.md"
license: "MIT"
```

**Required fields**

| Field | Description |
|---|---|
| `name` | Display name of your app |
| `category` | Category used for filtering (e.g. `productivity`, `utilities`, `games`) |
| `platforms` | List of supported platforms: `windows`, `android`, `linux`, `mac` |
| `short_description` | One-line description shown on cards and search results |

**Optional fields**

| Field | Description |
|---|---|
| `icon` | Path to the icon file inside `.StoreAssets` |
| `tags` | Additional keywords for search and filtering |
| `changelog` | Path to your changelog file |
| `license` | License identifier (e.g. `MIT`, `Apache-2.0`) |

If `store.yml` is present and all required fields are filled in, your listing receives a **Verified** badge. If required fields are missing, the listing is marked incomplete. If `store.yml` is absent entirely, GitShelf generates a basic listing from the repository description and releases.

### .StoreAssets

`.StoreAssets` is a folder in your repository root that holds the visual assets for your listing.

| File | Description |
|---|---|
| `icon.png` | App icon, recommended size 512x512 pixels |
| `screen*.png` | Screenshots shown in the gallery. Any file whose name starts with `screen` is picked up automatically (e.g. `screen1.png`, `screen-home.png`) |

All images are served directly via the GitHub CDN using each file's `download_url`. GitShelf does not re-host or process them.

If no icon is provided, GitShelf falls back to the repository owner's GitHub avatar. If no screenshots are provided, the screenshot section is hidden.

### Releases

GitShelf reads download links from your GitHub releases. Create a release on GitHub and attach your platform-specific files as release assets. GitShelf maps each asset to a platform and displays one download button per platform on the listing page.

No changes to your release workflow are needed. GitShelf reads whatever you publish.

---

## For Users

Open [git-shelf.vercel.app](https://git-shelf.vercel.app), search or browse the trending grid, and click an app to open its listing. Each listing shows:

- App icon and name
- Short description and full README
- Screenshots
- Platform download buttons that link directly to the GitHub release asset
- Version number, stars, forks, and last updated date

No account, no login, no tracking.

---

## Self-Hosting

### Prerequisites

- Node.js 18 or later
- A GitHub Personal Access Token with `public_repo` read access

### Setup

```bash
git clone https://github.com/Async-NickL/GitShelf.git
cd gitshelf
npm install
```

Copy the environment file and fill in your token:

```bash
cp .env.example .env.local
```

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token. Gives 5,000 API requests per hour. All users share this single token, and since responses are cached for 10 minutes on the server, the limit is not a practical concern under normal traffic. |
| `NEXT_PUBLIC_BASE_URL` | Yes | Base URL of the running instance. Use `http://localhost:3000` locally and your deployment URL in production. |

### Docker

A `Dockerfile` and `docker-compose.yml` are included if you prefer running GitShelf in a container.

```bash
docker-compose up
```

Set `GITHUB_TOKEN` and `NEXT_PUBLIC_BASE_URL` in your environment or in a `.env` file before running.

---

## Architecture

GitShelf is a Next.js application using the App Router. There is no database, no authentication layer, and no file storage.

```
User request
     |
     v
Next.js API route
     |
     v
lib/github.js  -->  Octokit  -->  GitHub API  (authenticated with GITHUB_TOKEN)
     |
     v
Response cached 10 minutes on Vercel
     |
     v
All subsequent users within that window get the cached response
```

Every GitHub API call uses `next: { revalidate: 600 }`, which means GitHub is called at most once per 10 minutes per resource, regardless of how many users are visiting.

**API routes**

| Route | Description |
|---|---|
| `GET /api/store/[owner]/[repo]` | Full listing for one app, combining repo info, store.yml, releases, and store assets |
| `GET /api/search?q=` | Search results filtered to repositories that have releases |
| `GET /api/trending` | Homepage repositories sorted by stars |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| GitHub API | Octokit (`@octokit/rest`) |
| YAML parsing | `js-yaml` |
| UI | Tailwind CSS, shadcn/ui, Radix UI |
| Animations | Motion |
| Markdown | `marked` |
| Hosting | Vercel |

---

## Contributing

Contributions are welcome. Open an issue to discuss what you want to change before submitting a pull request. Please keep changes focused, one concern per PR.

---

## License

MIT. See [LICENSE](./LICENSE) for details.

Copyright (c) 2026 Nikhil Kole

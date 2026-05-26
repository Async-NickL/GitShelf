import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div
          className="hidden lg:block absolute top-0 bottom-0 border-l border-border"
          style={{ left: "calc(1.5rem + 2px)" }}
        />
        <div
          className="hidden lg:block absolute top-0 bottom-0 border-r border-border"
          style={{ right: "calc(1.5rem + 2px)" }}
        />

        <div className="lg:px-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-between text-sm text-muted-foreground">
          <p className="text-center sm:text-left flex flex-wrap items-center justify-center sm:justify-start gap-1">
            Made with{" "}
            <span className="text-rose-500" aria-label="love">
              ❤️
            </span>{" "}
            by{" "}
            <Link
              href="https://github.com/Async-NickL"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline underline-offset-4 transition-colors"
            >
              Nikhil Kole
            </Link>{" "}
            from India{" "}
            <span aria-label="Indian flag">🇮🇳</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              href="https://github.com/Async-NickL/GitShelf/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-foreground transition-colors"
            >
              MIT License
            </Link>

            <span className="text-border hidden sm:inline" aria-hidden="true">|</span>

            <Link
              href="https://github.com/Async-NickL/GitShelf/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-foreground transition-colors"
            >
              Report Issue
            </Link>

            <Link
              href="https://github.com/Async-NickL/GitShelf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-muted/70 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

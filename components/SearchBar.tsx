"use client";
import { Search, Star, TrendingUp, X } from "lucide-react";
import { AnimatedInput } from "@/components/ui/animated-input";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Suggestion {
  owner: string;
  avatar: string | null;
  name: string;
  description: string;
  stars: number;
}

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({
  initialValue = "",
  placeholder = "Search apps, tools, utilities…",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.slice(0, 6));
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setActiveIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!v.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => fetchSuggestions(v), 400);
  };

  const navigate = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      setIsOpen(false);
      setSuggestions([]);
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    },
    [router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      const s = suggestions[activeIndex];
      setIsOpen(false);
      setSuggestions([]);
      router.push(`/${s.owner}/${s.name}`);
    } else {
      navigate(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showDropdown = isOpen && value.trim().length > 0;

  return (
    <>
      {isOpen && (
        <div
          className="hidden sm:block fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div ref={containerRef} className="relative w-full mx-auto z-50">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <AnimatedInput
              ref={inputRef}
              type="search"
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-10 h-12 text-base rounded-lg [&::-webkit-search-cancel-button]:hidden"
            />
            {value.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setValue("");
                  setSuggestions([]);
                  setIsOpen(false);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-6 w-6 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {showDropdown && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-xl border border-border bg-popover shadow-2xl shadow-black/20 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-150">
            {loading ? (
              <div className="px-4 py-3 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                      <div className="h-2.5 w-48 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="px-3 py-2 flex items-center gap-1.5 border-b border-border">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Suggestions
                  </span>
                </div>
                <ul>
                  {suggestions.map((s, i) => (
                    <li key={`${s.owner}/${s.name}`}>
                      <button
                        type="button"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          activeIndex === i
                            ? "bg-accent"
                            : "hover:bg-accent/60"
                        }`}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => {
                          setIsOpen(false);
                          setSuggestions([]);
                          router.push(`/${s.owner}/${s.name}`);
                        }}
                      >
                        <Avatar className="h-8 w-8 rounded-lg shrink-0">
                          <AvatarImage
                            src={s.avatar ?? `https://avatars.githubusercontent.com/${s.owner}`}
                            alt={s.name}
                          />
                          <AvatarFallback className="rounded-lg text-[10px] font-bold bg-primary/10 text-primary">
                            {s.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate leading-tight">
                            {s.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {s.owner}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {s.stars >= 1000 ? `${(s.stars / 1000).toFixed(1)}k` : s.stars}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-3 py-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => navigate(value)}
                    className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                  >
                    <Search className="h-3 w-3" />
                    Search for &ldquo;{value}&rdquo;
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No results for &ldquo;{value}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

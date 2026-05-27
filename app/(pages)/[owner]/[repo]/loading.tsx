import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center gap-1 border border-border rounded-lg px-2.5 py-2 bg-background">
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex-1">
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-6">
                <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                  <Skeleton className="h-3 w-full max-w-sm rounded-md" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>

              <Skeleton className="h-5 w-28 rounded-md mb-3" />
              <div className="flex gap-3 overflow-hidden mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-80 rounded-xl shrink-0" />
                ))}
              </div>

              <Skeleton className="h-5 w-16 rounded-md mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-4/5 rounded-md" />
                <Skeleton className="h-3 w-3/5 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </div>
            </div>

            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import AppCardSkeleton from "@/components/AppCardSkeleton";
import { ChevronLeft } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="lg:px-9 flex items-center gap-3">
            <div className="shrink-0 flex items-center gap-1 border border-border rounded-lg px-2.5 py-2 bg-background">
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto flex-1 w-full">
        <div className="px-4 sm:px-6 lg:px-14 pt-8 pb-16">
          <Skeleton className="h-3.5 w-52 rounded-md mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <AppCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

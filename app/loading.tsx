import { Skeleton } from "@/components/ui/skeleton";
import AppCardSkeleton from "@/components/AppCardSkeleton";

function CarouselSectionSkeleton() {
  return (
    <section className="mb-14">
      <div className="mb-5 px-4 sm:px-1">
        <Skeleton className="h-5 w-40 rounded-md" />
      </div>

      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[390px] w-[300px] shrink-0">
            <AppCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="lg:px-9">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="sm:px-6 lg:px-14 pt-8 pb-16">
          <CarouselSectionSkeleton />
          <hr className="border-border mb-14 -mt-6 lg:-mx-[37px]" />
          <CarouselSectionSkeleton />
          <hr className="border-border mb-14 -mt-6 lg:-mx-[37px]" />
          <CarouselSectionSkeleton />
        </div>
      </div>
    </main>
  );
}

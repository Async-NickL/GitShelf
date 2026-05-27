import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AppCardSkeleton() {
  return (
    <Card className="card-glass h-full overflow-hidden border border-border/50 rounded-2xl">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
          <div className="flex-1 min-w-0 pt-0.5 space-y-2">
            <Skeleton className="h-3.5 w-2/3 rounded-md" />
            <Skeleton className="h-2.5 w-1/3 rounded-md" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <Skeleton className="h-2.5 w-full rounded-md" />
          <Skeleton className="h-2.5 w-full rounded-md" />
          <Skeleton className="h-2.5 w-full rounded-md" />
          <Skeleton className="h-2.5 w-4/5 rounded-md" />
          <Skeleton className="h-2.5 w-3/5 rounded-md" />
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

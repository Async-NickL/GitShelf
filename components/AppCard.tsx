"use client";
import { Star, Download } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface AppCardProps {
  name: string;
  owner: string;
  description: string;
  avatarUrl: string;
  stars: number;
  forks: number;
  platforms: string[];
  verified?: boolean;
}

export default function AppCard({
  name,
  owner,
  description,
  avatarUrl,
  stars,
  forks,
  platforms,
  verified,
}: AppCardProps) {
  return (
    <Link href={`/${owner}/${name}`} className="block h-full">
      <Card className="card-glass group h-full overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer rounded-2xl select-none">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12 rounded-2xl shrink-0 ring-1 ring-border/50">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="rounded-2xl text-xs font-bold bg-primary/10 text-primary">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-foreground truncate leading-tight">
                  {name}
                </h3>
                {verified && (
                  <span className="text-[9px] text-primary shrink-0 font-semibold tracking-tight">
                    ✦
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{owner}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-6 leading-relaxed flex-1">
            {description || "No description provided."}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3 w-3" />
              {forks >= 1000 ? `${(forks / 1000).toFixed(1)}k` : forks}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-shadow group-hover:shadow-md">
        T
      </span>
      {!compact ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Travora
        </span>
      ) : null}
    </Link>
  );
}

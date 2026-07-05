import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center gap-2", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        T
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Travora
      </span>
    </Link>
  );
}

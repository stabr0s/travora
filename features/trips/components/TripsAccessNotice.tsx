import Link from "next/link";
import { CloudOff, LogIn } from "lucide-react";

import { Card } from "@/components/ui";

type TripsAccessNoticeProps = {
  mode: "demo" | "fallback";
};

const linkClassName =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-surface";

export function TripsAccessNotice({ mode }: TripsAccessNoticeProps) {
  const Icon = mode === "demo" ? LogIn : CloudOff;

  return (
    <Card padding="sm" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <Icon className="size-4 text-primary" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">
            {mode === "demo" ? "You are viewing demo trips" : "Saved trips are temporarily unavailable"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {mode === "demo"
              ? "Sign in to create trips and keep them saved in your account."
              : "Demo trips are shown so you can continue exploring Travora."}
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:shrink-0">
        {mode === "demo" ? (
          <>
            <Link href="/login" className={linkClassName}>Login</Link>
            <Link href="/register" className={linkClassName}>Register</Link>
          </>
        ) : (
          <Link href="/trips" className={linkClassName}>Try again</Link>
        )}
      </div>
    </Card>
  );
}

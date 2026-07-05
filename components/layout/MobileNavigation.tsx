"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mobileNavigation } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

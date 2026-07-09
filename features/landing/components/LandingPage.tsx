import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  FileText,
  MapPin,
  Plane,
  ReceiptText,
  UsersRound,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Card } from "@/components/ui";

const features = [
  ["Save places", "Keep restaurants, viewpoints, hotels, and ideas together before they disappear into chat history.", MapPin],
  ["Build your daily plan", "Turn scattered ideas into a calm day-by-day plan with times, notes, and room to adjust.", CalendarDays],
  ["Track reservations", "Collect flights, hotels, tickets, and booking references in one place for the whole trip.", ReceiptText],
  ["Follow the budget", "Track trip expenses by currency and keep everyone aligned without spreadsheet chaos.", CircleDollarSign],
  ["Prepare packing lists", "Create shared packing lists, mark items as packed, and use quick presets for common trips.", CheckSquare],
  ["Manage trip access", "Add existing Travora users and keep owner, editor, and viewer access clear.", UsersRound],
  ["Print a trip summary", "Create a clean browser-printable summary for plans, places, reservations, budget, and packing.", FileText],
] as const;

const steps = [
  "Create a trip and set the basics.",
  "Add places, plans, reservations, budget items, and packing notes.",
  "Share access with your group and travel prepared.",
];

function LandingLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
    secondary: "border border-border bg-background text-foreground shadow-xs hover:bg-surface",
    ghost: "text-foreground hover:bg-surface",
  };

  return (
    <Link
      href={href}
      className={`${styles[variant]} inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-medium transition-colors`}
    >
      {children}
    </Link>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-primary-subtle via-surface to-transparent" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Logo href="/" />
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground">
              Sign in
            </Link>
            <Link href="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-hover">
              Get started
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 pb-16 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-24">
          <div className="max-w-3xl">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Plan every trip in one calm place.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
              Travora helps you organize places, daily plans, reservations, budgets, packing, and people before the trip starts.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <LandingLink href="/register">Get started</LandingLink>
              <LandingLink href="/login" variant="secondary">Sign in</LandingLink>
              <LandingLink href="/trips/japan-2027" variant="ghost">View demo trip</LandingLink>
            </div>
            <p className="mt-4 text-sm text-muted">
              The demo trip is an example workspace. Demo data is not saved to your account.
            </p>
          </div>

          <Card className="relative overflow-hidden" padding="none">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary-subtle to-transparent" />
            <div className="relative p-5 sm:p-6">
              <div className="rounded-3xl bg-foreground p-5 text-primary-foreground shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-primary-foreground/70">Japan 2027</p>
                    <h2 className="mt-1 text-2xl font-semibold">Tokyo, Kyoto, Osaka</h2>
                  </div>
                  <Plane className="size-6 text-primary-foreground/80" />
                </div>
                <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
                  {["18 places", "7 days", "4 people"].map((item) => (
                    <div key={item} className="rounded-2xl bg-white/10 p-3">
                      <p className="text-xl font-semibold">{item.split(" ")[0]}</p>
                      <p className="mt-1 text-primary-foreground/60">{item.split(" ").slice(1).join(" ")}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {["Save ramen places in Shinjuku", "Print the final trip summary", "Check shared packing list"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-subtle text-sm font-semibold text-success">✓</span>
                    <p className="min-w-0 text-sm font-medium text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-y border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">What Travora organizes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              The practical parts of group travel, without the noise.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, description, Icon]) => (
              <Card key={title} className="h-full">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Start simple. Add detail when the trip takes shape.
            </h2>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-2 text-sm font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          <p className="text-sm leading-6 text-muted">
            Travora is an early MVP. Public links, email invitations, and map rendering are planned for later — for now, the focus is a calm private workspace for planning real trips.
          </p>
        </div>
      </section>
    </main>
  );
}

import { Logo } from "@/components/layout/Logo";
import { Card } from "@/components/ui";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-subtle/70 to-transparent" />
      <div className="relative w-full max-w-md">
        <Logo href="/" className="mb-8 justify-center" />
        <Card padding="lg">{children}</Card>
        <p className="mt-6 text-center text-xs text-muted">
          Plan thoughtfully. Travel beautifully.
        </p>
      </div>
    </main>
  );
}

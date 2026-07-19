import { LoginForm } from "@/features/auth";
import { getSafeInviteNextPath } from "@/lib/routing/safe-next";

type LoginPageProps = {
  searchParams: Promise<{ confirmed?: string | string[]; error?: string | string[]; next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { confirmed, error, next } = await searchParams;
  const nextValue = Array.isArray(next) ? next[0] : next;
  const nextPath = getSafeInviteNextPath(nextValue);
  const initialError = error === "auth_callback_failed"
    ? "We could not confirm your email. Please try signing in or request a new confirmation link."
    : undefined;
  const initialSuccess = confirmed === "1"
    ? "Email confirmed. You can sign in."
    : undefined;

  return <LoginForm initialError={initialError} initialSuccess={initialSuccess} nextPath={nextPath} />;
}

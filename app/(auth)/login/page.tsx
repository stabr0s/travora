import { LoginForm } from "@/features/auth";

type LoginPageProps = {
  searchParams: Promise<{ confirmed?: string | string[]; error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { confirmed, error } = await searchParams;
  const initialError = error === "auth_callback_failed"
    ? "We could not confirm your email. Please try signing in or request a new confirmation link."
    : undefined;
  const initialSuccess = confirmed === "1"
    ? "Email confirmed. You can sign in."
    : undefined;

  return <LoginForm initialError={initialError} initialSuccess={initialSuccess} />;
}

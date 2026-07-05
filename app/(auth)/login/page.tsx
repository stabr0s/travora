import { LoginForm } from "@/features/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const initialError = error === "auth_callback_failed"
    ? "We couldn't complete authentication. Please try signing in again."
    : undefined;

  return <LoginForm initialError={initialError} />;
}

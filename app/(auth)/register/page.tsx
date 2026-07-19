import { RegisterForm } from "@/features/auth";
import { getSafeInviteNextPath } from "@/lib/routing/safe-next";

type RegisterPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;
  const nextValue = Array.isArray(next) ? next[0] : next;
  const nextPath = getSafeInviteNextPath(nextValue);

  return <RegisterForm nextPath={nextPath} />;
}

"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction } from "@/features/auth/actions/auth-actions";
import { AuthField } from "@/features/auth/components/AuthField";
import { AuthSubmitButton } from "@/features/auth/components/AuthSubmitButton";
import type { AuthActionState } from "@/features/auth/types/auth";

const initialState: AuthActionState = { status: "idle" };

type RegisterFormProps = {
  nextPath?: string | null;
};

export function RegisterForm({ nextPath }: RegisterFormProps) {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Create a free account, confirm your email, and start planning your first trip.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={6}
          required
        />
        <AuthField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          minLength={6}
          required
        />

        {state.message ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={
              state.status === "error"
                ? "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"
                : "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"
            }
          >
            {state.message}
          </p>
        ) : null}

        <AuthSubmitButton idleLabel="Create account" pendingLabel="Creating account…" />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"} className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}

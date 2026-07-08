"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/features/auth/actions/auth-actions";
import { AuthField } from "@/features/auth/components/AuthField";
import { AuthSubmitButton } from "@/features/auth/components/AuthSubmitButton";
import type { AuthActionState } from "@/features/auth/types/auth";

const initialState: AuthActionState = { status: "idle" };

type LoginFormProps = {
  initialError?: string;
  initialSuccess?: string;
};

export function LoginForm({ initialError, initialSuccess }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const message = state.message ?? initialError ?? initialSuccess;
  const isSuccessMessage = state.status === "success"
    || (!state.message && !initialError && Boolean(initialSuccess));

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to continue planning with Travora.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
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
          autoComplete="current-password"
          placeholder="Your password"
          required
        />

        {message ? (
          <p
            role={isSuccessMessage ? "status" : "alert"}
            className={isSuccessMessage
              ? "rounded-xl bg-success-subtle px-3.5 py-3 text-sm text-success"
              : "rounded-xl bg-error-subtle px-3.5 py-3 text-sm text-error"}
          >
            {message}
          </p>
        ) : null}

        <AuthSubmitButton idleLabel="Sign in" pendingLabel="Signing in…" />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to Travora?{" "}
        <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
          Create an account
        </Link>
      </p>
    </div>
  );
}

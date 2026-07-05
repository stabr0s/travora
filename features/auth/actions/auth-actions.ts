"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/features/auth/types/auth";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email").trim();
  const password = readField(formData, "password");

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      message: "We couldn't sign you in. Check your email and password.",
    };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email").trim();
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");

  if (!email || !password || !confirmPassword) {
    return { status: "error", message: "Complete all required fields." };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  const origin = await getRequestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return {
      status: "error",
      message: "We couldn't create your account. Check your details and try again.",
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    status: "success",
    message: "Check your email to confirm your account, then return to sign in.",
  };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();
  redirect("/login");
}

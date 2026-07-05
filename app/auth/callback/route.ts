import { NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function getSafeNextPath(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/dashboard";
  }

  return value;
}

function loginErrorResponse(request: NextRequest) {
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", request.url),
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return loginErrorResponse(request);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return loginErrorResponse(request);
  }

  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));

  return NextResponse.redirect(new URL(nextPath, request.url));
}

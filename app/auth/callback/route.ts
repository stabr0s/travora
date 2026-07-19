import { NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSafeInviteNextPath } from "@/lib/routing/safe-next";

const allowedOtpTypes = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const;

type AllowedOtpType = (typeof allowedOtpTypes)[number];

function getSafeNextPath(value: string | null) {
  return getSafeInviteNextPath(value) || "/dashboard";
}

function loginErrorResponse(request: NextRequest) {
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", request.url),
  );
}

function isAllowedOtpType(value: string | null): value is AllowedOtpType {
  return allowedOtpTypes.includes(value as AllowedOtpType);
}

export async function GET(request: NextRequest) {
  const authError = request.nextUrl.searchParams.get("error")
    || request.nextUrl.searchParams.get("error_code")
    || request.nextUrl.searchParams.get("error_description");

  if (authError) {
    return loginErrorResponse(request);
  }

  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));

  if (!code && (!tokenHash || !isAllowedOtpType(type))) {
    return loginErrorResponse(request);
  }

  const supabase = await createServerSupabaseClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return loginErrorResponse(request);

    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  if (tokenHash && isAllowedOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) return loginErrorResponse(request);

    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  return loginErrorResponse(request);
}

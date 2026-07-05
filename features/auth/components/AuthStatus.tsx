import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const linkClassName =
  "inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-surface";

export async function AuthStatus() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle">
            <ShieldCheck className="size-5 text-primary" />
          </span>
          <div>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Supabase account and session status.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Signed in</p>
              <p className="mt-1 break-all text-sm text-muted">{user.email}</p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline">Sign out</Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">You are exploring Travora in demo mode.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/login" className={linkClassName}>Login</Link>
              <Link href="/register" className={linkClassName}>Register</Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

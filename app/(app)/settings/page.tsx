import { Settings } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, SectionHeader } from "@/components/ui";
import { AuthStatus } from "@/features/auth";

export default function SettingsPage() {
  return (
    <>
      <SectionHeader
        title="Settings"
        description="Manage your account preferences and application settings."
      />

      <AuthStatus />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your name, avatar, and account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">Profile settings will appear here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Language, currency, and display options.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">Preference controls will appear here.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <EmptyState
          icon={Settings}
          title="More settings coming soon"
          description="Additional account and notification settings will be available in a future update."
          className="py-12"
        />
      </div>
    </>
  );
}

import { InviteAcceptScreen } from "@/features/invites/components/InviteAcceptScreen";
import { InviteUnavailableScreen } from "@/features/invites/components/InviteUnavailableScreen";
import {
  getTripInviteAuthState,
  getTripInviteByToken,
} from "@/features/invites/services/invite-token-service";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const invite = await getTripInviteByToken(token);

  if (!invite.data) return <InviteUnavailableScreen />;

  const authState = await getTripInviteAuthState();

  return (
    <InviteAcceptScreen
      token={token}
      invite={invite.data}
      authState={authState}
    />
  );
}

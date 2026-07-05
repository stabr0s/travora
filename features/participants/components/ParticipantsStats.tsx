import { CircleCheck, MailPlus, Pencil, Users } from "lucide-react";

import { Card } from "@/components/ui";
import type { Participant } from "@/features/participants/types/participant";

type ParticipantsStatsProps = {
  participants: Participant[];
};

export function ParticipantsStats({
  participants,
}: ParticipantsStatsProps) {
  const stats = [
    { label: "Participants", value: participants.length, icon: Users },
    {
      label: "Active",
      value: participants.filter((participant) => participant.status === "active").length,
      icon: CircleCheck,
    },
    {
      label: "Invited",
      value: participants.filter((participant) => participant.status === "invited").length,
      icon: MailPlus,
    },
    {
      label: "Editors",
      value: participants.filter((participant) => participant.role === "editor").length,
      icon: Pencil,
    },
  ];

  return (
    <section aria-label="Participant statistics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}

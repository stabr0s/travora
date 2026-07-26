export type ImportantInfoTemplate = {
  id: string;
  label: string;
  description: string;
  content: string;
};

export const importantInfoTemplates: ImportantInfoTemplate[] = [
  {
    id: "emergency-contacts",
    label: "Emergency contacts",
    description: "Keep essential local and group contacts together.",
    content: `Emergency contacts

Local emergency number:
Embassy / consulate:
Insurance assistance:
Group emergency contact:
Hotel / host contact:`,
  },
  {
    id: "documents",
    label: "Documents",
    description: "Note the documents and copies needed for the trip.",
    content: `Documents

Passport / ID:
Visa / entry requirements:
Travel insurance:
Driving licence:
Copies stored in:`,
  },
  {
    id: "accommodation",
    label: "Accommodation",
    description: "Save practical arrival and stay details.",
    content: `Accommodation

Address:
Check-in:
Check-out:
Host / reception contact:
Access code / key info:
Important rules:`,
  },
  {
    id: "transport",
    label: "Transport",
    description: "Collect useful transfer and local travel notes.",
    content: `Transport

Airport / station transfer:
Local transport card/app:
Taxi/rideshare notes:
Parking:
Important routes:`,
  },
  {
    id: "group-rules",
    label: "Group rules",
    description: "Set simple expectations for traveling together.",
    content: `Group rules

Meeting point:
Daily start time:
Budget rules:
Free time:
Emergency plan:`,
  },
  {
    id: "useful-phrases",
    label: "Useful phrases",
    description: "Prepare a short list of practical local phrases.",
    content: `Useful phrases

Hello:
Thank you:
How much is it?
Where is ...?
Help:
Dietary/allergy phrase:`,
  },
  {
    id: "insurance",
    label: "Insurance",
    description: "Keep policy and assistance details easy to find.",
    content: `Insurance

Provider:
Policy number:
Assistance phone:
Coverage notes:
Claim steps:`,
  },
  {
    id: "local-tips",
    label: "Local tips",
    description: "Capture useful practical notes about the destination.",
    content: `Local tips

Areas to avoid:
Good food spots:
Local customs:
Cash/card notes:
SIM/eSIM/Wi-Fi:`,
  },
];

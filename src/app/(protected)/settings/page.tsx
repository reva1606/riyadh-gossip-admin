import { Settings } from "lucide-react";

import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and platform preferences." />
      <ComingSoon
        icon={Settings}
        title="Settings are coming soon"
        description="Profile editing and platform preferences will land in a future module."
      />
    </>
  );
}

import { CalendarDays } from "lucide-react";

import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function EventsPage() {
  return (
    <>
      <PageHeader title="Events" description="Plan and manage upcoming events." />
      <ComingSoon
        icon={CalendarDays}
        title="Events management is coming soon"
        description="Event creation, scheduling and management will land in a future module."
      />
    </>
  );
}

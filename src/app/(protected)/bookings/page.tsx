import { ClipboardList } from "lucide-react";

import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function BookingsPage() {
  return (
    <>
      <PageHeader title="Bookings" description="Track and manage bookings." />
      <ComingSoon
        icon={ClipboardList}
        title="Bookings management is coming soon"
        description="Booking tracking and management will land in a future module."
      />
    </>
  );
}

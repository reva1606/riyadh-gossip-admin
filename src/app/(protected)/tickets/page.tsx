import { Ticket } from "lucide-react";

import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function TicketsPage() {
  return (
    <>
      <PageHeader title="Tickets" description="Track ticket sales and inventory." />
      <ComingSoon
        icon={Ticket}
        title="Ticket management is coming soon"
        description="Ticket sales tracking and inventory management will land in a future module."
      />
    </>
  );
}

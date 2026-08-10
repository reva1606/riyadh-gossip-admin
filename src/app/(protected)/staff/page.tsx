import { Users } from "lucide-react";

import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function StaffPage() {
  return (
    <>
      <PageHeader title="Staff" description="Manage staff accounts, roles and access." />
      <ComingSoon
        icon={Users}
        title="Staff management is next"
        description="Listing, creating, editing and role assignment for staff accounts land in the next module."
      />
    </>
  );
}

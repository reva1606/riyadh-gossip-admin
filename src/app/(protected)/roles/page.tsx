import { ShieldCheck } from "lucide-react";

import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function RolesPage() {
  return (
    <>
      <PageHeader title="Roles & Permissions" description="Define roles and their access." />
      <ComingSoon
        icon={ShieldCheck}
        title="Roles & permissions are next"
        description="The role list, permission matrix, and role assignment flows land in an upcoming module."
      />
    </>
  );
}

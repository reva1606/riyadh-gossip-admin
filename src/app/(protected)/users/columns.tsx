"use client";

import { createDataTableColumnHelper } from "@/components/data-table/columns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { User, UserRoleSummary } from "@/types/user.types";

const columnHelper = createDataTableColumnHelper<User>();

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Roles aren't included on user list rows, so the page fetches them per-row
 * (small page size) and passes the result in here — same pattern the Roles
 * page uses for its per-role permission-count column.
 */
export function createUserColumns(rolesByUserId: Record<number, UserRoleSummary[] | undefined>) {
  // Column ids intentionally match the backend's sortBy whitelist (id, first_name,
  // last_name, email, status, created_at) — the Users page is server-mode, so
  // each sortable column id is sent straight through as `sortBy`.
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
      id: "first_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
    }),
    columnHelper.display({
      id: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const roles = rolesByUserId[row.original.id];
        if (!roles) return <span className="text-muted-foreground">…</span>;
        if (!roles.length) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role) => (
              <Badge key={role.id} variant="secondary">
                {role.name}
              </Badge>
            ))}
          </div>
        );
      },
      enableSorting: false,
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "ACTIVE" ? "success" : "secondary"}>
          {getValue() === "ACTIVE" ? "Active" : "Inactive"}
        </Badge>
      ),
    }),
    columnHelper.accessor("created_at", {
      id: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
    }),
  ]);
}

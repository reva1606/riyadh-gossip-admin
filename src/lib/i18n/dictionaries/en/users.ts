export const users = {
  title: "Users",
  description:
    "View, edit and manage every account — customers and staff alike.",
  createButton: "Add user",
  searchPlaceholder: "Search by name or email…",
  totalLabel: "Users",

  filters: {
    statusLabel: "Status",
  },

  table: {
    name: "Name",
    email: "Email",
    roles: "Roles",
    status: "Status",
    created: "Created",
  },

  rowActions: {
    activate: "Activate",
    deactivate: "Deactivate",
    cannotDeactivate: "You cannot deactivate {{reason}}",
    cannotDelete: "You cannot delete {{reason}}",
    yourOwnAccount: "your own account",
    superAdminAccount: "a SUPER_ADMIN account",
  },

  createDialog: {
    title: "Create user account",
    description:
      "A temporary password will be emailed to them, and they'll be asked to change it on first login.",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Email",
    rolesLabel: "Roles",
    loadingRoles: "Loading roles…",
    noAssignableRoles: "No assignable roles yet.",
    submit: "Create account",
    submitting: "Creating…",
  },

  editSheet: {
    editUserTitle: "Edit {{name}}",
    fallbackTitle: "Edit user",
    profileTab: "Profile",
    rolesTab: "Roles",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Email",
    statusLabel: "Status",
    saveChanges: "Save changes",
    currentRoles: "Current roles",
    noRolesAssigned: "No roles assigned.",
    cannotChangeOwnRoles: "You cannot change your own roles.",
    assignRole: "Assign a role",
    selectRolePlaceholder: "Select a role",
    addButton: "Add",
    removeRoleLabel: "Remove {{role}}",
  },

  delete: {
    title: "Delete user",
    descriptionPrefix: "This permanently deletes",
    descriptionFallback: "this user",
    descriptionSuffix: "This action cannot be undone.",
  },
} as const;

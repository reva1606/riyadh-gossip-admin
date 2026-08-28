export const roles = {
  title: "Roles & Permissions",
  description: "Define roles and manage which permissions each one grants.",
  createButton: "Create role",
  searchPlaceholder: "Search roles…",
  totalLabel: "Roles",

  table: {
    name: "Name",
    description: "Description",
    type: "Type",
    system: "System",
    custom: "Custom",
    permissions: "Permissions",
  },

  rowActions: {
    permissions: "Permissions",
  },

  form: {
    createTitle: "Create role",
    editTitle: "Edit role",
    createDescription:
      "Define a new role. You can assign permissions after creating it.",
    editDescription: "Update this role's name and description.",
    nameLabel: "Name",
    namePlaceholder: "e.g. EVENT_MANAGER",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Optional",
    saveChanges: "Save changes",
  },

  permissionsSheet: {
    title: "{{name}} permissions",
    fallbackTitle: "Role permissions",
    fallbackHeading: "Permissions",
    systemHint: "System roles' permissions are fixed and cannot be changed.",
    ownRoleHint:
      "You cannot change the permissions of a role you hold yourself.",
    toggleHint: "Toggle which permissions this role grants.",
  },

  delete: {
    title: "Delete role",
    descriptionPrefix: "This permanently deletes the",
    descriptionSuffix:
      "role. Users holding it will lose the permissions it granted.",
  },
} as const;

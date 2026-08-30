export const categories = {
  title: "Categories",
  description: "Manage the categories events can be organized under.",
  createButton: "Create category",
  searchPlaceholder: "Search categories…",
  totalLabel: "Categories",

  table: {
    name: "Name",
    description: "Description",
  },

  form: {
    createTitle: "Create category",
    editTitle: "Edit category",
    createDescription: "Define a new event category.",
    editDescription: "Update this category's name and description.",
    nameLabel: "Name",
    namePlaceholder: "e.g. Music",
    nameArLabel: "Name (Arabic)",
    nameArPlaceholder: "e.g. موسيقى",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Optional",
    descriptionArLabel: "Description (Arabic)",
    descriptionArPlaceholder: "Optional",
    saveChanges: "Save changes",
  },

  delete: {
    title: "Delete category",
    descriptionPrefix: "This permanently deletes the",
    descriptionSuffix: "category. Categories still used by an event can't be deleted.",
  },
} as const;

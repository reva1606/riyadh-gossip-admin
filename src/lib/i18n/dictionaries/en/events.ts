export const events = {
  title: "Events",
  description: "Create and manage events, their ticket classes and images.",
  createButton: "Create event",
  searchPlaceholder: "Search by title or location…",
  totalLabel: "Events",

  table: {
    title: "Title",
    category: "Category",
    starts: "Starts",
    location: "Location",
    ticketClasses: "Ticket classes",
    status: "Status",
  },

  status: {
    scheduled: "Scheduled",
    cancelled: "Cancelled",
  },

  form: {
    createTitle: "Create event",
    editTitle: "Edit {{title}}",
    createDescription: "Fill in the details for a new event.",
    editDescription: "Update this event's details.",
    titleLabel: "Title",
    titlePlaceholder: "e.g. MBFshow Music Night",
    descriptionLabel: "Description",
    descriptionPlaceholder: "What's this event about?",
    startsLabel: "Starts",
    startsPlaceholder: "Start date",
    endsLabel: "Ends",
    endsPlaceholder: "End date",
    categoryLabel: "Category",
    categoryPlaceholder: "Select a category",
    locationLabel: "Location",
    locationPlaceholder: "e.g. Boulevard City, Riyadh",
    mapLocationLabel: "Map location",
    mapLocationHelp: "Click the map (or drag the pin) to set the exact coordinates.",
    latitudeLabel: "Latitude",
    longitudeLabel: "Longitude",
    howToGetThereLabel: "How to get there",
    howToGetTherePlaceholder: "Directions, parking, entry gate, etc.",
    ticketClassesLabel: "Ticket classes",
    imagesLabel: "Images",
    loadingMap: "Loading map…",
    saveChanges: "Save changes",
  },

  ticketClasses: {
    namePlaceholder: "e.g. VIP",
    pricePlaceholder: "Price",
    countPlaceholder: "Count",
    removeAria: "Remove ticket class",
    addButton: "Add ticket class",
  },

  imageUpload: {
    addImage: "Add image",
    removeAria: "Remove image",
    invalidType: "{{fileName}}: please choose a JPEG, PNG, WEBP or GIF image.",
    tooLarge: "{{fileName}}: image must be 5MB or smaller.",
  },

  delete: {
    title: "Delete event",
    descriptionPrefix: "This permanently deletes the",
    descriptionSuffix: "event, along with its ticket classes and images. This action cannot be undone.",
  },

  cancelAction: "Cancel event",
  cancel: {
    title: "Cancel event",
    descriptionPrefix: "This cancels",
    descriptionSuffix:
      "and refunds every paid booking (excluding VAT) back to the customer. This action cannot be undone.",
    confirmButton: "Cancel event",
    cancelling: "Cancelling…",
    alreadyStarted: "This event has already started and can no longer be cancelled.",
  },
} as const;

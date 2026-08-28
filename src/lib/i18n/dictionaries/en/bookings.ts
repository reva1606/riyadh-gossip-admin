export const bookings = {
  title: "Bookings",
  description: "View bookings placed by customers through the mobile app.",
  searchPlaceholder: "Search by customer name, email or event…",
  totalLabel: "Bookings",
  viewBooking: "View booking",

  filters: {
    statusLabel: "Status",
  },

  status: {
    pendingPayment: "Pending payment",
    paid: "Paid",
    cancelled: "Cancelled",
    expired: "Expired",
  },

  paymentStatus: {
    succeeded: "Succeeded",
    pending: "Pending",
    failed: "Failed",
  },

  table: {
    id: "ID",
    customer: "Customer",
    event: "Event",
    tickets: "Tickets",
    total: "Total",
    status: "Status",
    booked: "Booked",
  },

  detail: {
    title: "Booking details",
    titleWithId: "Booking #{{id}}",
    loadError: "Failed to load this booking. Please try again.",

    tabs: {
      details: "Details",
      tickets: "Tickets ({{count}})",
    },

    customer: {
      title: "Customer",
      name: "Name",
      email: "Email",
    },

    event: {
      title: "Event",
      titleLabel: "Title",
      starts: "Starts",
      location: "Location",
    },

    payment: {
      title: "Payment",
      status: "Status",
      method: "Method",
      paidAt: "Paid at",
    },

    amounts: {
      title: "Amounts",
      subtotal: "Subtotal",
      discount: "Discount",
      total: "Total",
      promoCode: "Promo code",
    },

    entry: {
      title: "Entry",
      noQr: "No QR",
      checkedInLabel: "Checked in",
      checkedIn: "Checked in — {{date}}",
      notCheckedIn: "Not checked in yet",
      qrAlt: "QR code for booking #{{id}}",
      qrDialogTitle: "Booking QR code",
      qrPreviewAlt: "Booking QR code",
    },

    timing: {
      title: "Timing",
      created: "Created",
      updated: "Updated",
      expires: "Expires",
    },

    tickets: {
      empty: "This booking has no tickets.",
      each: "each",
    },
  },
} as const;

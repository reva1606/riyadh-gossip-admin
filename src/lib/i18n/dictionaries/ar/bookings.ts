export const bookings = {
  title: "الحجوزات",
  description: "عرض الحجوزات التي أجراها العملاء عبر تطبيق الجوال.",
  searchPlaceholder: "بحث باسم العميل أو البريد الإلكتروني أو الفعالية…",
  totalLabel: "الحجوزات",
  viewBooking: "عرض الحجز",

  filters: {
    statusLabel: "الحالة",
  },

  status: {
    pendingPayment: "بانتظار الدفع",
    paid: "مدفوع",
    cancelled: "ملغى",
    expired: "منتهي",
  },

  paymentStatus: {
    succeeded: "ناجح",
    pending: "قيد الانتظار",
    failed: "فشل",
  },

  table: {
    id: "الرقم",
    customer: "العميل",
    event: "الفعالية",
    tickets: "التذاكر",
    total: "الإجمالي",
    status: "الحالة",
    booked: "تاريخ الحجز",
  },

  detail: {
    title: "تفاصيل الحجز",
    titleWithId: "الحجز #{{id}}",
    loadError: "تعذر تحميل هذا الحجز. الرجاء المحاولة مرة أخرى.",

    tabs: {
      details: "التفاصيل",
      tickets: "التذاكر ({{count}})",
    },

    customer: {
      title: "العميل",
      name: "الاسم",
      email: "البريد الإلكتروني",
    },

    event: {
      title: "الفعالية",
      titleLabel: "العنوان",
      starts: "تبدأ في",
      location: "الموقع",
    },

    payment: {
      title: "الدفع",
      status: "الحالة",
      method: "طريقة الدفع",
      paidAt: "تاريخ الدفع",
    },

    amounts: {
      title: "المبالغ",
      subtotal: "المجموع الفرعي",
      discount: "الخصم",
      total: "الإجمالي",
      promoCode: "كود الخصم",
    },

    entry: {
      title: "الدخول",
      noQr: "لا يوجد رمز QR",
      checkedInLabel: "تسجيل الدخول",
      checkedIn: "تم تسجيل الدخول — {{date}}",
      notCheckedIn: "لم يتم تسجيل الدخول بعد",
      qrAlt: "رمز QR للحجز #{{id}}",
      qrDialogTitle: "رمز QR للحجز",
      qrPreviewAlt: "رمز QR للحجز",
    },

    timing: {
      title: "التوقيت",
      created: "تاريخ الإنشاء",
      updated: "تاريخ التحديث",
      expires: "تاريخ الانتهاء",
    },

    tickets: {
      empty: "لا توجد تذاكر لهذا الحجز.",
      each: "لكل تذكرة",
    },
  },
} as const;

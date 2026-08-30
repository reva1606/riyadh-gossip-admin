export const events = {
  title: "الفعاليات",
  description: "إنشاء الفعاليات وإدارتها، مع فئات التذاكر والصور الخاصة بها.",
  createButton: "إنشاء فعالية",
  searchPlaceholder: "بحث بالعنوان أو الموقع…",
  totalLabel: "الفعاليات",

  table: {
    title: "العنوان",
    category: "الفئة",
    starts: "تبدأ في",
    location: "الموقع",
    ticketClasses: "فئات التذاكر",
    status: "الحالة",
  },

  status: {
    scheduled: "مجدولة",
    cancelled: "ملغاة",
  },

  form: {
    createTitle: "إنشاء فعالية",
    editTitle: "تعديل {{title}}",
    createDescription: "أدخل تفاصيل الفعالية الجديدة.",
    editDescription: "تحديث تفاصيل هذه الفعالية.",
    titleLabel: "العنوان",
    titlePlaceholder: "مثال: حفلة MBFshow الموسيقية",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "عن ماذا تتحدث هذه الفعالية؟",
    startsLabel: "تبدأ في",
    startsPlaceholder: "تاريخ البداية",
    endsLabel: "تنتهي في",
    endsPlaceholder: "تاريخ النهاية",
    categoryLabel: "الفئة",
    categoryPlaceholder: "اختر فئة",
    locationLabel: "الموقع",
    locationPlaceholder: "مثال: بوليفارد سيتي، الرياض",
    mapLocationLabel: "الموقع على الخريطة",
    mapLocationHelp: "انقر على الخريطة (أو اسحب الدبوس) لتحديد الإحداثيات بدقة.",
    latitudeLabel: "خط العرض",
    longitudeLabel: "خط الطول",
    howToGetThereLabel: "طريقة الوصول",
    howToGetTherePlaceholder: "الاتجاهات، مواقف السيارات، بوابة الدخول، إلخ.",
    ticketClassesLabel: "فئات التذاكر",
    imagesLabel: "الصور",
    loadingMap: "جارٍ تحميل الخريطة…",
    saveChanges: "حفظ التغييرات",
  },

  ticketClasses: {
    namePlaceholder: "مثال: VIP",
    pricePlaceholder: "السعر",
    countPlaceholder: "العدد",
    removeAria: "إزالة فئة التذكرة",
    addButton: "إضافة فئة تذكرة",
  },

  imageUpload: {
    addImage: "إضافة صورة",
    removeAria: "إزالة الصورة",
    invalidType: "{{fileName}}: الرجاء اختيار صورة بصيغة JPEG أو PNG أو WEBP أو GIF.",
    tooLarge: "{{fileName}}: يجب ألا يتجاوز حجم الصورة 5 ميغابايت.",
  },

  delete: {
    title: "حذف الفعالية",
    descriptionPrefix: "سيؤدي هذا إلى حذف فعالية",
    descriptionSuffix: "نهائيًا، مع فئات تذاكرها وصورها. لا يمكن التراجع عن هذا الإجراء.",
  },

  cancelAction: "إلغاء الفعالية",
  cancel: {
    title: "إلغاء الفعالية",
    descriptionPrefix: "سيؤدي هذا إلى إلغاء فعالية",
    descriptionSuffix:
      "واسترداد قيمة كل حجز مدفوع (باستثناء ضريبة القيمة المضافة) للعميل. لا يمكن التراجع عن هذا الإجراء.",
    confirmButton: "إلغاء الفعالية",
    cancelling: "جارٍ الإلغاء…",
    alreadyStarted: "بدأت هذه الفعالية بالفعل ولا يمكن إلغاؤها.",
  },
} as const;

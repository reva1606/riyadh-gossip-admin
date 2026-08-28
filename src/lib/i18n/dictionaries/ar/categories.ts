export const categories = {
  title: "الفئات",
  description: "إدارة الفئات التي يمكن تصنيف الفعاليات ضمنها.",
  createButton: "إنشاء فئة",
  searchPlaceholder: "بحث في الفئات…",
  totalLabel: "الفئات",

  table: {
    name: "الاسم",
    description: "الوصف",
  },

  form: {
    createTitle: "إنشاء فئة",
    editTitle: "تعديل الفئة",
    createDescription: "عرّف فئة جديدة للفعاليات.",
    editDescription: "تحديث اسم الفئة ووصفها.",
    nameLabel: "الاسم",
    namePlaceholder: "مثال: موسيقى",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "اختياري",
    saveChanges: "حفظ التغييرات",
  },

  delete: {
    title: "حذف الفئة",
    descriptionPrefix: "سيؤدي هذا إلى حذف فئة",
    descriptionSuffix: "نهائيًا. لا يمكن حذف الفئات المستخدمة في أي فعالية.",
  },
} as const;

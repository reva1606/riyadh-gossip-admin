export const roles = {
  title: "الأدوار والصلاحيات",
  description: "تعريف الأدوار وإدارة الصلاحيات التي يمنحها كل دور.",
  createButton: "إنشاء دور",
  searchPlaceholder: "بحث في الأدوار…",
  totalLabel: "الأدوار",

  table: {
    name: "الاسم",
    description: "الوصف",
    type: "النوع",
    system: "نظامي",
    custom: "مخصص",
    permissions: "الصلاحيات",
  },

  rowActions: {
    permissions: "الصلاحيات",
  },

  form: {
    createTitle: "إنشاء دور",
    editTitle: "تعديل الدور",
    createDescription: "عرّف دورًا جديدًا. يمكنك تعيين الصلاحيات بعد إنشائه.",
    editDescription: "تحديث اسم الدور ووصفه.",
    nameLabel: "الاسم",
    namePlaceholder: "مثال: EVENT_MANAGER",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "اختياري",
    saveChanges: "حفظ التغييرات",
  },

  permissionsSheet: {
    title: "صلاحيات {{name}}",
    fallbackTitle: "صلاحيات الدور",
    fallbackHeading: "الصلاحيات",
    systemHint: "صلاحيات الأدوار النظامية ثابتة ولا يمكن تغييرها.",
    ownRoleHint: "لا يمكنك تغيير صلاحيات دور تحمله أنت نفسك.",
    toggleHint: "بدّل الصلاحيات التي يمنحها هذا الدور.",
  },

  delete: {
    title: "حذف الدور",
    descriptionPrefix: "سيؤدي هذا إلى حذف دور",
    descriptionSuffix:
      "نهائيًا. سيفقد المستخدمون الذين يحملونه الصلاحيات التي كان يمنحها.",
  },
} as const;

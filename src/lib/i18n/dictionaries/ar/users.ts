export const users = {
  title: "المستخدمون",
  description:
    "عرض وتعديل وإدارة جميع الحسابات — العملاء والموظفون على حدٍّ سواء.",
  createButton: "إضافة مستخدم",
  searchPlaceholder: "بحث بالاسم أو البريد الإلكتروني…",
  totalLabel: "المستخدمون",

  filters: {
    statusLabel: "الحالة",
  },

  table: {
    name: "الاسم",
    email: "البريد الإلكتروني",
    roles: "الأدوار",
    status: "الحالة",
    created: "تاريخ الإنشاء",
  },

  rowActions: {
    activate: "تفعيل",
    deactivate: "إلغاء التفعيل",
    cannotDeactivate: "لا يمكنك إلغاء تفعيل {{reason}}",
    cannotDelete: "لا يمكنك حذف {{reason}}",
    yourOwnAccount: "حسابك الخاص",
    superAdminAccount: "حساب مشرف عام (SUPER_ADMIN)",
  },

  createDialog: {
    title: "إنشاء حساب مستخدم",
    description:
      "سيتم إرسال كلمة مرور مؤقتة إلى بريده الإلكتروني، وسيُطلب منه تغييرها عند أول تسجيل دخول.",
    firstNameLabel: "الاسم الأول",
    lastNameLabel: "اسم العائلة",
    emailLabel: "البريد الإلكتروني",
    rolesLabel: "الأدوار",
    loadingRoles: "جارٍ تحميل الأدوار…",
    noAssignableRoles: "لا توجد أدوار قابلة للتعيين حاليًا.",
    submit: "إنشاء الحساب",
    submitting: "جارٍ الإنشاء…",
  },

  editSheet: {
    editUserTitle: "تعديل {{name}}",
    fallbackTitle: "تعديل المستخدم",
    profileTab: "الملف الشخصي",
    rolesTab: "الأدوار",
    firstNameLabel: "الاسم الأول",
    lastNameLabel: "اسم العائلة",
    emailLabel: "البريد الإلكتروني",
    statusLabel: "الحالة",
    saveChanges: "حفظ التغييرات",
    currentRoles: "الأدوار الحالية",
    noRolesAssigned: "لا توجد أدوار معيّنة.",
    cannotChangeOwnRoles: "لا يمكنك تغيير أدوارك الخاصة.",
    assignRole: "تعيين دور",
    selectRolePlaceholder: "اختر دورًا",
    addButton: "إضافة",
    removeRoleLabel: "إزالة {{role}}",
  },

  delete: {
    title: "حذف المستخدم",
    descriptionPrefix: "سيؤدي هذا إلى حذف",
    descriptionFallback: "هذا المستخدم",
    descriptionSuffix: "نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
  },
} as const;

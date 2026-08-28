export const settings = {
  description: "إدارة ملفك الشخصي وتفضيلات المنصة.",

  profile: {
    title: "الملف الشخصي",
    description: "بيانات حسابك.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    roles: "الأدوار",
  },

  photo: {
    changePhoto: "تغيير الصورة",
    uploadPhoto: "رفع صورة",
    remove: "إزالة",
    photoAlt: "الصورة الشخصية",
    helpText: "JPEG أو PNG أو WEBP أو GIF. الحد الأقصى 5 ميغابايت.",
    invalidType: "الرجاء اختيار صورة بصيغة JPEG أو PNG أو WEBP أو GIF.",
    tooLarge: "يجب ألا يتجاوز حجم الصورة 5 ميغابايت.",
  },

  changePassword: {
    title: "تغيير كلمة المرور",
    description: "تحديث كلمة المرور التي تستخدمها لتسجيل الدخول.",
    mustChangeWarning: "أنت مسجّل الدخول بكلمة مرور مؤقتة — الرجاء تغييرها الآن.",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
    signOutNotice: "تغيير كلمة المرور سيسجّل خروجك من جميع الأجهزة، بما فيها هذا الجهاز.",
    submit: "تغيير كلمة المرور",
    submitting: "جارٍ التغيير…",
    successToast: "تم تغيير كلمة المرور. الرجاء تسجيل الدخول مرة أخرى.",
  },
} as const;

export const settings = {
  description: "Manage your profile and platform preferences.",

  profile: {
    title: "Profile",
    description: "Your account details.",
    name: "Name",
    email: "Email",
    roles: "Roles",
  },

  photo: {
    changePhoto: "Change photo",
    uploadPhoto: "Upload photo",
    remove: "Remove",
    photoAlt: "Profile photo",
    helpText: "JPEG, PNG, WEBP or GIF. Max 5MB.",
    invalidType: "Please choose a JPEG, PNG, WEBP or GIF image.",
    tooLarge: "Image must be 5MB or smaller.",
  },

  changePassword: {
    title: "Change password",
    description: "Update the password you use to sign in.",
    mustChangeWarning: "You're signed in with a temporary password — please change it now.",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    signOutNotice: "Changing your password signs you out of every device, including this one.",
    submit: "Change password",
    submitting: "Changing…",
    successToast: "Password changed. Please sign in again.",
  },
} as const;

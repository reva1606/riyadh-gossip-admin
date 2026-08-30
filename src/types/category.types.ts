/** Mirrors the core app's `CategoryDto` (GET/POST/PATCH /categories, port 4001). */
export interface Category {
  id: number;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
}

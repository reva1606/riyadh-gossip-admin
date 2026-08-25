export type PromoCodeType = "FIXED" | "PERCENTAGE";

/** Lean projection of a restricted user — never the full User row. */
export interface PromoCodeUserRef {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PromoCodeEventRef {
  id: number;
  title: string;
}

/** Mirrors the core app's `PromoCodeDto` (GET/POST/PATCH /promo-codes, port 4001). */
export interface PromoCode {
  id: number;
  name: string;
  code: string;
  description: string | null;
  valid_from: string | null;
  valid_until: string | null;
  type: PromoCodeType;
  value: number;
  is_active: boolean;
  /** Empty means applicable to all users. */
  users: PromoCodeUserRef[];
  /** Empty means applicable to all events. */
  events: PromoCodeEventRef[];
  created_at: string;
  updated_at: string;
}

export interface CreatePromoCodePayload {
  name: string;
  code: string;
  description?: string;
  /** Omit for no start restriction. */
  valid_from?: string;
  /** Omit for no end restriction. Must be after valid_from when both are set. */
  valid_until?: string;
  type: PromoCodeType;
  /** Must be > 0. For PERCENTAGE, must also be <= 100. */
  value: number;
  /** Omit or leave empty to make it applicable to all users. */
  user_ids?: number[];
  /** Omit or leave empty to make it applicable to all events. */
  event_ids?: number[];
  is_active?: boolean;
}

/** Every field optional — "provided means changed", same convention as UpdateEventPayload. */
export type UpdatePromoCodePayload = Partial<CreatePromoCodePayload>;

export interface PromoCodesListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "id" | "name" | "code" | "type" | "value" | "valid_from" | "valid_until" | "is_active" | "created_at";
  sortOrder?: "ASC" | "DESC";
  type?: PromoCodeType;
  /** String, not boolean — sent straight through as a query param. */
  is_active?: "true" | "false";
}

/** The authenticated user is taken from the JWT server-side — never sent from the client. */
export interface ValidatePromoCodePayload {
  code: string;
  event_id: number;
  subtotal: number;
}

export interface PromoCodeValidateResult {
  valid: boolean;
  code: string;
  type: PromoCodeType;
  value: number;
  subtotal: number;
  discount: number;
  final_amount: number;
}

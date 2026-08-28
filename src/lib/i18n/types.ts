import type { en } from "./dictionaries/en";

export type Dictionary = typeof en;

/** Widens every literal string leaf to `string` so a translated dictionary (e.g. `ar`) can satisfy the same shape as `en` without matching its literal English values. */
export type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};

type Primitive = string | number;

/** Union of every dot-separated path in `T` that resolves to a translatable string. */
export type TranslationKey<T = Dictionary> = {
  [K in keyof T & string]: T[K] extends Primitive
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${TranslationKey<T[K]>}`
      : never;
}[keyof T & string];

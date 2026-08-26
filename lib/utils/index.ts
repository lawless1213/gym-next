import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LocalizedText, WorkoutSession } from '../../types'
import { Locale } from 'next-intl';
import { LOCALES } from '@/i18n/locales';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function totalHistoryVolume(data: WorkoutSession[]): number {
  return data.reduce((total, item) => total + (item.volume ?? 0), 0);
}

export function getLocalizedText(value: LocalizedText | string | undefined, locale: Locale = "uk"): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value[locale as keyof LocalizedText] ?? value.en ?? value.uk ?? Object.values(value)[0] ?? "";
}

export function toLocalizedText(value: string): LocalizedText {
  return Object.fromEntries(LOCALES.map((locale) => [locale, value])) as LocalizedText;
}

export * from "./PWA";
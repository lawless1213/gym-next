'use server';

import { cookies } from 'next/headers';
import { isLocale, LOCALE_COOKIE } from './locales';

export async function setUserLocale(locale: string) {
  if (!isLocale(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 31536000, // 1 рік
    sameSite: 'lax',
  });
}

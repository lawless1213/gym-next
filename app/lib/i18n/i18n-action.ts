'use server';

import { cookies } from 'next/headers';

export async function setUserLocale(locale: string) {
  const store = await cookies();
	
  store.set('locale', locale, {
    path: '/',
    maxAge: 31536000, // 1 рік
    sameSite: 'lax',
  });
}
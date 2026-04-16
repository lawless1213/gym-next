import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateOfWeek(date: 'start' | 'end'): Date {
  const now = new Date();
  const dayNum = now.getDay();
  const diffToMonday = dayNum === 0 ? -6 : 1 - dayNum;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date === "start" ? startOfWeek : endOfWeek;
}


import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { WorkoutSession } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function totalHistoryVolume(data: WorkoutSession[]): number {
  return data.reduce((total, item) => total + (item.volume ?? 0), 0);
}
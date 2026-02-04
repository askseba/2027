import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Common class utilities
export const perfumeCardClasses = {
  base: 'w-full max-w-sm bg-cream-bg rounded-2xl shadow-[0_0_20px_rgba(236,156,19,0.15)] overflow-hidden border transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,156,19,0.25)] hover:scale-[1.01] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  interactive: 'cursor-pointer',
  clickable: 'group',
  default: 'border border-brown-text/5',
  liked: 'border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] ring-2 ring-green-500/20',
  disliked: 'border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] ring-2 ring-red-500/20'
}

export const buttonClasses = {
  primary: 'bg-gradient-to-r from-primary to-accent-yellow text-white shadow-xl hover:shadow-2xl',
  secondary: 'border-2 border-brown-text20 hover:border-primary',
  disabled: 'opacity-50 cursor-not-allowed'
}

export const inputClasses = {
  base: 'w-full px-4 py-3 rounded-xl border-2',
  focus: 'focus:ring-2 focus:ring-primary focus:border-primary',
  error: 'border-red-500 focus:ring-red-500'
}

export const badgeClasses = {
  selectionCounter: {
    base: 'inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all',
    valid: 'bg-green-600/10 border-2 border-green-600',
    active: 'bg-primary/10 border-2 border-primary',
    inactive: 'bg-gray-100 border-2 border-gray-300'
  },
  text: {
    valid: 'text-green-700',
    active: 'text-brown-text',
    inactive: 'text-gray-500'
  }
}

export const searchButtonClasses = {
  base: 'min-touch-target min-touch-target flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg font-semibold text-sm transition-all touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  enabled: 'bg-primary text-white hover:bg-primary/90 active:scale-95',
  disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
}

export const favoriteButtonClasses = {
  base: 'min-touch-target min-touch-target w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 touch-manipulation',
  active: 'bg-red-500 text-white',
  inactive: 'bg-white text-red-500 hover:bg-red-50'
}

export const paginationButtonClasses = {
  base: 'min-touch-target min-touch-target px-4 py-2 rounded-xl font-medium transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed',
  active: 'bg-primary text-white shadow-button',
  inactive: 'bg-white border border-brown-text/20 hover:shadow-md'
}

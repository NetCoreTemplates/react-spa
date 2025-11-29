import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function generateSlug(str:string) {
  return str
      .normalize('NFKD') // normalize() with NFKD returns Unicode Normalization Form
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\_/g,'-')       // Replace _ with -
      .replace(/\-\-+/g, '-')   // Replace multiple - with single -
      .replace(/\-$/g, '');     // Remove trailing -
}
export function dateLabel(date:any) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
export function dateTimestamp(date:any) {
  try {
    return new Date(date).toISOString()
  } catch (e) {
    return '2000-01-01T00:00:00.000Z'
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

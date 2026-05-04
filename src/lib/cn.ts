/**
 * Merges class names — a lightweight alternative to clsx + tailwind-merge.
 * Usage: cn("base", condition && "conditional", "always")
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

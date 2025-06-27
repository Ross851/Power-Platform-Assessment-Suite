/**
 * Safely escape any text that will be used inside a RegExp constructor.
 * Source – MDN recommended escape helper
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

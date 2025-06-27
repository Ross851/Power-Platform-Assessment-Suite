/**
 * Escapes special regex characters in a string to make it safe for use in RegExp constructor
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

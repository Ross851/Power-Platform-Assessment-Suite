/**
 * Escape any text you intend to embed in a `RegExp` constructor.
 * Ref – MDN (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping)
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

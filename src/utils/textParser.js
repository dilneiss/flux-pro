/**
 * Parses a multi-line string into structured items.
 * Lines starting with '*' are marked as active/highlighted.
 * @param {string} text
 * @returns {Array<{ name: string, active: boolean }>}
 */
export function parseList(text) {
  if (!text || typeof text !== 'string') return [];
  return text.split('\n').map((line) => ({
    name: line.replace(/^\*/, '').trim(),
    active: line.trim().startsWith('*')
  }));
}

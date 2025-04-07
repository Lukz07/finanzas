import sanitizeHtmlLib from 'sanitize-html';

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty);
} 
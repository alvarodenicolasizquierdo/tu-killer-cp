import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows only safe formatting tags.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'br', 'p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'span', 'div', 'b', 'i'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });
}

/**
 * Convert simple markdown to sanitized HTML.
 * Used for chat messages and article content.
 */
export function markdownToSafeHtml(content: string): string {
  const html = content
    .replace(/## (.*)/g, '<h2 class="text-lg font-semibold mt-6 mb-3">$1</h2>')
    .replace(/### (.*)/g, '<h3 class="text-base font-medium mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br/>');
  return sanitizeHtml(html);
}

/**
 * Convert chat message content to sanitized HTML.
 */
export function chatMessageToSafeHtml(content: string): string {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
    .replace(/\|/g, ' | ');
  return sanitizeHtml(html);
}

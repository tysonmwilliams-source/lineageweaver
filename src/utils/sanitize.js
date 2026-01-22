/**
 * sanitize.js - Content Sanitization Utilities
 *
 * PURPOSE:
 * Provides sanitization functions to prevent XSS attacks when rendering
 * user-provided content like SVG heraldry or Markdown content.
 *
 * SECURITY NOTE:
 * All content rendered via dangerouslySetInnerHTML MUST be sanitized first.
 * SVG files can contain malicious scripts that execute in the browser context.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize SVG content for safe rendering
 *
 * Removes potentially dangerous elements like:
 * - <script> tags
 * - Event handlers (onclick, onerror, etc.)
 * - External references that could leak data
 * - Embedded JavaScript in href/xlink:href
 *
 * @param {string} svgContent - Raw SVG string
 * @returns {string} Sanitized SVG string safe for dangerouslySetInnerHTML
 *
 * @example
 * <div dangerouslySetInnerHTML={{ __html: sanitizeSVG(heraldry.heraldrySVG) }} />
 */
export function sanitizeSVG(svgContent) {
  if (!svgContent) return '';

  return DOMPurify.sanitize(svgContent, {
    USE_PROFILES: { svg: true, svgFilters: true },
    // Allow common SVG elements
    ADD_TAGS: ['use', 'symbol', 'defs', 'clipPath', 'mask', 'pattern'],
    // Allow xlink:href for internal references but sanitize external ones
    ADD_ATTR: ['xlink:href', 'href', 'viewBox', 'preserveAspectRatio'],
    // Remove dangerous attributes
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus'],
    // Remove script tags and similar
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  });
}

/**
 * Sanitize HTML content (e.g., rendered Markdown)
 *
 * More permissive than SVG sanitization but still removes dangerous elements.
 *
 * @param {string} htmlContent - Raw HTML string
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHTML(htmlContent) {
  if (!htmlContent) return '';

  return DOMPurify.sanitize(htmlContent, {
    // Allow common HTML elements for rich text
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'div', 'span',
      'sup', 'sub', 'mark'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'target', 'rel', 'width', 'height'
    ],
    // Open links in new tab safely
    ADD_ATTR: ['target'],
    // Ensure links have rel="noopener"
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Create a safe innerHTML object for React
 *
 * @param {string} content - Content to sanitize
 * @param {'svg' | 'html'} type - Type of content
 * @returns {{ __html: string }} Object for dangerouslySetInnerHTML
 */
export function createSafeHTML(content, type = 'html') {
  const sanitized = type === 'svg' ? sanitizeSVG(content) : sanitizeHTML(content);
  return { __html: sanitized };
}

export default {
  sanitizeSVG,
  sanitizeHTML,
  createSafeHTML
};

/**
 * exportService.js - Writing Export Service
 *
 * Provides export functionality for writings in various formats.
 */

import { getWriting } from './writingService';
import { getChaptersByWriting } from './chapterService';

// ==================== EXPORT FORMATS ====================

export const EXPORT_FORMATS = {
  MARKDOWN: 'markdown',
  HTML: 'html',
  PLAIN_TEXT: 'plain_text',
  JSON: 'json'
};

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.MARKDOWN]: 'Markdown',
  [EXPORT_FORMATS.HTML]: 'HTML',
  [EXPORT_FORMATS.PLAIN_TEXT]: 'Plain Text',
  [EXPORT_FORMATS.JSON]: 'JSON'
};

export const EXPORT_FORMAT_EXTENSIONS = {
  [EXPORT_FORMATS.MARKDOWN]: '.md',
  [EXPORT_FORMATS.HTML]: '.html',
  [EXPORT_FORMATS.PLAIN_TEXT]: '.txt',
  [EXPORT_FORMATS.JSON]: '.json'
};

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export a writing to the specified format
 *
 * @param {number} writingId - Writing ID
 * @param {string} format - Export format
 * @param {string} datasetId - Dataset ID
 * @returns {Promise<Object>} { content, filename, mimeType }
 */
export async function exportWriting(writingId, format, datasetId) {
  const writing = await getWriting(writingId, datasetId);
  if (!writing) {
    throw new Error('Writing not found');
  }

  const chapters = await getChaptersByWriting(writingId, datasetId);

  // Sort chapters by order
  chapters.sort((a, b) => (a.order || 0) - (b.order || 0));

  const filename = sanitizeFilename(writing.title) + EXPORT_FORMAT_EXTENSIONS[format];

  switch (format) {
    case EXPORT_FORMATS.MARKDOWN:
      return {
        content: exportToMarkdown(writing, chapters),
        filename,
        mimeType: 'text/markdown'
      };

    case EXPORT_FORMATS.HTML:
      return {
        content: exportToHTML(writing, chapters),
        filename,
        mimeType: 'text/html'
      };

    case EXPORT_FORMATS.PLAIN_TEXT:
      return {
        content: exportToPlainText(writing, chapters),
        filename,
        mimeType: 'text/plain'
      };

    case EXPORT_FORMATS.JSON:
      return {
        content: exportToJSON(writing, chapters),
        filename,
        mimeType: 'application/json'
      };

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Export to Markdown format
 */
function exportToMarkdown(writing, chapters) {
  let output = `# ${writing.title}\n\n`;

  if (writing.synopsis) {
    output += `> ${writing.synopsis}\n\n`;
  }

  output += `---\n\n`;

  const isMultiChapter = chapters.length > 1;

  for (const chapter of chapters) {
    if (isMultiChapter) {
      output += `## ${chapter.title || `Chapter ${chapter.order}`}\n\n`;
    }

    // Convert TipTap content to Markdown
    if (chapter.content) {
      output += tiptapToMarkdown(chapter.content);
    } else if (chapter.contentPlainText) {
      output += chapter.contentPlainText;
    }

    output += '\n\n';
  }

  // Add metadata footer
  output += `---\n\n`;
  output += `*Exported from LineageWeaver Writing Studio*\n`;
  output += `*${new Date().toLocaleDateString()}*\n`;

  return output;
}

/**
 * Export to HTML format
 */
function exportToHTML(writing, chapters) {
  const styles = `
    <style>
      body {
        font-family: 'Georgia', serif;
        max-width: 720px;
        margin: 0 auto;
        padding: 40px 20px;
        line-height: 1.8;
        color: #333;
      }
      h1 { font-size: 2.5em; margin-bottom: 0.5em; }
      h2 { font-size: 1.75em; margin-top: 2em; }
      h3 { font-size: 1.25em; }
      blockquote {
        border-left: 3px solid #ccc;
        padding-left: 1em;
        color: #666;
        font-style: italic;
      }
      .synopsis {
        font-style: italic;
        color: #666;
        margin-bottom: 2em;
      }
      hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 2em 0;
      }
      .wiki-link {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        text-decoration: none;
      }
      .footer {
        margin-top: 4em;
        padding-top: 1em;
        border-top: 1px solid #ddd;
        font-size: 0.875em;
        color: #999;
      }
    </style>
  `;

  let body = `<h1>${escapeHtml(writing.title)}</h1>\n`;

  if (writing.synopsis) {
    body += `<p class="synopsis">${escapeHtml(writing.synopsis)}</p>\n`;
  }

  body += `<hr>\n`;

  const isMultiChapter = chapters.length > 1;

  for (const chapter of chapters) {
    if (isMultiChapter) {
      body += `<h2>${escapeHtml(chapter.title || `Chapter ${chapter.order}`)}</h2>\n`;
    }

    if (chapter.contentHtml) {
      body += chapter.contentHtml;
    } else if (chapter.contentPlainText) {
      body += `<p>${escapeHtml(chapter.contentPlainText).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    }

    body += '\n';
  }

  body += `<div class="footer">
    <p>Exported from LineageWeaver Writing Studio</p>
    <p>${new Date().toLocaleDateString()}</p>
  </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(writing.title)}</title>
  ${styles}
</head>
<body>
${body}
</body>
</html>`;
}

/**
 * Export to plain text
 */
function exportToPlainText(writing, chapters) {
  let output = `${writing.title.toUpperCase()}\n`;
  output += '='.repeat(writing.title.length) + '\n\n';

  if (writing.synopsis) {
    output += `${writing.synopsis}\n\n`;
  }

  output += '-'.repeat(40) + '\n\n';

  const isMultiChapter = chapters.length > 1;

  for (const chapter of chapters) {
    if (isMultiChapter) {
      const title = chapter.title || `Chapter ${chapter.order}`;
      output += `${title}\n`;
      output += '-'.repeat(title.length) + '\n\n';
    }

    if (chapter.contentPlainText) {
      output += chapter.contentPlainText;
    }

    output += '\n\n';
  }

  output += '-'.repeat(40) + '\n';
  output += `Exported from LineageWeaver Writing Studio\n`;
  output += new Date().toLocaleDateString() + '\n';

  return output;
}

/**
 * Export to JSON format (full data)
 */
function exportToJSON(writing, chapters) {
  return JSON.stringify({
    writing: {
      id: writing.id,
      title: writing.title,
      type: writing.type,
      status: writing.status,
      synopsis: writing.synopsis,
      tags: writing.tags,
      createdAt: writing.createdAt,
      updatedAt: writing.updatedAt
    },
    chapters: chapters.map(ch => ({
      id: ch.id,
      title: ch.title,
      order: ch.order,
      content: ch.content,
      contentHtml: ch.contentHtml,
      contentPlainText: ch.contentPlainText,
      wordCount: ch.wordCount
    })),
    exportedAt: new Date().toISOString(),
    source: 'LineageWeaver Writing Studio'
  }, null, 2);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert TipTap JSON to Markdown
 */
function tiptapToMarkdown(content) {
  if (!content || !content.content) return '';

  let markdown = '';

  function processNode(node) {
    switch (node.type) {
      case 'paragraph':
        return processContent(node.content) + '\n\n';

      case 'heading':
        const level = node.attrs?.level || 1;
        return '#'.repeat(level) + ' ' + processContent(node.content) + '\n\n';

      case 'bulletList':
        return node.content?.map(item =>
          '- ' + processContent(item.content?.[0]?.content)
        ).join('\n') + '\n\n';

      case 'orderedList':
        return node.content?.map((item, i) =>
          `${i + 1}. ` + processContent(item.content?.[0]?.content)
        ).join('\n') + '\n\n';

      case 'blockquote':
        return '> ' + processContent(node.content).trim().replace(/\n/g, '\n> ') + '\n\n';

      case 'horizontalRule':
        return '---\n\n';

      case 'text':
        let text = node.text || '';
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'bold':
                text = `**${text}**`;
                break;
              case 'italic':
                text = `*${text}*`;
                break;
              case 'strike':
                text = `~~${text}~~`;
                break;
            }
          }
        }
        return text;

      case 'wikiLink':
        return `[[${node.attrs?.label || ''}]]`;

      default:
        if (node.content) {
          return processContent(node.content);
        }
        return '';
    }
  }

  function processContent(content) {
    if (!content) return '';
    return content.map(processNode).join('');
  }

  markdown = processContent(content.content);
  return markdown.trim();
}

/**
 * Sanitize filename
 */
function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 100);
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Download a file
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default {
  EXPORT_FORMATS,
  EXPORT_FORMAT_LABELS,
  EXPORT_FORMAT_EXTENSIONS,
  exportWriting,
  downloadFile
};

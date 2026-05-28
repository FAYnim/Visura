'use strict';

const pdfParse = require('pdf-parse');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

/**
 * Extract plain text from a PDF buffer.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function extractPdfText(buffer) {
  try {
    const data = await pdfParse(buffer);
    return (data.text || '').trim();
  } catch (err) {
    console.warn('[textExtractors] PDF parse failed, returning empty string:', err.message);
    return '';
  }
}

/**
 * Extract plain text from a Markdown (or plain text) buffer.
 * @param {Buffer} buffer
 * @returns {string}
 */
function extractMarkdownText(buffer) {
  try {
    const raw = buffer.toString('utf-8');
    // Render HTML then strip tags to get readable plain text
    const html = md.render(raw);
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.warn('[textExtractors] Markdown parse failed, returning raw text:', err.message);
    return buffer.toString('utf-8').trim();
  }
}

module.exports = { extractPdfText, extractMarkdownText };

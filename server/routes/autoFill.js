'use strict';

const express = require('express');
const multer = require('multer');
const { extractPdfText, extractMarkdownText } = require('../ai/textExtractors');
const { autoFillFromSources } = require('../ai/autoFillService');

const router = express.Router();

// Memory storage — files are NOT persisted beyond request
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

const uploadFields = upload.fields([
  { name: 'docFile', maxCount: 1 },
  { name: 'screenshotFile', maxCount: 1 }
]);

router.post('/auto-fill', uploadFields, async (req, res) => {
  try {
    const brief = (req.body.brief || '').trim();
    const files = req.files || {};

    // ── Text extraction ──────────────────────────────────────
    let docText = '';
    if (files.docFile && files.docFile[0]) {
      const file = files.docFile[0];
      const mime = file.mimetype || '';
      if (mime === 'application/pdf') {
        docText = await extractPdfText(file.buffer);
      } else {
        // Treat as markdown / plain text
        docText = extractMarkdownText(file.buffer);
      }
    }

    // screenshot is stored in memory during request only (MVP — no OCR)
    // files.screenshotFile is available but not processed in MVP

    if (!brief && !docText) {
      return res.status(400).json({ error: 'Provide at least a brief or a document file.' });
    }

    // ── AI extraction ────────────────────────────────────────
    const result = await autoFillFromSources({ brief, docText });

    // ── Coverage stats ───────────────────────────────────────
    const emptyFields = [];
    let total = 0;
    let filled = 0;

    Object.keys(result).forEach(slideKey => {
      Object.keys(result[slideKey]).forEach(field => {
        total++;
        const val = result[slideKey][field];
        if (val && val.trim() !== '') {
          filled++;
        } else {
          emptyFields.push(`${slideKey}.${field}`);
        }
      });
    });

    const coverage = total > 0 ? Math.round((filled / total) * 100) : 0;

    return res.json({ data: result, coverage, emptyFields });
  } catch (err) {
    console.error('[auto-fill] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during AI extraction.' });
  }
});

module.exports = router;

import express from 'express';
import multer from 'multer';
import { extractPdfText, extractMarkdownText } from '../ai/textExtractors.js';
import { autoFillFromSources, isProviderAvailable } from '../ai/autoFillService.js';
import { MODELS } from '../ai/models.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadFields = upload.fields([
  { name: 'docFile', maxCount: 1 },
  { name: 'screenshotFile', maxCount: 1 }
]);

router.get('/models', (_req, res) => {
  const available = MODELS.filter(m => isProviderAvailable(m.provider));
  res.json({ models: available.map(m => ({ id: m.id, label: m.label, provider: m.provider })) });
});

router.post('/auto-fill', uploadFields, async (req, res) => {
  try {
    const brief = (req.body.brief || '').trim();
    const modelId = (req.body.model || '').trim();
    const files = req.files || {};

    if (!modelId) {
      return res.status(400).json({ error: 'Model ID is required.' });
    }

    let docText = '';
    if (files.docFile && files.docFile[0]) {
      const file = files.docFile[0];
      const mime = file.mimetype || '';
      if (mime === 'application/pdf') {
        docText = await extractPdfText(file.buffer);
      } else {
        docText = extractMarkdownText(file.buffer);
      }
    }

    if (!brief && !docText) {
      return res.status(400).json({ error: 'Provide at least a brief or a document file.' });
    }

    const result = await autoFillFromSources({ brief, docText }, modelId);

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

export default router;

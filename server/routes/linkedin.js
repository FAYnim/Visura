import express from 'express';
import multer from 'multer';
import { extractPdfText, extractMarkdownText } from '../ai/textExtractors.js';
import { MODELS } from '../ai/models.js';
import { generateLinkedinPostFromSources } from '../ai/linkedin/service.js';
import { SUPPORTED_LINKEDIN_LANGUAGES } from '../ai/linkedin/promptBuilder.js';
import { listLinkedinTemplates } from '../ai/linkedin/templateLoader.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadFields = upload.fields([
  { name: 'docFile', maxCount: 1 }
]);

function handleLinkedinUpload(req, res, next) {
  uploadFields(req, res, err => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Document file must be 10 MB or smaller.' });
    }

    return res.status(400).json({ error: err.message || 'Invalid upload.' });
  });
}

const LINKEDIN_MARKDOWN_MIMES = ['text/markdown', 'text/plain'];

function isLinkedinDocumentFileSupported(file) {
  const mime = file.mimetype || '';
  const name = (file.originalname || '').toLowerCase();
  const isPdf = name.endsWith('.pdf') && mime === 'application/pdf';
  const isMarkdown = (name.endsWith('.md') || name.endsWith('.markdown')) && LINKEDIN_MARKDOWN_MIMES.includes(mime);
  return isPdf || isMarkdown;
}

function isLinkedinLanguageSupported(language) {
  return SUPPORTED_LINKEDIN_LANGUAGES.includes(language);
}

router.get('/linkedin/styles', (_req, res) => {
  res.json({ styles: listLinkedinTemplates() });
});

router.post('/linkedin/generate', handleLinkedinUpload, async (req, res) => {
  try {
    const brief = (req.body.brief || '').trim();
    const styleId = (req.body.styleId || '').trim();
    const language = (req.body.language || '').trim();
    const modelId = (req.body.model || '').trim();
    const byokKey = (req.body.byokKey || '').trim() || null;
    const files = req.files || {};

    if (!modelId || !MODELS.some(model => model.id === modelId)) {
      return res.status(400).json({ error: 'Valid model ID is required.' });
    }

    if (!styleId || !listLinkedinTemplates().some(style => style.id === styleId)) {
      return res.status(400).json({ error: 'Valid LinkedIn style is required.' });
    }

    if (!isLinkedinLanguageSupported(language)) {
      return res.status(400).json({ error: 'Unsupported language. Choose Indonesia or English.' });
    }

    let docText = '';
    if (files.docFile && files.docFile[0]) {
      const file = files.docFile[0];
      const mime = file.mimetype || '';
      if (!isLinkedinDocumentFileSupported(file)) {
        return res.status(400).json({ error: 'Unsupported document file. Upload a Markdown or PDF file.' });
      }
      if (mime === 'application/pdf') {
        docText = await extractPdfText(file.buffer);
      } else {
        docText = extractMarkdownText(file.buffer);
      }
    }

    if (!brief && !docText) {
      return res.status(400).json({ error: 'Provide at least a brief or a document file.' });
    }

    const result = await generateLinkedinPostFromSources({
      brief,
      docText,
      styleId,
      language,
      modelId,
      byokKey
    });

    return res.json(result);
  } catch (err) {
    console.error('[linkedin-generate] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during LinkedIn post generation.' });
  }
});

export { isLinkedinDocumentFileSupported, isLinkedinLanguageSupported };
export default router;

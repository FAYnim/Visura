import express from 'express';
import multer from 'multer';
import { extractPdfText, extractMarkdownText } from '../ai/textExtractors.js';
import { MODELS } from '../ai/models.js';
import { generateArticleFromSources } from '../ai/article/service.js';
import { ARTICLE_LENGTHS, SUPPORTED_ARTICLE_LANGUAGES } from '../ai/article/promptBuilder.js';
import { listArticleTemplates } from '../ai/article/templateLoader.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadFields = upload.fields([
  { name: 'docFile', maxCount: 1 }
]);

function handleArticleUpload(req, res, next) {
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

const ARTICLE_MARKDOWN_MIMES = ['text/markdown', 'text/plain'];

function isArticleDocumentFileSupported(file) {
  const mime = file.mimetype || '';
  const name = (file.originalname || '').toLowerCase();
  const isPdf = name.endsWith('.pdf') && mime === 'application/pdf';
  const isMarkdown = (name.endsWith('.md') || name.endsWith('.markdown')) && ARTICLE_MARKDOWN_MIMES.includes(mime);
  return isPdf || isMarkdown;
}

function isArticleLanguageSupported(language) {
  return SUPPORTED_ARTICLE_LANGUAGES.includes(language);
}

function isArticleLengthSupported(length) {
  return Boolean(ARTICLE_LENGTHS[length]);
}

function validateArticleGenerateRequest({ brief = '', docText = '', styleId = '', language = '', length = '', modelId = '' } = {}) {
  if (!modelId || !MODELS.some(model => model.id === modelId)) {
    return 'Valid model ID is required.';
  }
  if (!styleId || !listArticleTemplates().some(style => style.id === styleId)) {
    return 'Valid article style is required.';
  }
  if (!isArticleLanguageSupported(language)) {
    return 'Unsupported language. Choose Indonesia or English.';
  }
  if (!isArticleLengthSupported(length)) {
    return 'Unsupported length. Choose short, medium, or long.';
  }
  if (!brief && !docText) {
    return 'Provide at least a brief or a document file.';
  }
  return '';
}

router.get('/article/styles', (_req, res) => {
  res.json({ styles: listArticleTemplates() });
});

router.post('/article/generate', handleArticleUpload, async (req, res) => {
  try {
    const brief = (req.body.brief || '').trim();
    const styleId = (req.body.styleId || '').trim();
    const language = (req.body.language || '').trim();
    const length = (req.body.length || '').trim();
    const modelId = (req.body.model || '').trim();
    const byokKey = (req.body.byokKey || '').trim() || null;
    const files = req.files || {};

    const fieldError = validateArticleGenerateRequest({ brief: 'pending', docText: '', styleId, language, length, modelId });
    if (fieldError) {
      return res.status(400).json({ error: fieldError });
    }

    let docText = '';
    if (files.docFile && files.docFile[0]) {
      const file = files.docFile[0];
      const mime = file.mimetype || '';
      if (!isArticleDocumentFileSupported(file)) {
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

    const result = await generateArticleFromSources({
      brief,
      docText,
      styleId,
      language,
      length,
      modelId,
      byokKey
    });

    return res.json(result);
  } catch (err) {
    console.error('[article-generate] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during article generation.' });
  }
});

export {
  isArticleDocumentFileSupported,
  isArticleLanguageSupported,
  isArticleLengthSupported,
  validateArticleGenerateRequest
};
export default router;

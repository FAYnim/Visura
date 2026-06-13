function hasGeneratedArticle(article) {
  return Boolean(article && typeof article.articleMarkdown === 'string' && article.articleMarkdown.trim());
}

async function copyArticleMarkdown({ articleMarkdown, clipboard = navigator.clipboard } = {}) {
  if (typeof articleMarkdown !== 'string' || !articleMarkdown.trim()) {
    return false;
  }

  if (!clipboard || typeof clipboard.writeText !== 'function') {
    throw new Error('Clipboard is unavailable');
  }

  await clipboard.writeText(articleMarkdown.trim());
  return true;
}

export { copyArticleMarkdown, hasGeneratedArticle };

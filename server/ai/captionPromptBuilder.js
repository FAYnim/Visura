function buildCaptionPrompt({ brief, docText }) {
  const systemPrompt = `You are an expert Instagram caption copywriter for premium digital product portfolio posts.

Generate one professional storytelling Instagram caption based on the provided project brief and/or document content.

RULES:
1. Return ONLY valid JSON. No markdown, no explanation, no code fences.
2. JSON shape must be exactly:
{
  "caption": ""
}
3. Caption must be 100-200 words.
4. Use a premium, clear, professional storytelling tone.
5. Structure the caption like this:
   - Strong opening hook
   - Short project context
   - Key value/features
   - Closing CTA
   - Optional relevant hashtags
6. Use \\n for paragraph line breaks.
7. Do not invent unsupported claims. If details are missing, use sensible but generic wording.

OUTPUT EXAMPLE:
{
  "caption": "From idea to interface, this project was built to make complex workflows feel simple.\\n\\nVisura helps creators turn project details into polished carousel content with a faster, more structured process. Instead of starting from a blank page, users can generate slide-ready copy, refine the message, and keep the presentation consistent from first impression to final CTA.\\n\\nThe focus is clarity, speed, and a premium storytelling flow — so every portfolio post feels intentional.\\n\\nReady to turn your project into content that speaks?\\n\\n#PortfolioDesign #DigitalProduct #CreativeWorkflow"
}`;

  const parts = [];
  if (brief) parts.push(`PROJECT BRIEF:\n${brief}`);
  if (docText) parts.push(`DOCUMENT CONTENT:\n${docText.slice(0, 8000)}`);

  const userPrompt = parts.join('\n\n---\n\n') + '\n\nReturn only the JSON.';

  return { systemPrompt, userPrompt };
}

function normalizeCaptionOutput(raw) {
  if (!raw || typeof raw.caption !== 'string') {
    throw new Error('Caption response is invalid.');
  }

  const caption = raw.caption.trim();
  if (!caption) {
    throw new Error('Caption response is empty.');
  }

  return { caption };
}

export { buildCaptionPrompt, normalizeCaptionOutput };

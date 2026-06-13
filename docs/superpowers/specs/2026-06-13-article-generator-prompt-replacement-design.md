# Article Generator Prompt Replacement Design

## Goal

Replace the Article Generator prompt styles with the four prompt styles from `tmp-prompt-article-generator` while preserving the existing Article Generator flow, API schema, and UI structure.

## Approved Approach

Use the focused replacement approach: update the four existing article template files so the backend and frontend continue to work through the current template loader, prompt builder, article service, and article page.

## Prompt Styles

The Article Generator will expose these four styles:

1. Product Launching
2. Project Deep Dive
3. Case Study
4. Technical Breakdown

Each style will keep its own template file under `server/ai/article/templates/` with frontmatter fields:

- `id`
- `name`
- `description`

The UI style cards will display only the template name and description.

## Placeholder Format

The source prompt files use these placeholders:

- `{{LANGUAGE}}`
- `{{ARTICLE_LENGTH}}`
- `{{PROJECT_INFORMATION}}`

The implementation will convert them to the existing app placeholders:

- `{language}`
- `{length}`
- `{projectInfo}`

This preserves the current validation rules in `templateLoader.js` and `promptBuilder.js`.

## Output Schema

The existing API and UI schema stays unchanged. AI output must remain valid JSON with exactly these keys:

```json
{
  "title": "Article title",
  "excerpt": "Short article summary in 1-2 sentences",
  "articleMarkdown": "Full article in Markdown format"
}
```

The source prompt examples use `article`, but templates will be adapted to `articleMarkdown` to avoid frontend and service changes.

## Architecture

The existing flow remains:

1. User enters brief and/or uploads MD/PDF on `/article`.
2. User selects language, length, model, and style.
3. Frontend submits to `/api/article/generate`.
4. Route extracts uploaded text and form fields.
5. Article service loads the selected template.
6. Prompt builder injects `{projectInfo}`, `{language}`, and `{length}`.
7. AI returns JSON.
8. Service normalizes `title`, `excerpt`, and `articleMarkdown`.
9. Markdown is rendered to preview HTML.
10. Frontend displays title, excerpt, raw Markdown, rendered preview, and copy action.

## UI Design

No new UI components are required.

Changes are limited to style card content:

- Product Launching: launch announcement and product value story.
- Project Deep Dive: comprehensive project showcase.
- Case Study: problem-solving and decision-making narrative.
- Technical Breakdown: engineering-focused technical article.

Language, length, model selection, upload, generated output, preview, and copy behavior stay unchanged.

## Error Handling

Existing error behavior remains:

- Missing brief and missing document shows source validation error.
- Unsupported template IDs are rejected.
- Templates missing required placeholders fail validation.
- Unsupported language or length fails prompt building.
- Invalid AI JSON or missing required output fields fails normalization.
- Missing provider API key shows the existing API-key error.

## Testing

Update existing tests to match the new template set and prompt content:

- Article template loader tests should expect the four new style IDs.
- Prompt builder tests should continue verifying `{projectInfo}`, `{language}`, and `{length}` replacement.
- Prompt builder tests should keep JSON schema expectations for `articleMarkdown`.
- Service and route tests should use one valid new style ID.

Run `npm test` after implementation. The project has no lint or typecheck scripts in `package.json`.

## Scope

In scope:

- Replace article template bodies and frontmatter.
- Adapt placeholders from tmp prompt format to app format.
- Keep output schema as `articleMarkdown`.
- Update tests affected by style IDs or prompt text.

Out of scope:

- Adding new UI fields.
- Changing API response shape.
- Adding support for both `article` and `articleMarkdown`.
- Redesigning the article page layout.
- Changing AI model handling or BYOK behavior.

## Approval Status

User approved:

- Replace all four current article styles.
- Keep `articleMarkdown` output schema.
- Use app placeholder format.
- Update only style names and descriptions in the UI.
- Proceed with this design.

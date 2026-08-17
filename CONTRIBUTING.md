# Contributing to Better Quant Wiki

Thanks for helping make this a sharper quantitative-finance primer.

## Local setup

Need **Node.js 20.9+** (24 LTS preferred).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm run build
```

## What belongs here

This is **not** a translation dump of Investopedia or Quant Wiki. Notes and glossary entries should stay:

- short enough to use, long enough to be correct
- bilingual: Chinese term + English name (and abbreviation when it is actually used)
- tagged `core` / `supporting` / `context`
- explicit about pitfalls and source errors

Content lives in:

- `src/content/chapters.ts` — nine reading notes
- `src/content/glossary/*.ts` — terms
- `src/content/corrections.ts` — mistakes found in the original topic list
- `src/content/practice/*.ts` — chapter quizzes (see [the authoring guide](src/content/practice/README.md))

Do not paste long encyclopedia articles. Prefer a definition, a formula, why a quant cares, and a caveat.

Practice questions must follow `src/content/practice/README.md`: test practitioner mistakes, hang real `conceptSlugs`, never reuse a published question `id`.

## Pull requests

1. One concern per PR (a term, a chapter section, a quiz item, or a site fix).
2. If you change a definition, say **why** the old wording was wrong or incomplete.
3. Keep related `slug`s pointing at real glossary entries.
4. Run lint / typecheck / build before you push.

Use the PR template checklist. Factual fixes are more valuable than extra adjectives.

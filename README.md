# Better Quant Wiki

**量化精要** — a concise Chinese–English primer for quantitative finance.

Quant Wiki’s `/basic` list covers useful ground, but the articles are long, repetitive, and sometimes wrong. This project keeps the topic coverage, rewrites the knowledge the way a practitioner actually uses it, and records the corrections.

- Nine reading notes (probability → risk)
- A searchable glossary: Chinese + English, formulas, caveats
- Importance tags: **core** / **supporting** / **context**

## Run locally

Requires Node.js 20.9+ (24 LTS recommended).

```bash
git clone https://github.com/Tomortec/better-quant-wiki.git
cd better-quant-wiki
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `⌘K` searches terms.

```bash
npm run lint
npm run typecheck
npm run build
```

## Project layout

```
src/app/                 # Next.js App Router pages
src/content/chapters.ts  # Notes
src/content/glossary/    # Terms
src/content/corrections.ts
```

## License

[MIT](LICENSE). The wording here is original. The original topic *list* is from [Quant Wiki](https://quant-wiki.com/basic/) / [LLMQuant/quant-wiki](https://github.com/LLMQuant/quant-wiki); we are not affiliated with them.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Factual fixes and missing core terms are the highest-signal PRs.

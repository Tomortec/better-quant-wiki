<p align="center">
  <img src="src/app/icon.svg" width="72" height="72" alt="量化精要 Better Quant Wiki">
</p>

<h1 align="center">量化精要 · Better Quant Wiki</h1>

<p align="center">
  <strong>Bilingual quantitative finance primer</strong> — core definitions, formulas, and pitfalls in Chinese and English.<br>
  从 Quant Wiki 基础词条提炼、纠错后的量化核心知识。中英对照，只保留必须掌握的定义、公式与误区。
</p>

<p align="center">
  <a href="https://wiki.zibenxiuxing.com">wiki.zibenxiuxing.com</a>
  ·
  <a href="LICENSE">MIT</a>
  ·
  <a href="GLOSSARY.md">Glossary</a>
</p>

A rewritten **quant wiki** / **quantitative finance glossary** for practitioners: probability, statistics, markets, macro, valuation, asset pricing, derivatives, trading strategies, and risk. Not an Investopedia dump — each term keeps a definition, a formula when it matters, why a quant uses it, and a caveat.

Quant Wiki 的 `/basic` 列表覆盖面不错，但原文长、重复，还有事实错误。这里保留选题，按从业者真正会用的方式重写，并把勘误记下来。

- Nine reading notes (probability → risk) / 九章阅读笔记
- Searchable bilingual glossary / 可检索术语表：中英对照、公式、误区
- Importance: **core** / **supporting** / **context**
- Corrections to Quant Wiki `/basic`

## Curriculum

| # | Notes | 笔记 |
| --- | --- | --- |
| 01 | [Probability](https://wiki.zibenxiuxing.com/notes/probability) | 概率 |
| 02 | [Inference and Regression](https://wiki.zibenxiuxing.com/notes/statistics) | 统计推断与回归 |
| 03 | [Markets and Microstructure](https://wiki.zibenxiuxing.com/notes/markets) | 市场、工具与微观结构 |
| 04 | [Macro, Rates, Policy](https://wiki.zibenxiuxing.com/notes/macro) | 宏观、利率与政策 |
| 05 | [Valuation](https://wiki.zibenxiuxing.com/notes/valuation) | 估值与公司金融 |
| 06 | [Asset Pricing and Factors](https://wiki.zibenxiuxing.com/notes/pricing) | 资产定价与因子 |
| 07 | [Derivatives, Volatility, Greeks](https://wiki.zibenxiuxing.com/notes/derivatives) | 衍生品、波动与希腊值 |
| 08 | [Strategies, Execution, Backtests](https://wiki.zibenxiuxing.com/notes/strategies) | 策略、执行与回测 |
| 09 | [Risk, Leverage, History](https://wiki.zibenxiuxing.com/notes/risk) | 风险、杠杆与历史 |

Full term index: [GLOSSARY.md](GLOSSARY.md) (Sharpe, VaR, CAPM, Black–Scholes, put-call parity, duration, log return, …).

## Local setup

Need Node.js 20.9+ (Node 24 LTS preferred).

```bash
git clone https://github.com/Tomortec/better-quant-wiki.git
cd better-quant-wiki
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Search terms with `⌘K`.

```bash
npm run lint
npm run typecheck
npm run build
```

## Layout

```
src/app/                 # Next.js App Router pages
src/content/chapters.ts  # nine reading notes
src/content/glossary/    # bilingual quant glossary
src/content/corrections.ts
```

## License

[MIT](LICENSE). Prose in this repo is original. The topic list is drawn from [Quant Wiki](https://quant-wiki.com/basic/) / [LLMQuant/quant-wiki](https://github.com/LLMQuant/quant-wiki); we are not affiliated with them.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Factual corrections and missing **core** terms help the most.

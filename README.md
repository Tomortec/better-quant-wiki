# 量化精要

**Better Quant Wiki** — 从 Quant Wiki 基础词条提炼、纠错后的量化核心知识。中英对照，只保留必须掌握的定义、公式与误区。

站点：[wiki.zibenxiuxing.com](https://wiki.zibenxiuxing.com)

Quant Wiki 的 `/basic` 列表覆盖面不错，但原文长、重复，还有事实错误。这里保留选题，按从业者真正会用的方式重写，并把勘误记下来。

- 九章阅读笔记（概率 → 风险）
- 可检索术语表：中英对照、公式、误区
- 重要度：**核心** / **配套** / **背景**

## 本地运行

需要 Node.js 20.9+（推荐 24 LTS）。

```bash
git clone https://github.com/Tomortec/better-quant-wiki.git
cd better-quant-wiki
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。`⌘K` 搜索术语。

```bash
npm run lint
npm run typecheck
npm run build
```

## 目录结构

```
src/app/                 # Next.js App Router 页面
src/content/chapters.ts  # 九章笔记
src/content/glossary/    # 术语表
src/content/corrections.ts
```

## 许可

[MIT](LICENSE)。正文为原创。选题列表来自 [Quant Wiki](https://quant-wiki.com/basic/) / [LLMQuant/quant-wiki](https://github.com/LLMQuant/quant-wiki)；我们与他们没有隶属关系。

## 贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)。事实勘误和缺失的核心术语最有价值。

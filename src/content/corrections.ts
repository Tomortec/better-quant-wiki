import type { Correction } from "./types";

export const corrections: Correction[] = [
  {
    source: "国库券 = Treasury Notes",
    issue: "中文「国库券」通常对应短期贴现债 Treasury Bill；Treasury Note 是 2–10 年附息中期国债。",
    fix: "本站拆成 T-Bill / T-Note / T-Bond 三条，并写清报价惯例不同。",
  },
  {
    source: "Baye's Theorem",
    issue: "拼写错误，应为 Bayes' Theorem。原文对条件概率的文字定义也不成立。",
    fix: "使用标准定义 P(A|B)=P(B|A)P(A)/P(B)，并强调后验 ≠ 似然。",
  },
  {
    source: "概率章「衍生品 Derivative」",
    issue: "正文整篇都是金融衍生品合约，与微积分导数无关。两个英文词碰巧一样。",
    fix: "拆成「导数（微积分）」与「金融衍生品」。",
  },
  {
    source: "限时订单 = Held Order",
    issue: "Held order 指经纪商必须立即执行、几乎无价格裁量权；不是 Day/GTD 这类有效期（time-in-force）。",
    fix: "中文改为「必须立即执行的委托」，并单独保留 IOC 作为真正的时效指令。",
  },
  {
    source: "PdivE Ratio / LongdivShort",
    issue: "把斜杠 / 错误编码成了 div。",
    fix: "统一为 P/E、Long/Short。",
  },
  {
    source: "β = 1 的股票「不增加任何风险」",
    issue: "β=1 表示与市场同步的系统风险，加入组合会带入市场风险；只是没有额外的相对波动。",
    fix: "区分系统风险、特异质风险与相对基准的残差风险。",
  },
  {
    source: "默顿模型放在统计学；σ 写成股票波动率",
    issue: "这是结构信用/期权模型。公式中的 σ 是企业资产波动率 σ_V。",
    fix: "归入衍生品与信用，并写明股权是资产看涨期权。",
  },
  {
    source: "贴现率一篇混用两个概念",
    issue: "美联储贴现窗口利率 ≠ DCF 折现率。量化日常说的 discount rate 几乎总是后者。",
    fix: "拆成「贴现窗口利率」与「贴现率（估值）」。",
  },
  {
    source: "看跌期权标题 vs Long Put 正文",
    issue: "Put option 是合约；long put 是多头仓位。卖出看跌风险完全不同。",
    fix: "两条分开，并补上看跌—看涨平价。",
  },
  {
    source: "货币套利交易",
    issue: "Carry trade 不是无风险套利，是赚利差、承担汇率崩塌的负偏策略。",
    fix: "称为利差交易，并写明 UIP 不成立是溢价来源。",
  },
  {
    source: "AAA信用评级_AAA信用评级_AAA 等残留标题",
    issue: "文件名重复、标题残留 Investopedia 的 What Is / Who Was。",
    fix: "全部改为规范中英文学名。",
  },
  {
    source: "R² 与决定系数、相关性与相关系数、Forex 与外汇市场",
    issue: "同一概念拆成近乎重复的多篇文章，并配上大段相同的「关键要点」。",
    fix: "合并，只保留一个定义，并写清细微差别（例如 ρ 是协方差的标准化）。",
  },
  {
    source: "经验法则 / 正态分布用于风控",
    issue: "原文暗示 ±2σ 大约就是 95%。金融收益厚尾，这会严重低估崩盘。",
    fix: "把 68–95–99.7 标为心算工具，明确反对当风险限额。",
  },
  {
    source: "缺漏的必需要点",
    issue: "192 篇文章几乎不提：对数收益、看跌—看涨平价、久期、隐含波动作为报价、回测的多重检验。",
    fix: "在相应笔记中补上，并在术语表中单列。",
  },
];

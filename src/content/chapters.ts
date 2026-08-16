import type { Chapter } from "./types";

export const chapters: Chapter[] = [
  {
    id: "probability",
    n: "01",
    zh: "概率",
    en: "Probability",
    summary:
      "量化的语言不是 K 线，是条件分布。先把期望、条件概率、贝叶斯更新和「正态只是起点」搞清楚。",
    sections: [
      {
        id: "language",
        title: "先分清你在问什么",
        en: "What question is the probability answering?",
        body: `金融里几乎没有无条件问题。你真正问的是：给定这个信号、这组宏观状态、这笔订单流，收益或违约的分布是什么。

**条件概率** P(A|B) 是这个语言的原子。联合概率回答「同时发生」；条件概率回答「已经看见 B」。二者由链式法则锁在一起：P(A∩B)=P(A|B)P(B)。

**贝叶斯定理**不是一种投资哲学，它只是条件概率的重写：后验 ∝ 似然 × 先验。回测里「策略赢了所以有效」、风控里「模型没报警所以没风险」，都是在偷换后验与似然。假阳性高、先验很小时，一次「显著」结果仍然很可能是空的。`,
        formulas: [
          {
            label: "Bayes",
            tex: "P(A\\mid B)=\\frac{P(B\\mid A)\\,P(A)}{P(B)}",
          },
        ],
        conceptSlugs: [
          "conditional-probability",
          "joint-probability",
          "bayes-theorem",
        ],
      },
      {
        id: "expectation",
        title: "期望、分布、尾部",
        en: "Expectation is not a plan",
        body: `**期望**是按概率加权的平均。定价的第一原理就是：在某个测度下求期望，再贴现。但期望可以被尾部绑架——正期望策略仍可因杠杆和方差破产。重复博弈里，几何期望（对数财富）往往比算术期望更接近「能不能活着复利」。

只报一个均值等于没有模型。**概率分布**才是工作对象：分位数、偏度、峰度、违约概率都是分布上的泛函。

**正态分布**由 μ、σ 完全决定，是中心极限定理给出的「平均之后」的形状，也是 Black–Scholes 对数收益假设的底盘。它是可计算的起点，不是市场事实。日收益通常左偏、厚尾、有波动聚集；用 ±2σ 当 95% 风控限额，会在危机里破产。`,
        formulas: [
          {
            label: "Gaussian density",
            tex: "f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)",
          },
        ],
        conceptSlugs: [
          "expected-value",
          "probability-distribution",
          "normal-distribution",
          "uniform-distribution",
          "empirical-rule",
        ],
      },
      {
        id: "lln-mc",
        title: "大数定律与模拟",
        en: "More samples are not more truth if they are not independent",
        body: `**大数定律**：i.i.d. 且期望有限时，样本均值几乎必然趋向真实期望。这是保险、做市库存、高频统计套利能存在的前提。

金融市场的「样本」高度依赖、非平稳。把十年牛市的胜率当成概率，是对大数定律的误用。它不保证小样本，也不消灭尾部。

**蒙特卡罗**用抽样逼近没有解析解的期望（路径依赖期权、组合尾部、复杂约束）。误差大约 1/√N；方差缩减比蛮力加次数更重要。垃圾过程假设进，垃圾分位数出——用 GBM 生成「真实崩盘」是自欺。`,
        formulas: [
          {
            label: "MC estimator",
            tex: "\\mathbb{E}[f(X)]\\approx\\frac{1}{N}\\sum_{i=1}^N f(X^{(i)})",
          },
        ],
        conceptSlugs: [
          "law-of-large-numbers",
          "monte-carlo",
          "systematic-sampling",
          "coefficient-of-variation",
        ],
      },
      {
        id: "dependence",
        title: "相关不是依赖",
        en: "Correlation is linear co-movement, not causation",
        body: `**协方差**构成组合方差的交叉项；**相关系数** ρ 只是把协方差除以两边 σ，变成 [-1,1] 的无量纲数。

ρ=0 不是独立（可以有非线性依赖）。危机时相关会跳向 1，用「平时的相关」做分散化，会系统性低估尾部。相关也不是因果。

回归斜率 β 与 ρ 差一个波动率比：β = ρ σ_i/σ_m。高相关不自动等于可交易，还要看延迟、成本、稳定性。

原文把「相关性」和「相关系数」写成两篇重复文章；把微积分**导数**误放到概率章并配上金融衍生品正文。敏感度（Delta、久期）是导数；合约是 derivative security。两个词不要混。`,
        formulas: [
          {
            label: "Correlation",
            tex: "\\rho_{X,Y}=\\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\sigma_Y}",
          },
        ],
        conceptSlugs: [
          "correlation",
          "correlation-coefficient",
          "covariance",
          "calculus-derivative",
        ],
      },
    ],
  },
  {
    id: "statistics",
    n: "02",
    zh: "统计推断与回归",
    en: "Inference and Regression",
    summary:
      "回测不是故事会：每个「有效」都必须对应一个假设、一个标准误、一个样本外。回归是因子模型的骨架。",
    sections: [
      {
        id: "testing",
        title: "检验：显著不是能赚钱",
        en: "p-values filter luck, they do not mint alpha",
        body: `**假设检验**先规定 H₀，再问：若 H₀ 为真，眼前这份数据有多极端。**P 值**是这个条件概率，不是「策略为真的概率」，也不是效应大小。

**t 检验**在方差未知时用样本 σ。数量级上，策略的 t ≈ 夏普 × √T。所以「三年夏普 2」若没有独立样本和成本，往往只是过拟合。收益厚尾、异方差、重叠窗口会让名义 t 过于乐观——至少用 HAC 标准误或 bootstrap。

**置信区间**比单点夏普诚实：很多「年化 20%」的区间穿过 0。频率派的 95% 是「重复实验时区间覆盖真值的比例」，不是「这个已实现区间里有 95% 概率装着真值」。

**统计显著**只说明不像纯噪声。样本越大，越小的效应也会显著。经济显著性还要扣成本、容量、衰减。先看数据再选假设，p 值作废；多个因子一起挖，必须做多重检验校正。`,
        formulas: [
          {
            label: "t statistic",
            tex: "t=\\frac{\\bar x-\\mu_0}{s/\\sqrt{n}}",
          },
        ],
        conceptSlugs: [
          "hypothesis-testing",
          "p-value",
          "t-test",
          "z-test",
          "z-score",
          "statistical-significance",
          "confidence-interval",
          "chi-square",
        ],
      },
      {
        id: "clt",
        title: "中心极限：平均之后才像正态",
        en: "CLT is why estimators look Gaussian",
        body: `独立、方差有限时，标准化样本均值依分布趋向 N(0,1)。这是大样本 z/t、蒙特卡洛误差呈钟形的原因。

方差无限或尾部极厚时，收敛可以极慢甚至失败。日收益「有限方差」本身就可疑。有依赖时要用混合中心极限或 HAC，不能假装 i.i.d.。`,
        formulas: [
          {
            label: "CLT",
            tex: "\\sqrt{n}\\,(\\bar X_n-\\mu)/\\sigma \\xrightarrow{d} N(0,1)",
          },
        ],
        conceptSlugs: ["central-limit-theorem", "law-of-large-numbers"],
      },
      {
        id: "regression",
        title: "回归：因子模型就是回归",
        en: "Attribution is a regression",
        body: `**OLS** 选使残差平方和最小的系数。CAPM β、对冲比率、Fama–French 归因，第一版都是线性回归。

**R²** 是解释了多少方差。一元时 R²=ρ²。加变量 R² 只升不降，所以看调整 R²；预测看样本外。高 R² 可以来自共同趋势或过拟合。

**多元回归**的系数是「控制其他变量后」的偏效应。把未来信息放进 X，就是前视偏差。**共线性**让单个系数不稳、符号乱跳，但整体拟合仍可很好——你会看到「每个因子都不显著，模型却很能解释」。**VIF** 是诊断，不是策略。

**自相关**：收益率的自相关是可预测性（或微观结构噪声）；残差自相关则让 OLS 标准误作废。重叠的滚动收益会人为制造巨大自相关。波动聚集是平方收益的自相关——价格方向难测，σ 往往可测。

**非线性**（期权 Gamma、杠杆、涨跌停、制度切换）会让线性对冲在该对冲时失效。默顿模型不是统计检验，是把股权当资产看涨期权的结构信用模型，原文放错了章节。`,
        formulas: [
          {
            label: "OLS",
            tex: "\\hat\\beta=(X^\\top X)^{-1}X^\\top Y",
          },
        ],
        conceptSlugs: [
          "regression",
          "ols",
          "r-squared",
          "multiple-regression",
          "multicollinearity",
          "variance-inflation-factor",
          "anova",
          "autocorrelation",
          "linear-relationship",
          "nonlinearity",
          "merton-model",
        ],
      },
    ],
  },
  {
    id: "markets",
    n: "03",
    zh: "市场、工具与微观结构",
    en: "Markets and Microstructure",
    summary:
      "你成交的是订单簿上的报价，不是 K 线收盘。先分清一级/二级、股票/债券/外汇，以及市价单真正在买什么。",
    sections: [
      {
        id: "venues",
        title: "钱从哪来，价格在哪形成",
        en: "Primary vs secondary",
        body: `**一级市场**是发行人融资的地方：IPO、增发、国债拍卖。**二级市场**是投资者之间转手、价格发现发生的地方。量化几乎都在二级；但发行供给、锁定期、拍卖机制会改变随后的波动与因子。

**证券**是可转让的请求权。**股权**是剩余索取权；股票市场是它的交易机制。市值分层（大/中/小盘）是规模因子的原料，中美阈值不可照搬。`,
        conceptSlugs: [
          "primary-market",
          "secondary-market",
          "ipo",
          "security",
          "equity",
          "stock-market",
          "nasdaq",
          "mid-cap",
        ],
      },
      {
        id: "fi-fx",
        title: "债券与外汇：贴现率从这里来",
        en: "Rates and FX are the discounting machines",
        body: `全球债市体量大于股市，但很多券是场外、分层流动性。**固息债**价格与利率反向。美债必须分清：

- **T-Bill**：≤1 年贴现，无票息，货币市场惯例。
- **T-Note**：2–10 年附息，10Y 是全球基准。
- **T-Bond**：20/30 年长端。

原文把「国库券」标成 Treasury Notes——中文国库券更接近 Bill。

**外汇**是另一种货币的价格。即期、远期、掉期分层。升值必须说清是哪一种货币。跨境股票收益 = 资产收益 × 汇率。`,
        conceptSlugs: [
          "bond",
          "bond-market",
          "fixed-income",
          "treasury-bill",
          "treasury-note",
          "treasury-bond",
          "face-value",
          "forex",
          "fx-market",
          "exchange-rate",
        ],
      },
      {
        id: "micro",
        title: "成交：订单、账簿、杠杆",
        en: "You trade the book, not the chart",
        body: `**限价订单簿**按价格优先、时间优先。**报价**是 bid/ask 与数量；回测用 last/close 会系统性高估。

- **市价单**：确定时间，不确定价格。
- **限价单**：确定最差价格，不确定能否成交；提供流动性，承担逆向选择。
- **IOC**：能成交的立刻成交，剩余撤销。
- **Held order**：经纪术语，要求立即执行、几乎无价格裁量；**不是**「限时」或 GTD。原文中文标题是错的。

**交易商**用自己的账户吃价差。对冲基金的杠杆、融券、托管走 **Prime Broker**。**保证金**是杠杆的实现：爆仓是保证金公式被击穿，具有路径依赖。

**卖空**利润有限、亏损理论上无界，还有借券费与召回。回测里假设免费无限卖空，是最常见的谎言之一。A 股 **T+1** 往往指当日买入不可卖出，与美股 T+1 **结算**仍可当日回转不是一回事。

**流动性**有价差、深度、弹性、即时性。资产流动性与融资流动性会互相强化。牛熊是粗糙的体制标签；真正要建模的是趋势、波动与相关结构。`,
        conceptSlugs: [
          "dealer",
          "prime-brokerage",
          "margin",
          "buying-on-margin",
          "short-selling",
          "short-position",
          "t-plus-one",
          "quotation",
          "limit-order-book",
          "market-order",
          "limit-order",
          "ioc-order",
          "held-order",
          "liquidity",
          "bull-market",
          "bear-market",
          "pareto-principle",
        ],
      },
    ],
  },
  {
    id: "macro",
    n: "04",
    zh: "宏观、利率与政策",
    en: "Macro and Policy",
    summary:
      "资产价格是现金流预期加贴现率。宏观决定贴现率与风险偏好；交易的是意外，不是教科书定义。",
    sections: [
      {
        id: "real",
        title: "总量：增长、通胀、失业",
        en: "Trade the surprise, not the level",
        body: `**GDP** 是境内最终产出；**GNP** 加上海外净要素收入。长期增长由劳动力、资本、生产率决定；短期是**商业周期**。指数与因子的一年表现，常常是周期位置而不是选股魔法。

**通胀**把名义利率拆成实际利率加预期。成长股是长久期资产，对贴现率（因而对通胀意外）敏感。**PPI** 是上游价格，向 CPI 的传导取决于利润率。**恶性通胀**是货币作为记账单位崩溃——发达市场不是日常输入，但是尾部情景。

**失业**是美联储双重使命之一。菲利普斯曲线给出失业—通胀权衡的直觉，但曲线会移动，不能当稳定交易法则。`,
        formulas: [
          { label: "Expenditure GDP", tex: "Y=C+I+G+(X-M)" },
        ],
        conceptSlugs: [
          "macroeconomics",
          "gdp",
          "gnp",
          "economic-growth",
          "inflation",
          "hyperinflation",
          "unemployment",
          "ppi",
          "business-cycle",
          "phillips-curve",
        ],
      },
      {
        id: "policy",
        title: "货币：短端利率与资产负债表",
        en: "The front end is a policy rate",
        body: `**货币政策**通过利率、资产负债表和沟通影响金融条件。**联邦基金利率**是美元隔夜锚；市场交易的是路径预期与点阵图之差。

**公开市场操作**把政策利率做到市场上。**量化宽松**是政策利率触底后买久期、压期限溢价。**贴现窗口利率**是最后贷款人工具，通常高于市场、带污名——不要和 DCF **贴现率**混为一谈。原文把这两件事写在同一篇。

**利率**必须声明：名义/实际、短/长、无风险/含信用、即期/远期、年化惯例。**曲线倒挂**常被当作衰退信号，机制是预期未来短端下降或期限溢价为负；时滞极不稳定，2s10s 与 3m10y 结论不同。`,
        conceptSlugs: [
          "interest-rate",
          "federal-funds-rate",
          "monetary-policy",
          "open-market-operations",
          "qe",
          "discount-rate-fed",
          "inverted-yield-curve",
          "velocity-of-money",
        ],
      },
      {
        id: "open",
        title: "开放经济与制度背景",
        en: "Trade, tariffs, and the stories around them",
        body: `**贸易逆差**是储蓄—投资缺口的镜子，对应资本流入，不是「国家亏钱」。**关税**提高进口价格、保护部分生产者、伤害下游。贸易的逻辑是**比较优势**（机会成本），不是绝对优势。

凯恩斯强调短期需求不足与政策稳定；「自由市场」「新自由主义」「资本主义」是制度背景，不是可估计因子。**基尼**与**知识经济**几乎不能当高频信号，但后者能解释为何纯账面价值因子会阶段性失效（无形资产没进账）。

大萧条与房地产泡沫是尾部模板：杠杆、抵押品、流动性螺旋。风险模型若在样本里抹掉它们，会系统性乐观。`,
        conceptSlugs: [
          "keynesian-economics",
          "neoliberalism",
          "capitalism",
          "free-market",
          "free-trade",
          "tariff",
          "trade-deficit",
          "comparative-advantage",
          "absolute-advantage",
          "gini-index",
          "knowledge-economy",
        ],
      },
    ],
  },
  {
    id: "valuation",
    n: "05",
    zh: "估值与公司金融",
    en: "Valuation and Corporate Finance",
    summary:
      "价格是贴现的现金流。先统一复利口径，再谈 P/E；杠杆与稀释决定股权到底是什么。",
    sections: [
      {
        id: "tvm",
        title: "时间价值：同一口径才能比较",
        en: "Arithmetic vs geometric is not pedantry",
        body: `**现值**是金融第一公式。**复利**频率趋向连续时变成 e^{rt}。**对数收益**时间上可加，是统计默认；组合加权仍要用简单收益。原文完全没区分这一点。

**CAGR** 是几何年化，抹掉路径。算术「月收益×12」会高估可实现财富。没有统一年化，夏普不可比。

估值用的 **贴现率** 必须匹配现金流风险（CAPM 成本或 WACC）。宏观利率通过这条通道进入成长股。年金终值/系数表只是同一公式的特款。`,
        formulas: [
          {
            label: "Present value",
            tex: "\\mathrm{PV}=\\sum_{t=1}^{T}\\frac{C_t}{(1+r)^t}",
          },
        ],
        conceptSlugs: [
          "present-value",
          "compounding",
          "cagr",
          "annual-return",
          "log-return",
          "discount-rate-dcf",
          "annuity-fv",
          "annuity-table",
        ],
      },
      {
        id: "multiples",
        title: "倍数、会计与质量",
        en: "A ratio is a model with the assumptions hidden",
        body: `**P/E** 在 Gordon 模型下约是 1/(r−g)。要用总回报：忽略**股息**会低估股票。亏损时 P/E 无意义。**CAPE** 用十年实际盈利平滑周期，对十年尺度配置有用，对择时很弱。

三张表：**资产负债表**是时点恒等式；毛利率是质量因子的常用输入。**稀释**（增发、期权、转债）要求看 fully diluted。**资本化**一词既指市值也指把费用记成资产——阅读必须看上下文。

增长率不要把短暂指数外推成永续（增长曲线从指数变为 S 形）。基准年只影响指数水平。经济订货量是运营管理，不是定价核心。`,
        conceptSlugs: [
          "pe-ratio",
          "cape",
          "dividend",
          "dilution",
          "gross-margin",
          "balance-sheet",
          "capitalization",
          "growth-rate",
          "growth-curve",
          "base-year",
          "roc",
          "eoq",
          "marginal-benefit",
        ],
      },
      {
        id: "corp",
        title: "控制权、杠杆与企业形态",
        en: "Equity is a call option on the assets",
        body: `**M&A** 创造事件驱动价差：成交概率 × 时间 − 断单风险。**LBO** 把股权压成薄薄一层期权。**债务重组**是优先级之间重新分配损失，不是债务「消失」。

VC 与 **有限合伙** 是一级市场的供给端。股份公司提供有限责任与可转让股权，这才有二级市场。寡头与规模经济解释利润率持续性——基本面「护城河」的工业组织语言。`,
        conceptSlugs: [
          "ma-deals",
          "lbo",
          "debt-restructuring",
          "venture-capital",
          "limited-partnership",
          "joint-stock-company",
          "oligopoly",
          "economies-of-scale",
        ],
      },
    ],
  },
  {
    id: "pricing",
    n: "06",
    zh: "资产定价与因子",
    en: "Asset Pricing and Factors",
    summary:
      "没有明确的基准与因子，就没有 alpha，只有「赚了钱」。CAPM 是参照系；多因子才是当代工作语言。",
    sections: [
      {
        id: "emh-capm",
        title: "有效与 CAPM：先有基准",
        en: "Alpha is a residual, not a vibe",
        body: `**EMH** 说价格已反映某个信息集。它不是「不能赚钱」，而是：扣掉风险、成本、选择性报告后，没有免费午餐。可预测性可以是风险溢价，也可以是摩擦。

**CAPM**：期望超额与市场 β 成正比。**β** 是回归斜率，是系统暴露，不是波动率本身。波动大但与市场无关，β 可以低。原文写「β=1 不增加任何风险」是错的——它带入与市场相同的系统风险。

**α** 是相对所选择模型的截距。换模型，α 就变。样本内 α 很容易挖；真正的 α 必须样本外、扣成本、扣多重检验。

**无杠杆 β** 用于跨资本结构比较业务风险。高杠杆公司的权益 β 自然更高。`,
        formulas: [
          {
            label: "CAPM",
            tex: "\\mathbb{E}[R_i]-r_f=\\beta_i(\\mathbb{E}[R_m]-r_f)",
          },
        ],
        conceptSlugs: [
          "emh",
          "capm",
          "beta",
          "unlevered-beta",
          "alpha",
          "passive-investing",
        ],
      },
      {
        id: "factors",
        title: "从单因子到多因子",
        en: "Ask what you are actually loading",
        body: `**多因子模型**把收益写成若干共同驱动加残差。宏观因子、基本面因子、PCA 统计因子是三条构建路径。

**Fama–French**：市场 + SMB + HML，后来加盈利与投资。先问策略是不是小盘价值，再谈 α。因子定义（如何分组）会改变结论。

**因子投资**把主动观点变成可重复暴露。发表后衰减、拥挤、定义套利是真实风险。**价值投资**是其故事版本；量化价值是横截面规则。格雷厄姆提供思想史，不是数据。`,
        formulas: [
          {
            label: "FF3",
            tex: "R-r_f=\\alpha+b\\,\\mathrm{MKT}+s\\,\\mathrm{SMB}+h\\,\\mathrm{HML}+\\varepsilon",
          },
        ],
        conceptSlugs: [
          "multi-factor-model",
          "fama-french",
          "factor-investing",
          "value-investing",
          "graham",
        ],
      },
      {
        id: "risk-vol",
        title: "对冲、杠杆、波动",
        en: "Hedge transfers risk; leverage makes path survival",
        body: `**对冲**是转移某一因子，不是免费保险。完美对冲只在模型里。

**杠杆**放大收益、亏损与破产概率，并把中间回撤变成生存问题。许多高夏普策略的真实风险是杠杆 × 拥挤 × 流动性。

**波动**通常是收益标准差或期权隐含。√252 年化假设独立。高波动 ≠ 高 β。波动聚集意味着 σ 可比方向更可预测。VIX 是 30 天隐含方差的指数，本身不可直接交易。`,
        conceptSlugs: [
          "hedge",
          "leverage",
          "leverage-ratio",
          "volatility",
          "vix",
        ],
      },
    ],
  },
  {
    id: "derivatives",
    n: "07",
    zh: "衍生品、波动与希腊值",
    en: "Derivatives and Greeks",
    summary:
      "线性合约复制暴露；期权买卖凸性。先写无套利远期，再写 Delta–Gamma，最后才是形态策略。",
    sections: [
      {
        id: "linear",
        title: "远期与期货：无套利，不是预测",
        en: "F is a no-arbitrage price",
        body: `**金融衍生品**依赖标的。先定义**标的**怎么计量（价格、收益、结算价），再谈合约。

**远期**是场外、到期必须履行；**远期价格**使合约现值刚为零：F=S e^{(r−q)T}。F 不是对未来即期的期望（除非风险溢价为零）。**期货**是标准化、每日盯市的远期，把对手方风险换成清算所与保证金。基差与展期是实盘 PnL 的主要来源。`,
        formulas: [
          { label: "Forward", tex: "F_{0,T}=S_0 e^{(r-q)T}" },
        ],
        conceptSlugs: [
          "financial-derivative",
          "underlying",
          "forward-contract",
          "forward-price",
          "futures",
        ],
      },
      {
        id: "options",
        title: "期权：权利、平价、结构",
        en: "Put-call parity is the first identity",
        body: `**看跌期权**是以 K 卖出的权利。**买入看跌**损失有限、负 Theta、正 Vega；卖出看跌完全不同。原文把合约与 long put 仓位混在一篇。

**看跌—看涨平价**强制欧式看涨、看跌与远期一致——这是期权第一恒等式，原文完全没写。**跨式**是最干净的波动观点。**二元**支付固定金额，报价的是风险中性概率。**可转债**是债底加股权期权。

**VIX 期权**的标的是波动本身，必须通过期货期限结构来理解。`,
        formulas: [
          {
            label: "Put-call parity",
            tex: "C-P=S e^{-qT}-K e^{-rT}",
          },
        ],
        conceptSlugs: [
          "put-option",
          "long-put",
          "put-call-parity",
          "binary-option",
          "straddle",
          "bear-call-spread",
          "convertible-bond",
          "vix-option",
        ],
      },
      {
        id: "greeks",
        title: "希腊值：对冲在交易什么",
        en: "Delta-hedging sells or buys realized vs implied",
        body: `**Delta** 是对 S 的一阶导，也是复制组合里的标的数量。**Delta 对冲**把方向拿走，剩下 Gamma/Vega/Theta——这才是波动率交易。离散对冲、跳跃、价差，就是 PnL。

**Gamma** 是 Delta 的导数、价格的凸性。多 Gamma 怕时间、喜大动；空 Gamma 相反。标的只能对冲 Delta，**伽马对冲**必须用别的期权。Delta 中性不是无风险。

**隐含波动**是价格的报价方式，不是无偏预测。**微笑/偏斜**否证了常数 σ。**波动率套利**交易 IV vs RV，名字里的 arbitrage 名不副实。

固收的一阶是**久期**，二阶是**凸性**。默顿把公司股权写成资产看涨：信用与期权是同一套数学。`,
        formulas: [
          {
            label: "Merton equity",
            tex: "E=V N(d_1)-K e^{-rT}N(d_2)",
          },
        ],
        conceptSlugs: [
          "delta",
          "delta-hedging",
          "delta-neutral",
          "gamma",
          "gamma-hedging",
          "gamma-neutral",
          "implied-vol",
          "volatility-smile",
          "vol-arb",
          "duration",
          "convexity",
          "merton-model",
        ],
      },
    ],
  },
  {
    id: "strategies",
    n: "08",
    zh: "策略、执行与回测",
    en: "Strategies and Execution",
    summary:
      "动量与回归是不同时间尺度；中性是对冲结果不是金额各半。回测的敌人是前视、过拟合与虚假的无限卖空。",
    sections: [
      {
        id: "ts",
        title: "趋势、动量、回归",
        en: "They coexist on different horizons",
        body: `**趋势**假设方向延续，典型是低胜率、高盈亏比。**动量**（横截面）是过去强者继续强，最稳健的因子之一，但有崩溃。**均值回归**是负自相关或平稳过程；均衡会走，把随机游走当回归就是接飞刀。

三者可以共存：短期噪声回归、中期趋势、长期估值回归。

均线、黄金交叉、RSI、Fisher、双顶，都是上述结构的滤波器或形态包装。单独当圣杯不行；必须定义成可程序化规则再测。ROC 既是一般变化率，也是动量指标。`,
        conceptSlugs: [
          "trend-trading",
          "momentum",
          "mean-reversion",
          "moving-average",
          "sma",
          "ema",
          "golden-cross",
          "rsi",
          "fisher-transform",
          "double-top",
          "roc",
        ],
      },
      {
        id: "relative",
        title: "相对价值与执行",
        en: "Neutral is a regression result",
        body: `**市场中性**要对实现 β 与因子回归检验，不是多空金额各半。市值中性 ≠ β 中性 ≠ 因子中性。危机中残差相关仍可让「中性」大亏。

**多空股票**是最主流形态；融资融券是硬约束。**套利者**的资本有限，所以偏差可以持续。

**利差交易**赚利率差、承担汇率崩塌，是负偏风险溢价，不是套利。**HFT** 塑造你看到的价差，即使你不是高频。新闻交易在液态品种上已很难赢过机器。

执行发生在订单簿上：冲击、队列、IOC 与 not-held 裁量，决定 alpha 还能剩多少。`,
        conceptSlugs: [
          "market-neutral",
          "long-short-equity",
          "long-short-fund",
          "arbitrageur",
          "carry-trade",
          "hft",
          "news-trader",
        ],
      },
      {
        id: "research",
        title: "回测是实验室",
        en: "A backtest estimates the future or it is fan fiction",
        body: `用当时可获得的信息模拟规则。敌人包括：前视偏差、幸存者偏差、遗漏成本、无限卖空、过拟合、多重检验。任意一条可以把夏普从 2 打到 0。

样本外、纸交易、容量估计是必经关。利弗莫尔是市场文化，不是数据集。`,
        conceptSlugs: ["backtesting", "alpha", "livermore"],
      },
    ],
  },
  {
    id: "risk",
    n: "09",
    zh: "风险、杠杆与历史",
    en: "Risk and History",
    summary:
      "能杀死组合的往往不是平均波动，是杠杆、拥挤、流动性与相关性同时转向。",
    sections: [
      {
        id: "lessons",
        title: "当模型里的套利不再是套利",
        en: "LTCM is the curriculum",
        body: `**LTCM** 用高杠杆做相对价值，在 1998 年相关崩溃、融资抽走。教案是：模型残差在压力下不再正交；清算是同步的。

**逼空**是空头回补的正反馈，线性风险模型会低估。**AAA** 是意见不是保证，结构化产品的 AAA 是 2008 的反面。

**大萧条**与**房价泡沫**给出同一机制的宏观版：抵押品下跌 → 去杠杆 → 流动性消失 → 价格再跌。任何只在「平静样本」里校准的风险数字，都偏乐观。

活下来靠的是：杠杆上限、拥挤度、融资条款、以及承认非线性。`,
        conceptSlugs: [
          "ltcm",
          "short-squeeze",
          "aaa-rating",
          "great-depression",
          "housing-bubble",
          "leverage",
          "liquidity",
        ],
      },
    ],
  },
];

export const chapterById = Object.fromEntries(
  chapters.map((c) => [c.id, c]),
) as Record<(typeof chapters)[number]["id"], Chapter>;

<a href="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus">
  <img align="center" src="https://capsule-render.vercel.app/api?type=wave&color=0:0d1117,50:161b22,100:1f6feb&height=180&section=header&text=CyberShellX%20Nexus&fontSize=42&fontColor=58a6ff&animation=fadeIn&fontAlignY=32&desc=AI%E9%A9%B1%E5%8A%A8%E7%9A%84%E5%85%88%E8%BF%9B%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8%E5%B9%B3%E5%8F%B0&descSize=18&descColor=8b949e&descAlignY=52" />
</a>

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=58A6FF&center=true&vCenter=true&width=600&lines=AI%E9%A9%B1%E5%8A%A8%E7%9A%84%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8%E5%B9%B3%E5%8F%B0;Gemini+%E5%A4%9AAPI%E9%9B%86%E6%88%90;%E8%B7%A8%E5%B9%B3%E5%8F%B0+%E7%BB%88%E7%AB%AF+%2B+Web+%2B+Android;%E4%BA%A4%E4%BA%92%E5%BC%8F%E5%AE%89%E5%85%A8%E5%9F%B9%E8%AE%AD%E4%B8%8E%E6%95%99%E8%82%B2)](https://git.io/typing-svg)

</div>

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cybersecurity](https://img.shields.io/badge/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8-AI%20Powered-00CED1?style=for-the-badge&logo=shield-check&logoColor=white)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Version](https://img.shields.io/badge/%E7%89%88%E6%9C%AC-1.0.0-1f6feb?style=for-the-badge)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases)

</div>

<div align="center">

**语言 / Bahasa / 语言**

[![EN](https://img.shields.io/badge/EN-English-blue?style=flat-square)](README.md)
[![ID](https://img.shields.io/badge/ID-Bahasa%20Indonesia-red?style=flat-square)](README_id.md)
[![CN](https://img.shields.io/badge/CN-中文-green?style=flat-square)](README_zh.md)

</div>

---

## 概述

**CyberShellX Nexus** 是一个先进的跨平台网络安全平台，集成了人工智能技术，提供实时安全指导、交互式工具演示和教育培训场景。该平台基于现代 TypeScript/React 技术栈构建，由 Google Gemini AI 驱动，具备弹性的多 API 回退系统，为网络安全专业人员、学生和爱好者提供智能助手，涵盖网络分析、漏洞评估、渗透测试方法、数字取证等多个领域。

该平台通过三种不同的界面运行：为高级用户设计的命令行终端、用于交互式探索的基于浏览器的 Web 仪表板，以及用于移动安全咨询的原生 Android 语音助手。每个界面都连接到同一个 AI 驱动的后端，确保无论使用何种访问方式，都能获得一致且丰富的响应。CyberShellX Nexus 强调道德黑客和负责任的披露，在每次交互中都嵌入法律声明和道德准则。

本项目与 [HermesQuantOS](https://github.com/mulkymalikuldhrs/HermesQuantOS) 同属更广泛的网络安全生态系统，共享架构模式和 AI 集成策略，共同构建下一代安全工具。

---

## 功能特性

### AI 驱动的网络安全助手
- **多 API Gemini 集成** -- 在 4 个 Gemini API 端点之间自动回退，确保即使个别 API 出现停机或速率限制也能保持不间断服务
- **智能命令处理** -- 对网络安全命令进行上下文感知分析，涵盖网络扫描、漏洞评估、漏洞利用、取证、无线安全和密码学
- **增强型 AI 响应** -- 基础响应通过实时 Gemini AI 分析进行增强，添加技术深度、实际示例和当前最佳实践
- **实时 API 健康监控** -- 实时跟踪所有 API 端点状态，在检测到故障时自动切换
- **道德准则引擎** -- 每个响应都包含适当的法律声明和负责任披露提醒

### 命令行界面 (CLI)
- 集成 AI 的交互式网络安全终端
- 工具模拟：nmap、metasploit、wireshark、sqlmap、burpsuite、hashcat、aircrack-ng
- 带有详细解释的教育性命令演示
- 跨平台兼容性（Linux、macOS、Android 上的 Termux）
- 难度级别分类（初级、中级、高级）

### Web 仪表板
- 现代化 React 18 + TypeScript + Vite 应用
- 支持 WebSocket 的实时终端模拟
- 网络安全工具演示和交互式场景
- 使用 Drizzle ORM 的 PostgreSQL 数据库集成
- 专业深色主题的响应式设计
- 采用 shadcn/ui 样式的 Radix UI 组件库

### Android 语音助手
- 支持"Hey CyberShell"唤醒词的语音激活助手
- 始终在线的后台服务功能
- 系统控制功能（WiFi、蓝牙、手电筒、音量）
- Shell 命令执行接口
- 通过自然对话提供 AI 驱动的网络安全指导

### 交互式培训场景
- 初级：网络发现、日志分析练习
- 中级：Web 应用测试、无线安全评估
- 高级：APT 模拟、内存取证调查
- 涵盖 OWASP Top 10、渗透测试阶段、负责任披露的学习提示

---

## 安装

### 前提条件
- **Node.js** 18+ 和 npm
- **PostgreSQL** 数据库（用于 Web 界面）
- **Git** 用于克隆和更新

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# 安装依赖
npm install

# 设置数据库架构
npm run db:push

# 使用交互式菜单启动（推荐）
./launcher.sh
```

### 启动模式

```bash
./launcher.sh              # 交互式菜单（推荐）
./launcher.sh cli          # CLI 网络安全 shell
./launcher.sh web          # Web 服务器（端口 5000）
./launcher.sh android      # Android 语音助手后端
./launcher.sh update       # 从 GitHub 更新系统
./launcher.sh status       # 系统健康检查
```

### Termux (Android)

```bash
# 下载并运行安装程序
curl -o termux-install.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/termux-install.sh
chmod +x termux-install.sh
./termux-install.sh

# 启动
cd ~/cyber-shell-x-nexus
./run.sh
```

### 环境变量

在项目根目录创建 `.env` 文件：

```env
# Gemini API 密钥（至少需要一个用于 AI 功能）
GOOGLE_API_KEY=您的主要Gemini_API密钥
GOOGLE_API_KEY_2=您的备用Gemini_API密钥
GEMINI_API_KEY=替代Gemini_API密钥

# 数据库
DATABASE_URL=postgresql://用户:密码@localhost:5432/cybershellx

# 服务器
PORT=5000
NODE_ENV=development
```

---

## 使用方法

### CLI 终端

命令行界面提供带有 AI 解释的交互式网络安全 shell：

```bash
node cli-interface.js
```

可用命令类别：
- **网络安全**: `scan network`、`nmap`、`wireshark`、`netstat`
- **漏洞评估**: `check vulnerabilities`、`nikto`、`openvas`
- **漏洞利用**: `metasploit`、`sql injection`、`burp suite`
- **数字取证**: `volatility`、`autopsy`、`memory analysis`
- **无线安全**: `aircrack`、`wireless security`、`wifi scan`
- **密码学**: `password crack`、`hashcat`、`john ripper`
- **系统分析**: `system info`、`process monitor`、`log analysis`

### Web 界面

启动 Web 服务器并访问 `http://localhost:5000`：

```bash
npm run dev
```

Web 界面功能：
- 带 AI 聊天的交互式终端
- 实时 WebSocket 通信
- 工具安装和管理
- 渗透测试环境准备
- 会话管理和命令历史

### Android 应用

构建并安装 Android 语音助手：

```bash
cd android-assistant
./build-apk.sh
./install-apk.sh
```

---

## 项目结构

```
cyber-shell-x-nexus/
├── client/                        # React 前端
│   ├── src/
│   │   ├── components/            # React 组件（UI + 自定义）
│   │   │   ├── ui/               # shadcn/ui Radix 组件
│   │   │   ├── CyberShellXTerminal.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   └── ...
│   │   ├── pages/                # 应用页面
│   │   ├── hooks/                # 自定义 React hooks
│   │   └── lib/                  # 工具函数和查询客户端
│   └── index.html
├── server/                        # Express 后端
│   ├── index.ts                  # 服务器入口点
│   ├── routes.ts                 # API 端点 + WebSocket
│   ├── cybershell-ai.ts          # AI 命令处理引擎
│   ├── gemini-api.ts             # 多 API Gemini 回退管理器
│   ├── storage.ts                # 数据库存储层
│   ├── db.ts                     # 数据库连接
│   ├── supabase-integration.ts   # Supabase 客户端集成
│   └── vite.ts                   # Vite 开发/生产中间件
├── shared/                        # 共享类型和架构
│   └── schema.ts                 # Drizzle ORM 数据库定义
├── android-assistant/             # 原生 Android 语音助手
│   ├── app/src/main/java/        # Kotlin 源代码
│   ├── build-apk.sh              # APK 构建脚本
│   └── install-apk.sh            # APK 安装脚本
├── cybershell-commands/           # AI 知识库
│   ├── commands.json             # 工具定义和场景
│   └── ai-knowledge-base.md      # AI 训练参考数据
├── scripts/                       # 实用脚本
│   ├── health-check.js           # 系统验证
│   ├── verify-repo.js            # 仓库验证
│   └── fix-build.js              # 构建故障排除
├── docs/                          # 文档
│   ├── API.md                    # API 参考
│   └── TROUBLESHOOTING.md        # 常见问题和解决方案
├── launcher.sh                    # 主交互式启动器
├── cli-interface.js               # CLI 终端界面
├── drizzle.config.ts             # 数据库迁移配置
├── vite.config.ts                # 前端构建配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 依赖和脚本
```

---

## API 参考

| 端点 | 方法 | 描述 |
|---|---|---|
| `/api/command` | POST | 处理网络安全命令并提供 AI 增强 |
| `/api/learning-prompt` | GET | 获取随机教育学习提示 |
| `/api/scenario/:difficulty` | GET | 按难度级别获取交互式场景 |
| `/api/ethics` | GET | 获取道德黑客准则 |
| `/api/ai/status` | GET | 检查 AI API 健康状态和回退状态 |
| `/ws/cybershell` | WS | 用于终端通信的实时 WebSocket |

详细请求/响应格式请参阅 [API 文档](docs/API.md)。

---

## 架构

该平台遵循模块化 monorepo 架构，前端、后端、共享架构、移动应用和 AI 处理层之间有清晰的分离。

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **后端**: Express.js + TypeScript，支持 WebSocket
- **数据库**: PostgreSQL + Drizzle ORM + Supabase 集成
- **AI 引擎**: Google Gemini 2.5 Flash/Pro，4 端点回退系统
- **移动端**: 原生 Android (Kotlin)，支持语音识别和后台服务
- **CLI**: Node.js 终端界面，支持命令解析

完整系统设计文档请参阅 [ARCHITECTURE.md](ARCHITECTURE.md)。

---

## 贡献

我们欢迎来自网络安全和开发者社区的贡献。无论您是修复错误、添加新命令类别、改进 AI 响应、增强 UI 还是添加翻译支持，您的帮助都受到重视。

请阅读我们的[贡献指南](CONTRIBUTING.md)了解详细说明：

- 设置开发环境
- 代码风格和提交约定
- Pull request 流程和审查指南
- 报告错误和请求功能

**项目所有者**: Mulky Malikul Dhaher  
**联系方式**: mulkymalikuldhaher@email.com

---

## 安全声明

本平台**仅**用于教育和授权安全测试目的。所有命令解释和工具演示都包含法律声明，强调需要获得适当授权。用户有责任确保遵守所有适用的地方、国家和国际法律法规。未经授权访问计算机系统在大多数司法管辖区都是违法的。在测试任何系统或网络之前，请务必获得明确的书面许可。

---

## 联系方式

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-mulkymalikuldhrs-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mulkymalikuldhrs)
[![Email](https://img.shields.io/badge/Email-mulkymalikuldhaher%40email.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mulkymalikuldhaher@email.com)
[![仓库](https://img.shields.io/badge/%E4%BB%93%E5%BA%93-CyberShellX%20Nexus-1f6feb?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus)
[![HermesQuantOS](https://img.shields.io/badge/%E5%85%B3%E8%81%94-HermesQuantOS-6e40c9?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mulkymalikuldhrs/HermesQuantOS)

</div>

---

<div align="center">

[![License: MIT](https://img.shields.io/badge/%E8%AE%B8%E5%8F%AF%E8%AF%81-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

<a href="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus">
  <img align="center" src="https://capsule-render.vercel.app/api?type=wave&color=0:1f6feb,50:161b22,100:0d1117&height=120&section=footer" />
</a>

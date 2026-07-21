# AG Translation

基于 Electron + Vue 3 的跨平台翻译桌面应用，支持在线 AI 翻译和离线词典翻译。

## 功能

- **在线翻译** — 通过自定义 Agent API（OpenAI 兼容接口）进行 AI 翻译
- **离线翻译** — 内置中英词典，无网络时可用
- **智能模式** — 自动检测网络状态，在线优先、离线降级
- **多语言支持** — 中 / 英 / 日 / 韩 / 法 / 德 / 西 / 俄 / 葡，支持自动检测
- **自定义 API** — 可配置 Endpoint / API Key / Model / Temperature
- **翻译历史** — 保存最近 100 条记录，点击可复用
- **一键复制 / 粘贴** — 剪贴板快捷操作
- **跨平台** — Windows（Electron）/ 鸿蒙 6.0（WebView）

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Electron 43 + Vue 3 + TypeScript |
| UI | Element Plus + 自定义样式 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| 构建 | Vite 8 + electron-builder |
| 在线翻译 | OpenAI 兼容 API (Axios) |
| 离线翻译 | 内置词典引擎 |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（Vite + Electron 同时启动）
npm run electron:dev

# 生产构建（Vite 构建 + electron-builder 打包）
npm run electron:build
```

> 注意：开发模式需要依赖 Vite 开发服务器，确保 `src/renderer/` 作为 Vite 根目录配置正确。

## 首次使用

1. 启动应用，进入 **设置** 页面
2. 配置 Agent API：
   - **API 地址**: 填入你的 API Endpoint（如 `https://api.openai.com/v1`）
   - **API Key**: 填入你的 API Key
   - **模型**: 选择模型（如 `gpt-4o-mini`）
   - 点击 **测试连接** 验证配置
3. 回到 **翻译** 页：
   - 选择翻译模式（在线 / 离线 / 智能）
   - 选择源语言和目标语言（默认 中 → 英）
   - 输入文本，按 `Ctrl + Enter` 翻译
   - 结果可一键复制

## 项目结构

```
AG Translation/
├── scripts/
│   └── dev.js                 # 开发启动脚本
├── src/
│   ├── main/                  # Electron 主进程
│   │   ├── main.js            # 窗口管理、IPC、系统托盘
│   │   ├── preload.js         # 安全 API 桥接
│   │   ├── store.js           # 本地配置持久化
│   │   └── offline.js         # 离线翻译引擎
│   └── renderer/              # Vue 3 前端
│       ├── api/
│       │   ├── agent.ts       # Agent API 翻译模块
│       │   └── types.ts       # 类型定义
│       ├── components/
│       │   ├── TitleBar.vue   # 自定义无边框标题栏
│       │   └── NavBar.vue     # 底部导航栏
│       ├── views/
│       │   ├── TranslateView.vue  # 翻译主界面
│       │   ├── SettingsView.vue   # 设置页面
│       │   └── HistoryView.vue    # 历史记录
│       ├── stores/
│       │   └── app.ts         # Pinia 全局状态
│       ├── platform/
│       │   └── harmony.ts     # 鸿蒙 6.0 平台适配
│       ├── App.vue            # 根组件
│       ├── main.ts            # 入口
│       ├── router.ts          # 路由配置
│       └── index.html         # HTML 入口
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 鸿蒙 6.0 部署

1. 运行 `npm run build`，生成 `dist/` 目录
2. 将 `dist/` 作为鸿蒙 WebView 资源加载
3. 鸿蒙原生通过 JS Bridge 注入 `window.harmonyAPI`（接口定义见 `src/renderer/platform/harmony.ts`）
4. 应用自动检测 `window.__harmony__` 标志，切换为鸿蒙 API 调用

## License

MIT

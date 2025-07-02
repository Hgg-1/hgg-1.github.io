# 作品集 - Personal Portfolio

欢迎来到我的个人作品集！这是一个基于 Next.js 构建的、充满活泼与可爱风格的个人网站。

在这里，你可以浏览我的项目作品，在首页与 AI 助手聊天，或者给我留言。整个网站都采用了明亮、愉快的色彩主题，希望能给你带来好心情！

## ✨ 主题与特点

- **🎨 活泼可爱主题**: 整个网站从配色、字体到交互动画，都充满了清新活泼的感觉。
- **📱 响应式设计**: 无论是在桌面还是移动设备上，都能获得良好的浏览体验。
- **🤖 集成 AI 聊天**: 在首页右侧集成了 AI 聊天助手，可以进行有趣的互动。
- **作品集展示**: 使用动态路由和分类筛选，清晰地展示了我的项目和练习。
- **⏱️ WakaTime 集成**: 在页脚展示通过 WakaTime API 获取的编程时长统计，记录创作历程。

## 🚀 主要功能

### 1. 首页 (`/`)

- 吸引眼球的欢迎横幅。
- 精选作品的快速入口。
- 一个可以直接交互的 AI 聊天机器人。

### 2. 作品展示 (`/portfolio`)

<div className="grid grid-cols-2 gap-4">
  <img src="/images/portfolio/1.png" alt="智能家居控制界面" />
  <img src="/images/portfolio/2.png" alt="电商后台管理系统" />
  <img src="/images/portfolio/3.png" alt="移动端健康应用" />
  <img src="/images/portfolio/4.png" alt="数据可视化大屏" />
  <img src="/images/portfolio/5.png" alt="社交平台UI设计" />
  <img src="/images/portfolio/6.png" alt="在线教育平台" />
  <img src="/images/portfolio/7.png" alt="物联网设备管理" />
</div>

▲ 精选作品截图（点击查看大图）

![作品集截图](/images/portfolio-screenshot.png)
<center>▲ 作品集卡片式布局展示</center>

- **集中展示**: 以卡片网格的形式，展示了所有的项目和练习。
- **分类筛选**: 可以根据"作业"、"练习"、"其他"等分类快速筛选作品。
- **在线预览**: 点击每个作品卡片，可以在新页面进行在线预览和操作。

### 3. 联系我 (`/contact`)

- 一个功能完善的联系表单/留言板。
- 展示了详细的联系方式。

### 4. 关于 (`/about`)

- 包含了关于我的技能、教育背景和个人爱好的介绍。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/) (使用 App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **AI 对接**: 通过自定义后端 API 路由，与大语言模型进行交互。
- **开发统计**: 使用 [WakaTime API](https://wakatime.com/developers) 追踪和展示编程时长。

## 📂 项目结构

```
/final-project
├── app/
│   ├── components/       # 共享组件 (Header, Footer)
│   ├── portfolio/        # 作品展示页面及子路由
│   │   └── [assignment]/ # 单个作品预览页
│   ├── contact/          # 联系我页面
│   ├── about/            # 关于页面
│   ├── api/              # 后端 API 路由
│   │   ├── assignments/  # 获取作品列表 API
│   │   ├── qanything/    # 对接 AI 模型 API
│   │   └── wakatime/     # 获取 WakaTime 编程时长数据
│   ├── layout.tsx        # 全局布局
│   └── page.tsx          # 应用首页
├── public/               # 静态资源 (图片, 练习的 html 文件等)
├── README.md             # 就是你正在看的这个文件啦！
└── ...                   # 其他 Next.js 配置文件
```

## 🤖 AI 聊天功能实现

该功能通过在首页直接集成客户端逻辑和后端 API 代理来实现。

- **前端界面**: 在首页 (`/app/page.tsx`) 中，使用 React 的 state and effects 来管理聊天状态、用户输入和消息历史。
- **API 代理**: 在后端的 API 路由 (`/app/api/qanything`) 中处理对大模型服务 API 的请求。这样做是为了隐藏 API Key 等敏感信息，并处理鉴权。
- **流式响应**: 为了提升用户体验，前端能够处理流式（streaming）API 响应，实现打字机效果。

## ⏱️ WakaTime 编程时长统计

该功能通过 WakaTime API 获取编程时长数据，并在网站页脚中展示。

- **数据获取**: 在后端 API 路由 (`/app/api/wakatime`) 中安全地调用 WakaTime API。
- **页脚展示**: 在 Footer 组件中使用 WakaTimeStats 组件显示总编程时长。
- **自动更新**: 数据每小时自动刷新一次，保持统计信息的及时性。

## 本地开发指南

想在你的电脑上运行这个项目吗？请遵循以下步骤：

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **设置环境变量 (如果需要)**
    如果需要使用 AI 聊天和 WakaTime 等依赖外部 API 的功能, 请在项目根目录下创建一个名为 `.env.local` 的文件，并添加：
    ```env
    # WakaTime API Key (从 https://wakatime.com/settings/api-key 获取)
    WAKATIME_API_KEY="YOUR_WAKATIME_API_KEY"
    
    # AI 聊天所需的 API Keys
    # 根据你使用的服务填写相应的 API Key 和 URL
    ```

4.  **运行开发服务器**
    ```bash
    npm run dev
    ```

    现在，在浏览器里打开 [http://localhost:3000](http://localhost:3000) 就可以看到网站了！

---

感谢你的访问，希望你喜欢我的作品集！

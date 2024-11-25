# GitHub Stars Manager

[English](#english) | [中文](#中文)

## English

A React web app for managing GitHub starred repositories with search, tagging and sorting features.

### Features
- 🔍 Search through all your starred repositories
- 🏷️ Custom tagging system
- 🗂️ Filter repositories by tags
- 📝 Repository details with last update time
- 📱 Responsive design

### Live Demo
Visit: https://mawendi0990.github.io/github-stars-manager

### Installation

#### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A GitHub account and personal access token

#### Steps

1. Clone the repository
```bash
git clone https://github.com/mawendi0990/github-stars-manager.git
cd github-stars-manager
```

2. Install dependencies
```bash
npm install
```

3. Create a GitHub token
- Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
- Generate new token
- Select 'repo' scope
- Copy the generated token

4. Create environment file
Create a `.env` file in the root directory:
```
REACT_APP_GITHUB_TOKEN=your_github_token_here
```

5. Start the development server
```bash
npm start
```

The app should now be running at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

### Technologies Used
- React.js
- Tailwind CSS
- GitHub REST API
- Local Storage

---

## 中文

一个用于管理 GitHub 星标仓库的 React 网页应用，具有搜索、标签和排序功能。

### 功能特点
- 🔍 搜索所有星标仓库
- 🏷️ 自定义标签系统
- 🗂️ 按标签筛选仓库
- 📝 显示仓库详情和最后更新时间
- 📱 响应式设计

### 在线演示
访问：https://mawendi0990.github.io/github-stars-manager

### 安装说明

#### 环境要求
- Node.js (v14 或更高版本)
- npm 或 yarn
- GitHub 账号和个人访问令牌

#### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/mawendi0990/github-stars-manager.git
cd github-stars-manager
```

2. 安装依赖
```bash
npm install
```

3. 创建 GitHub 令牌
- 访问 GitHub 设置 > 开发者设置 > 个人访问令牌 > 令牌（经典）
- 生成新令牌
- 选择 'repo' 权限
- 复制生成的令牌

4. 创建环境文件
在根目录创建 `.env` 文件：
```
REACT_APP_GITHUB_TOKEN=你的_github_令牌
```

5. 启动开发服务器
```bash
npm start
```

应用将在 `http://localhost:3000` 运行

### 生产环境构建
```bash
npm run build
```

### 使用的技术
- React.js
- Tailwind CSS
- GitHub REST API
- 本地存储

### 使用说明
1. 搜索：使用顶部搜索框搜索仓库名称、描述或标签
2. 添加标签：在仓库卡片底部输入标签名称并按回车
3. 筛选：点击顶部的标签进行筛选
4. 查看详情：点击仓库名称跳转到 GitHub 页面

### 注意事项
- 标签数据保存在浏览器本地存储中
- 需要有效的 GitHub 令牌才能访问数据
- 首次加载可能需要一些时间，取决于星标仓库数量

## License / 许可证
MIT License

## Acknowledgments / 致谢
Built with GitHub REST API and Octokit
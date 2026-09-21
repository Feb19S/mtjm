# 明天见吗 · 百业门户

《燕云十六声》百业「明天见吗」的移动端门户站点。包含首页介绍、活动排期、成员风采与招募信息。

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:3000（建议用手机模拟器查看，或直接手机访问局域网 IP）。

## 页面结构

| 路由 | 页面 | 内容 |
|------|------|------|
| `/` | 首页 | 百业简介、数据概览、本周活动、最新公告 |
| `/activities` | 活动 | 周常活动报名（可点击报名/取消）、本周排期、报名须知 |
| `/members` | 成员 | 职位统计、成员列表（昵称/职业/战力/在线状态） |
| `/recruit` | 招募 | 招募标语、职业缺口、福利、要求、联系入口 |

## PWA

已支持添加到主屏幕：`public/manifest.json` + 图标（`icon-192/512.png`、`apple-icon.png`）。
图标由 `scripts/gen-icons.py` 生成（需要 Pillow），改样式后重新运行即可。

## 目录说明

```
src/
├── app/            # 页面（App Router）
├── components/     # 公共组件（底部导航、页头、活动报名）
└── lib/data.ts     # 演示数据（替换为真实数据或接口）
public/             # manifest 与 PWA 图标
scripts/            # 图标生成脚本
```

## 报名系统

- 活动页可报名：填写游戏昵称 → 点「我要报名」，名单全员可见（存服务端）
- 接口：`GET /api/signups` 读取名单，`POST /api/signups`（`{activityId, player}`）报名/取消
- 存储：`data/signups.json`（运行时自动创建，已加入 .gitignore）
- **上云提醒**：部署到 Serverless（Vercel）时文件系统只读，需把 `src/lib/store.ts` 里的读写换成 Vercel KV / Supabase 等，接口不用动

## 部署（Deploy）

### 方式一：Vercel 一键导入（推荐）

1. 把代码推到 GitHub（仓库 `Feb19S/mtjm`）
2. 打开 https://vercel.com/new → 选中该仓库 → Import
3. Framework 会自动识别为 Next.js → 直接点 **Deploy**
4. 完成后得到 `https://mtjm-xxx.vercel.app`，可在 Settings 里绑定自定义域名

### 方式二：本地 CLI 部署

```bash
npx vercel login      # 首次需登录
npm run build         # 本地构建验证
npm run deploy        # 等价于 npx vercel --prod，直接上线
```

### ⚠️ 报名存储上云必读

当前报名名单写在 `data/signups.json`（服务端文件）。**Vercel 等 Serverless 平台文件系统只读**，部署后报名会写不进去。
上线报名功能前，把 `src/lib/store.ts` 的读写换成 Vercel KV / Supabase / Redis 等托管存储（接口 `/api/signups` 与前端组件**无需改动**）。

> 纯展示页面（首页 / 成员 / 招募）不依赖文件存储，可直接部署，不受影响。

## 待办

- [ ] 对接真实数据（成员、活动、公告）
- [ ] 部署时把报名存储换成云端 KV / 数据库
- [ ] 招募表单单据 / 群二维码

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
- 存储（`src/lib/store.ts` 双模式，自动切换）：
  - 配了 `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` 环境变量 → 用 **Upstash Redis**（Serverless 只读文件系统也能写）
  - 否则 → 用本地 `data/signups.json`（开发 / 单机，已加入 .gitignore）

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

### 报名存储上云（Upstash Redis）

`src/lib/store.ts` 已做成双模式：检测到 Upstash Redis 环境变量就自动用 Redis，否则退回本地文件。**接口和前端都不用改**，只要以下步骤：

1. 在 Vercel 项目里：**Storage → Connect Store → 选 Upstash Redis**（从 Marketplace 安装，Vercel KV 已弃用，新项目走 Redis）→ 创建并绑定到本项目
2. 绑定后 Vercel 会自动注入 `UPSTASH_REDIS_REST_URL` 与 `UPSTASH_REDIS_REST_TOKEN` 两个环境变量（无需手填）
3. 重新 Deploy（或等自动重新部署）
4. 验证：活动页填昵称点「我要报名」→ 刷新/换设备仍看得到名单即成功

> 未接 Redis 时，报名在 Vercel 上会失败（只读文件系统），但首页 / 活动展示 / 成员 / 招募页面正常。
> 纯展示页面不依赖存储，任何时候都能部署。

## 待办

- [ ] 对接真实数据（成员、活动、公告）
- [x] 报名存储上云（Vercel KV 双模式，已接）
- [ ] 招募表单单据 / 群二维码

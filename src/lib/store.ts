import { promises as fs } from "fs";
import path from "path";

// 报名数据：{ 活动ID: [昵称, ...] }
export type Signups = Record<string, string[]>;

const FILE = path.join(process.cwd(), "data", "signups.json");
const KV_KEY = "mtjm:signups";

// 双模式：
// - 配了 Upstash Redis 环境变量 → 用 Redis（Serverless 只读文件系统也能写）
//   兼容两套变量名：UPSTASH_REDIS_REST_URL/TOKEN 或 KV_REST_API_URL/TOKEN（部分 Vercel 集成注入后者）
// - 否则 → 用本地 JSON 文件（开发 / 单机）
const url =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const useKV = !!(url && token);

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  // fromEnv() 只认 UPSTASH_ 前缀；若只有 KV_ 前缀则手动传入
  if (process.env.UPSTASH_REDIS_REST_URL) return Redis.fromEnv();
  return new Redis({ url, token });
}

async function readFile(): Promise<Signups> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Signups;
  } catch {
    return {};
  }
}

async function writeFile(data: Signups): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function readSignups(): Promise<Signups> {
  if (useKV) {
    try {
      const redis = await getRedis();
      return (await redis.get<Signups>(KV_KEY)) ?? {};
    } catch (e) {
      console.error("[store] Redis 读取失败，回退本地文件:", e);
    }
  }
  return readFile();
}

export async function toggleSignup(
  activityId: string,
  player: string
): Promise<Signups> {
  const data = await readSignups();
  const list = data[activityId] ?? [];
  const idx = list.indexOf(player);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(player);
  data[activityId] = list;

  if (useKV) {
    const redis = await getRedis();
    await redis.set(KV_KEY, data);
  } else {
    await writeFile(data);
  }
  return data;
}

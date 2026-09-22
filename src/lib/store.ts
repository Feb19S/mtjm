import { promises as fs } from "fs";
import path from "path";

// 报名数据：{ 活动ID: [昵称, ...] }
export type Signups = Record<string, string[]>;

const FILE = path.join(process.cwd(), "data", "signups.json");
const KV_KEY = "mtjm:signups";

// 双模式：
// - 配了 Upstash Redis 环境变量（UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN）→ 用 Redis（Serverless 只读文件系统也能写）
// - 否则 → 用本地 JSON 文件（开发 / 单机）
const useKV = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

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
      const { Redis } = await import("@upstash/redis");
      const redis = Redis.fromEnv();
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
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    await redis.set(KV_KEY, data);
  } else {
    await writeFile(data);
  }
  return data;
}

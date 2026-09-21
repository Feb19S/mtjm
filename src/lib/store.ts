import { promises as fs } from "fs";
import path from "path";

// 报名数据：{ 活动ID: [昵称, ...] }
export type Signups = Record<string, string[]>;

// 开发/单机环境用 JSON 文件持久化。
// 注意：部署到 Serverless（如 Vercel）时文件系统只读，
// 需把这里换成 KV / 数据库（如 Vercel KV、Supabase）。
const FILE = path.join(process.cwd(), "data", "signups.json");

export async function readSignups(): Promise<Signups> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Signups;
  } catch {
    return {};
  }
}

export async function writeSignups(data: Signups): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
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
  await writeSignups(data);
  return data;
}

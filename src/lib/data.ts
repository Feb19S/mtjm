export const clan = {
  name: "明天见吗",
  slogan: "江湖路远，明天见。",
  subtitle: "《燕云十六声》百业",
  intro:
    "我们是一群爱闯江湖、也爱唠嗑的玩家。不卷战力，只图开心——每天在群里吼一声「明天见吗」，就是我们的集合暗号。",
  level: 8,
  memberCount: 42,
  foundedDays: 368,
  weeklyActivities: 3,
};

export type Announcement = {
  id: number;
  tag: "公告" | "活动" | "招募";
  title: string;
  date: string;
};

export const announcements: Announcement[] = [
  {
    id: 1,
    tag: "活动",
    title: "本周十人本固定团开组，缺 2 名奶妈",
    date: "09-21",
  },
  {
    id: 2,
    tag: "公告",
    title: "百业商店长鸣玉分红已到账，请查收",
    date: "09-19",
  },
  {
    id: 3,
    tag: "招募",
    title: "长期招募爬塔高玩，战力 18000+ 优先",
    date: "09-15",
  },
];

export type Activity = {
  id: string;
  name: string;
  desc: string;
  schedule: string;
  difficulty: "普通" | "困难" | "顶级";
  accent: string;
};

export const activities: Activity[] = [
  {
    id: "raid5",
    name: "五人本",
    desc: "每周固定速刷，稳定出货自选装备",
    schedule: "周三 / 周六 20:00",
    difficulty: "普通",
    accent: "#48BB78",
  },
  {
    id: "raid10",
    name: "十人本",
    desc: "主力团活动，需 T 奶齐全、战力达标",
    schedule: "周五 21:00",
    difficulty: "困难",
    accent: "#ED8936",
  },
  {
    id: "tower",
    name: "爬塔",
    desc: "冲层带躺，卡关互助，记录每周层数",
    schedule: "随时 / 周末集中",
    difficulty: "顶级",
    accent: "#9F7AEA",
  },
];

export type Member = {
  id: number;
  nickname: string;
  role: "大哥" | "管理" | "核心" | "成员";
  class: string;
  power: number;
  online: boolean;
  joinWeeks: number;
  bio: string;
  avatar?: string;
  // 个人页扩展字段
  title?: string; // 称号
  tags?: string[]; // 标签
  joinedAt?: string; // 入伙日期，如 "2025-08"
  signature?: string; // 个性签名
  achievements?: string[]; // 高光时刻
  photos?: string[]; // 相册图片路径
};

export const members: Member[] = [
  { id: 1, nickname: "不过一介凡人", role: "大哥", class: "剑客", power: 21500, online: true, joinWeeks: 52, bio: "百业创始人，每天准时喊那句「明天见吗」。", title: "百业创始人", tags: ["气氛担当", "固定团指挥"], joinedAt: "2025-08", signature: "每天准时喊那句「明天见吗」", achievements: ["百业初创成员", "连续 52 周满勤", "十人本首杀团长"] },
  { id: 2, nickname: "江湖小二", role: "管理", class: "医者", power: 19800, online: true, joinWeeks: 48, bio: "专职奶妈兼气氛组，团本后勤一把好手。", title: "后勤总管", tags: ["团本奶妈", "气氛组"], joinedAt: "2025-09", signature: "有事喊一声，奶马上到", achievements: ["十人本首杀", "分红 Top3", "带新人次数最多"] },
  { id: 3, nickname: "风雪夜归人", role: "核心", class: "刺客", power: 20400, online: false, joinWeeks: 40, bio: "十人本主力输出，喜欢研究机制速通。", title: "机制研究员", tags: ["速通", "机制研究"], joinedAt: "2025-10", signature: "副本机制？我闭眼都熟", achievements: ["爬塔最高层记录", "十人本机制速通"] },
  { id: 4, nickname: "一箭穿云", role: "核心", class: "射手", power: 19200, online: true, joinWeeks: 36, bio: "远程稳定输出，爬塔带躺专业户。", title: "远程核心", tags: ["稳定输出", "爬塔带躺"], joinedAt: "2025-11", signature: "站桩输出，稳得很", achievements: ["爬塔带躺 20+ 次", "周常满勤"] },
  { id: 5, nickname: "南山樵夫", role: "成员", class: "肉盾", power: 18900, online: false, joinWeeks: 30, bio: "团本主T，扛伤一流，话不多。", title: "主T", tags: ["扛伤", "话少"], joinedAt: "2025-12", signature: "别怕，我顶在前面", achievements: ["十人本主T", "零倒T记录"] },
  { id: 6, nickname: "千山暮雪", role: "成员", class: "术士", power: 18100, online: true, joinWeeks: 24, bio: "控场型术士，PVE / PVP 都在线。", title: "控场术士", tags: ["控场", "PVP"], joinedAt: "2026-01", signature: "控住就赢了半场", achievements: ["PVP 胜率领先", "团本控场核心"] },
  { id: 7, nickname: "醉卧沙场", role: "成员", class: "刀客", power: 17900, online: false, joinWeeks: 20, bio: "佛系刀客，周末固定出勤。", title: "佛系刀客", tags: ["周末出勤", "佛系"], joinedAt: "2026-02", signature: "周末固定来，平时随缘", achievements: ["周末团本满勤"] },
  { id: 8, nickname: "月下独酌", role: "成员", class: "琴师", power: 17500, online: true, joinWeeks: 12, bio: "新人友好型琴师，乐于带萌新。", title: "新人向导", tags: ["带萌新", "乐子人"], joinedAt: "2026-03", signature: "新人别慌，我带你", achievements: ["带萌新入门 10+", "团本气氛担当"] },
];

export type RecruitRole = {
  name: string;
  need: number;
  total: number;
  urgent: boolean;
};

export const recruitRoles: RecruitRole[] = [
  { name: "医者 / 奶妈", need: 2, total: 3, urgent: true },
  { name: "肉盾 / 坦克", need: 1, total: 3, urgent: true },
  { name: "输出（剑/刀/射）", need: 3, total: 6, urgent: false },
  { name: "术士 / 琴师", need: 2, total: 4, urgent: false },
];

export const recruitRequirements = [
  "战力 17000 以上，能稳定参加每周固定团",
  "有麦克风、愿意上语音沟通",
  "不摆烂、不划水，尊重队友",
  "长期在线优先，新人肯学也欢迎",
];

export const clanBenefits = [
  { title: "固定团", desc: "每周五人本 / 十人本 / 爬塔排期" },
  { title: "分红", desc: "百业长鸣玉按活跃度分账" },
  { title: "带躺", desc: "爬塔带新人，卡关随时喊人" },
  { title: "氛围", desc: "佛系不卷，唠嗑为主" },
];

// 加群联系方式：填好后招募页「怎么加入」区会自动显示并可一键复制。
// 微信号 / QQ 群留空则不显示对应行；群二维码放 public/recruit-qr.png 即可。
export const contact = {
  wechat: "",
  qqGroup: "",
  note: "游戏内搜索百业「明天见吗」申请，或在群里 @管理员",
};

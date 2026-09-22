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
    title: "本周十人本固定团开启报名，缺 2 名奶妈",
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
};

export const members: Member[] = [
  { id: 1, nickname: "不过一介凡人", role: "大哥", class: "剑客", power: 21500, online: true, joinWeeks: 52 },
  { id: 2, nickname: "江湖小二", role: "管理", class: "医者", power: 19800, online: true, joinWeeks: 48 },
  { id: 3, nickname: "风雪夜归人", role: "核心", class: "刺客", power: 20400, online: false, joinWeeks: 40 },
  { id: 4, nickname: "一箭穿云", role: "核心", class: "射手", power: 19200, online: true, joinWeeks: 36 },
  { id: 5, nickname: "南山樵夫", role: "成员", class: "肉盾", power: 18900, online: false, joinWeeks: 30 },
  { id: 6, nickname: "千山暮雪", role: "成员", class: "术士", power: 18100, online: true, joinWeeks: 24 },
  { id: 7, nickname: "醉卧沙场", role: "成员", class: "刀客", power: 17900, online: false, joinWeeks: 20 },
  { id: 8, nickname: "月下独酌", role: "成员", class: "琴师", power: 17500, online: true, joinWeeks: 12 },
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

import type { Member } from "@/lib/data";

const roleColor: Record<string, string> = {
  大哥: "#ef4444",
  管理: "#c9a961",
  核心: "#38bdf8",
  成员: "#6f6f82",
};

const classEmoji: Record<string, string> = {
  剑客: "⚔",
  医者: "☯",
  刺客: "🗡",
  射手: "🏹",
  肉盾: "🛡",
  术士: "✦",
  刀客: "⚔",
  琴师: "♪",
};

export default function MemberAvatar({
  member,
  size = 52,
}: {
  member: Member;
  size?: number;
}) {
  const color = roleColor[member.role] ?? "#6f6f82";
  const emoji = classEmoji[member.class] ?? "侠";
  const gid = `m-avatar-${member.id}`;

  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.nickname}
        style={{ width: size, height: size }}
        className="rounded-2xl object-cover"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={member.nickname}
      className="rounded-2xl"
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="36%" r="72%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#131318" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gid})`} />
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="30"
        fill="#eceae4"
      >
        {emoji}
      </text>
    </svg>
  );
}

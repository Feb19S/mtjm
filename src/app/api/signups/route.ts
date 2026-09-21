import { NextResponse } from "next/server";
import { readSignups, toggleSignup } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await readSignups());
}

export async function POST(req: Request) {
  let body: { activityId?: string; player?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const activityId = body.activityId?.trim();
  const player = body.player?.trim();

  if (!activityId || !player) {
    return NextResponse.json(
      { error: "activityId 和 player 不能为空" },
      { status: 400 }
    );
  }
  if (player.length > 20) {
    return NextResponse.json({ error: "昵称过长" }, { status: 400 });
  }

  const data = await toggleSignup(activityId, player);
  return NextResponse.json(data);
}

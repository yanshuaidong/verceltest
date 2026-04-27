import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile });
}

export async function PUT(request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const bio = String(body.bio || "").trim();

  if (!name || !bio) {
    return NextResponse.json(
      { error: "name 和 bio 都不能为空" },
      { status: 400 }
    );
  }

  const profile = await updateProfile({ name, bio });

  return NextResponse.json({ profile });
}

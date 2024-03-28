import { NextResponse } from "next/server";

export async function GET() {
  const result = "Helo, World! This is CRON route.";

  return NextResponse.json({ data: result });
}

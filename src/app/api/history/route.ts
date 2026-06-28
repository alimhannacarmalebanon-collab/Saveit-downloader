import { NextResponse } from "next/server";
import { db } from "@/db";
import { downloads } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const history = await db
      .select()
      .from(downloads)
      .orderBy(desc(downloads.createdAt))
      .limit(50);

    return NextResponse.json(history);
  } catch (error: unknown) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

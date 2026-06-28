import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { downloads } from "@/db/schema";
import { detectPlatform } from "@/lib/platforms";
import { fetchFromCobalt } from "@/lib/cobalt";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { url, quality } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!parsedUrl.protocol.startsWith("http")) {
      return NextResponse.json(
        { error: "URL must start with http:// or https://" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(url);
    const videoQuality = quality || "1080";

    const [record] = await db
      .insert(downloads)
      .values({
        originalUrl: url,
        platform,
        status: "processing",
        videoQuality,
      })
      .returning();

    const result = await fetchFromCobalt(url, videoQuality);

    if (result.status === "error" || !result.url) {
      await db
        .update(downloads)
        .set({
          status: "failed",
          errorMessage: result.error || "Failed to process video",
        })
        .where(eq(downloads.id, record.id));

      return NextResponse.json(
        {
          error: result.error || "Failed to process video. Try a different URL or quality.",
          id: record.id,
        },
        { status: 422 }
      );
    }

    await db
      .update(downloads)
      .set({
        status: "completed",
        downloadUrl: result.url,
        filename: result.filename || "download",
      })
      .where(eq(downloads.id, record.id));

    return NextResponse.json({
      id: record.id,
      url: result.url,
      filename: result.filename || "download",
      platform,
      status: result.status,
    });
  } catch (error: unknown) {
    console.error("Download error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

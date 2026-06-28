import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "download";

  if (!url) {
    return NextResponse.json({ error: "URL parameter required" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: 502 }
      );
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    let ext = "mp4";
    if (contentType.includes("audio")) {
      ext = "mp3";
    } else if (contentType.includes("webm")) {
      ext = "webm";
    }

    const finalFilename = filename.includes(".")
      ? filename
      : `${filename}.${ext}`;

    const body = response.body;
    if (!body) {
      return NextResponse.json({ error: "Empty response body" }, { status: 502 });
    }

    return new NextResponse(body as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${finalFilename}"`,
        "Cache-Control": "no-cache",
        ...(response.headers.get("content-length")
          ? { "Content-Length": response.headers.get("content-length")! }
          : {}),
      },
    });
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch the file" },
      { status: 500 }
    );
  }
}

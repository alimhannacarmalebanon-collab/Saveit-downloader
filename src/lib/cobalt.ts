const COBALT_INSTANCES = [
  "https://api.cobalt.blackcat.sweeux.org",
  "https://rue-cobalt.xenon.zone",
  "https://dog.kittycat.boo",
  "https://cobaltapi.kittycat.boo",
];

export type CobaltResponse = {
  status: "tunnel" | "redirect" | "error" | "picker";
  url?: string;
  filename?: string;
  error?: string;
  picker?: Array<{ url: string; type: string; thumb?: string }>;
};

export async function fetchFromCobalt(
  videoUrl: string,
  quality: string = "1080"
): Promise<CobaltResponse> {
  const body = JSON.stringify({
    url: videoUrl,
    videoQuality: quality,
    audioFormat: "mp3",
    filenameStyle: "pretty",
    downloadMode: "auto",
    youtubeVideoCodec: "h264",
    alwaysProxy: true,
  });

  let lastError: string = "All instances failed";

  for (const instance of COBALT_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${instance}/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (data.status === "error") {
        lastError = data.error?.code || data.error || "Unknown error from API";
        continue;
      }

      if (data.status === "picker" && data.picker?.length > 0) {
        return {
          status: "tunnel",
          url: data.picker[0].url,
          filename: data.filename || "download",
        };
      }

      if (data.status === "tunnel" || data.status === "redirect") {
        return data as CobaltResponse;
      }

      lastError = `Unexpected response status: ${data.status}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        lastError = err.message;
      }
      continue;
    }
  }

  return {
    status: "error",
    error: lastError,
  };
}

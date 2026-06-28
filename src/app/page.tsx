"use client";

import { useState, useCallback } from "react";
import DownloaderForm from "@/components/DownloaderForm";
import DownloadResult from "@/components/DownloadResult";
import HistorySection from "@/components/HistorySection";
import PlatformGrid from "@/components/PlatformGrid";

export type DownloadResponse = {
  id: number;
  url: string;
  filename: string;
  platform: string;
  status: string;
  error?: string;
};

export default function Home() {
  const [result, setResult] = useState<DownloadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDownload = useCallback(async (url: string, quality: string) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, quality }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process video");
        return;
      }

      setResult(data);
      setRefreshKey((k) => k + 1);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="pt-8 pb-4 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/25">
            ⬇️
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            SaveIt
          </h1>
        </div>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Download videos from YouTube, TikTok, Instagram, Facebook, Twitter
          and 10+ other platforms
        </p>
      </header>

      <div className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full">
        <DownloaderForm onSubmit={handleDownload} loading={loading} />

        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-medium">Download Failed</p>
                <p className="mt-1 text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && <DownloadResult result={result} />}
        <PlatformGrid />
        <HistorySection refreshKey={refreshKey} />
      </div>

      <footer className="py-6 text-center text-xs text-slate-600 border-t border-slate-800/50">
        <p>SaveIt — Free & Open Source Video Downloader</p>
        <p className="mt-1">Works on mobile & desktop browsers</p>
      </footer>
    </main>
  );
}

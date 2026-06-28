"use client";

import { useState, useEffect, useCallback } from "react";

type HistoryItem = {
  id: number;
  originalUrl: string;
  platform: string;
  downloadUrl: string | null;
  filename: string | null;
  status: string;
  videoQuality: string | null;
  errorMessage: string | null;
  createdAt: string;
};

type Props = {
  refreshKey: number;
};

export default function HistorySection({ refreshKey }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, refreshKey, fetchHistory]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400">
            ✓ Done
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-400">
            ✕ Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/20 text-yellow-400">
            ⏳ Processing
          </span>
        );
    }
  };

  const truncateUrl = (url: string, maxLen: number = 40) => {
    if (url.length <= maxLen) return url;
    return url.substring(0, maxLen) + "...";
  };

  return (
    <section className="mt-8">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
          📜 Download History
        </span>
        <span
          className={`text-slate-500 text-xs transition-transform ${showHistory ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {showHistory && (
        <div className="mt-2 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-sm">
              No downloads yet. Try downloading a video!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-violet-400">
                        {item.platform}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {truncateUrl(item.originalUrl)}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {formatDate(item.createdAt)}
                      {item.videoQuality && ` • ${item.videoQuality}p`}
                    </p>
                  </div>
                  {item.status === "completed" && item.downloadUrl && (
                    <a
                      href={`/api/proxy?url=${encodeURIComponent(item.downloadUrl)}&filename=${encodeURIComponent(item.filename || "download")}`}
                      download
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-medium hover:bg-violet-500/30 transition-colors active:scale-95"
                    >
                      ⬇️
                    </a>
                  )}
                </div>
                {item.errorMessage && (
                  <p className="text-[10px] text-red-400/60 mt-1 truncate">
                    {item.errorMessage}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

"use client";

import type { DownloadResponse } from "@/app/page";

type Props = {
  result: DownloadResponse;
};

export default function DownloadResult({ result }: Props) {
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(result.url)}&filename=${encodeURIComponent(result.filename)}`;

  return (
    <div className="mt-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-start gap-3">
        <span className="text-2xl">✅</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-emerald-400">Ready to Download!</p>
          <p className="text-xs text-slate-400 mt-1 truncate">
            Platform: {result.platform} • {result.filename}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <a
          href={proxyUrl}
          download={result.filename}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-white font-semibold text-center text-sm hover:bg-emerald-400 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          💾 Save to Device
        </a>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-xl bg-slate-700/50 text-slate-300 font-medium text-center text-sm hover:bg-slate-600/50 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          🔗 Direct Link
        </a>
      </div>

      <p className="mt-3 text-xs text-slate-500 text-center">
        💡 Tip: On mobile, tap &quot;Save to Device&quot; to download. If it opens in
        browser, long-press and select &quot;Download&quot; or &quot;Save Video&quot;.
      </p>
    </div>
  );
}

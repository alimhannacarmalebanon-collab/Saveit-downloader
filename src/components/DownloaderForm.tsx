"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onSubmit: (url: string, quality: string) => void;
  loading: boolean;
};

export default function DownloaderForm({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("1080");
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onSubmit(url.trim(), quality);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        inputRef.current?.focus();
      }
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here..."
              className="w-full px-4 py-4 pr-20 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-base transition-all"
              disabled={loading}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-700/80 text-slate-300 text-xs font-medium hover:bg-slate-600/80 transition-colors active:scale-95"
            >
              📋 Paste
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 px-1">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          ⚙️ Options
          <span className={`transition-transform ${showOptions ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {showOptions && (
        <div className="mt-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30">
          <label className="text-xs text-slate-400 font-medium">
            Video Quality
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { value: "max", label: "Max" },
              { value: "2160", label: "4K" },
              { value: "1080", label: "1080p" },
              { value: "720", label: "720p" },
              { value: "480", label: "480p" },
              { value: "360", label: "360p" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setQuality(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                  quality === opt.value
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                    : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!url.trim() || loading}
        className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-base shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>⬇️ Download Video</>
        )}
      </button>
    </form>
  );
}

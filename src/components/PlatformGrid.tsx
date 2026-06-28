"use client";

const supportedPlatforms = [
  { name: "YouTube", icon: "▶️", color: "from-red-600 to-red-500" },
  { name: "TikTok", icon: "🎵", color: "from-slate-800 to-slate-700" },
  { name: "Instagram", icon: "📷", color: "from-purple-600 to-pink-500" },
  { name: "Facebook", icon: "👤", color: "from-blue-700 to-blue-500" },
  { name: "Twitter/X", icon: "🐦", color: "from-sky-600 to-sky-400" },
  { name: "Reddit", icon: "🤖", color: "from-orange-600 to-orange-400" },
  { name: "Pinterest", icon: "📌", color: "from-red-700 to-red-500" },
  { name: "Twitch", icon: "🎮", color: "from-purple-700 to-purple-500" },
  { name: "Vimeo", icon: "🎬", color: "from-cyan-700 to-cyan-500" },
  { name: "SoundCloud", icon: "🔊", color: "from-orange-500 to-orange-300" },
  { name: "Tumblr", icon: "📝", color: "from-indigo-700 to-indigo-500" },
  { name: "Bluesky", icon: "🦋", color: "from-blue-500 to-blue-300" },
  { name: "Snapchat", icon: "👻", color: "from-yellow-500 to-yellow-300" },
  { name: "Dailymotion", icon: "📹", color: "from-blue-800 to-blue-600" },
];

export default function PlatformGrid() {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
        Supported Platforms
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {supportedPlatforms.map((platform) => (
          <div
            key={platform.name}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/30 transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-lg shadow-lg`}
            >
              {platform.icon}
            </div>
            <span className="text-xs text-slate-400 text-center leading-tight">
              {platform.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

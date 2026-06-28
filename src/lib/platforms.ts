export type Platform = {
  name: string;
  icon: string;
  color: string;
  patterns: RegExp[];
};

export const platforms: Platform[] = [
  {
    name: "YouTube",
    icon: "▶️",
    color: "bg-red-500",
    patterns: [
      /youtube\.com/i,
      /youtu\.be/i,
      /youtube-nocookie\.com/i,
      /music\.youtube\.com/i,
    ],
  },
  {
    name: "TikTok",
    icon: "🎵",
    color: "bg-black",
    patterns: [/tiktok\.com/i, /vm\.tiktok\.com/i],
  },
  {
    name: "Instagram",
    icon: "📷",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    patterns: [/instagram\.com/i, /instagr\.am/i],
  },
  {
    name: "Facebook",
    icon: "👤",
    color: "bg-blue-600",
    patterns: [/facebook\.com/i, /fb\.watch/i, /fb\.com/i],
  },
  {
    name: "Twitter/X",
    icon: "🐦",
    color: "bg-sky-500",
    patterns: [/twitter\.com/i, /x\.com/i, /t\.co/i],
  },
  {
    name: "Reddit",
    icon: "🤖",
    color: "bg-orange-500",
    patterns: [/reddit\.com/i, /redd\.it/i],
  },
  {
    name: "Pinterest",
    icon: "📌",
    color: "bg-red-600",
    patterns: [/pinterest\.com/i, /pin\.it/i],
  },
  {
    name: "Twitch",
    icon: "🎮",
    color: "bg-purple-600",
    patterns: [/twitch\.tv/i, /clips\.twitch\.tv/i],
  },
  {
    name: "Vimeo",
    icon: "🎬",
    color: "bg-cyan-600",
    patterns: [/vimeo\.com/i],
  },
  {
    name: "SoundCloud",
    icon: "🔊",
    color: "bg-orange-400",
    patterns: [/soundcloud\.com/i],
  },
  {
    name: "Tumblr",
    icon: "📝",
    color: "bg-indigo-600",
    patterns: [/tumblr\.com/i],
  },
  {
    name: "Snapchat",
    icon: "👻",
    color: "bg-yellow-400",
    patterns: [/snapchat\.com/i],
  },
  {
    name: "Bluesky",
    icon: "🦋",
    color: "bg-blue-400",
    patterns: [/bsky\.app/i],
  },
  {
    name: "Dailymotion",
    icon: "📹",
    color: "bg-blue-700",
    patterns: [/dailymotion\.com/i],
  },
];

export function detectPlatform(url: string): string {
  for (const platform of platforms) {
    for (const pattern of platform.patterns) {
      if (pattern.test(url)) {
        return platform.name;
      }
    }
  }
  return "Other";
}

export function getPlatformInfo(name: string): Platform | undefined {
  return platforms.find((p) => p.name === name);
}

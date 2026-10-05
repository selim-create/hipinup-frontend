export type SocialEmbedProvider =
  | "youtube"
  | "vimeo"
  | "instagram"
  | "x"
  | "tiktok"
  | "spotify"
  | "facebook"
  | "soundcloud"
  | "dailymotion"
  | "generic";

export type SocialEmbedLayout = "video" | "portrait" | "social" | "audio";

export type SocialEmbedDescriptor = {
  provider: SocialEmbedProvider;
  label: string;
  originalUrl: string;
  embedUrl?: string;
  layout: SocialEmbedLayout;
  allowFullScreen?: boolean;
};

const httpUrl = (value: string) => {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed : null;
  } catch {
    return null;
  }
};

const hostOf = (url: URL) => url.hostname.replace(/^www\./, "").toLowerCase();
const pathParts = (url: URL) => url.pathname.split("/").filter(Boolean);
const cleanId = (value = "") => value.replace(/[^A-Za-z0-9_-]/g, "");

function youtube(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  const parts = pathParts(url);
  let id = "";

  if (host === "youtu.be") id = parts[0] || "";
  if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
    id =
      url.searchParams.get("v") ||
      ((["shorts", "live", "embed"].includes(parts[0])) ? parts[1] : "") ||
      "";
  }

  id = cleanId(id);
  if (!id) return null;

  return {
    provider: "youtube",
    label: "YouTube",
    originalUrl: url.toString(),
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
    layout: "video",
    allowFullScreen: true,
  };
}

function vimeo(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (!["vimeo.com", "player.vimeo.com"].includes(host)) return null;
  const id = pathParts(url).find((part) => /^\d+$/.test(part));
  if (!id) return null;

  return {
    provider: "vimeo",
    label: "Vimeo",
    originalUrl: url.toString(),
    embedUrl: `https://player.vimeo.com/video/${id}?dnt=1&title=0&byline=0&portrait=0`,
    layout: "video",
    allowFullScreen: true,
  };
}

function instagram(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (!["instagram.com", "m.instagram.com"].includes(host)) return null;
  const parts = pathParts(url);
  const type = ["p", "reel", "tv"].includes(parts[0]) ? parts[0] : "";
  const code = cleanId(parts[1] || "");
  if (!type || !code) return null;

  return {
    provider: "instagram",
    label: "Instagram",
    originalUrl: url.toString(),
    embedUrl: `https://www.instagram.com/${type}/${code}/embed/`,
    layout: "social",
  };
}

function xPost(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (!["x.com", "twitter.com", "mobile.twitter.com"].includes(host)) return null;
  const match = url.pathname.match(/\/status\/(\d+)/);
  if (!match) return null;

  return {
    provider: "x",
    label: "X",
    originalUrl: url.toString(),
    embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}&dnt=true`,
    layout: "social",
  };
}

function tiktok(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (!["tiktok.com", "m.tiktok.com"].includes(host)) return null;
  const match = url.pathname.match(/\/video\/(\d+)/);
  if (!match) return null;

  return {
    provider: "tiktok",
    label: "TikTok",
    originalUrl: url.toString(),
    embedUrl: `https://www.tiktok.com/player/v1/${match[1]}?autoplay=0&loop=0&music_info=1&description=1`,
    layout: "portrait",
    allowFullScreen: true,
  };
}

function spotify(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (host !== "open.spotify.com") return null;
  const parts = pathParts(url).filter((part) => !part.startsWith("intl-"));
  const [type, id] = parts;
  const allowed = new Set(["track", "album", "playlist", "episode", "show", "artist"]);
  if (!allowed.has(type) || !id) return null;

  return {
    provider: "spotify",
    label: "Spotify",
    originalUrl: url.toString(),
    embedUrl: `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}?utm_source=generator`,
    layout: "audio",
    allowFullScreen: true,
  };
}

function facebook(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (!["facebook.com", "m.facebook.com"].includes(host)) return null;
  const original = url.toString();
  const isVideo = /\/(videos|reel)\//i.test(url.pathname);

  return {
    provider: "facebook",
    label: "Facebook",
    originalUrl: original,
    embedUrl: isVideo
      ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(original)}&show_text=true&width=560`
      : `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(original)}&show_text=true&width=500`,
    layout: isVideo ? "video" : "social",
    allowFullScreen: isVideo,
  };
}

function soundcloud(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  if (!["soundcloud.com", "m.soundcloud.com"].includes(host)) return null;
  const original = url.toString();

  return {
    provider: "soundcloud",
    label: "SoundCloud",
    originalUrl: original,
    embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(original)}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`,
    layout: "audio",
  };
}

function dailymotion(url: URL): SocialEmbedDescriptor | null {
  const host = hostOf(url);
  const parts = pathParts(url);
  let id = "";

  if (host === "dai.ly") id = parts[0] || "";
  if (["dailymotion.com", "geo.dailymotion.com"].includes(host)) {
    const videoIndex = parts.indexOf("video");
    if (videoIndex >= 0) id = parts[videoIndex + 1] || "";
  }

  id = cleanId(id);
  if (!id) return null;

  return {
    provider: "dailymotion",
    label: "Dailymotion",
    originalUrl: url.toString(),
    embedUrl: `https://www.dailymotion.com/embed/video/${id}`,
    layout: "video",
    allowFullScreen: true,
  };
}

export function resolveSocialEmbed(rawUrl: string, providerHint = ""): SocialEmbedDescriptor | null {
  const url = httpUrl(rawUrl);
  if (!url) return null;

  const resolvers = [youtube, vimeo, instagram, xPost, tiktok, spotify, facebook, soundcloud, dailymotion];
  for (const resolver of resolvers) {
    const result = resolver(url);
    if (result) return result;
  }

  const label = providerHint
    ? providerHint.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : hostOf(url);

  return {
    provider: "generic",
    label,
    originalUrl: url.toString(),
    layout: "social",
  };
}

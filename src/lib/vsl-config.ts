export const VSL_CONFIG = {
  /** 'youtube' | 'vimeo' | 'local' */
  platform: "local" as const,

  /** Leave empty to show the placeholder state (for youtube/vimeo) */
  videoId: "",

  /** Path to local video file in /public */
  localVideoSrc: "/videos/vsl-certificacao.mp4",

  /** Thumbnail shown before play — falls back to a generated gradient if missing */
  thumbnailUrl: "/images/vsl/vsl-thumbnail.jpg",

  /** Headline rendered above or beside the player */
  headline: "Assista e entenda como funciona",

  /** Subheadline for context */
  subheadline:
    "Em 1 minuto você vai descobrir como transformar sua experiência profissional em um diploma técnico com validade nacional.",
} as const;

export type VslPlatform = typeof VSL_CONFIG.platform;

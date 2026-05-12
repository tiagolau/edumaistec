"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ShieldCheck,
  Users,
  BookOpen,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VSL_CONFIG } from "@/lib/vsl-config";
import { INSTITUTION } from "@/lib/constants";

interface VslPlayerProps {
  /** Override the global config */
  videoId?: string;
  platform?: "youtube" | "vimeo" | "local";
  localVideoSrc?: string;
  /** Autoplay (muted — browser requirement) */
  autoPlay?: boolean;
  /** Compact mode for inline/secondary placements */
  compact?: boolean;
  /** Hide trust badges below */
  hideBadges?: boolean;
  className?: string;
}

const trustBadges = [
  { icon: Users, label: "2.500+ formados" },
  { icon: ShieldCheck, label: "SISTEC/MEC" },
  { icon: BookOpen, label: "60+ cursos" },
];

function getEmbedUrl(platform: string, videoId: string): string {
  if (platform === "vimeo") {
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
  }
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}

export function VslPlayer({
  videoId,
  platform,
  localVideoSrc,
  autoPlay = false,
  compact = false,
  hideBadges = false,
  className = "",
}: VslPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const resolvedPlatform = platform ?? VSL_CONFIG.platform;
  const resolvedVideoId = videoId ?? VSL_CONFIG.videoId;
  const resolvedLocalSrc = localVideoSrc ?? VSL_CONFIG.localVideoSrc;
  const isLocal = resolvedPlatform === "local" && resolvedLocalSrc;
  const hasVideo = isLocal || resolvedVideoId.length > 0;

  const handlePlay = () => {
    if (isLocal && videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
      setMuted(false);
      videoRef.current.muted = false;
    } else {
      setPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <div className={className}>
      {/* Player container — vertical video layout */}
      <div className="relative group mx-auto w-full max-w-[min(100%,360px)] sm:max-w-[340px] md:max-w-[380px]">
        {/* Glow effect */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/25 via-primary-dark/15 to-accent/25 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

        {/* Border frame */}
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-white/20 via-white/5 to-white/10">
          <div className="relative overflow-hidden rounded-[14px] bg-black aspect-[9/16]">
            {isLocal ? (
              <>
                {/* Local video player */}
                <video
                  ref={videoRef}
                  src={resolvedLocalSrc}
                  className="absolute inset-0 h-full w-full object-cover cursor-pointer"
                  playsInline
                  muted
                  autoPlay={autoPlay}
                  loop={autoPlay}
                  preload={autoPlay ? "auto" : "metadata"}
                  onClick={playing ? handleTogglePlay : handlePlay}
                  onEnded={() => { if (!autoPlay) setPlaying(false); }}
                />

                {/* Play overlay — shown when not playing */}
                {!playing && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group/play"
                    aria-label="Reproduzir vídeo"
                  >
                    {/* Dark overlay on thumbnail */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-accent/80 group-hover/play:border-accent/50 sm:h-20 sm:w-20">
                        <Play className="h-7 w-7 text-white ml-1 sm:h-8 sm:w-8" />
                      </div>
                      {!compact && (
                        <span className="text-sm font-medium text-white/80 group-hover/play:text-white transition-colors drop-shadow-lg">
                          {VSL_CONFIG.headline}
                        </span>
                      )}
                    </div>

                    {/* Animated ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-22 w-22 rounded-full border-2 border-white/10 animate-ping sm:h-24 sm:w-24 [animation-duration:3s]" />
                    </div>
                  </button>
                )}

                {/* Controls overlay — shown when playing */}
                {playing && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={handleTogglePlay}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors"
                      aria-label={playing ? "Pausar" : "Reproduzir"}
                    >
                      {playing ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={handleToggleMute}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors"
                      aria-label={muted ? "Ativar som" : "Desativar som"}
                    >
                      {muted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : hasVideo && playing ? (
              /* Active embed (youtube/vimeo) */
              <iframe
                src={getEmbedUrl(resolvedPlatform, resolvedVideoId)}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                title={`VSL — ${INSTITUTION.name}`}
              />
            ) : hasVideo ? (
              /* Thumbnail + play button (youtube/vimeo) */
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                aria-label="Reproduzir vídeo"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#1a0a0a] to-black" />

                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-accent/80 group-hover/play:border-accent/50 sm:h-20 sm:w-20">
                    <Play className="h-7 w-7 text-white ml-1 sm:h-8 sm:w-8" />
                  </div>
                  {!compact && (
                    <span className="text-sm font-medium text-white/70 group-hover/play:text-white transition-colors">
                      {VSL_CONFIG.headline}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-22 w-22 rounded-full border-2 border-white/10 animate-ping sm:h-24 sm:w-24 [animation-duration:3s]" />
                </div>
              </button>
            ) : (
              /* Placeholder — no video yet */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#1a0808] to-black" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

                <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-dashed border-white/20 sm:h-20 sm:w-20">
                    <Play className="h-7 w-7 text-white/40 ml-1 sm:h-8 sm:w-8" />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-white sm:text-xl">
                      Video em breve
                    </p>
                    <p className="mt-2 text-sm text-white/50 leading-relaxed">
                      {VSL_CONFIG.subheadline}
                    </p>
                  </div>

                  <Button
                    size={compact ? "sm" : "lg"}
                    className="bg-accent text-accent-foreground hover:bg-accent-dark"
                    asChild
                  >
                    <Link href="/cursos">Ver cursos disponíveis</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust badges */}
      {!hideBadges && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {trustBadges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-white/50"
            >
              <badge.icon className="h-4 w-4 text-accent/70" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

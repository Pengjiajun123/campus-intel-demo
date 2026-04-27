"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { StickerMood, StickerStatus } from "@/lib/status";

type StatusStickerProps = {
  status: StickerStatus;
  label?: string;
  description?: string;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  priority?: boolean;
  className?: string;
};

const sizeClass = {
  sm: "sticker-size-sm",
  md: "sticker-size-md",
  lg: "sticker-size-lg",
};

const imageByMood: Record<StickerMood, string> = {
  missed: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stickers/missed-blue-sad.png`,
  overload: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stickers/overload-red-angry.png`,
  busy: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stickers/busy-orange-nervous.png`,
  urgent: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stickers/urgent-yellow-uncomfortable.png`,
  easy: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stickers/easy-pink-happy.png`,
  clear: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stickers/clear-green-happy.png`,
};

const bubbleByMood: Record<StickerMood, string> = {
  missed: "先补救这个！",
  overload: "马上处理！",
  busy: "别拖太久",
  urgent: "时间有点紧",
  easy: "今天还稳",
  clear: "今日清爽",
};

const particles = [
  { x: "-56px", y: "-46px", shape: "dot" },
  { x: "52px", y: "-50px", shape: "star" },
  { x: "72px", y: "-4px", shape: "heart" },
  { x: "46px", y: "54px", shape: "dot" },
  { x: "-34px", y: "60px", shape: "star" },
  { x: "-72px", y: "10px", shape: "heart" },
  { x: "10px", y: "-72px", shape: "dot" },
  { x: "2px", y: "70px", shape: "heart" },
];

export function StatusSticker({
  status,
  label,
  description,
  title,
  subtitle,
  size = "md",
  interactive = true,
  priority = true,
  className = "",
}: StatusStickerProps) {
  const [burstKey, setBurstKey] = useState(0);
  const [isPopping, setIsPopping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const displayTitle = label ?? title ?? status.title;
  const displayDescription = description ?? subtitle ?? status.shortLabel;
  const imageSrc = imageByMood[status.mood];

  function handleActivate() {
    if (!interactive) {
      return;
    }

    setBurstKey((current) => current + 1);
    setIsPopping(true);
    setShowBubble(true);
    window.setTimeout(() => setIsPopping(false), 460);
    window.setTimeout(() => setShowBubble(false), 900);
  }

  const Element = interactive ? "button" : "div";

  return (
    <Element
      type={interactive ? "button" : undefined}
      onClick={interactive ? handleActivate : undefined}
      className={`status-sticker ${isPopping ? "is-popping" : ""} ${sizeClass[size]} ${className}`}
      aria-label={`${displayTitle}，${displayDescription}。点击查看状态反馈`}
    >
      <span className="status-sticker-art" aria-hidden="true">
        <Image
          src={imageSrc}
          alt=""
          width={760}
          height={760}
          sizes={size === "lg" ? "(max-width: 520px) 75vw, 320px" : size === "md" ? "200px" : "128px"}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="status-sticker-img"
          draggable={false}
        />
      </span>

      <span className="sticker-copy">
        <span className="sticker-copy-title">{displayTitle}</span>
        <span className="sticker-copy-subtitle">{displayDescription}</span>
      </span>

      {interactive && showBubble ? (
        <span key={`bubble-${burstKey}`} className="sticker-bubble" aria-hidden="true">
          {bubbleByMood[status.mood]}
        </span>
      ) : null}

      {interactive && isPopping
        ? particles.map((particle, index) => (
            <span
              key={`${burstKey}-${index}`}
              className={`sticker-particle particle-${particle.shape}`}
              style={{ "--x": particle.x, "--y": particle.y } as CSSProperties}
              aria-hidden="true"
            />
          ))
        : null}
    </Element>
  );
}

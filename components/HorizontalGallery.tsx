"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Category } from "@/types/content";

const CARD_WIDTH_VW = 32;   // ancho de cada card en vw
const CARD_HEIGHT_VH = 58;  // alto de cada card en vh
const GAP_PX = 28;          // separación entre cards
const PADDING_PX = 72;      // padding lateral del strip
const LERP = 0.08;           // suavidad del scroll (menor = más lento)
const PARALLAX_FACTOR = 0.25; // intensidad del parallax (0 = sin parallax, 1 = máximo)

// ─── Componente ───────────────────────────────────────────────────────────────

export function HorizontalGallery({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentX = useRef(0);
  const targetX = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const [opacity, setOpacity] = useState(0);

  const items = category.items;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ── Fade in al montar ─────────────────────────────────────────────────────
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpacity(1));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setOpacity(0);
    setTimeout(onClose, 450);
  };

  // ── GSAP ticker: lerp + parallax ─────────────────────────────────────────
  useEffect(() => {
    const ticker = gsap.ticker.add(() => {
      currentX.current += (targetX.current - currentX.current) * LERP;

      if (stripRef.current) {
        gsap.set(stripRef.current, { x: currentX.current });
      }

      // Parallax: el fondo se mueve más lento que el card
      imageRefs.current.forEach(el => {
        if (!el) return;
        const offset = -currentX.current * PARALLAX_FACTOR;
        el.style.backgroundPositionX = `calc(50% + ${offset}px)`;
      });
    });

    return () => gsap.ticker.remove(ticker);
  }, []);

  // ── Bounds calculados post-mount ──────────────────────────────────────────
  function getMinX() {
    const cardWidthPx = (CARD_WIDTH_VW / 100) * window.innerWidth;
    const totalWidth = items.length * cardWidthPx + (items.length - 1) * GAP_PX + PADDING_PX * 2;
    return Math.min(0, -(totalWidth - window.innerWidth));
  }

  function clamp(value: number) {
    return Math.max(getMinX(), Math.min(0, value));
  }

  // ── Wheel ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetX.current = clamp(targetX.current - (e.deltaY || e.deltaX));
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [items.length]);

  // ── Touch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      touchStartX.current = e.touches[0].clientX;
      targetX.current = clamp(targetX.current + dx);
    };
    const handleTouchEnd = () => { touchStartX.current = null; };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [items.length]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#0d0d0d",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      opacity,
      transition: "opacity 0.45s ease",
    }}>
      {/* Botón cerrar */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          zIndex: 10,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          width: 44,
          height: 44,
          borderRadius: "50%",
          fontSize: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
      >
        ✕
      </button>

      {/* Título de categoría */}
      <p style={{
        position: "absolute",
        top: 30,
        left: PADDING_PX,
        color: "#ffffff",
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        margin: 0,
        zIndex: 10,
      }}>
        {category.title}
      </p>

      {/* Strip horizontal */}
      <div
        ref={stripRef}
        style={{
          display: "flex",
          gap: GAP_PX,
          paddingLeft: PADDING_PX,
          paddingRight: PADDING_PX,
          willChange: "transform",
          userSelect: "none",
        }}
      >
        {items.map((item, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: "relative",
                flexShrink: 0,
                width: `${CARD_WIDTH_VW}vw`,
                height: `${CARD_HEIGHT_VH}vh`,
                overflow: "hidden",
              }}
            >
              {/* Imagen con parallax */}
              <div
                ref={el => { imageRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  inset: "-10% 0",
                  backgroundImage: `url(${item.mainImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "50% 50%",
                }}
              />

              {/* Overlay degradado — se intensifica al hover */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.05) 55%)",
                opacity: isHovered ? 1 : 0.7,
                transition: "opacity 0.35s ease",
              }} />

              {/* Título — sube cuando aparece la descripción */}
              <p style={{
                position: "absolute",
                bottom: 20,
                left: 24,
                right: 24,
                color: "white",
                fontSize: 28,
                fontWeight: 600,
                margin: 0,
                letterSpacing: 0.3,
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                zIndex: 2,
                transform: isHovered ? "translateY(-130px)" : "translateY(0)",
                transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
                {item.title}
              </p>

              {/* Panel de descripción — entra desde abajo */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "18px 24px 22px",
                background: "rgba(0, 0, 0, 0.62)",
                backdropFilter: "blur(10px)",
                zIndex: 1,
                transform: isHovered ? "translateY(0)" : "translateY(100%)",
                opacity: isHovered ? 1 : 0,
                transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
              }}>
                <div
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  style={{
                    color: "rgba(255,255,255,0.82)",
                    fontSize: 16,
                    lineHeight: 1.65,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

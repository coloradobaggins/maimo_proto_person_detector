"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ImageGallery } from "./ImageGallery";
import { Category, GalleryItem } from "../types/content";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface DetailViewProps {
  category: Category;
  currentItem: GalleryItem;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DetailView({
  category,
  currentItem,
  currentIndex,
  total,
  onClose,
  onPrev,
  onNext,
}: DetailViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(currentIndex);

  const [galleryOpen, setGalleryOpen] = useState(false);

  // ── Animación slide entre items ───────────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    if (prevIndexRef.current === currentIndex) return;

    const direction = currentIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;

    // Reset scroll al cambiar de item
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: direction * 60 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [currentIndex]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < total - 1;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#0d0d0d",
      overflow: "hidden",
    }}>

      {/* ── Overlay flotante superior ──────────────────────────────────── */}
      {/* Contador — top left */}
      <div style={{
        position: "absolute",
        top: 24,
        left: 32,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span style={{
          fontSize: 11,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0,0,0,0.35)",
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {currentIndex + 1} / {total}
        </span>
        <span style={{
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0,0,0,0.35)",
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {category.title}
        </span>
      </div>

      {/* Botón cerrar — top right flotante */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 28,
          zIndex: 30,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(15,15,15,0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.75)",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(15,15,15,0.6)";
          e.currentTarget.style.color = "rgba(255,255,255,0.75)";
        }}
      >
        ✕
      </button>

      {/* ── Botones nav — flotantes sobre la imagen ────────────────────── */}
      <NavButton
        direction="prev"
        onClick={onPrev}
        disabled={!canPrev}
        active={canPrev}
      />
      <NavButton
        direction="next"
        onClick={onNext}
        disabled={!canNext}
        active={canNext}
      />

      {/* ── Área principal con scroll ──────────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div ref={contentRef}>

          {/* Hero — imagen a pantalla completa */}
          <div style={{
            position: "relative",
            width: "100%",
            height: "65vh",
            minHeight: 400,
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${currentItem.mainImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }} />

            {/* Gradiente oscuro abajo del hero para que el título flote */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%, rgba(13,13,13,0.85) 80%, #0d0d0d 100%)",
            }} />

            {/* Título superpuesto sobre la imagen */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "0 48px 32px",
            }}>
              <h1 style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                fontWeight: 300,
                color: "white",
                letterSpacing: 0.5,
                lineHeight: 1.2,
                margin: 0,
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              }}>
                {currentItem.title}
              </h1>
            </div>
          </div>

          {/* ── Contenido editorial ──────────────────────────────────── */}
          <div style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "40px 48px 80px",
            color: "white",
          }}>

            {/* Tags */}
            {currentItem.tags.length > 0 && (
              <div style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 36,
              }}>
                {currentItem.tags.map(tag => (
                  <span key={tag} style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Línea divisoria elegante */}
            <div style={{
              width: 48,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              marginBottom: 32,
            }} />

            {/* Descripción */}
            <div
              dangerouslySetInnerHTML={{ __html: currentItem.description }}
              style={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.9,
                fontSize: 16,
                marginBottom: 48,
                fontWeight: 300,
              }}
            />

            {/* Galería thumbnail */}
            {currentItem.thumbImage && currentItem.images && currentItem.images.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 14,
                }}>
                  Galería · {currentItem.images.length} imágenes
                </p>

                <div
                  onClick={() => setGalleryOpen(true)}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={e => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={currentItem.thumbImage}
                    alt={currentItem.title}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      maxHeight: 280,
                      transition: "transform 0.5s ease",
                    }}
                  />
                  {/* Overlay "ver galería" */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  >
                    <span style={{
                      fontSize: 11,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.5)",
                      padding: "10px 24px",
                      borderRadius: 2,
                      backdropFilter: "blur(4px)",
                    }}>
                      Ver galería
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Nav inferior — prev / next */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              marginTop: 16,
            }}>
              <button
                onClick={onPrev}
                disabled={!canPrev}
                style={{
                  background: "none",
                  border: "none",
                  color: canPrev ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)",
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: canPrev ? "pointer" : "not-allowed",
                  padding: "8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { if (canPrev) e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { if (canPrev) e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                ← Anterior
              </button>

              <span style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: 2,
              }}>
                {currentIndex + 1} · {total}
              </span>

              <button
                onClick={onNext}
                disabled={!canNext}
                style={{
                  background: "none",
                  border: "none",
                  color: canNext ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)",
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: canNext ? "pointer" : "not-allowed",
                  padding: "8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { if (canNext) e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { if (canNext) e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería lightbox */}
      {galleryOpen && currentItem.images && (
        <ImageGallery
          images={currentItem.images}
          initialIndex={0}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Botón de navegación lateral ──────────────────────────────────────────────

function NavButton({
  direction,
  onClick,
  disabled,
  active,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  active: boolean;
}) {
  const isPrev = direction === "prev";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={active ? "btn-pulse" : ""}
      style={{
        position: "absolute",
        [isPrev ? "left" : "right"]: 16,
        top: "calc(65vh / 2)",
        transform: "translateY(-50%)",
        zIndex: 20,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: active
          ? "rgba(10,10,10,0.55)"
          : "rgba(10,10,10,0.2)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
        fontSize: 18,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: active ? "0 4px 16px rgba(0,0,0,0.4)" : "none",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {isPrev ? "←" : "→"}
    </button>
  );
}

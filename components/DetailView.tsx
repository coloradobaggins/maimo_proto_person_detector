"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ImageGallery } from "./ImageGallery";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface GalleryImage {
    url: string;
    caption?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  mainImage: string;
  thumbImage?: string;
  images?: GalleryImage[];
}

export interface Category {
  id: string;
  title: string;
  coverImage: string;
  items: GalleryItem[];
}

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
  const prevIndexRef = useRef<number>(currentIndex);

  const [galleryOpen, setGalleryOpen] = useState(false);

  // ── Animación slide entre items ───────────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    if (prevIndexRef.current === currentIndex) return;

    const direction = currentIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: direction * 60 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [currentIndex]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#111",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Hero fijo */}
      <div style={{
        padding: "20px 32px",
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}>
        <div>
          <p style={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#555",
            marginBottom: 4,
          }}>
            {currentIndex + 1} / {total}
          </p>
          <h2 style={{
            fontSize: 28,
            fontWeight: 300,
            color: "white",
            letterSpacing: 1,
          }}>
            {category.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            width: 40,
            height: 40,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Contenido principal con botones laterales */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Botón anterior */}
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={currentIndex > 0 ? "btn-pulse" : ""}
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: currentIndex === 0
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: currentIndex === 0 ? "#333" : "white",
            width: 48,
            height: 48,
            borderRadius: "50%",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          ←
        </button>

        {/* Contenido animado */}
        <div
          ref={contentRef}
          style={{
            display: "flex",
            flex: 1,
            height: "100%",
            marginLeft: 80,
            marginRight: 80,
          }}
        >
          {/* Foto grande izquierda */}
          <div style={{
            width: "50%",
            backgroundImage: `url(${currentItem.mainImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }} />

          {/* Info derecha scrolleable */}
          <div style={{
            width: "50%",
            backgroundColor: "#1a1a1a",
            padding: "40px",
            overflowY: "auto",
            height: "100%",
            color: "white",
          }}>
            <h2 style={{ fontSize: 28, marginBottom: 16, fontWeight: 400 }}>
              {currentItem.title}
            </h2>

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {currentItem.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  color: "#aaa",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Descripción HTML */}
            <div
              dangerouslySetInnerHTML={{ __html: currentItem.description }}
              style={{ color: "#bbb", lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}
            />

            {/* Foto thumb → abre galería al tocar */}
                {currentItem.thumbImage && currentItem.images && currentItem.images.length > 0 && (
                <>
                    <img
                    src={currentItem.thumbImage}
                    alt={currentItem.title}
                    onClick={() => setGalleryOpen(true)}
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        objectFit: "cover",
                        maxHeight: 200,
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    />
                    <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
                    Tocá para ver la galería ({currentItem.images.length} fotos)
                    </p>
                </>
                )}

                {/* Galería */}
                {galleryOpen && currentItem.images && (
                <ImageGallery
                    images={currentItem.images}
                    initialIndex={0}
                    onClose={() => setGalleryOpen(false)}
                />
                )}
          </div>
        </div>

        {/* Botón siguiente */}
        <button
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className={currentIndex < total - 1 ? "btn-pulse" : ""}
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: currentIndex === total - 1
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: currentIndex === total - 1 ? "#333" : "white",
            width: 48,
            height: 48,
            borderRadius: "50%",
            cursor: currentIndex === total - 1 ? "not-allowed" : "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
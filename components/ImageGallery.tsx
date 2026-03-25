"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GalleryImage } from "./DetailView";

interface ImageGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageGallery({ images, initialIndex = 0, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(initialIndex);
  const dragStartX = useRef<number | null>(null);

  // ── Entrada del overlay ───────────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  // ── Slide entre imágenes ──────────────────────────────────────────────────
  useEffect(() => {
    const content = contentRef.current;
    if (!content || prevIndexRef.current === currentIndex) return;
    const direction = currentIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;
    gsap.fromTo(content,
      { opacity: 0, x: direction * 80 },
      { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [currentIndex]);

  // ── Cerrar ────────────────────────────────────────────────────────────────
  const handleClose = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  // ── Swipe handlers ────────────────────────────────────────────────────────
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(i => i + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    }
    dragStartX.current = null;
  };

  const currentImage = images[currentIndex];
  const total = images.length;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.88)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Cerrar */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          width: 40,
          height: 40,
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        ✕
      </button>

      {/* Imagen + caption con swipe */}
      <div
        ref={contentRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "70%",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        {/* Contenedor de altura fija para la imagen */}
        <div style={{
          width: "100%",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img
            src={currentImage.url}
            alt={currentImage.caption ?? ""}
            draggable={false}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 8,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Caption de altura fija */}
        <div style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {currentImage.caption && (
            <p style={{
              color: "#aaa",
              fontSize: 14,
              textAlign: "center",
              letterSpacing: 0.5,
              margin: 0,
            }}>
              {currentImage.caption}
            </p>
          )}
        </div>
      </div>

      {/* Puntitos indicadores */}
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 24,
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: i === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === currentIndex
                ? "white"
                : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
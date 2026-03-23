"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GalleryImage } from "./DetailView";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ImageGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ImageGallery({ images, initialIndex = 0, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(initialIndex);

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

  // ── Cerrar con animación ──────────────────────────────────────────────────
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

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(i => i + 1);
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

      {/* Contador */}
      <div style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#666",
        fontSize: 13,
        letterSpacing: 2,
      }}>
        {currentIndex + 1} / {total}
      </div>

      {/* Botón anterior */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={currentIndex > 0 ? "btn-pulse" : ""}
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
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
        }}
      >
        ←
      </button>

      {/* Imagen + caption */}
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "70%",
          maxHeight: "80vh",
        }}
      >
        <img
          src={currentImage.url}
          alt={currentImage.caption ?? ""}
          style={{
            maxWidth: "100%",
            maxHeight: "65vh",
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
        {currentImage.caption && (
          <p style={{
            color: "#aaa",
            fontSize: 14,
            marginTop: 16,
            textAlign: "center",
            letterSpacing: 0.5,
          }}>
            {currentImage.caption}
          </p>
        )}
      </div>

      {/* Botón siguiente */}
      <button
        onClick={handleNext}
        disabled={currentIndex === total - 1}
        className={currentIndex < total - 1 ? "btn-pulse" : ""}
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
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
        }}
      >
        →
      </button>
    </div>
  );
}
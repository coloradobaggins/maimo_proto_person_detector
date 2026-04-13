"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import QRCode from "react-qr-code";
import { Category } from "../types/content";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface DetailViewProps {
  category: Category;
  categoryIndex: number;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DetailView({ category, categoryIndex, onClose }: DetailViewProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [mapsOpen, setMapsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);
  const mapsPopupRef = useRef<HTMLDivElement>(null);
  const qrPopupRef = useRef<HTMLDivElement>(null);
  const galleryPopupRef = useRef<HTMLDivElement>(null);
  const galleryDragStartX = useRef<number | null>(null);

  const currentItem = category.items[currentItemIndex];
  const thumbnails = currentItem.images?.slice(0, 3) ?? [];
  const categoryUrl = `https://maimonides.edu/categoria/${category.id}`;
  const mapsUrl =
    category.latitude != null && category.longitude != null
      ? `https://maps.google.com/maps?q=${category.latitude},${category.longitude}&z=15&output=embed`
      : null;

  // ── Animación slide al cambiar ítem ──────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    if (prevIndexRef.current === currentItemIndex) return;
    const direction = currentItemIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentItemIndex;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: direction * 40 },
      { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [currentItemIndex]);

  // ── Fade in popups ────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapsOpen && mapsPopupRef.current) {
      gsap.fromTo(mapsPopupRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }, [mapsOpen]);

  useEffect(() => {
    if (qrOpen && qrPopupRef.current) {
      gsap.fromTo(qrPopupRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }, [qrOpen]);

  useEffect(() => {
    if (galleryOpen && galleryPopupRef.current) {
      gsap.fromTo(galleryPopupRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }, [galleryOpen]);

  // ── Fade out y cierre de popups ───────────────────────────────────────────
  const closeMaps = () => {
    if (mapsPopupRef.current) {
      gsap.to(mapsPopupRef.current, { opacity: 0, duration: 0.2, onComplete: () => setMapsOpen(false) });
    } else {
      setMapsOpen(false);
    }
  };

  const closeQr = () => {
    if (qrPopupRef.current) {
      gsap.to(qrPopupRef.current, { opacity: 0, duration: 0.2, onComplete: () => setQrOpen(false) });
    } else {
      setQrOpen(false);
    }
  };

  const closeGallery = () => {
    if (galleryPopupRef.current) {
      gsap.to(galleryPopupRef.current, { opacity: 0, duration: 0.2, onComplete: () => setGalleryOpen(false) });
    } else {
      setGalleryOpen(false);
    }
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handleGalleryDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    galleryDragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleGalleryDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (galleryDragStartX.current === null) return;
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = galleryDragStartX.current - endX;
    galleryDragStartX.current = null;

    if (Math.abs(diff) > 50) {
      e.stopPropagation();
      if (diff > 0) setGalleryIndex(i => Math.min(thumbnails.length - 1, i + 1));
      else setGalleryIndex(i => Math.max(0, i - 1));
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", userSelect: "none" }}>
      <style>{`
        .detail-desc-scroll::-webkit-scrollbar { width: 3px; }
        .detail-desc-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .detail-desc-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.28); border-radius: 2px; }
        .detail-desc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
      `}</style>

      {/* Imagen de fondo (coverImage de la categoría) */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${category.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      {/* Overlay base oscuro */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
      }} />

      {/* Línea vertical separadora — entre contenido izquierdo y menú derecho */}
      <div style={{
        position: "absolute",
        right: "42%",
        top: 0,
        bottom: 0,
        width: 1,
        background: "rgba(255,255,255,0.35)",
        zIndex: 1,
      }} />

      {/* Línea vertical derecha — debajo del gradiente */}
      <div style={{
        position: "absolute",
        right: 32,
        top: 0,
        bottom: 0,
        width: 1,
        background: "rgba(255,255,255,0.35)",
        zIndex: 1,
      }} />

      {/* Gradiente derecho — desvanece la línea derecha */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 52%)",
        zIndex: 2,
      }} />

      {/* ── HEADER: número + título categoría + título ítem ─────────────────── */}
      <div style={{
        position: "absolute",
        top: 32,
        left: 32,
        right: 32,
        borderLeft: "1px solid rgba(255,255,255,0.35)",
        borderBottom: "1px solid rgba(255,255,255,0.35)",
        paddingTop: 12,
        paddingLeft: 20,
        paddingBottom: 16,
        paddingRight: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        zIndex: 3,
      }}>
        {/* Izquierda: número + título categoría */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: 3,
          }}>
            {String(categoryIndex + 1).padStart(2, "0")}
          </span>
          <h2 style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1,
            margin: 0,
            color: "white",
            textTransform: "uppercase",
          }}>
            {category.title}
          </h2>
        </div>

        {/* Derecha: título del ítem activo */}
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
        }}>
          {currentItem.title}
        </span>
      </div>

      {/* ── BOTÓN CERRAR (top-right, sobre el header) ────────────────────────── */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 52,
          zIndex: 5,
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          fontSize: 18,
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        ✕
      </button>

      {/* ── CONTENIDO IZQUIERDO ──────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          top: 160,
          left: 52,
          right: "42%",
          bottom: 130,
          zIndex: 3,
          overflow: "hidden",
        }}
      >
        {/* Título del ítem */}
        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: 3,
          marginBottom: 20,
          marginTop: 0,
        }}>
          {currentItem.title}
        </h3>

        {/* Descripción en 2 columnas con scroll */}
        <div
          className="detail-desc-scroll"
          style={{ height: 400, overflowY: "auto", overflowX: "hidden" }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: currentItem.description }}
            style={{
              columns: 2,
              columnGap: 32,
              fontSize: 13,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.7)",
              margin: 0,
            }}
          />
        </div>

      </div>

      {/* Fade inferior full-width — cubre todo el ancho, viene de abajo */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,
        background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
        zIndex: 3,
        pointerEvents: "none",
      }} />

      {/* ── THUMBNAILS — de punta a punta, fuera del div de contenido ────────── */}
      {thumbnails.length > 0 && (
        <div style={{
          position: "absolute",
          left: 32,
          right: "42%",
          bottom: 0,
          height: 120,
          display: "flex",
          gap: 2,
          zIndex: 4,
        }}>
          {thumbnails.map((img, i) => (
            <div
              key={i}
              onClick={() => openGallery(i)}
              style={{
                flex: 1,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img
                src={img.url}
                alt={img.caption ?? ""}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.35s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── MENÚ DERECHO: navegación de ítems ───────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 160,
        right: 52,
        width: "28%",
        zIndex: 3,
      }}>
        {category.items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => setCurrentItemIndex(i)}
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: i === currentItemIndex ? "white" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              padding: "12px 0",
              borderBottom: i === currentItemIndex
                ? "1px solid rgba(255,255,255,0.6)"
                : "1px solid rgba(255,255,255,0.08)",
              transition: "color 0.2s",
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* ── BOTONES FIJOS DERECHA ────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 48,
        right: 52,
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end",
      }}>
        <button
          onClick={() => setMapsOpen(true)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.65)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Como llegar
        </button>
        <button
          onClick={() => setQrOpen(true)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.65)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Informacion Completa
        </button>
      </div>

      {/* ── POPUP: COMO LLEGAR ───────────────────────────────────────────────── */}
      {mapsOpen && (
        <div
          ref={mapsPopupRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Overlay backdrop */}
          <div
            onClick={closeMaps}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.72)",
            }}
          />
          {/* Modal */}
          <div style={{
            position: "relative",
            width: "60%",
            height: "60%",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Header del modal */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
              <span style={{
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}>
                Como llegar
              </span>
              <button
                onClick={closeMaps}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 16,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
            {/* Mapa */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {mapsUrl ? (
                <iframe
                  src={mapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 13,
                  letterSpacing: 2,
                }}>
                  Ubicación no disponible
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── POPUP: INFORMACION COMPLETA (QR) ─────────────────────────────────── */}
      {qrOpen && (
        <div
          ref={qrPopupRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Overlay backdrop */}
          <div
            onClick={closeQr}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.72)",
            }}
          />
          {/* Modal */}
          <div style={{
            position: "relative",
            padding: "24px 32px 32px",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            minWidth: 280,
          }}>
            {/* Header del modal */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}>
                Informacion Completa
              </span>
              <button
                onClick={closeQr}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 16,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
            {/* QR Code */}
            <div style={{ background: "white", padding: 16 }}>
              <QRCode value={categoryUrl} size={180} />
            </div>
            <p style={{
              fontSize: 11,
              letterSpacing: 2,
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              margin: 0,
              textTransform: "uppercase",
            }}>
              Escaneá para más información
            </p>
          </div>
        </div>
      )}

      {/* ── POPUP: GALERÍA DE IMÁGENES ───────────────────────────────────────── */}
      {galleryOpen && thumbnails.length > 0 && (
        <div
          ref={galleryPopupRef}
          onMouseDown={handleGalleryDragStart}
          onMouseUp={handleGalleryDragEnd}
          onTouchStart={handleGalleryDragStart}
          onTouchEnd={handleGalleryDragEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
          }}
        >
          {/* Overlay backdrop — no cierra al hacer click */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
          }} />

          {/* Imagen principal */}
          <div style={{
            position: "relative",
            width: "70%",
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}>
            <img
              src={thumbnails[galleryIndex].url}
              alt={thumbnails[galleryIndex].caption ?? ""}
              draggable={false}
              onDragStart={e => e.preventDefault()}
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
              }}
            />
            {thumbnails[galleryIndex].caption && (
              <p style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                margin: 0,
              }}>
                {thumbnails[galleryIndex].caption}
              </p>
            )}

            {/* Dots indicadores */}
            {thumbnails.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {thumbnails.map((_, i) => (
                  <div
                    key={i}
                    onClick={e => { e.stopPropagation(); setGalleryIndex(i); }}
                    style={{
                      width: i === galleryIndex ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: i === galleryIndex ? "white" : "rgba(255,255,255,0.35)",
                      cursor: "pointer",
                      transition: "width 0.3s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Flecha anterior */}
          {galleryIndex > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setGalleryIndex(i => i - 1); }}
              style={{
                position: "absolute",
                left: 32,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                width: 48,
                height: 48,
                borderRadius: "50%",
                fontSize: 20,
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ←
            </button>
          )}

          {/* Flecha siguiente */}
          {galleryIndex < thumbnails.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setGalleryIndex(i => i + 1); }}
              style={{
                position: "absolute",
                right: 32,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                width: 48,
                height: 48,
                borderRadius: "50%",
                fontSize: 20,
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              →
            </button>
          )}

          {/* Botón cerrar */}
          <button
            onClick={closeGallery}
            style={{
              position: "absolute",
              top: 24,
              right: 32,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.55)",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

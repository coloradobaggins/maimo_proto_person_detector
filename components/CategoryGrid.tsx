"use client";

import { useState, useRef, useEffect } from "react";
import { Category } from "@/types/content";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { useContent } from "@/context/ContentContext";

// ─── Scramble ─────────────────────────────────────────────────────────────────

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";
const SCRAMBLE_STEPS = 14;

function scrambleText(el: HTMLElement, text: string, duration = 550): () => void {
  const stepMs = duration / SCRAMBLE_STEPS;
  let step = 0;

  const id = setInterval(() => {
    step++;
    const revealed = Math.floor((step / SCRAMBLE_STEPS) * text.length);
    el.textContent = text
      .split("")
      .map((char, i) => {
        if (i < revealed || char === " ") return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");

    if (step >= SCRAMBLE_STEPS) {
      clearInterval(id);
      el.textContent = text;
    }
  }, stepMs);

  return () => {
    clearInterval(id);
    el.textContent = text;
  };
}

// ─── Card individual ──────────────────────────────────────────────────────────

function CategoryCard({
  category,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  category: Category;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isHovered) {
      // Restaurar texto original cuando se cierra el acordeón
      if (titleRef.current) titleRef.current.textContent = category.title;
      if (descRef.current && category.shortDescription) {
        descRef.current.textContent = category.shortDescription;
      }
      return;
    }

    const cleanups: Array<() => void> = [];

    if (titleRef.current) {
      cleanups.push(scrambleText(titleRef.current, category.title, 500));
    }
    if (descRef.current && category.shortDescription) {
      cleanups.push(scrambleText(descRef.current, category.shortDescription, 750));
    }

    return () => cleanups.forEach(fn => fn());
  }, [isHovered, category.title, category.shortDescription]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        flex: isHovered ? 3 : 1,
        transition: "flex 0.5s ease",
        backgroundImage: `url(${category.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay superior — legibilidad del título */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 45%)",
      }} />

      {/* Overlay superior — se intensifica al expandirse para legibilidad */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 55%)",
        opacity: isHovered ? 1 : 0.7,
        transition: "opacity 0.4s ease",
      }} />

      {/* Header: título + descripción arriba */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "252px 28px 24px",
      }}>
        <p
          ref={titleRef}
          style={{
            color: "white",
            fontSize: isHovered ? 40 : 32,
            fontWeight: 700,
            margin: 0,
            letterSpacing: 0.5,
            textShadow: "0 1px 6px rgba(0,0,0,0.7)",
            transition: "font-size 0.4s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {category.title}
        </p>

        {category.shortDescription && (
          <p
            ref={descRef}
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 18,
              lineHeight: 1.5,
              margin: "10px 0 0",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {category.shortDescription}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Grid principal ───────────────────────────────────────────────────────────

// ─── QR Icon SVG (placeholder decorativo) ────────────────────────────────────

export function QRIconSVG({ size = 170 }: { size?: number }) {
  const s = size;
  const u = s / 21; // unidad base (QR estándar ~21 módulos)

  // Módulos del centro (pattern decorativo, no scannable)
  const centerModules = [
    [7,0],[8,0],[9,0],[11,0],[12,0],
    [7,1],[10,1],[12,1],
    [8,2],[9,2],[11,2],[12,2],
    [7,3],[8,3],[10,3],
    [9,4],[11,4],[12,4],
    [7,5],[9,5],[10,5],
    [8,6],[9,6],[11,6],[12,6],
    [7,7],[12,7],
    [9,8],[10,8],[11,8],
    [7,9],[8,9],[10,9],[12,9],
    [8,10],[9,10],[11,10],[12,10],
    [7,11],[10,11],
    [9,12],[10,12],[11,12],
    [7,13],[8,13],[12,13],
    [7,14],[9,14],[11,14],[12,14],
  ];

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="white">
      {/* Esquina superior izquierda */}
      <rect x={0} y={0} width={u*7} height={u*7} rx={u*0.8} fill="white" />
      <rect x={u*1} y={u*1} width={u*5} height={u*5} rx={u*0.4} fill="black" />
      <rect x={u*2} y={u*2} width={u*3} height={u*3} rx={u*0.3} fill="white" />

      {/* Esquina superior derecha */}
      <rect x={u*14} y={0} width={u*7} height={u*7} rx={u*0.8} fill="white" />
      <rect x={u*15} y={u*1} width={u*5} height={u*5} rx={u*0.4} fill="black" />
      <rect x={u*16} y={u*2} width={u*3} height={u*3} rx={u*0.3} fill="white" />

      {/* Esquina inferior izquierda */}
      <rect x={0} y={u*14} width={u*7} height={u*7} rx={u*0.8} fill="white" />
      <rect x={u*1} y={u*15} width={u*5} height={u*5} rx={u*0.4} fill="black" />
      <rect x={u*2} y={u*16} width={u*3} height={u*3} rx={u*0.3} fill="white" />

      {/* Módulos centrales decorativos */}
      {centerModules.map(([col, row], i) => (
        <rect
          key={i}
          x={col * u + u * 0.1}
          y={row * u + u * 0.1}
          width={u * 0.85}
          height={u * 0.85}
          rx={u * 0.15}
          fill="white"
        />
      ))}
    </svg>
  );
}

// ─── Grid principal ───────────────────────────────────────────────────────────

export function CategoryGrid({ onCategorySelect }: { onCategorySelect?: (id: string) => void }) {
  const { content, isLoading } = useContent();
  const categories = content.categories;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  if (isLoading) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{ color: "#555", letterSpacing: 2 }}>Cargando...</p>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <HorizontalGallery
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    );
  }

  const handleClick = (category: Category) => {
    setSelectedCategory(category);
    onCategorySelect?.(category.id);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
    }}>
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          isHovered={hoveredId === category.id}
          onHover={() => setHoveredId(category.id)}
          onLeave={() => setHoveredId(null)}
          onClick={() => handleClick(category)}
        />
      ))}

      {/* Sombra inferior para legibilidad del banner de vista reducida */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "220px",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 500,
      }} />
    </div>
  );
}

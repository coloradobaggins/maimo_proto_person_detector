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
      {/* Overlay base */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 60%)",
        transition: "background 0.4s ease",
      }} />

      {/* Overlay extra al expandirse */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.4s ease",
      }} />

      {/* Footer: título siempre visible + shortDescription aparece al expandirse */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "24px 28px",
      }}>
        {/* shortDescription — fade in sin movimiento */}
        {category.shortDescription && (
          <p
            ref={descRef}
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 14,
              lineHeight: 1.5,
              margin: "0 0 10px",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {category.shortDescription}
          </p>
        )}

        {/* Título — siempre visible */}
        <p
          ref={titleRef}
          style={{
            color: "white",
            fontSize: isHovered ? 26 : 20,
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
      </div>
    </div>
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
    </div>
  );
}

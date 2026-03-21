"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface GalleryItem {
    id: number;
    title: string;
    description: string;
    tags: string[];
    mainImage: string;
    thumbImage?: string;
}

interface Category {
    id: string;
    title: string;
    coverImage: string;
    items: GalleryItem[];
}

interface CategorySliderProps {
    onCategorySelect?: (categoryId: string) => void;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CATEGORIES: Category[] = [
    {
        id: "obelisco",
        title: "El Obelisco",
        coverImage: "https://picsum.photos/seed/animals/800/600",
        items: [
            {
                id: 1,
                title: "El León",
                description: "El león es uno de los animales más **imponentes** de la naturaleza.\n\n## Características\n\nConocido como el rey de la selva, vive en manadas llamadas *pride*.\n\n- Rugido de hasta 8km\n- Único felino social\n- Vive en África",
                tags: ["Felino", "África", "Carnívoro", "Mamífero"],
                mainImage: "https://picsum.photos/seed/lion/800/600",
                thumbImage: "https://picsum.photos/seed/lion2/200/150",
            },
            {
                id: 2,
                title: "El Elefante",
                description: "El elefante africano es el animal terrestre más grande del mundo. Posee una memoria extraordinaria y una inteligencia comparable a la de los primates. Vive en grupos familiares liderados por la hembra más anciana.",
                tags: ["Mamífero", "África", "Herbívoro", "Endangered"],
                mainImage: "https://picsum.photos/seed/elephant/800/600",
                thumbImage: "https://picsum.photos/seed/elephant2/200/150",
            },
            {
                id: 3,
                title: "El Delfín",
                description: "Los delfines son mamíferos marinos altamente inteligentes. Se comunican mediante un sofisticado sistema de clics y silbidos. Son conocidos por su comportamiento social y su capacidad de aprendizaje.",
                tags: ["Marino", "Mamífero", "Inteligente"],
                mainImage: "https://picsum.photos/seed/dolphin/800/600",
                thumbImage: "https://picsum.photos/seed/dolphin2/200/150",
            },
        ],
    },
    {
        id: "paseodelbajo",
        title: "Paseo del Bajo",
        coverImage: "https://picsum.photos/seed/space/800/600",
        items: [
            {
                id: 1,
                title: "La Luna",
                description: "La Luna es el único satélite natural de la Tierra y el quinto satélite más grande del sistema solar. Su influencia gravitacional produce las mareas oceánicas. Fue visitada por primera vez por el ser humano en 1969.",
                tags: ["Satélite", "NASA", "Exploración"],
                mainImage: "https://picsum.photos/seed/moon/800/600",
                thumbImage: "https://picsum.photos/seed/moon2/200/150",
            },
            {
                id: 2,
                title: "Saturno",
                description: "Saturno es el sexto planeta del sistema solar y el segundo más grande. Sus espectaculares anillos están formados por partículas de hielo y roca. Tiene 83 lunas confirmadas, siendo Titán la más grande.",
                tags: ["Planeta", "Anillos", "Gas gigante"],
                mainImage: "https://picsum.photos/seed/saturn/800/600",
                thumbImage: "https://picsum.photos/seed/saturn2/200/150",
            },
        ],
    },
    {
        id: "Subtes",
        title: "La Ciudad",
        coverImage: "https://picsum.photos/seed/city/800/600",
        items: [
            {
                id: 1,
                title: "Los Rascacielos",
                description: "Los rascacielos son el símbolo de la modernidad urbana. El primero fue construido en Chicago en 1885. Hoy en día, el Burj Khalifa en Dubái es el más alto del mundo con 828 metros de altura.",
                tags: ["Arquitectura", "Urbano", "Moderno"],
                mainImage: "https://picsum.photos/seed/skyscraper/800/600",
                thumbImage: "https://picsum.photos/seed/skyscraper2/200/150",
            },
            {
                id: 2,
                title: "Los Puentes",
                description: "Los puentes son obras de ingeniería que conectan comunidades. El puente Golden Gate en San Francisco es uno de los más fotografiados del mundo. Fue construido entre 1933 y 1937 y mide 2.7 kilómetros.",
                tags: ["Ingeniería", "Conectividad", "Icónico"],
                mainImage: "https://picsum.photos/seed/bridge/800/600",
                thumbImage: "https://picsum.photos/seed/bridge2/200/150",
            },
        ],
    },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export function CategorySlider({ onCategorySelect }: { onCategorySelect?: (id: string) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const slideRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef<number | null>(null);

    // ── Animación de entrada del texto ────────────────────────────────────────
    useEffect(() => {
        if (!textRef.current || selectedCategory) return;
        gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
    }, [currentIndex, selectedCategory]);

    // ── Navegar entre categorías con animación ────────────────────────────────
    const navigateTo = useCallback((nextIndex: number) => {
        if (!slideRef.current) return;
        const direction = nextIndex > currentIndex ? -1 : 1;

        gsap.to(slideRef.current, {
            opacity: 0,
            x: direction * 80,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setCurrentIndex(nextIndex);
                gsap.fromTo(
                    slideRef.current,
                    { opacity: 0, x: -direction * 80 },
                    { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
                );
            },
        });
    }, [currentIndex]);

    const handlePrev = () => {
        if (currentIndex > 0) navigateTo(currentIndex - 1);
    };

    const handleNext = () => {
        if (currentIndex < MOCK_CATEGORIES.length - 1) navigateTo(currentIndex + 1);
    };

    // ── Drag / Swipe ──────────────────────────────────────────────────────────
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    };

    const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (dragStartX.current === null) return;
        const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
        const diff = dragStartX.current - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) handleNext();
            else handlePrev();
        }
        dragStartX.current = null;
    };

    const handleCategoryClick = (category: Category) => {
        if (!slideRef.current) return;
        gsap.to(slideRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setSelectedCategory(category);
                setCurrentItemIndex(0);
                onCategorySelect?.(category.id);
                gsap.set(slideRef.current, { scale: 1 });
            },
        });
    };

    const category = MOCK_CATEGORIES[currentIndex];

    // ── Vista detalle ─────────────────────────────────────────────────────────
    if (selectedCategory) {
        const currentItem = selectedCategory.items[currentItemIndex];
        const total = selectedCategory.items.length;

        return (
            <div style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "#111",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
                }}>
                    <span style={{ color: "#aaa", fontSize: 14 }}>
                        {selectedCategory.title} — {currentItemIndex + 1} / {total}
                    </span>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{
                            background: "rgba(255,255,255,0.15)",
                            border: "none",
                            color: "white",
                            width: 36,
                            height: 36,
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

                {/* Contenido */}
                <div style={{ display: "flex", flex: 1 }}>
                    <div style={{
                        width: "50%",
                        backgroundImage: `url(${currentItem.mainImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }} />

                    <div style={{
                        width: "50%",
                        backgroundColor: "#1a1a1a",
                        padding: "80px 40px 80px",
                        overflowY: "auto",
                        height: "100vh",
                        color: "white",
                    }}>
                        <h2 style={{ fontSize: 32, marginBottom: 16 }}>{currentItem.title}</h2>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                            {currentItem.tags.map(tag => (
                                <span key={tag} style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    padding: "4px 12px",
                                    borderRadius: 20,
                                    fontSize: 12,
                                    color: "#ccc",
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {/*<p style={{ color: "#bbb", lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}>*/}
                            {/*currentItem.description*/}
                        {/*</p>*/}
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                <p style={{ color: "#bbb", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
                                    {children}
                                </p>
                                ),
                                h1: ({ children }) => (
                                <h1 style={{ color: "white", fontSize: 28, marginBottom: 12, marginTop: 24 }}>
                                    {children}
                                </h1>
                                ),
                                h2: ({ children }) => (
                                <h2 style={{ color: "white", fontSize: 22, marginBottom: 10, marginTop: 20 }}>
                                    {children}
                                </h2>
                                ),
                                strong: ({ children }) => (
                                <strong style={{ color: "white", fontWeight: 700 }}>{children}</strong>
                                ),
                                ul: ({ children }) => (
                                <ul style={{ color: "#bbb", paddingLeft: 20, marginBottom: 16 }}>{children}</ul>
                                ),
                                li: ({ children }) => (
                                <li style={{ marginBottom: 6 }}>{children}</li>
                                ),
                            }}
                            >
                            {currentItem.description}
                        </ReactMarkdown>
                        {currentItem.thumbImage && (
                            <img
                                src={currentItem.thumbImage}
                                alt={currentItem.title}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    objectFit: "cover",
                                    maxHeight: 200,
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Navegación */}
                <div style={{
                    position: "absolute",
                    bottom: 24,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 24px",
                }}>
                    <button
                        onClick={() => setCurrentItemIndex(i => Math.max(0, i - 1))}
                        disabled={currentItemIndex === 0}
                        style={{
                            background: currentItemIndex === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
                            border: "none",
                            color: currentItemIndex === 0 ? "#444" : "white",
                            padding: "12px 24px",
                            borderRadius: 8,
                            cursor: currentItemIndex === 0 ? "not-allowed" : "pointer",
                            fontSize: 16,
                        }}
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={() => setCurrentItemIndex(i => Math.min(total - 1, i + 1))}
                        disabled={currentItemIndex === total - 1}
                        style={{
                            background: currentItemIndex === total - 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
                            border: "none",
                            color: currentItemIndex === total - 1 ? "#444" : "white",
                            padding: "12px 24px",
                            borderRadius: 8,
                            cursor: currentItemIndex === total - 1 ? "not-allowed" : "pointer",
                            fontSize: 16,
                        }}
                    >
                        Siguiente →
                    </button>
                </div>
            </div>
        );
    }

    // ── Vista carousel fullscreen ─────────────────────────────────────────────
    return (
        <div
            ref={slideRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            style={{
                position: "fixed",
                inset: 0,
                backgroundImage: `url(${category.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "grab",
                userSelect: "none",
            }}
        >
            {/* Overlay */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
            }} />

            {/* Texto sobre imagen */}
            <div
                ref={textRef}
                onClick={() => handleCategoryClick(category)}
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 60,
                    color: "white",
                    cursor: "pointer",
                }}
            >
                <p style={{ fontSize: 13, letterSpacing: 3, color: "#aaa", textTransform: "uppercase", marginBottom: 8 }}>
                    {currentIndex + 1} / {MOCK_CATEGORIES.length}
                </p>
                <h2 style={{ fontSize: 56, fontWeight: 700, marginBottom: 12, lineHeight: 1 }}>
                    {category.title}
                </h2>
                <p style={{ fontSize: 14, color: "#bbb" }}>
                    {category.items.length} {category.items.length === 1 ? "artículo" : "artículos"} — Tocá para explorar
                </p>
            </div>

            {/* Flecha izquierda */}
            <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                    position: "absolute",
                    left: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: currentIndex === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
                    border: "none",
                    color: currentIndex === 0 ? "#444" : "white",
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

            {/* Flecha derecha */}
            <button
                onClick={handleNext}
                disabled={currentIndex === MOCK_CATEGORIES.length - 1}
                style={{
                    position: "absolute",
                    right: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: currentIndex === MOCK_CATEGORIES.length - 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
                    border: "none",
                    color: currentIndex === MOCK_CATEGORIES.length - 1 ? "#444" : "white",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    cursor: currentIndex === MOCK_CATEGORIES.length - 1 ? "not-allowed" : "pointer",
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(4px)",
                }}
            >
                →
            </button>

            {/* Indicadores de posición */}
            <div style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
            }}>
                {MOCK_CATEGORIES.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => navigateTo(i)}
                        style={{
                            width: i === currentIndex ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: i === currentIndex ? "white" : "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                            transition: "width 0.3s ease",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
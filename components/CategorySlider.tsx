"use client";

import { useState } from "react";

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
                description: "El león es uno de los animales más imponentes de la naturaleza. Conocido como el rey de la selva, vive en manadas llamadas 'pride' y es el único felino verdaderamente social. Su rugido puede escucharse hasta 8 kilómetros de distancia.",
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

export function CategorySlider({ onCategorySelect }: CategorySliderProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    // ── Vista detalle de categoría ─────────────────────────────────────────────
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
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}>
                    <span style={{ color: "#999", fontSize: 14 }}>
                        {selectedCategory.title} — {currentItemIndex + 1} / {total}
                    </span>
                    <button
                        onClick={() => {
                            setSelectedCategory(null);
                            setCurrentItemIndex(0);
                        }}
                        style={{
                            background: "rgba(255,255,255,0.1)",
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

                {/* Contenido principal */}
                <div style={{ display: "flex", flex: 1 }}>

                    {/* Izquierda: foto grande 50% */}
                    <div style={{
                        width: "50%",
                        backgroundImage: `url(${currentItem.mainImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }} />

                    {/* Derecha: info scrolleable */}
                    <div style={{
                        width: "50%",
                        backgroundColor: "#1a1a1a",
                        padding: "80px 40px 40px",
                        overflowY: "auto",
                        color: "white",
                    }}>
                        <h2 style={{ fontSize: 32, marginBottom: 16 }}>{currentItem.title}</h2>

                        {/* Tags */}
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

                        {/* Descripción */}
                        <p style={{
                            color: "#bbb",
                            lineHeight: 1.8,
                            fontSize: 15,
                            marginBottom: 24,
                        }}>
                            {currentItem.description}
                        </p>

                        {/* Foto chica adicional */}
                        {currentItem.thumbImage && (
                            <img
                                src={currentItem.thumbImage}
                                alt={currentItem.title}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    marginBottom: 24,
                                    objectFit: "cover",
                                    maxHeight: 200,
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Navegación anterior/siguiente */}
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
                            background: currentItemIndex === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                            border: "none",
                            color: currentItemIndex === 0 ? "#555" : "white",
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
                            background: currentItemIndex === total - 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                            border: "none",
                            color: currentItemIndex === total - 1 ? "#555" : "white",
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

    // ── Vista slider de categorías ─────────────────────────────────────────────
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#111",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            overflowY: "auto",
        }}>
            <h1 style={{
                color: "white",
                fontSize: 32,
                marginBottom: 48,
                letterSpacing: 2,
                textTransform: "uppercase",
            }}>
                Explorá
            </h1>

            {/* Categorías en scroll vertical */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
                maxWidth: 800,
                padding: "0 24px",
            }}>
                {MOCK_CATEGORIES.map(category => (
                    <div
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(category);
                            setCurrentItemIndex(0);
                            onCategorySelect?.(category.id);
                        }}
                        style={{
                            position: "relative",
                            height: 200,
                            cursor: "pointer",
                            overflow: "hidden",
                            borderRadius: 4,
                        }}
                    >
                        {/* Imagen de fondo */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${category.coverImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transition: "transform 0.4s ease",
                        }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                            }}
                        />

                        {/* Overlay */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)",
                        }} />

                        {/* Título */}
                        <div style={{
                            position: "absolute",
                            bottom: 24,
                            left: 32,
                            color: "white",
                        }}>
                            <h2 style={{ fontSize: 28, marginBottom: 4 }}>{category.title}</h2>
                            <p style={{ fontSize: 13, color: "#aaa" }}>
                                {category.items.length} {category.items.length === 1 ? "artículo" : "artículos"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
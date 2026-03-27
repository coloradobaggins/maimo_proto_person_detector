"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { DetailView } from "@/components/DetailView";
import { Category } from "@/types/content";
import { useContent } from "@/context/ContentContext"


// ─── Mock data ────────────────────────────────────────────────────────────────
/*
const MOCK_CATEGORIES: Category[] = [
    {
        id: "obelisco",
        title: "El Obelisco",
        coverImage: "/adult/obelisco/1-29.jpg",
        items: [
            {
                id: 1,
                title: "Construccion",
                description: "El <b>Obelisco de Buenos Aires</b> es un monumento histórico, considerado ícono de Buenos Aires, capital de Argentina.<br /><br /> Fue construido en 1936 con motivo del cuarto centenario de la primera fundación de Buenos Aires por Pedro de Mendoza. La obra es autoría del arquitecto argentino Alberto Prebisch y la construcción estuvo a cargo del consorcio alemán GEOPÉ-Siemens Bauunion-Grün & Bilfinger. Tiene una altura de 67,5 metros, de los cuales 63 son desde la base de 7x7 m hasta el inicio del ápice de 3,50x3,50 m, culminando con una punta del estilo Roma de unos 40 cm. Tiene una sola puerta de entrada y en su cúspide hay cuatro ventanas.<br /><br /> Se encuentra ubicado en la plaza de la República, en la intersección de las avenidas Corrientes y 9 de Julio, en el barrio de San Nicolás en Buenos Aires.",
                tags: ["Felino", "África", "Carnívoro", "Mamífero"],
                mainImage: "/adult/obelisco/006.jpg",
                thumbImage: "adult/obelisco/1.webp",
                images: [
                    { url: "/adult/obelisco/gallery/g1.jpg", caption: "El Obelisco" },
                    { url: "/adult/obelisco/gallery/g2.jpg", caption: "La manada al atardecer" },
                    { url: "/adult/obelisco/gallery/g3.webp", caption: "El rugido del rey" },
                ],
            },
            {
                id: 2,
                title: "Actualidad",
                description: "El elefante africano es el animal terrestre más grande del mundo. Posee una memoria extraordinaria y una inteligencia comparable a la de los primates. Vive en grupos familiares liderados por la hembra más anciana.",
                tags: ["Mamífero", "África", "Herbívoro", "Endangered"],
                mainImage: "https://picsum.photos/seed/elephant/800/600",
                thumbImage: "https://picsum.photos/seed/elephant2/200/150",
                images: [
                    { url: "/adult/obelisco/gallery/g4.png", caption: "El león descansando" },
                    { url: "/adult/obelisco/gallery/g5.jpg", caption: "La manada al atardecer" },
                    { url: "/adult/obelisco/gallery/g6.webp", caption: "El rugido del rey" },
                ],
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
        id: "palaciobarolo",
        title: "Palacio Barolo",
        coverImage: "/adult/barolo/palacio-barolo-ve-mayo-street-buenos-aires-argentina.jpg",
        items: [
            {
                id: 1,
                title: "El Palacio",
                description: "El Palacio Barolo fue construido por el arquitecto italiano Mario Palanti, a pedido del empresario Luigi Barolo. Fue inaugurado en 1923 y se convirtió en el edificio más alto de Sudamérica (incluso superó hasta cuatro veces las reglamentaciones de altura llegando su coronamiento a los cien metros sobre Av. de Mayo), hasta ocho años después cuando se construyó el Kavanagh. <br /><br />El Barolo tiene otras características que lo hicieron y hacen especial.. Por ejemplo, fue la primera edificación de hormigón armado de casi 100 mts. de altura en la Ciudad. Además, está rematado por un faro giratorio de 300.000 bujías en el piso 22. En 1923, ese faro transmitió con sus luces el resultado de la pelea por el título mundial de boxeo entre Luis Angel Firpo y Jack Dempsey en Nueva York. <br /><br />Palanti también fue el creador del Palacio Salvo en Montevideo (Uruguay), con similares características de construcción que el Barolo. Estos dos edificios rioplatenses fueron verdaderos pioneros ya que probaron el uso vertical del hormigón consiguiendo que cada récord local conformara, simultáneamente, un récord internacional.",
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
        title: "Subtes de Buenos Aires",
        coverImage: "/adult/subtes/estacion-plaza-mayo-inauguracion-1913jpg.webp",
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
];*/

// ─── Componente ───────────────────────────────────────────────────────────────

export function CategorySlider({ onCategorySelect }: { onCategorySelect?: (id: string) => void }) {
    const { content, isLoading } = useContent();
    const CATEGORIES_AND_DATA = content.categories;

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
        if (currentIndex < CATEGORIES_AND_DATA.length - 1) navigateTo(currentIndex + 1);
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

    // ── Mientras carga ────────────────────────────────────────
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

    const category = CATEGORIES_AND_DATA[currentIndex];

    // ── Vista detalle ─────────────────────────────────────────────────────────
    if (selectedCategory) {
        const currentItem = selectedCategory.items[currentItemIndex];
        const total = selectedCategory.items.length;
        
        return (
            <DetailView
            category={selectedCategory}
            currentItem={currentItem}
            currentIndex={currentItemIndex}
            total={total}
            onClose={() => {
                setSelectedCategory(null);
                setCurrentItemIndex(0);
            }}
            onPrev={() => setCurrentItemIndex(i => Math.max(0, i - 1))}
            onNext={() => setCurrentItemIndex(i => Math.min(total - 1, i + 1))}
            />
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
                    {currentIndex + 1} / {CATEGORIES_AND_DATA.length}
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
                disabled={currentIndex === CATEGORIES_AND_DATA.length - 1}
                style={{
                    position: "absolute",
                    right: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: currentIndex === CATEGORIES_AND_DATA.length - 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
                    border: "none",
                    color: currentIndex === CATEGORIES_AND_DATA.length - 1 ? "#444" : "white",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    cursor: currentIndex === CATEGORIES_AND_DATA.length - 1 ? "not-allowed" : "pointer",
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
                {CATEGORIES_AND_DATA.map((_, i) => (
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
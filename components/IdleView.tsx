"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RobotSVG } from "./RobotSVG";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface IdleViewProps {
    mode: "mac" | "notebook";
}

type Edge = "bottom" | "top" | "left" | "right";

// ─── Constantes ───────────────────────────────────────────────────────────────

const MESSAGES = ["¡Hey!", "¡Psst!", "¡Hola!", "¿Jugamos?"];

// ─── Componente principal ─────────────────────────────────────────────────────

export function IdleView({ mode }: IdleViewProps) {
    return mode === "mac" ? <AdultIdle /> : <ChildIdle />;
}

// ─── Idle Adulto ──────────────────────────────────────────────────────────────

function AdultIdle() {
    const textRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [particles, setParticles] = useState<{ left: string; top: string }[]>([]);

    useEffect(() => {
        setParticles(
            Array.from({ length: 20 }, () => ({
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
            }))
        );
    }, []);

    useEffect(() => {
        const text = textRef.current;
        const glow = glowRef.current;
        const particles = particlesRef.current;

        if (!text || !glow) return;

        // Pulso del texto
        gsap.to(text, {
            opacity: 0.3,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Resplandor de fondo
        gsap.to(glow, {
            opacity: 0.15,
            scale: 1.2,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Partículas flotando
        particles.forEach(particle => {
            if (!particle) return;
            gsap.to(particle, {
                y: -30 - Math.random() * 40,
                x: (Math.random() - 0.5) * 30,
                opacity: 0,
                duration: 3 + Math.random() * 3,
                delay: Math.random() * 3,
                repeat: -1,
                ease: "power1.out",
                onRepeat: () => {
                    gsap.set(particle, {
                        x: Math.random() * window.innerWidth,
                        y: window.innerHeight,
                        opacity: 0.6,
                    });
                },
            });
        });

        return () => {
            gsap.killTweensOf([text, glow, ...particlesRef.current]);
        };
    }, [particles]);

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        }}>
            {/* Resplandor central */}
            <div
                ref={glowRef}
                style={{
                    position: "absolute",
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
                    opacity: 0.05,
                }}
            />

            {/* Texto */}
            <div
                ref={textRef}
                style={{
                    color: "white",
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                <p style={{
                    fontSize: 13,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    color: "#555",
                    marginBottom: 16,
                }}>
                    Bienvenido
                </p>
                <h1 style={{
                    fontSize: 42,
                    fontWeight: 300,
                    letterSpacing: 2,
                    color: "white",
                    marginBottom: 16,
                }}>
                    Acercate para explorar
                </h1>
                <div style={{
                    width: 40,
                    height: 1,
                    backgroundColor: "#333",
                    margin: "0 auto",
                }} />
            </div>

            {/* Partículas */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    ref={el => { particlesRef.current[i] = el; }}
                    style={{
                        position: "absolute",
                        width: "2px",
                        height: "2px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        left: p.left,
                        top: p.top,
                        opacity: 0,
                    }}
                />
            ))}
        </div>
    );
}

// ─── Idle Niño ────────────────────────────────────────────────────────────────

function ChildIdle() {
    const robotRef = useRef<HTMLDivElement>(null);
    const vinetaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const robot = robotRef.current;
        const vineta = vinetaRef.current;

        if (!robot || !vineta) return;

        const getPositionForEdge = (edge: Edge) => {
            const margin = -130; // Para que el robot esté completamente fuera de la pantalla al irse
            switch (edge) {
                case "bottom":
                    return {
                        x: Math.random() * (window.innerWidth - 120),
                        y: window.innerHeight - margin,
                        peekY: window.innerHeight - 120,
                        peekX: null,
                    };
                case "top":
                    return {
                        x: Math.random() * (window.innerWidth - 120),
                        y: margin,
                        peekY: 10,
                        peekX: null,
                    };
                case "left":
                    return {
                        x: margin,
                        y: Math.random() * (window.innerHeight - 140),
                        peekY: null,
                        peekX: 10,
                    };
                case "right":
                    return {
                        x: window.innerWidth - margin,
                        y: Math.random() * (window.innerHeight - 140),
                        peekY: null,
                        peekX: window.innerWidth - 120,
                    };
            }
        };

        const edges: Edge[] = ["bottom", "top", "left", "right"];
        let timeoutId: ReturnType<typeof setTimeout>;

        const peek = () => {
            const edge = edges[Math.floor(Math.random() * edges.length)];
            const pos = getPositionForEdge(edge);
            const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];


            gsap.set(robot, { x: pos.x, y: pos.y, opacity: 1 });
            gsap.set(vineta, { opacity: 0, scale: 0.5 });
            vineta.textContent = message;

            // Ajustar posición de viñeta según el borde
            if (vineta) {
                if (edge === "top") {
                    vineta.style.bottom = "auto";
                    vineta.style.top = "110%";
                } else {
                    vineta.style.top = "auto";
                    vineta.style.bottom = "110%";
                }
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    timeoutId = setTimeout(peek, 2000 + Math.random() * 3000);
                },
            });

            tl
                .to(robot, {
                    x: pos.peekX ?? pos.x,
                    y: pos.peekY ?? pos.y,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)", // rebote
                })
                .to(vineta, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(3)",
                })
                .to({}, { duration: 1.5 })
                .to(vineta, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.2,
                })
                .to(robot, {
                    x: pos.x,
                    y: pos.y,
                    duration: 0.4,
                    ease: "power3.in", // salida rapida
                });
        };

        timeoutId = setTimeout(peek, 1000);

        return () => {
            clearTimeout(timeoutId);
            gsap.killTweensOf([robot, vineta]);
        };
    }, []);

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#000",
            overflow: "hidden",
        }}>
            {/* Robot que se asoma */}
            <div
                ref={robotRef}
                style={{
                    position: "absolute",
                    opacity: 0,
                    zIndex: 10,
                }}
            >
                {/* Viñeta encima del robot, centrada */}
                <div
                    ref={vinetaRef}
                    style={{
                        position: "absolute",
                        bottom: "110%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "white",
                        borderRadius: 12,
                        padding: "8px 14px",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1565c0",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                    }}
                />
                <RobotSVG size={80} />
            </div>
        </div>
    );
}
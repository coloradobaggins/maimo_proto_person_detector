"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RobotSVG } from "./RobotSVG";

const GRID_SIZE = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const PIECE_SIZE = 80;

interface PuzzleIntroProps {
  imageUrl: string;
  onIntroComplete: (shuffledOrder: number[]) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function PuzzleIntro({ imageUrl, onIntroComplete }: PuzzleIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const vineta = useRef<HTMLDivElement>(null);
  const piecesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [phase, setPhase] = useState<"intro" | "exploding">("intro");

  const IMAGE_SIZE = GRID_SIZE * PIECE_SIZE; // 320px

  // ── Entrada: fade in imagen + robot ───────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !robotRef.current) return;

    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(robotRef.current,
      { opacity: 0, y: 30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.5, ease: "back.out(1.7)" }
    );

    gsap.fromTo(vineta.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.4, delay: 0.9, ease: "back.out(2)" }
    );
  }, []);

  // ── Click en robot/viñeta: explosión de piezas ────────────────────────────
  const handleStart = () => {
    if (phase === "exploding") return;
    setPhase("exploding");

    // Ocultar robot y viñeta
    gsap.to([robotRef.current, vineta.current], {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      ease: "power2.in",
    });

    // Calcular orden mezclado
    const shuffledOrder = shuffleArray(
      Array.from({ length: TOTAL_PIECES }, (_, i) => i)
    );

    // Posiciones destino en la grilla izquierda
    const gridLeft = 40; // margen izquierdo
    const gridTop = (window.innerHeight - IMAGE_SIZE) / 2;

    // Animar cada pieza desde su posición en la imagen hacia la grilla
    piecesRef.current.forEach((piece, i) => {
      if (!piece) return;

      const destIndex = shuffledOrder.indexOf(i);
      const destCol = destIndex % GRID_SIZE;
      const destRow = Math.floor(destIndex / GRID_SIZE);

      const destX = gridLeft + destCol * PIECE_SIZE;
      const destY = gridTop + destRow * PIECE_SIZE;

      const pieceRect = piece.getBoundingClientRect();

      gsap.to(piece, {
        x: destX - pieceRect.left,
        y: destY - pieceRect.top,
        duration: 0.8 + Math.random() * 0.4,
        delay: i * 0.04,
        ease: "power3.inOut",
        onComplete: i === TOTAL_PIECES - 1
          ? () => onIntroComplete(shuffledOrder)
          : undefined,
      });
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Imagen dividida en piezas */}
      <div
        ref={imageRef}
        style={{
          position: "relative",
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
        }}
      >
        {Array.from({ length: TOTAL_PIECES }, (_, i) => {
          const col = i % GRID_SIZE;
          const row = Math.floor(i / GRID_SIZE);
          return (
            <div
              key={i}
              ref={el => { piecesRef.current[i] = el; }}
              style={{
                position: "absolute",
                left: col * PIECE_SIZE,
                top: row * PIECE_SIZE,
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${IMAGE_SIZE}px ${IMAGE_SIZE}px`,
                backgroundPosition: `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          );
        })}
      </div>

      {/* Robot + viñeta encima de la imagen */}
      <div
        ref={robotRef}
        onClick={handleStart}
        style={{
          position: "absolute",
          bottom: "calc(50% - 80px)",
          right: "calc(50% - 220px)",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <RobotSVG size={120} />
      </div>

      {/* Viñeta */}
      <div
        ref={vineta}
        onClick={handleStart}
        style={{
          position: "absolute",
          bottom: "calc(50% + 60px)",
          right: "calc(50% - 320px)",
          backgroundColor: "white",
          borderRadius: 16,
          padding: "12px 20px",
          cursor: "pointer",
          zIndex: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <p style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: "#1565c0",
        }}>
          ¡Empezá! 🧩
        </p>
        {/* Puntito de la viñeta */}
        <div style={{
          position: "absolute",
          bottom: -8,
          left: 20,
          width: 16,
          height: 16,
          backgroundColor: "white",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: -18,
          left: 28,
          width: 10,
          height: 10,
          backgroundColor: "white",
          borderRadius: "50%",
        }} />
      </div>
    </div>
  );
}
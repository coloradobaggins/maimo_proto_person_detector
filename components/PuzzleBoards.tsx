"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PuzzleIntro } from "./PuzzleIntro";
import { usePuzzleSounds } from "@/hooks/usePuzzleSounds";
import { usePuzzleAmbient } from "@/hooks/usePuzzleAmbient";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Piece {
  id: number;        // posición correcta (0-15)
  placed: boolean;   // si ya fue colocada correctamente
}

interface PuzzleBoardProps {
  audioUrl: string | null;
  imageUrl: string;
  title: string;
  description: string;
  onCompleted: () => void;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const GRID_SIZE = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const PIECE_SIZE_SMALL = 70;   // tamaño piezas izquierda (px)
const PIECE_SIZE_LARGE = 100;  // tamaño piezas derecha (px)

// ─── Fisher-Yates shuffle ─────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PuzzleBoard({
  audioUrl,
  imageUrl,
  title,
  description,
  onCompleted,
}: PuzzleBoardProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  /*const [pieces, setPieces] = useState<Piece[]>(() => {
    const initial = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
      id: i,
      placed: false,
    }));
    return shuffleArray(initial);
  });
  */
  const [board, setBoard] = useState<(number | null)[]>(
    Array(TOTAL_PIECES).fill(null)
  );
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gamePhase, setGamePhase] = useState<"intro" | "playing">("intro");
  const boardRef = useRef<HTMLDivElement>(null);
  const boardPiecesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [showCompleteImage, setShowCompleteImage] = useState(false);
  const { playGrab, playCorrect, playWrong, playComplete, playFanfare } = usePuzzleSounds();
  const { stop: stopAmbient } = usePuzzleAmbient(audioUrl, gamePhase === "playing");

  // ── Inicializar piezas mezcladas ───────────────────────────────────────────

  // ── Verificar si el puzzle está completo ───────────────────────────────────
  const checkCompleted = useCallback((newBoard: (number | null)[]) => {
    const isComplete = newBoard.every((cell, index) => cell === index);
    if (isComplete) {
      console.log("🎉 Puzzle completado!");
      stopAmbient();
      playComplete();
      setCompleted(true);
      setShowCompleteImage(true);
      setTimeout(() => {
        setShowPopup(true);
        playFanfare();
      }, 2800);
    }
  }, []);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (pieceId: number) => {
    playGrab();
    setDraggingId(pieceId);
  };

  const handleDropOnBoard = (cellIndex: number) => {
    if (draggingId === null) return;
    if (board[cellIndex] !== null) return; // celda ocupada

    const newBoard = [...board];
    newBoard[cellIndex] = draggingId;

    // Si la pieza encajó en el lugar correcto
    if (draggingId === cellIndex) {
      playCorrect();
      setPieces(prev => prev.map(p =>
        p.id === draggingId ? { ...p, placed: true } : p
      ));
    } else {
      playWrong();
      // Pieza en lugar incorrecto, la devolvemos al pool
      setTimeout(() => {
        setBoard(prev => {
          const updated = [...prev];
          updated[cellIndex] = null;
          return updated;
        });
      }, 500);
    }

    setBoard(newBoard);
    setDraggingId(null);
    checkCompleted(newBoard);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleIntroComplete = (shuffledOrder: number[]) => {
    // Recibimos el orden mezclado de la intro y lo aplicamos
    setPieces(shuffledOrder.map(id => ({ id, placed: false })));
    setGamePhase("playing");
  };

  // ── Piezas disponibles (no colocadas correctamente) ────────────────────────
  const availablePieces = pieces.filter(p => !p.placed);

  // ── Estilos de cada pieza (recorte de imagen) ─────────────────────────────
  const getPieceStyle = (pieceId: number, size: number) => {
    const col = pieceId % GRID_SIZE;
    const row = Math.floor(pieceId / GRID_SIZE);
    return {
      width: size,
      height: size,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${size * GRID_SIZE}px ${size * GRID_SIZE}px`,
      backgroundPosition: `-${col * size}px -${row * size}px`,
      cursor: "grab",
      borderRadius: 4,
      border: "2px solid white",
      flexShrink: 0,
    };
  };

  console.log(`showPopup: ${showPopup}, completed: ${completed}`);

  if (gamePhase === "intro") {
    return (
      <PuzzleIntro
        imageUrl={imageUrl}
        onIntroComplete={handleIntroComplete}
      />
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: 24,
      fontFamily: "var(--font-nunito), system-ui, sans-serif",
    }}>

      {/* Título y descripción */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h2 style={{
          fontSize: 42,
          marginBottom: 8,
          fontFamily: "var(--font-fredoka), system-ui, sans-serif",
          fontWeight: 700,
          color: "white",
          letterSpacing: "0.5px",
        }}>{title}</h2>
        <p style={{
          color: "#ccc",
          fontSize: 18,
          fontFamily: "var(--font-nunito), system-ui, sans-serif",
          fontWeight: 600,
        }}>{description}</p>
      </div>

      {/* Layout principal */}
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>

        {/* Izquierda: piezas mezcladas */}
        <div>
          <p style={{
            fontSize: 18,
            color: "#bbb",
            marginBottom: 8,
            fontFamily: "var(--font-nunito), system-ui, sans-serif",
            fontWeight: 600,
            textAlign: "center",
          }}>
            Piezas ({availablePieces.length} restantes)
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE_SMALL}px)`,
            gap: 4,
            padding: 12,
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            minHeight: GRID_SIZE * (PIECE_SIZE_SMALL + 4),
          }}>
            {availablePieces.map(piece => (
              <div
                key={piece.id}
                draggable
                onDragStart={() => handleDragStart(piece.id)}
                style={getPieceStyle(piece.id, PIECE_SIZE_SMALL)}
              />
            ))}
          </div>
        </div>

        {/* Derecha: tablero destino */}
        <div>
          <p style={{
            fontSize: 18,
            color: "#bbb",
            marginBottom: 8,
            fontFamily: "var(--font-nunito), system-ui, sans-serif",
            fontWeight: 600,
            textAlign: "center",
          }}>
            Armá el rompecabezas
          </p>
          {showCompleteImage ? (
            <div
              ref={boardRef}
              style={{
                width: GRID_SIZE * PIECE_SIZE_LARGE + 24,
                height: GRID_SIZE * PIECE_SIZE_LARGE + 24,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 8,
                animation: "zoomIn 0.6s ease forwards",
              }}
            />
          ) : (
          <div 
            ref={boardRef}
            style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE_LARGE}px)`,
            gap: 4,
            padding: 12,
            backgroundColor: "#e8e8e8",
            borderRadius: 8,
          }}>
            {board.map((cellContent, cellIndex) => (
              <div
                key={cellIndex}
                ref={el => { boardPiecesRef.current[cellIndex] = el; }}
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnBoard(cellIndex)}
                style={{
                  width: PIECE_SIZE_LARGE,
                  height: PIECE_SIZE_LARGE,
                  backgroundColor: cellContent === null ? "#d0d0d0" : "transparent",
                  borderRadius: 4,
                  border: cellContent === null ? "2px dashed #bbb" : "2px solid transparent",
                  overflow: "hidden",
                }}
              >
                {cellContent !== null && (
                  <div style={getPieceStyle(cellContent, PIECE_SIZE_LARGE)} />
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Popup de completado */}
      {showPopup && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 40,
            maxWidth: 400,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{
              fontSize: 36,
              marginBottom: 8,
              fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              fontWeight: 700,
              color: "#1a1a2e",
            }}>¡Felicitaciones!</h2>
            <p style={{
              color: "#444",
              marginBottom: 8,
              fontFamily: "var(--font-nunito), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}>{title}</p>
            <p style={{
              color: "#666",
              fontSize: 16,
              marginBottom: 24,
              fontFamily: "var(--font-nunito), system-ui, sans-serif",
              fontWeight: 400,
            }}>{description}</p>
            <button
              onClick={() => {
                setShowPopup(false)
                onCompleted() //Cuando cierra el popup, pasa al proximo nivel
              }}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 32px",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Siguiente puzzle →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

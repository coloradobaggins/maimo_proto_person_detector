"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { useFaceApi } from "@/hooks/useFaceApi";
import { useWebcam } from "@/hooks/useWebcam";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useConfig } from "@/context/ConfigContext";
import { useNotebookSync } from "@/hooks/useNotebookSync";
import { PuzzleCategory, PUZZLE_CATEGORIES } from "@/types/config";
import { PuzzleBoard } from "@/components/PuzzleBoards";
import { CategorySlider } from "@/components/CategorySlider";
import { CategoryGrid } from "@/components/CategoryGrid";
import { IdleView } from "@/components/IdleView";
import { ChildGreeting } from "@/components/ChildGreetings";

const LANG = "es";
const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || "mac";
const ROOM_NAME = APP_MODE === "mac" ? "mac-app" : "notebook-app";

export default function Home() {
  const [isDebug, setIsDebug] = useState(false);
  const [childPresent, setChildPresent] = useState(false);
  const [childOverride, setChildOverride] = useState(false);
  const childOverrideRef = useRef(false);

  const { config, isLoading: isLoadingConfig, error: errorConfig, refresh } = useConfig();
  const { isLoaded } = useFaceApi();
  const { videoRef, isReady, error: errorWebcam } = useWebcam();
  const { detectionState, canvasRef } = useFaceDetection(
    videoRef,
    isReady,
    isLoaded,
    config.config.sensor_detections
  );

  /*
    Config va a cargar en ultima instancia lib/defaultConfig.ts
    si los otros dos metodos anteriores no estan disponible:
    Carga por nestjs, cargar filesystem, en el momento del async
    al buscar la config. 
    Una vez cargado, actualiza con la data cuando se termina de cargar.
  */
  //console.log("Config actual:", config);
  const [activeCategory, setActiveCategory] = useState<PuzzleCategory | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [puzzleActive, setPuzzleActive] = useState(false);
  const defaultCategory = config?.config.default_puzzle_category;
  const currentCategory = activeCategory ?? defaultCategory;
  const currentPuzzleImage = config.puzzles[currentCategory]?.images[currentImageIndex];
  const puzzleImageUrl = currentPuzzleImage
    ? `/puzzles/${currentCategory}/${currentPuzzleImage.filename}`
    : `https://picsum.photos/seed/${currentCategory}/400/400`;
  const puzzleAudioUrl = currentPuzzleImage?.audio
    ? `/puzzles/${currentCategory}/audios/${currentPuzzleImage.audio}`
    : null;
  

  type NotebookPhase = "idle" | "greeting" | "puzzle";
  const [notebookPhase, setNotebookPhase] = useState<NotebookPhase>("idle");

  const notebookPhaseRef = useRef<NotebookPhase>("idle");

  //const [childPhase, setChildPhase] = useState<"idle" | "greeting" | "puzzle">("idle");


  useEffect(() => {
    notebookPhaseRef.current = notebookPhase;
  }, [notebookPhase]);

  useEffect(() => {
    childOverrideRef.current = childOverride;
  }, [childOverride]);

  // Reset override cuando el adulto se va (reinicio de ciclo)
  useEffect(() => {
    if (APP_MODE !== "mac") return;
    if (detectionState === "idle") {
      setChildOverride(false);
    }
  }, [detectionState]);
  
  useEffect(() => {
    if (APP_MODE !== "notebook") return;
    
    console.log("detectionState cambió:", detectionState, "notebookPhase:", notebookPhase);
  
    if (detectionState === "child" || detectionState === "both") {
      setNotebookPhase(prev => {
        console.log("prev:", prev);
        return prev === "idle" ? "greeting" : prev;
      });
    }
  
    if (detectionState === "idle") {
      setNotebookPhase("idle");
    }
  }, [detectionState]);

  const [showPuzzle, setShowPuzzle] = useState(false);

  useEffect(() => {
    if (notebookPhase === "puzzle") {
      setTimeout(() => setShowPuzzle(true), 100);
    } else {
      setShowPuzzle(false);
      if (notebookPhase === "idle") {
        setCurrentImageIndex(0);
      }
    }
  }, [notebookPhase]);

  // ── Estado global ──────────────────────────────────────────────────────────
  const globalState = (()=>{
    if (APP_MODE === "notebook") {
      // notebook: si detecta ambos en la misma cámara, prioriza child
      if (detectionState === "both") return "child";
      return detectionState;
    }
    // mac: override activo → ignorar presencia del niño
    if (childOverride) return "adult";
    // mac: si detecta ambos en la misma cámara, prioriza adult
    if (detectionState === "both") return "adult";
    if (detectionState === "adult" && childPresent) return "adult-with-child";
    return detectionState;
  })()

  // ── Mac/AdultApp: responde con su categoría actual cuando notebook completa puzzle ──
  const handleCategoryCurrentRequest = useCallback(() => {
    if(!activeCategory) return;
    console.log(`📤 Enviando categoría actual a notebook: ${activeCategory}`);
    // lo emitimos via socket directo
    (window as any).__socket?.emit("category:current", activeCategory);
  },[activeCategory]);

  // ── Mac/AdultApp: adulto selecciona categoría ──────────────────────────────────────
  const handleCategorySelect = useCallback((category: string) => {
    console.log(`Categoria seleccionada por el adulto: ${category}`);
    setActiveCategory(category as PuzzleCategory);

    if(!puzzleActive) {
      // Si no hay puzzle activo en notebook, enviamos la categoría
      (window as any).__socket?.emit("category:selected", category);
    } else {
      // Si hay puzzle activo, solo actualizamos nuestra categoría local
      console.log("🧩 Puzzle activo en notebook, no interrumpimos");
    }
  },[puzzleActive]);

  // ── Handle niño completa puzzle ────────────────────────────────────────────
  const handlePuzzleCompleted = useCallback(() => {
    const images = config.puzzles[currentCategory]?.images ?? [];
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  }, [currentCategory, currentImageIndex, config.puzzles]);

  //useWebSocket(refresh); // websocket para escuchar eventos
  // ── Modo Mac: escucha señales de la Notebook ───────────────────────────────
  useWebSocket({
    roomName: ROOM_NAME,
    onConfigUpdate: refresh,

    // Mac/AdultApp escucha
    onChildDetected: APP_MODE === "mac" ? () => { if (!childOverrideRef.current) setChildPresent(true); } : undefined,
    onChildGone: APP_MODE === "mac" ? () => setChildPresent(false) : undefined,
    onPuzzleActive: APP_MODE === "mac" ? () => setPuzzleActive(true) : undefined,
    onPuzzleCompleted: APP_MODE === "mac" ? () => setPuzzleActive(false) : undefined,
    onCategoryCurrentRequest: APP_MODE === "mac" ? handleCategoryCurrentRequest : undefined,

    // Notebook/childApp escucha
    //onCategorySelected: APP_MODE === "notebook" ? setActiveCategory : undefined,
    //onCategoryUpdate: APP_MODE === "notebook" ? setActiveCategory : undefined,
    
    onCategorySelected: APP_MODE === "notebook"
      ? (category) => {
          console.log("🎯 category:selected, notebookPhase:", notebookPhaseRef.current);
          if (notebookPhaseRef.current !== "puzzle") {
            setActiveCategory(category);
          } else {
            console.log("Puzzle activo, ignorando category:selected");
          }
        }
      : undefined,
    
      onCategoryUpdate: APP_MODE === "notebook"
        ? (category) => {
            if (notebookPhaseRef.current !== "puzzle") {
              setActiveCategory(category);
            } else {
              console.log("Puzzle activo, ignorando category:update");
            }
          }
        : undefined,
    
    onCategoryCurrentResponse: APP_MODE === "notebook"
      ? (category) => {
          if (!puzzleActive) setActiveCategory(category);
        }
      : undefined,
  });

  // ── Modo Notebook/childApp: emite señales a NestJS cuando detecta un niño ───────────
  useNotebookSync(APP_MODE === "notebook" ? detectionState : "idle");

  

  // ── Obtener contenido activo segun perfil detectado, en idioma seleccionado ─────//
  //const activeContent = config.data[detectionState].content.find(c => c.lang === LANG);

  // ── Contenido según estado global ─────────────────────────────────────────
  const contentProfile = globalState === "adult-with-child" ? "both" : detectionState;
  const activeContent = config.data[contentProfile]?.content.find(
    c => c.lang === "es"
  );

  return (
    <main>
      {/*<h1>Face API — {APP_MODE === "mac" ? "Mac" : "Notebook"}</h1>*/}
      {errorWebcam && <p>Error con la webcam: {errorWebcam.message}</p>}
      {!isLoaded && <p>Cargando modelos...</p>}
      {/*isLoaded && <p>Modelos cargados.</p>*/}
      {/*isLoaded && isReady && <p>Listo para detectar people</p>*/}

      {/* Toggle video debug */}
      {/*<label style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0" }}>
        <input type="checkbox"
        checked={isDebug}
        onChange={e => setIsDebug(e.target.checked)}
        />
        Video debug
      </label>/*}

      {/* Video + canvas superpuesto, visibles solo en debug */}
      <div style={{ position: "absolute", width: 640, height: 480, visibility: isDebug ? "visible" : "hidden" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 640, height: 480 }}
        />
      </div>

      {/* Indicadores debug */}
      {isDebug && (
        <>
          <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
            <div style={{
              width: 100, height: 100, borderRadius: 8, border: "2px solid #ccc",
              backgroundColor: detectionState === "adult" || detectionState === "both" ? "blue" : "white",
              transition: "background-color 0.3s"
            }} />
            <div style={{
              width: 100, height: 100, borderRadius: 8, border: "2px solid #ccc",
              backgroundColor: APP_MODE === "mac"
                ? (childPresent ? "green" : "white")
                : (detectionState === "child" || detectionState === "both" ? "green" : "white"),
              transition: "background-color 0.3s"
            }} />
          </div>
          <p>Estado local: {detectionState}</p>
          <p>Estado global: {globalState}</p>
          <p>Categoría activa: {activeCategory ?? defaultCategory}</p>
          {/*APP_MODE === "mac" && <p>Niño en notebook: {childPresent ? "sí" : "no"}</p>*/}
          {/*APP_MODE === "mac" && <p>Puzzle activo: {puzzleActive ? "sí" : "no"}</p>*/}
        </>
      )}

      {/* Selector de categorías (solo Mac en modo adult o adult-with-child) */}
      {/*APP_MODE === "mac" && (detectionState === "adult" || globalState === "adult-with-child") && (
        <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
          {PUZZLE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              style={{
                padding: "12px 24px",
                borderRadius: 8,
                border: "2px solid #ccc",
                backgroundColor: activeCategory === cat ? "#2563eb" : "white",
                color: activeCategory === cat ? "white" : "#222",
                cursor: "pointer",
                fontWeight: activeCategory === cat ? "bold" : "normal",
                transition: "all 0.2s"
              }}
            >
              {cat === "obelisco" ? "🐾 Obelisco" : cat === "paseodelbajo" ? "🚀 Paseo del bajo" : "🏙️ Subtes"}
            </button>
          ))}
        </div>
      )*/}

      {/*<p>Estado: {detectionState}</p>*/}
      {/*APP_MODE === "mac" && (
        <p>Niño en notebook: {childPresent ? "sí" : "no"}</p>
      )*/}

      {/* Contenido del perfil activo: */}
      {/*activeContent && (
        <div style={{marginTop: 32}}>
          <h2>{activeContent.title}</h2>
          <p>{activeContent.description}</p>
        </div>
      )*/}

      {APP_MODE === "mac" && globalState === "adult" && (
        <CategorySlider onCategorySelect={handleCategorySelect} />
      )}

      {APP_MODE === "mac" && globalState === "adult-with-child" && (
        <CategoryGrid onCategorySelect={handleCategorySelect} />
      )}

      {globalState === "idle" && <IdleView mode={APP_MODE as "mac" | "notebook"} />}

      {APP_MODE === "mac" && globalState === "adult-with-child" && (
        <div style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 20,
          //backgroundColor: "rgba(80, 80, 80, 0.88)",
          borderRadius: 12,
          padding: "14px 28px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(6px)",
        }}>
          <span style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontSize: 14,
            letterSpacing: "0.01em",
            maxWidth: 320,
            lineHeight: 1.4,
          }}>
            Detectamos que estás junto a un niño, por lo tanto esta vista es resumida.
          </span>
          <button
            onClick={() => setChildOverride(true)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            Ver versión completa
          </button>
        </div>
      )}

      {APP_MODE === "mac" && childOverride && childPresent && (
        <button
          onClick={() => setChildOverride(false)}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
            backgroundColor: "rgba(80, 80, 80, 0.88)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(6px)",
            letterSpacing: "0.02em",
          }}
        >
          Ver versión resumida
        </button>
      )}

      {/* Puzzle: solo en modo notebook/childApp cuando hay un niño presente */}
      {APP_MODE === "notebook" && (
  <>
    {/* Pantalla negra pura */}
    {notebookPhase === "idle" && (
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
      }} />
    )}

    {/* Robot asomándose */}
    {notebookPhase === "greeting" && (
      <ChildGreeting onTap={() => setNotebookPhase("puzzle")} />
    )}

    {/* Puzzle */}
        {notebookPhase === "puzzle" && currentPuzzleImage && (
          <div style={{
            opacity: showPuzzle ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}>
            <PuzzleBoard
              key={`${currentCategory}-${currentImageIndex}`}
              audioUrl={puzzleAudioUrl}
              imageUrl={puzzleImageUrl}
              title={currentPuzzleImage.title}
              description={currentPuzzleImage.description}
              onCompleted={handlePuzzleCompleted}
            />
          </div>
        )}
      </>
    )}
    </main>
  );
}

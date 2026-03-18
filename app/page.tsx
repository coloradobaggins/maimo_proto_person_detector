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

const LANG = "es";
const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || "mac";
const ROOM_NAME = APP_MODE === "mac" ? "mac-app" : "notebook-app";

export default function Home() {
  const [isDebug, setIsDebug] = useState(false);
  const [childPresent, setChildPresent] = useState(false);

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

  const [puzzleVisible, setPuzzleVisible] = useState(false);

  const puzzleVisibleRef = useRef(puzzleVisible); //PuzzleVisible esta afectado por useWebsockets, los callbacks se crean una sola vez cuando el hook se monta. Queda el valor inicial en false. Creo ref.
  
  console.log("config:", config.config.default_puzzle_category);
  console.log("activeCategory:", activeCategory);
  console.log("currentCategory:", currentCategory);
  console.log("puzzleVisible:", puzzleVisible);
  console.log("currentPuzzleImage:", currentPuzzleImage);

  useEffect(() => {
    puzzleVisibleRef.current = puzzleVisible;
  }, [puzzleVisible]);

  useEffect(() => {
    if (detectionState === "child" || detectionState === "both") {
      setPuzzleVisible(true);
    }
    if (detectionState === "idle") {
      setPuzzleVisible(false);
    }
    // Si queda solo el adulto, el puzzle se mantiene (no hacemos nada)
  }, [detectionState]);

  // ── Estado global ──────────────────────────────────────────────────────────
  const globalState = (()=>{
    if(APP_MODE === "notebook") return detectionState; // en modo notebook, el estado global es el mismo que el de detección
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
  const handleCategorySelect = useCallback((category: PuzzleCategory) => {
    console.log(`Categoria seleccionada por el adulto: ${category}`);
    setActiveCategory(category);

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
    onChildDetected: APP_MODE === "mac" ? () => setChildPresent(true) : undefined,
    onChildGone: APP_MODE === "mac" ? () => setChildPresent(false) : undefined,
    onPuzzleActive: APP_MODE === "mac" ? () => setPuzzleActive(true) : undefined,
    onPuzzleCompleted: APP_MODE === "mac" ? () => setPuzzleActive(false) : undefined,
    onCategoryCurrentRequest: APP_MODE === "mac" ? handleCategoryCurrentRequest : undefined,

    // Notebook/childApp escucha
    //onCategorySelected: APP_MODE === "notebook" ? setActiveCategory : undefined,
    //onCategoryUpdate: APP_MODE === "notebook" ? setActiveCategory : undefined,
    
    onCategorySelected: APP_MODE === "notebook"
      ? (category) => {
          console.log("🎯 category:selected, puzzleVisibleRef:", puzzleVisibleRef.current);
          if (!puzzleVisibleRef.current) {
            setActiveCategory(category);
          } else {
            console.log(`Puzzle activo, ignorando category:selected`);
          }
        }
      : undefined,
    
    onCategoryUpdate: APP_MODE === "notebook" 
    ? (category) => {
        if (!puzzleVisibleRef.current) {
          setActiveCategory(category);
        } else {
          console.log(`Puzzle activo, ignorando category:update`);
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
      <h1>Face API — {APP_MODE === "mac" ? "Mac" : "Notebook"}</h1>
      {errorWebcam && <p>Error con la webcam: {errorWebcam.message}</p>}
      {!isLoaded && <p>Cargando modelos...</p>}
      {isLoaded && <p>Modelos cargados.</p>}
      {isLoaded && isReady && <p>Listo para detectar people</p>}

      {/* Toggle video debug */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0" }}>
        <input type="checkbox"
        checked={isDebug}
        onChange={e => setIsDebug(e.target.checked)}
        />
        Video debug
      </label>

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
          {APP_MODE === "mac" && <p>Niño en notebook: {childPresent ? "sí" : "no"}</p>}
          {APP_MODE === "mac" && <p>Puzzle activo: {puzzleActive ? "sí" : "no"}</p>}
        </>
      )}

      {/* Selector de categorías (solo Mac en modo adult o adult-with-child) */}
      {APP_MODE === "mac" && (detectionState === "adult" || globalState === "adult-with-child") && (
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
      )}

      <p>Estado: {detectionState}</p>
      {APP_MODE === "mac" && (
        <p>Niño en notebook: {childPresent ? "sí" : "no"}</p>
      )}

      {/* Contenido del perfil activo: */}
      {activeContent && (
        <div style={{marginTop: 32}}>
          <h2>{activeContent.title}</h2>
          <p>{activeContent.description}</p>
        </div>
      )}

      {APP_MODE === "mac" && (globalState === "adult" || globalState === "adult-with-child") && (
        <CategorySlider onCategorySelect={handleCategorySelect} />
      )}

      {/* Puzzle: solo en modo notebook/childApp cuando hay un niño presente */}
      {APP_MODE === "notebook" &&
        puzzleVisible &&
        currentPuzzleImage && (
        <PuzzleBoard
          key={`${currentCategory}-${currentImageIndex}`} // forzar remount al cambiar imagen
          category={currentCategory}
          imageUrl={puzzleImageUrl}
          title={currentPuzzleImage.title}
          description={currentPuzzleImage.description}
          onCompleted={handlePuzzleCompleted}
        />
      )}
    </main>
  );
}

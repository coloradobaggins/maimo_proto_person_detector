"use client"

import { useState } from "react";
import { useFaceApi } from "@/hooks/useFaceApi";
import { useWebcam } from "@/hooks/useWebcam";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useConfig } from "@/context/ConfigContext";

const LANG = "es";

export default function Home() {
  const [isDebug, setIsDebug] = useState(false);

  const { isLoaded } = useFaceApi();
  const { videoRef, isReady, error: errorWebcam } = useWebcam();
  const { config, isLoading: isLoadingConfig, error: errorConfig, refresh } = useConfig();
  const { detectionState, canvasRef } = useFaceDetection(videoRef, isReady, isLoaded, config.config.sensor_detections);

  console.log("Config actual:", config);

  useWebSocket(refresh); // websocket para escuchar eventos

  // ── Obtener contenido activo segun perfil detectado, en idioma seleccionado ─────//
  const activeContent = config.data[detectionState].content.find(c => c.lang === LANG);

  return (
    <main>
      <h1>FaceApi js</h1>
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

      { /* Indicadores */}
      <div style={{ display: "flex", gap: 24, marginTop: 24}}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            backgroundColor: detectionState === "adult" || detectionState === "both" ? "blue" : "white",
            border: "2px solid #ccc",
            transition: "background-color 0.3s"
          }} />
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            backgroundColor: detectionState === "child" || detectionState === "both" ? "green" : "white",
            border: "2px solid #ccc",
            transition: "background-color 0.3s"
          }} />
      </div>

      <p>Estado: {detectionState}</p>

      {/* Contenido del perfil activo: */}
      {activeContent && (
        <div style={{marginTop: 32}}>
          <h2>{activeContent.title}</h2>
          <p>{activeContent.description}</p>
        </div>
      )}

    </main>
  );
}

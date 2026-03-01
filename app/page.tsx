"use client"

import { useState } from "react";
import { useFaceApi } from "@/hooks/useFaceApi";
import { useWebcam } from "@/hooks/useWebcam";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useConfig } from "@/context/ConfigContext";

export default function Home() {
  const [isDebug, setIsDebug] = useState(false);

  const { isLoaded } = useFaceApi();
  const { videoRef, isReady, error: errorWebcam } = useWebcam();
  const { config, isLoading: isLoadingConfig, error: errorConfig } = useConfig();
  const { detectionState, canvasRef } = useFaceDetection(videoRef, isReady, isLoaded, config.config.sensor_detections);

  console.log("Config actual:", config);

  return (
    <main>
      <h1>FaceApi js</h1>
      {errorWebcam && <p>Error con la webcam: {errorWebcam.message}</p>}
      {!isLoaded && <p>Cargando modelos...</p>}
      {isLoaded && <p>Modelos cargados.</p>}
      {isLoaded && isReady && <p>Listo para detectar people</p>}

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

      {/* Video + canvas superpuesto, visibles solo en debug */}
      <div style={{ position: "relative", width: 640, height: 480, visibility:"hidden"}}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 640, height: 480 }}
        />
      </div>

    </main>
  );
}

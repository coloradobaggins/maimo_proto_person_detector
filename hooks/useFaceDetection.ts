"use client";

import { useEffect, useRef, useState } from "react";
import faceapi from "@/lib/face-api";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type DetectionState = "idle" | "adult" | "child" | "both";

type Phase = "searching" | "active" | "verifying";

// ─── Constantes ──────────────────────────────────────────────────────────────

const DETECTION_INTERVAL_MS = 200;
const CONSECUTIVE_HITS_REQUIRED = 8;
const COOLDOWN_MS = 10_000;
const VERIFY_MAX_ATTEMPTS = 6;

// ─── Helper puro (sin dependencias del hook) ─────────────────────────────────

function classifyDetections(detections: { age: number }[]): DetectionState {
  if (detections.length === 0) return "idle";

  const ages = detections.map(d => Math.round(d.age));
  const hasAdult = ages.some(age => age > 16);
  const hasChild = ages.some(age => age >= 2 && age <= 15);

  if (hasAdult && hasChild) return "both";
  if (hasAdult) return "adult";
  if (hasChild) return "child";

  return "idle";
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  isReady: boolean,
  isLoaded: boolean,
) {
  const [detectionState, setDetectionState] = useState<DetectionState>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const phase = useRef<Phase>("searching");
  const consecutiveHits = useRef(0);
  const confirmedState = useRef<DetectionState>("idle");
  const verifyAttempts = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isReady || !isLoaded) return;

    // ── FASE 1: SEARCHING ────────────────────────────────────────────────────
    async function searching() {
      if (phase.current !== "searching") return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.3,
        }))
        .withAgeAndGender();

      const classified = classifyDetections(detections);

      if (classified !== "idle") {
        if (classified !== confirmedState.current) {
          consecutiveHits.current = 0;
          confirmedState.current = classified;
        }

        consecutiveHits.current++;
        console.log(`Searching: ${classified} (${consecutiveHits.current}/${CONSECUTIVE_HITS_REQUIRED})`);

        if (consecutiveHits.current >= CONSECUTIVE_HITS_REQUIRED) {
          consecutiveHits.current = 0;
          phase.current = "active";
          setDetectionState(confirmedState.current);
          console.log(`✅ Confirmado: ${confirmedState.current} → ACTIVE`);
          scheduleActive();
          return;
        }
      } else {
        consecutiveHits.current = 0;
        confirmedState.current = "idle";
      }

      timeoutId.current = setTimeout(searching, DETECTION_INTERVAL_MS);
    }

    // ── FASE 2: ACTIVE (cooldown) ────────────────────────────────────────────
    function scheduleActive() {
      console.log(`ACTIVE - cooldown ${COOLDOWN_MS}ms`);
      timeoutId.current = setTimeout(() => {
        console.log("Cooldown terminado → VERIFYING");
        phase.current = "verifying";
        verifyAttempts.current = 0;
        verifying();
      }, COOLDOWN_MS);
    }

    // ── FASE 3: VERIFYING ────────────────────────────────────────────────────
    async function verifying() {
      if (phase.current !== "verifying") return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.3,
        }))
        .withAgeAndGender();

      const classified = classifyDetections(detections);

      if (classified !== "idle") {
        console.log(`Sigue presente: ${classified} → ACTIVE`);
        phase.current = "active";
        confirmedState.current = classified;
        setDetectionState(classified);
        scheduleActive();
        return;
      }

      verifyAttempts.current++;
      console.log(`Verifying: intento ${verifyAttempts.current}/${VERIFY_MAX_ATTEMPTS}`);

      if (verifyAttempts.current >= VERIFY_MAX_ATTEMPTS) {
        console.log("Nadie encontrado → IDLE");
        phase.current = "searching";
        confirmedState.current = "idle";
        consecutiveHits.current = 0;
        setDetectionState("idle");
        timeoutId.current = setTimeout(searching, DETECTION_INTERVAL_MS);
        return;
      }

      timeoutId.current = setTimeout(verifying, DETECTION_INTERVAL_MS);
    }

    // Arrancamos en searching
    searching();

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isLoaded]);

  return { detectionState, canvasRef };
}
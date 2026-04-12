"use client";

import { useEffect, useRef } from "react";

/**
 * Reproduce un audio de ambiente una única vez.
 * - active: false → no reproduce (ej: durante PuzzleIntro)
 * - active: true  → inicia la reproducción
 * - Al desmontar o cuando active vuelve a false → detiene el audio
 * - audioUrl null/undefined → no hace nada
 */
export function usePuzzleAmbient(audioUrl: string | null | undefined, active: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function stop() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = "";
    audioRef.current = null;
  }

  useEffect(() => {
    if (!active || !audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.volume = 0.45;
    audio.play().catch(() => {});

    return stop; // detiene al desmontar o al cambiar audioUrl/active
  }, [audioUrl, active]);

  return { stop };
}

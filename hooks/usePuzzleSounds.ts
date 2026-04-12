"use client";

import { useRef } from "react";

export function usePuzzleSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    // Resume if the browser suspended it (common on long-running kiosk sessions)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }

  // ── Utilidad interna ──────────────────────────────────────────────────────
  function playTone(
    frequency: number,
    type: OscillatorType,
    duration: number,
    peakGain = 0.4,
    filterFreq?: number,
    startDelay = 0,
  ) {
    const ctx = getCtx();
    const t = ctx.currentTime + startDelay;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peakGain, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    if (filterFreq !== undefined) {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(filterFreq, t);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  // ── Sonidos públicos ──────────────────────────────────────────────────────

  /** Click suave al agarrar una pieza */
  function playGrab() {
    playTone(520, "sine", 0.08, 0.3);
  }

  /** Chime agradable al colocar correctamente */
  function playCorrect() {
    playTone(523, "triangle", 0.35, 0.35);           // C5
    playTone(659, "triangle", 0.35, 0.35, undefined, 0.12); // E5
  }

  /** Thud sordo al colocar en lugar incorrecto */
  function playWrong() {
    playTone(180, "sawtooth", 0.25, 0.3, 400);
  }

  /** Arpeggio corto al completar el puzzle */
  function playComplete() {
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      playTone(freq, "triangle", 0.3, 0.4, undefined, i * 0.13);
    });
  }

  /** Fanfare festivo al mostrar el popup de felicitaciones */
  function playFanfare() {
    // Arpeggio ascendente: C5-E5-G5-A5-C6-E6
    const notes = [523, 659, 784, 880, 1047, 1319];
    notes.forEach((freq, i) => {
      playTone(freq, "triangle", 0.45, 0.5, undefined, i * 0.1);
    });
    // Nota final sostenida
    playTone(1047, "sine", 0.8, 0.35, undefined, notes.length * 0.1);
  }

  /** "Boing" ascendente cuando el robot asoma desde un borde */
  function playRobotPeek() {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(700, t + 0.22);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.27);
  }

  /** Sparkle ascendente al tapear para empezar */
  function playTap() {
    playTone(880,  "triangle", 0.3, 0.45);                  // A5
    playTone(1047, "triangle", 0.3, 0.45, undefined, 0.1);  // C6
  }

  /** Cierra el AudioContext al desmontar el componente (para kioscos de larga duración) */
  function closeAudio() {
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }

  return { playGrab, playCorrect, playWrong, playComplete, playFanfare, playRobotPeek, playTap, closeAudio };
}

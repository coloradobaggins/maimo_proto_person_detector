"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function RobotSVG({ size = 120 }: { size?: number }) {
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const leftArmRef = useRef<SVGRectElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // ── Parpadeo de ojos ────────────────────────────────────────────────────
    const blinkTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    blinkTl
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 0.1,
        duration: 0.08,
        ease: "power2.in",
        transformOrigin: "center center",
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 1,
        duration: 0.08,
        ease: "power2.out",
      });

    // ── Saludo con brazo ────────────────────────────────────────────────────
    const waveTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    waveTl
      .to(leftArmRef.current, {
        rotation: -40,
        transformOrigin: "top center",
        duration: 0.3,
        ease: "power2.out",
      })
      .to(leftArmRef.current, {
        rotation: 0,
        transformOrigin: "top center",
        duration: 0.3,
        ease: "power2.in",
      })
      .to(leftArmRef.current, {
        rotation: -40,
        transformOrigin: "top center",
        duration: 0.3,
        ease: "power2.out",
      })
      .to(leftArmRef.current, {
        rotation: 0,
        transformOrigin: "top center",
        duration: 0.3,
        ease: "power2.in",
      });

    // ── Pulso antena ────────────────────────────────────────────────────────
    gsap.to(antennaRef.current, {
      scale: 1.4,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "center center",
    });

    return () => {
      blinkTl.kill();
      waveTl.kill();
    };
  }, []);

  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Antena */}
      <line x1="50" y1="8" x2="50" y2="20" stroke="#64b5f6" strokeWidth="2.5" strokeLinecap="round" />
      <circle ref={antennaRef} cx="50" cy="6" r="4" fill="#64b5f6" />

      {/* Cabeza */}
      <rect x="25" y="20" width="50" height="40" rx="10" fill="#42a5f5" />

      {/* Ojos */}
      <circle ref={leftEyeRef} cx="38" cy="37" r="7" fill="white" />
      <circle ref={rightEyeRef} cx="62" cy="37" r="7" fill="white" />
      <circle cx="38" cy="37" r="3.5" fill="#1565c0" />
      <circle cx="62" cy="37" r="3.5" fill="#1565c0" />
      <circle cx="39.5" cy="35.5" r="1.2" fill="white" />
      <circle cx="63.5" cy="35.5" r="1.2" fill="white" />

      {/* Boca */}
      <path
        ref={mouthRef}
        d="M 38 52 Q 50 60 62 52"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cuerpo */}
      <rect x="28" y="63" width="44" height="38" rx="8" fill="#1e88e5" />

      {/* Panel del cuerpo */}
      <rect x="36" y="70" width="12" height="8" rx="3" fill="#64b5f6" opacity="0.6" />
      <rect x="52" y="70" width="12" height="8" rx="3" fill="#64b5f6" opacity="0.6" />
      <circle cx="50" cy="86" r="5" fill="#42a5f5" />
      <circle cx="50" cy="86" r="2.5" fill="#1565c0" />

      {/* Brazo izquierdo */}
      <rect
        ref={leftArmRef}
        x="14"
        y="65"
        width="12"
        height="28"
        rx="6"
        fill="#42a5f5"
      />

      {/* Brazo derecho */}
      <rect x="74" y="65" width="12" height="28" rx="6" fill="#42a5f5" />

      {/* Piernas */}
      <rect x="33" y="101" width="13" height="22" rx="6" fill="#1e88e5" />
      <rect x="54" y="101" width="13" height="22" rx="6" fill="#1e88e5" />

      {/* Pies */}
      <rect x="30" y="118" width="18" height="8" rx="4" fill="#1565c0" />
      <rect x="52" y="118" width="18" height="8" rx="4" fill="#1565c0" />
    </svg>
  );
}
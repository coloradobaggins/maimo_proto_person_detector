"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { RobotSVG } from "./RobotSVG";

interface ChildGreetingProps {
  onTap: () => void;
}

type Edge = "bottom" | "top" | "left" | "right";

const MESSAGES = ["👀", "¡Psst!", "¡Hola!", "🤖", "¿Jugamos?"];

export function ChildGreeting({ onTap }: ChildGreetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const viñetaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const robot = robotRef.current;
    const viñeta = viñetaRef.current;
    if (!robot || !viñeta) return;

    const getPositionForEdge = (edge: Edge) => {
      const margin = -130;
      switch (edge) {
        case "bottom":
          return {
            x: Math.random() * (window.innerWidth - 120),
            y: window.innerHeight - margin,
            peekY: window.innerHeight - 120,
            peekX: null,
          };
        case "top":
          return {
            x: Math.random() * (window.innerWidth - 120),
            y: margin,
            peekY: 10,
            peekX: null,
          };
        case "left":
          return {
            x: margin,
            y: Math.random() * (window.innerHeight - 140),
            peekY: null,
            peekX: 10,
          };
        case "right":
          return {
            x: window.innerWidth - margin,
            y: Math.random() * (window.innerHeight - 140),
            peekY: null,
            peekX: window.innerWidth - 120,
          };
      }
    };

    const edges: Edge[] = ["bottom", "top", "left", "right"];
    let timeoutId: ReturnType<typeof setTimeout>;

    const peek = () => {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const pos = getPositionForEdge(edge);
      const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

      gsap.set(robot, { x: pos.x, y: pos.y, opacity: 1 });
      gsap.set(viñeta, { opacity: 0, scale: 0.5 });
      viñeta.textContent = message;

      if (edge === "top") {
        viñeta.style.bottom = "auto";
        viñeta.style.top = "110%";
      } else {
        viñeta.style.top = "auto";
        viñeta.style.bottom = "110%";
      }

      const tl = gsap.timeline({
        onComplete: () => {
          timeoutId = setTimeout(peek, 2000 + Math.random() * 3000);
        },
      });

      tl
        .to(robot, {
          x: pos.peekX ?? pos.x,
          y: pos.peekY ?? pos.y,
          duration: 0.7,
          ease: "elastic.out(1, 0.5)",
        })
        .to(viñeta, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(3)",
        })
        .to({}, { duration: 1.5 })
        .to(viñeta, {
          opacity: 0,
          scale: 0.5,
          duration: 0.2,
        })
        .to(robot, {
          x: pos.x,
          y: pos.y,
          duration: 0.5,
          ease: "power3.in",
        });
    };

    timeoutId = setTimeout(peek, 500);

    return () => {
      clearTimeout(timeoutId);
      gsap.killTweensOf([robot, viñeta]);
    };
  }, []);

  const handleTap = () => {
    const container = containerRef.current;
    if (!container) return;
    gsap.to(container, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: onTap,
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        overflow: "hidden",
        cursor: "pointer",
        zIndex: 20,
      }}
    >
      <div
        ref={robotRef}
        style={{
          position: "absolute",
          opacity: 0,
          zIndex: 10,
        }}
      >
        <div
          ref={viñetaRef}
          style={{
            position: "absolute",
            bottom: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            borderRadius: 12,
            padding: "8px 14px",
            fontSize: 16,
            fontWeight: 700,
            color: "#1565c0",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        />
        <RobotSVG size={80} />
      </div>
    </div>
  );
}
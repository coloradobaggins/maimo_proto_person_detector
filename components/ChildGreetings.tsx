"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { RobotSVG } from "./RobotSVG";
import { usePuzzleSounds } from "@/hooks/usePuzzleSounds";

interface ChildGreetingProps {
  onTap: () => void;
}

type Edge = "bottom" | "top" | "left" | "right";

const MESSAGES = ["👀", "¡Psst!", "¡Hola!", "🤖", "¿Jugamos?"];

export function ChildGreeting({ onTap }: ChildGreetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const vinetaRef = useRef<HTMLDivElement>(null);
  const tappedRef = useRef(false);
  const { playRobotPeek, playTap, closeAudio } = usePuzzleSounds();

  useEffect(() => {
    const robot = robotRef.current;
    const vineta = vinetaRef.current;
    if (!robot || !vineta) return;

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
      if (tappedRef.current) return;
      playRobotPeek();

      const edge = edges[Math.floor(Math.random() * edges.length)];
      const pos = getPositionForEdge(edge);
      const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

      gsap.set(robot, { x: pos.x, y: pos.y, opacity: 1 });
      gsap.set(vineta, { opacity: 0, scale: 0.5 });
      vineta.textContent = message;

      if (edge === "top") {
        vineta.style.bottom = "auto";
        vineta.style.top = "110%";
      } else {
        vineta.style.top = "auto";
        vineta.style.bottom = "110%";
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
        .to(vineta, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(3)",
        })
        .to({}, { duration: 1.5 })
        .to(vineta, {
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
      gsap.killTweensOf([robot, vineta]);
      closeAudio();
    };
  }, []);

  const handleTap = () => {
    if (tappedRef.current) return;
    tappedRef.current = true;
    playTap();

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
          ref={vinetaRef}
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
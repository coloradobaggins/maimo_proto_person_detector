// Maneja la emisión de presencia del adulto hacia NestJS cuando cambia el estado de detección
"use client"

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DetectionState } from "@/hooks/useFaceDetection";

const NEST_WS_URL = `${process.env.NEXT_PUBLIC_NEST_WS_URL}`;
const ROOM_NAME = "mac-app";

export function useMacSync(detectionState: DetectionState) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(NEST_WS_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ Mac sync conectada a NestJS");
            socket.emit("join", ROOM_NAME);
        });

        socket.on("disconnect", () => {
            console.log("⚠️ Mac sync desconectada de NestJS");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Emitir eventos cuando cambia el estado de detección del adulto
    useEffect(() => {
        if (!socketRef.current?.connected) return;

        if (detectionState === "adult" || detectionState === "both") {
            console.log("🧑 Emitiendo adult:detected");
            socketRef.current.emit("adult:detected");
        } else if (detectionState === "idle") {
            console.log("🧑 Emitiendo adult:gone");
            socketRef.current.emit("adult:gone");
        }
    }, [detectionState]);
}

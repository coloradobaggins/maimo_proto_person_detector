//maneja la emisión de eventos hacia NestJS cuando cambia el estado de detección
"use client"

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DetectionState } from "@/hooks/useFaceDetection";

const NEST_WS_URL = `${process.env.NEXT_PUBLIC_NEST_WS_URL}`;
const ROOM_NAME = "notebook-app"

export function useNotebookSync(detectionState: DetectionState) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(()=> {

        const socket = io(NEST_WS_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
        console.log("✅ Notebook conectada a NestJS");
            socket.emit("join", ROOM_NAME);
        });
    
        socket.on("disconnect", () => {
            console.log("⚠️ Notebook desconectada de NestJS");
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    // Emitir eventos cuando cambia el estado de detección
    useEffect(() => {
        if (!socketRef.current?.connected) return;

        if (detectionState === "child" || detectionState === "both") {
            console.log("👶 Emitiendo child:detected");
        socketRef.current.emit("child:detected");
        } else if (detectionState === "idle") {
            console.log("👶 Emitiendo child:gone");
            socketRef.current.emit("child:gone");
        }
    }, [detectionState]);
}
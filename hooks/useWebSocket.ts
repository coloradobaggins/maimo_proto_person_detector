"use client"

import { useEffect } from "react";
import { io } from "socket.io-client";
import { PuzzleCategory } from "@/types/config";

//const NEST_WS_URL = "http://localhost:3001";
const NEST_WS_URL = `${process.env.NEXT_PUBLIC_NEST_WS_URL}`;
const ROOM_NAME = "person-detector-app"

interface useWebSocketProps {
    roomName: string;
    onConfigUpdate: () => void;

    // Mac/AppAdulto escucha:
    onChildDetected?: () => void; // solo para app puzzle
    onChildGone?: () => void; // solo para app puzzle
    onPuzzleActive?: () => void;
    onPuzzleCompleted?: () => void;
    onCategoryCurrentRequest?: () => void; // Mac/AppAdulto debe responder con su categoría actual

    // Notebook escucha
    onCategorySelected?: (category: PuzzleCategory) => void;
    onCategoryUpdate?: (category: PuzzleCategory) => void;
    onCategoryCurrentResponse?: (category: PuzzleCategory) => void;
}

export function useWebSocket({
    //roomName = ROOM_NAME,
    roomName,
    onConfigUpdate,
    onChildDetected,
    onChildGone,
    onPuzzleActive,
    onPuzzleCompleted,
    onCategoryCurrentRequest,
    onCategorySelected,
    onCategoryUpdate,
    onCategoryCurrentResponse,
}: useWebSocketProps) {
    useEffect(()=> {
        console.log(`ESTOY USANDO LA NEST_WS_URL: ${NEST_WS_URL} DE PROCESS.ENV`);

        // Config que evita repetido errores si no esta levantado el server
        const socket = io(NEST_WS_URL, {
            reconnectionAttempts: 3, // Intentar reconectar hasta 5 veces
            reconnectionDelay: 2000, // Esperar 2 segundos entre cada intento
            //timeout: 5000, // Tiempo de espera para la conexión inicial
        });

        socket.on("connect", () => {
            console.log(`OK! WebSocket conectado, rommName: ${roomName}`);

            // Al conectase, unirse a la room definida
            socket.emit("join", roomName)
        });

        socket.on("disconnect", () => {
            console.warn(`WebSocket desconectado del servidor NestJS`);
        });

        // Escuchar evento de config update
        socket.on("config:update", () => {
            console.log(`WebSocket: config update recibida`);
            onConfigUpdate(); // En este evento llamar a la función pasada desde el componente para recargar la config (es el refresh() del Context)
        });

        // ── Mac/AdultApp escucha ───────────────────────────────────────────────────────────
        if(onChildDetected) {
            socket.on("child:detected", () => {
                console.log(`WS: evento child detected recibido`);
                onChildDetected();
            });
        }

        if(onChildGone) {
            socket.on("child:gone", () => {
                console.log(`WS: evento child gone recibido`);
                onChildGone();
            });
        }

        if(onPuzzleActive) {
            socket.on("puzzle:active", () => {
                console.log(`WS: Puzzle active en appChild (notebook)`);
                onPuzzleActive();
            });
        }

        if(onPuzzleCompleted) {
            socket.on("puzzle:completed", () => {
                console.log(`WS: Puzzle completed en appChild (notebook)`);
                onPuzzleCompleted();            // notifica que se completó
                onCategoryCurrentRequest?.();   // inmediatamente responde con la categoría actual
            });
        }

        // ── Notebook escucha ──────────────────────────────────────────────────────
        if (onCategorySelected) {
            socket.on("category:selected", ({ category } : {category: PuzzleCategory}) => {
                console.log(`WS: categoría seleccionada recibida: ${category}`);
                onCategorySelected(category);
            });
        }

        if(onCategoryUpdate) {
            socket.on("category:update", ({ category } : {category: PuzzleCategory}) => {
                console.log(`WS: categoría actualizada recibida: ${category}`);
                onCategoryUpdate(category);
            });
        }

        if(onCategoryCurrentResponse) {
            socket.on("category:current", ({ category } : {category: PuzzleCategory}) => {
                console.log(`WS: categoría actual recibida: ${category}`);
                onCategoryCurrentResponse(category);
            });
        }

       

        // ── Tests helpers ───────────────────────────────────────────────────────────
        // check para test manual con el browser
        if(process.env.NODE_ENV === "development") {
            (window as any).__socket = socket;
            (window as any).__simulateConfigUpdate = onConfigUpdate;
            /*
                Probar en la consola del browser:
                __socket.emit("config:update")
                
                o

                __simulateConfigUpdate() // Llama directamente a refresh() del Context
            */
            
                // Simular señales de la Notebook (solo útil en modo Mac)
            (window as any).__simulateChildDetected = () => {
                console.log(" --> Simulando child:detected");
                onChildDetected?.();
            };
            (window as any).__simulateChildGone = () => {
                console.log(" --> Simulando child:gone");
                onChildGone?.();
            };
            (window as any).__simulateCategorySelected = (category: PuzzleCategory) => {
                console.log(`🧪 Simulando category:selected: ${category}`);
                onCategorySelected?.(category);
              };
            (window as any).__simulatePuzzleCompleted = () => {
                console.log("🧪 Simulando puzzle:completed");
                onPuzzleCompleted?.();
                onCategoryCurrentRequest?.();
            };
        }

        return () => {
            socket.disconnect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

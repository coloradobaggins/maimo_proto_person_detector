"use client"

import { useEffect } from "react";
import { io } from "socket.io-client";

const NEST_WS_URL = "http://localhost:3001";
const ROOM_NAME = "person-detector-app"

export function useWebSocket(onConfigUpdate: () => void) {
    useEffect(()=> {

        const socket = io(NEST_WS_URL);

        socket.on("connect", () => {
            console.log(`OK! WebSocket conectado al servidor NestJS`);

            // Al conectase, unirse a la room definida
            socket.emit("join", ROOM_NAME)
        });

        socket.on("disconnect", () => {
            console.warn(`WebSocket desconectado del servidor NestJS`);
        });

        // Escuchar evento de config update
        socket.on("config:update", () => {
            console.log(`WebSocket: evento de actualizacion recibida`);
            onConfigUpdate(); // En este evento llamar a la función pasada desde el componente para recargar la config (es el refresh() del Context)
        });


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
        }

        return () => {
            socket.disconnect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

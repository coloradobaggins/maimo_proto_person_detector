"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AppConfig } from "@/types/config";
import { DEFAULT_CONFIG } from "@/lib/defaultConfig";

// ─── Tipos del Context ────────────────────────────────────────────────────────

interface ConfigContextValue {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>; // permite forzar una recarga manual o desde WebSocket
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ConfigContext = createContext<ConfigContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Carga la config con las tres capas de resiliencia ─────────────────────
  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // CAPA 1: intentar fetch al servidor NestJS
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_WS_URL}${process.env.NEXT_PUBLIC_NEST_PATH_CONFIG}`);
      if (!response.ok) throw new Error(`NestJS respondió con status ${response.status}`);
      const data: AppConfig = await response.json();
      console.log("Config cargada desde server central!");

      setConfig(data);
      setIsLoading(false);
      return;
    } catch (nestError) {
      console.warn("Server central no disponible, intentando cargar JSON local...", nestError);
    }

    // CAPA 2: intentar leer el JSON local via API Route de Next
    try {
      const response = await fetch("/api/config");
      if (!response.ok) throw new Error(`API Route respondió con status ${response.status}`);
      const data: AppConfig = await response.json();
      console.log("OK! - Config cargada desde JSON local");
      setConfig(data);
      setIsLoading(false);
      return;
    } catch (localError) {
      console.warn("x - JSON local no disponible, usando config default...", localError);
    }

    // CAPA 3: usar config default hardcodeada
    console.warn("x - Usando config default hardcodeada");
    setError("No se pudo cargar la config externa. Usando valores por defecto.");
    setConfig(DEFAULT_CONFIG);
    setIsLoading(false);
  }, []);

  // Carga inicial al montar
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <ConfigContext.Provider value={{ config, isLoading, error, refresh: loadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

// ─── Hook de consumo ──────────────────────────────────────────────────────────

export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig debe usarse dentro de un <ConfigProvider>");
  }
  return context;
}
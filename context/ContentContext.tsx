"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AppContent } from "@/types/content";

// ─── Fallback default ─────────────────────────────────────────────────────────

const DEFAULT_CONTENT: AppContent = {
  categories: [],
};

// ─── Tipos del Context ────────────────────────────────────────────────────────

interface ContentContextValue {
  content: AppContent;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ContentContext = createContext<ContentContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<AppContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    console.log(`BUSCANDO CONTENIDO CONTEXTPROVIDER..`)

    // CAPA 1: intentar fetch al servidor NestJS
    try {
      const response = await fetch("http://localhost:3001/api/person-detector/content");
      if (!response.ok) throw new Error(`NestJS respondió con status ${response.status}`);
      const data: AppContent = await response.json();
      console.log("OK, CONTENT cargado desde NestJS");
      setContent(data);
      setIsLoading(false);
      return;
    } catch (nestError) {
      console.warn("NestJS no disponible, intentando JSON local...", nestError);
    }

    // CAPA 2: intentar leer el JSON local via API Route de Next
    try {
      const response = await fetch("/api/content");
      if (!response.ok) throw new Error(`API Route respondió con status ${response.status}`);
      const data: AppContent = await response.json();
      console.log("CONTENT cargado desde JSON local");
      setContent(data);
      setIsLoading(false);
      return;
    } catch (localError) {
      console.warn("JSON local no disponible, usando content default...", localError);
    }

    // CAPA 3: usar content default
    console.warn("⚠️ Usando content default vacío");
    setError("No se pudo cargar el contenido externo.");
    setContent(DEFAULT_CONTENT);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <ContentContext.Provider value={{ content, isLoading, error, refresh: loadContent }}>
      {children}
    </ContentContext.Provider>
  );
}

// ─── Hook de consumo ──────────────────────────────────────────────────────────

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent debe usarse dentro de un <ContentProvider>");
  }
  return context;
}
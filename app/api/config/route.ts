//Api route

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// ─── GET /api/config ──────────────────────────────────────────────────────────
// Lee el archivo config/app-config.json del disco y lo devuelve como JSON.
// Se usa cuando el server nestjs no esta disponible

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "config", "app-config.json");
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error leyendo app-config.json:", error);
    return NextResponse.json(
      { error: "No se pudo leer el archivo de configuración" },
      { status: 500 }
    );
  }
}
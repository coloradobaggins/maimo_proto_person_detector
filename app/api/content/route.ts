import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "config", "app-content.json");
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error(" X Error leyendo app-content.json:", error);
    return NextResponse.json(
      { error: "No se pudo leer el archivo de contenido" },
      { status: 500 }
    );
  }
}
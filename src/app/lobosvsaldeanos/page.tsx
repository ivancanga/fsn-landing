"use client";

import Image from "next/image";
import { Logo } from "../styled";
import personajesData from "./personajes.json";

type Personaje = {
  nombre: string;
  tipo: "lobo" | "aldeano";
  habilidad: string;
  foto: string;
};

export default function LobosVsAldeanos() {
  const personajes: Personaje[] = personajesData as Personaje[];

  return (
    <main className="min-h-screen text-white px-6 py-8 mb-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="text-center space-y-3">
          <Logo>
            <h1>FSN</h1>
          </Logo>
          <h2 className="text-4xl font-bold mt-6 uppercase [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">
            Lobos vs Aldeanos
          </h2>
          <p className="text-xl text-white font-semibold max-w-2xl mx-auto [text-shadow:1px_1px_4px_rgba(0,0,0,0.8)]">
            En lo más profundo del bosque, un pequeño poblado de la Patagonia es desde hace algún tiempo, preso del ataque de los hombres lobo...
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personajes.map((personaje, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl hover:border-white/30 transition-all duration-300"
            >
              <div className="flex gap-4 p-4">
                <div className="relative w-1/2 aspect-square flex-shrink-0 rounded-xl overflow-hidden border border-white/20 bg-black/60">
                  <Image
                    src={personaje.foto}
                    alt={personaje.nombre}
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="text-xl font-bold uppercase [text-shadow:1px_1px_4px_rgba(0,0,0,0.8)]">
                    {personaje.nombre}
                  </h3>
                  <span
                    className={`inline-block text-xs uppercase tracking-wider px-2 py-1 rounded-full mt-1 w-fit ${
                      personaje.tipo === "lobo"
                        ? "bg-red-600/80 text-white border border-red-400/30"
                        : "bg-blue-600/80 text-white border border-blue-400/30"
                    }`}
                  >
                    {personaje.tipo}
                  </span>
                </div>
              </div>

              <div className="px-4 pb-4">
                <p className="text-lg font-semibold text-white bg-black/70 px-4 py-2 rounded-xl">
                  {personaje.habilidad}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

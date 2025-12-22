"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface Attempts {
  [key: string]: number | string | null;
}

export default function Stats() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempts>({});
  const [, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, "games", "current");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Attempts;
        setAttempts(data);

        if (data.winner && data.winner !== "") {
          setWinner(data.winner as string);
          router.push("/celebration");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const teams = ["Rojo", "Verde", "Azul", "Amarillo"];

  // clases de color por equipo (texto + resplandor)
  const teamClass: Record<string, string> = {
    Rojo: "text-red-500",
    Verde: "text-green-500",
    Azul: "text-blue-500",
    Amarillo: "text-yellow-400",
  };

  return (
    <div className="h-screen w-screen relative bg-black">
      {/* Título */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-3xl font-bold z-10">
        Intentos por equipo
      </div>

      {/* Imagen central con parpadeo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <Image src="/elritobg.png" alt="El rito de sangre" width={1200} height={800} className="object-contain animate-pulse" priority />
      </div>

      {/* Cuadrantes */}
      <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
        {teams.map((team) => (
          <div key={team} className="flex items-center justify-center border border-white/20">
            <div className={`text-8xl font-bold ${teamClass[team] || ""}`}>
              {attempts[team] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface Attempts {
  [key: string]: number | string | null; // Equipos como claves y valores numéricos (intentos) o string (winner)
}

export default function Stats() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempts>({});
  const [, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, "games", "current");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Attempts;
        setAttempts(data);

        // Redirigir si hay un ganador
        if (data.winner && data.winner !== "") {
          setWinner(data.winner as string);
          router.push("/celebration");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const teams = ["Rojo", "Verde", "Azul", "Amarillo"];
  const teamColors: { [key: string]: string } = {
    Rojo: "bg-red-500",
    Verde: "bg-green-500",
    Azul: "bg-blue-500",
    Amarillo: "bg-yellow-500",
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 w-full text-center text-6xl font-bold text-black bg-white bg-opacity-80 px-4 py-2 rounded-md shadow-md z-50">
        Intentos por equipo
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <img
          src="/diamond.gif"
          alt="Diamond"
          className="w-120 h-120 md:w-120 md:h-120"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
        {teams.map((team) => (
          <div
            key={team}
            className={`flex items-center justify-center ${
              teamColors[team] || "bg-gray-500"
            } transition-transform duration-300 transform`}
          >
            <div className="text-[200px] font-bold text-white p-4 animate-pulse">
              {attempts[team] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

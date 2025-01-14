"use client";

import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Celebration() {
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const fetchWinner = async () => {
      const docRef = doc(db, "games", "current");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setWinner(data.winner || ""); // Establece el equipo ganador
      } else {
        console.error("Documento no encontrado");
      }
    };

    fetchWinner();
  }, []);

  // Mapeo de colores según el equipo ganador
  const teamColors: { [key: string]: string } = {
    Rojo: "bg-red-500",
    Verde: "bg-green-500",
    Azul: "bg-blue-500",
    Amarillo: "bg-yellow-500",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${
        winner ? teamColors[winner] || "bg-gray-500" : "bg-gray-100"
      }`}
    >
      {winner ? (
        <>
          <h1 className="text-8xl font-bold text-white mb-4">
            ¡Felicidades al equipo {winner}! 🎉
          </h1>
          <p className="text-4xl text-white mb-16">¡Gracias a todos por participar!</p>
          <img
            src="/diamond.gif"
            alt="Diamond"
            className="w-80 h-80 animate-bounce"
          />
        </>
      ) : (
        <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
      )}
    </div>
  );
}

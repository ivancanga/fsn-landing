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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      {winner ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            ¡Felicidades al equipo {winner}! 🎉
          </h1>
          <p className="text-xl">¡Gracias a todos por participar!</p>
        </>
      ) : (
        <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
      )}
    </div>
  );
}

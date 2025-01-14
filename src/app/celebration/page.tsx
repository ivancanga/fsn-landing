"use client";

import { useEffect, useState } from "react";
import { useWindowSize } from "react-use"; // Para manejar el tamaño dinámico de la ventana
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import ReactConfetti from "react-confetti"; // Importa React-Confetti

export default function Celebration() {
  const [winner, setWinner] = useState<string | null>(null);
  const { width, height } = useWindowSize(); // Obtiene el tamaño de la ventana para el confeti

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
      className={`relative flex flex-col items-center justify-center h-screen w-full ${
        winner ? teamColors[winner] || "bg-gray-500" : "bg-gray-100"
      }`}
    >
      {/* Confeti */}
      {winner && <ReactConfetti width={width} height={height} recycle={true} />}

      {winner ? (
        <>
          {/* Texto del título, adaptativo */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-[180px] font-bold text-white text-center mb-4">
            ¡Felicidades al equipo {winner}! 🎉
          </h1>

          {/* Texto del subtítulo, adaptativo */}
          <p className="text-xl md:text-3xl lg:text-5xl xl:text-8xl text-white mb-8">
            ¡Gracias a todos por participar!
          </p>

          {/* Imagen del diamante */}
          <img
            src="/diamond.gif"
            alt="Diamond"
            className="w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 animate-bounce"
          />
        </>
      ) : (
        <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
      )}
    </div>
  );
}

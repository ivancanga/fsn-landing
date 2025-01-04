"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "../../utils/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { PasswordContaianer } from "../styled";

const secretCode = "123456"; // Código secreto que los equipos deben adivinar

export default function Game() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const team = searchParams.get("team"); // Obtén el equipo de los parámetros de búsqueda
  const [code, setCode] = useState("");

  const handleKeyPress = (key: string) => {
    if (code.length < 6) setCode(code + key);
  };

  const handleSubmit = async () => {
    if (!team || code.length !== 6) {
      alert("Debes ingresar un código de 6 dígitos.");
      return;
    }

    const docRef = doc(db, "games", "current");

    if (code === secretCode) {
      try {
        // Actualiza el campo `winner` en Firestore con el equipo ganador
        await updateDoc(docRef, { winner: team });

        // Redirige a la página de celebración
        router.push("/celebration");
      } catch (error) {
        console.error("Error al actualizar el ganador:", error);
        alert("Hubo un error al procesar el intento.");
      }
    } else {
      try {
        // Incrementa los intentos para el equipo
        await updateDoc(docRef, {
          [`${team}`]: increment(1),
        });
        alert(`Intento incorrecto: ${code}`);
      } catch (error) {
        console.error("Error al actualizar los intentos:", error);
        alert("Hubo un error al enviar el intento.");
      }
    }
    setCode("");
  };

  type TeamType = "rojo" | "verde" | "azul" | "amarillo";

  const teamColors: Record<TeamType, string> = {
    rojo: "bg-red-500",
    verde: "bg-green-500",
    azul: "bg-blue-500",
    amarillo: "bg-yellow-500",
  };

  const teamColorClass =
    team && teamColors[team.toLowerCase() as TeamType]
      ? teamColors[team.toLowerCase() as TeamType]
      : "bg-gray-500";

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1
        className={`text-3xl font-bold mb-8 p-4 text-white rounded ${teamColorClass} uppercase w-80 text-center`}
      >
        Equipo {team}
      </h1>
      <PasswordContaianer className="mb-4">
        {code || "******"}
      </PasswordContaianer>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className="p-4 bg-white text-black text-8xl rounded-lg font-black digital-key"
            onClick={() => handleKeyPress(num.toString())}
          >
            {num}
          </button>
        ))}
        <button
          className="p-4 bg-red-500 text-black rounded-lg digital-key"
          onClick={() => setCode("")}
        ></button>
        <button
          className="p-4 bg-white text-black text-8xl rounded-lg font-black digital-key"
          onClick={() => handleKeyPress("0")}
        >
          0
        </button>
        <button
          className="p-4 bg-green-500 text-black rounded-lg digital-key"
          onClick={handleSubmit}
        ></button>
      </div>
    </div>
  );
}

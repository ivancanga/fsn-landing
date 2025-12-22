"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "../../utils/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { PasswordContaianer } from "../styled";

const secretCode = "890782";

export default function Game() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const team = searchParams.get("team");
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
        await updateDoc(docRef, { winner: team });
        router.push("/celebration");
      } catch (error) {
        console.error("Error al actualizar el ganador:", error);
        alert("Hubo un error al procesar el intento.");
      }
    } else {
      try {
        await updateDoc(docRef, { [`${team}`]: increment(1) });
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
    rojo: "bg-red-700",
    verde: "bg-green-700",
    azul: "bg-blue-700",
    amarillo: "bg-yellow-600",
  };

  const teamColorClass =
    team && teamColors[team.toLowerCase() as TeamType]
      ? teamColors[team.toLowerCase() as TeamType]
      : "bg-gray-700";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className={`text-3xl font-bold mb-8 p-4 text-white rounded uppercase w-80 text-center ${teamColorClass}`}>
        Equipo {team}
      </h1>

      <PasswordContaianer className="mb-6">
        {code || "******"}
      </PasswordContaianer>

      <div className="grid grid-cols-3 gap-3 mb-4 w-[22rem] max-w-[90vw]">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className="digital-key"
            onClick={() => handleKeyPress(num.toString())}
          >
            {num}
          </button>
        ))}

        {/* Clear */}
        <button
          className="digital-key"
          aria-label="Borrar"
          onClick={() => setCode("")}
        />

        {/* 0 */}
        <button
          className="digital-key"
          onClick={() => handleKeyPress("0")}
        >
          0
        </button>

        {/* Submit */}
        <button
          className="digital-key"
          aria-label="Enviar"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

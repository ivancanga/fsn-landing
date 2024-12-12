"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, Diagonal, DiagonalInverted } from "./styled";

const teams = ["Rojo", "Verde", "Azul", "Amarillo"];

export default function Home() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Actualiza el contador cada segundo
  useEffect(() => {
    const targetDate = new Date("2025-01-17T21:30:00"); // Fecha objetivo

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("¡El evento ha comenzado!");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${days} días<br />${hours} horas, ${minutes} minutos`
      );
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  const handleTeamSelect = (team: string) => {
    router.push(`/game?team=${team}`);
  };

  return (
    <div className="flex flex-col items-center h-screen bg-black text-white">
      <Logo>
        <h1>FSN 7</h1>
      </Logo>
      <DiagonalInverted />
      <div className="bg-white text-black w-full text-left">
        <h2 dangerouslySetInnerHTML={{ __html: timeLeft }} />
      </div>
      <Diagonal />
      <h2 className="text-2xl font-bold mb-6">Selecciona tu equipo</h2>
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team) => (
          <button
            key={team}
            className={`p-4 rounded-lg text-white font-bold ${team.toLowerCase()}-bg`}
            onClick={() => handleTeamSelect(team)}
          >
            {team}
          </button>
        ))}
      </div>
      <style jsx>{`
        .rojo-bg {
          background-color: #f87171;
        }
        .verde-bg {
          background-color: #34d399;
        }
        .azul-bg {
          background-color: #60a5fa;
        }
        .amarillo-bg {
          background-color: #facc15;
        }
      `}</style>
    </div>
  );
}

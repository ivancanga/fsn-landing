"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<string>(""); // Estado del tiempo restante
  const [hasEventStarted, setHasEventStarted] = useState(false); // Estado para saber si el evento comenzó
  const teams = ["Rojo", "Verde", "Azul", "Amarillo"]; // Lista de equipos

  const router = useRouter();

  const handleTeamSelect = (team: string) => {
    router.push(`/game?team=${team}`);
  };

  // Actualiza el contador cada segundo
  useEffect(() => {
    const targetDate = new Date("2025-01-17T21:30:00"); // Fecha objetivo

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setHasEventStarted(true); // Marca que el evento ya comenzó
        setTimeLeft("¡El evento ha comenzado!");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      setTimeLeft(`${days} días<br />${hours} horas, ${minutes} minutos`);
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-black w-full text-center">
      {!hasEventStarted ? (
        <h2 dangerouslySetInnerHTML={{ __html: timeLeft }} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Seleccioná tu equipo</h2>
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
        </>
      )}
    </div>
  );
};

export default Countdown;

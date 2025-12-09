"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [hasEventStarted, setHasEventStarted] = useState(false);
  const teams = ["Rojo", "Verde", "Azul", "Amarillo"];

  const router = useRouter();

  const handleTeamSelect = (team: string) => {
    router.push(`/game?team=${team}`);
  };

  useEffect(() => {
    const targetDate = new Date("2026-01-17T12:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setHasEventStarted(true);
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
    <div className="text-white w-full text-center">
      {!hasEventStarted ? (
        <h2 dangerouslySetInnerHTML={{ __html: timeLeft }} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Seleccioná tu equipo</h2>

          <div className="grid grid-cols-2 gap-4">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => handleTeamSelect(team)}
                className={`rounded-lg text-white font-bold
                            text-xl md:text-xl              /* nombres más grandes */
                            h-36 flex items-center justify-center /* más cuadrados */
                            shadow-lg ${team.toLowerCase()}-bg`}
              >
                {team}
              </button>
            ))}
          </div>

          <style jsx>{`
            .rojo-bg {
              background-color: rgba(248, 113, 113, 0.8); /* #f87171 */
            }
            .verde-bg {
              background-color: rgba(52, 211, 153, 0.8); /* #34d399 */
            }
            .azul-bg {
              background-color: rgba(96, 165, 250, 0.8); /* #60a5fa */
            }
            .amarillo-bg {
              background-color: rgba(250, 204, 21, 0.8); /* #facc15 */
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Countdown;

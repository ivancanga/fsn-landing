"use client";

import { useRouter } from 'next/navigation';

const teams = ['Rojo', 'Verde', 'Azul', 'Amarillo'];

export default function Home() {
  const router = useRouter();

  const handleTeamSelect = (team: string) => {
    router.push(`/game?team=${team}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Selecciona tu equipo</h1>
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team) => (
          <button
            key={team}
            className={`p-4 rounded-lg text-white font-bold ${
              team.toLowerCase()
            }-bg`}
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

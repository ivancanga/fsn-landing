"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Logo } from "../styled";

type CheckInData = {
  id: string;
  name: string;
  team: string;
  photo?: string;
};

const teamConfig = [
  {
    id: "Rojo",
    label: "Equipo Rojo",
    gradient: "from-[#941010] via-[#ef4444] to-[#fb923c]",
  },
  {
    id: "Verde",
    label: "Equipo Verde",
    gradient: "from-[#0f8a5e] via-[#22c55e] to-[#6ee7b7]",
  },
  {
    id: "Azul",
    label: "Equipo Azul",
    gradient: "from-[#0f3460] via-[#2563eb] to-[#93c5fd]",
  },
  {
    id: "Amarillo",
    label: "Equipo Amarillo",
    gradient: "from-[#92400e] via-[#f59e0b] to-[#fde68a]",
  },
];

export default function TeamsPage() {
  const [checkins, setCheckins] = useState<Record<string, CheckInData[]>>({});

  useEffect(() => {
    const fetchCheckins = async () => {
      const snapshot = await getDocs(collection(db, "checkins"));
      const grouped = teamConfig.reduce<Record<string, CheckInData[]>>((acc, team) => {
        acc[team.id] = [];
        return acc;
      }, {});

      snapshot.forEach((doc) => {
        const data = doc.data();
        const team = data.team as string;
        if (grouped[team]) {
          grouped[team].push({
            id: doc.id,
            name: data.name ?? "Sin nombre",
            team,
            photo: data.photo,
          });
        }
      });

      setCheckins(grouped);
    };

    fetchCheckins();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white px-6 py-0">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <Logo>
            <h1>FSN</h1>
          </Logo>

        <div className="grid gap-6 lg:grid-cols-2">
          {teamConfig.map((team) => {
            const items = checkins[team.id] ?? [];
            return (
              <section
                key={team.id}
                className={`h-56 rounded-3xl border border-white/20 bg-gradient-to-b ${team.gradient} bg-opacity-80 p-2 shadow-2xl overflow-hidden`}
              >
                <div className="h-48 overflow-hidden">
                  <div className="flex gap-3 h-full flex-nowrap overflow-x-auto snap-x snap-mandatory px-2 max-w-full">
                    {items.length ? (
                      items.map((player) => (
                        <article
                          key={player.id}
                          className="snap-center flex-shrink-0 min-w-[11rem] h-full rounded-3xl border border-white/20 bg-black/40 shadow-lg shadow-black/50 overflow-hidden flex flex-col max-h-full"
                        >
                          <div className="h-4/5 w-full overflow-hidden">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                                Foto pendiente
                              </div>
                            )}
                          </div>
                          <div className="h-1/5 flex items-center justify-center px-3 text-center">
                            <p className="text-sm font-semibold">{player.name}</p>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="flex-shrink-0 min-w-full h-full rounded-3xl border border-white/20 bg-black/40 flex items-center justify-center text-sm text-gray-300">
                        Esperando jugadores...
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

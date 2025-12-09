"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Logo } from "../styled";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type CheckInData = {
  id: string;
  name: string;
  team: string;
  photo?: string;
};

const teamsMeta = [
  { id: "Rojo", label: "Equipo Rojo", gradient: "from-[#941010] via-[#ef4444] to-[#fb923c]" },
  { id: "Verde", label: "Equipo Verde", gradient: "from-[#0f8a5e] via-[#22c55e] to-[#6ee7b7]" },
  { id: "Azul", label: "Equipo Azul", gradient: "from-[#0f3460] via-[#2563eb] to-[#93c5fd]" },
  { id: "Amarillo", label: "Equipo Amarillo", gradient: "from-[#92400e] via-[#f59e0b] to-[#fde68a]" },
];

const TeamCarousel = ({ players }: { players: CheckInData[] }) => {
  const autoplayPlugin = useMemo(() => {
    return players.length >= 2 ? Autoplay({ delay: 2300, stopOnInteraction: false }) : undefined;
  }, [players.length]);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
    },
    autoplayPlugin ? [autoplayPlugin] : []
  );

  if (players.length === 0) {
    return (
      <div className="h-full flex items-center justify-center rounded-3xl border border-white/20 bg-black/40">
        <span className="text-sm text-gray-300">Esperando jugadores...</span>
      </div>
    );
  }

  if (players.length === 1) {
    const player = players[0];
    return (
      <div className="h-full flex items-center justify-center">
        <article className="w-[11rem] h-full rounded-3xl border border-white/30 bg-black/60 shadow-xl overflow-hidden flex flex-col">
          <div className="relative h-4/5 w-full overflow-hidden">
            {player.photo ? (
              <Image
                src={player.photo}
                alt={player.name}
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                Foto pendiente
              </div>
            )}
          </div>
          <div className="h-1/5 flex items-center justify-center px-2 text-center min-h-[20px]">
            <p className="text-sm font-semibold">{player.name}</p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden" ref={emblaRef}>
      <div className="flex h-full gap-3">
        {players.map((player) => (
          <article
            key={player.id}
            className="flex-shrink-0 w-[11rem] h-full rounded-3xl border border-white/30 bg-black/60 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="relative h-4/5 w-full overflow-hidden">
              {player.photo ? (
                <Image
                  src={player.photo}
                  alt={player.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                  Foto pendiente
                </div>
              )}
            </div>
            <div className="h-1/5 flex items-center justify-center px-2 text-center min-h-[20px]">
              <p className="text-sm font-semibold">{player.name}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default function TeamsPage() {
  const [checkins, setCheckins] = useState<CheckInData[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "checkins"), (snapshot) => {
      const data: CheckInData[] = [];
      snapshot.forEach((doc) => {
        const entry = doc.data();
        data.push({
          id: doc.id,
          name: entry.name ?? "Sin nombre",
          team: entry.team,
          photo: entry.photo,
        });
      });
      setCheckins(data);
    });

    return () => unsubscribe();
  }, []);

  const playersByTeam = useMemo(() => {
    const grouped: Record<string, CheckInData[]> = {
      Rojo: [],
      Verde: [],
      Azul: [],
      Amarillo: [],
    };

    checkins.forEach((player) => {
      if (grouped[player.team]) {
        grouped[player.team].push(player);
      }
    });

    return grouped;
  }, [checkins]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="text-center space-y-3">
          <Logo>
            <h1>FSN</h1>
          </Logo>
          <p className="text-sm uppercase tracking-[0.6em] text-white/60">Check-ins confirmados</p>
          <h2 className="text-3xl font-semibold">Equipos y llegadas</h2>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {teamsMeta.map((team) => (
            <section
              key={team.id}
              className={`h-64 rounded-3xl border border-white/20 bg-gradient-to-b ${team.gradient} bg-opacity-80 p-4 shadow-2xl overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Equipo</p>
                  <h3 className="text-xl font-semibold uppercase tracking-[0.2em]">{team.label}</h3>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {playersByTeam[team.id]?.length ?? 0} jugadores
                </span>
              </div>
              <div className="h-48">
                <TeamCarousel players={playersByTeam[team.id] ?? []} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

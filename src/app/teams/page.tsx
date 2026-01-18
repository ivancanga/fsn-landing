"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Logo } from "../styled";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type Player = {
  name: string;
  photo?: string;
  createdAt?: string;
};

const teamsMeta = [
  { id: "Rojo", label: "Equipo Rojo", gradient: "from-[#941010] via-[#ef4444] to-[#fb923c]" },
  { id: "Verde", label: "Equipo Verde", gradient: "from-[#0f8a5e] via-[#22c55e] to-[#6ee7b7]" },
  { id: "Azul", label: "Equipo Azul", gradient: "from-[#0f3460] via-[#2563eb] to-[#93c5fd]" },
  { id: "Amarillo", label: "Equipo Amarillo", gradient: "from-[#92400e] via-[#f59e0b] to-[#fde68a]" },
];

const TeamCarousel = ({ players }: { players: Player[] }) => {
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
        <span className="text-xl text-gray-300">Aún no hay jugadores...</span>
      </div>
    );
  }

  if (players.length === 1) {
    const player = players[0];
    return (
      <div className="h-full flex items-center justify-center">
        <article className="w-[9rem] h-full rounded-3xl border border-white/30 bg-black/60 shadow-xl overflow-hidden flex flex-col">
          <div className="relative h-[85%] w-full overflow-hidden">
            {player.photo ? (
              <Image
                src={player.photo}
                alt={player.name}
                fill
                sizes="144px"
                className="object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                Foto pendiente
              </div>
            )}
          </div>
          <div className="h-[15%] flex items-center justify-center px-2 text-center min-h-[20px]">
            <p className="text-base font-bold uppercase">{player.name}</p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <>
      {/* Carrusel para móvil/tablet */}
      <div className="h-full overflow-hidden lg:hidden" ref={emblaRef}>
        <div className="flex h-full">
          {players.map((player, index) => (
            <article
              key={`${player.name}-${index}`}
              className="flex-shrink-0 w-[9rem] h-full rounded-3xl border border-white/30 bg-black/60 shadow-xl overflow-hidden flex flex-col mr-3"
            >
              <div className="relative h-[85%] w-full overflow-hidden">
                {player.photo ? (
                  <Image
                    src={player.photo}
                    alt={player.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                    Foto pendiente
                  </div>
                )}
              </div>
              <div className="h-[15%] flex items-center justify-center px-2 text-center min-h-[20px]">
                <p className="text-base font-bold uppercase">{player.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Grid para desktop - muestra todos los jugadores */}
      <div className="hidden lg:flex h-full gap-3">
        {players.map((player, index) => (
          <article
            key={`${player.name}-${index}`}
            className="flex-shrink-0 h-full aspect-[3/5] rounded-3xl border border-white/30 bg-black/60 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="relative h-[85%] w-full overflow-hidden">
              {player.photo ? (
                <Image
                  src={player.photo}
                  alt={player.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                  Foto pendiente
                </div>
              )}
            </div>
            <div className="h-[15%] flex items-center justify-center px-2 text-center min-h-[20px]">
              <p className="text-base font-bold uppercase truncate">{player.name}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default function TeamsPage() {
  const [playersByTeam, setPlayersByTeam] = useState<Record<string, Player[]>>({
    Rojo: [],
    Verde: [],
    Azul: [],
    Amarillo: [],
  });

  const [scoresByTeam, setScoresByTeam] = useState<Record<string, number>>({
    Rojo: 0,
    Verde: 0,
    Azul: 0,
    Amarillo: 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const grouped: Record<string, Player[]> = {
        Rojo: [],
        Verde: [],
        Azul: [],
        Amarillo: [],
      };

      const scores: Record<string, number> = {
        Rojo: 0,
        Verde: 0,
        Azul: 0,
        Amarillo: 0,
      };

      snapshot.forEach((doc) => {
        const teamId = doc.id;
        const teamData = doc.data();
        const teamName = teamId.charAt(0).toUpperCase() + teamId.slice(1);

        console.log('Team ID:', teamId, 'Team Name:', teamName, 'Score:', teamData.score);

        if (grouped[teamName] !== undefined) {
          grouped[teamName] = teamData.players || [];
          scores[teamName] = teamData.score || 0;
        }
      });

      console.log('Final scores:', scores);

      setPlayersByTeam(grouped);
      setScoresByTeam(scores);
    });

    return () => unsubscribe();
  }, []);

  const sortedTeams = useMemo(() => {
    return [...teamsMeta].sort((a, b) => {
      const scoreA = scoresByTeam[a.id] || 0;
      const scoreB = scoresByTeam[b.id] || 0;
      return scoreB - scoreA;
    });
  }, [scoresByTeam]);

  const maxPlayers = useMemo(() => {
    return Math.max(...Object.values(playersByTeam).map(players => players.length), 1);
  }, [playersByTeam]);

  return (
    <main className="min-h-screen text-white px-6 mb-24">
      {/* Layout mobile y tablet */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 lg:hidden">
        <header className="text-center space-3">
          <Logo>
            <h1>FSN</h1>
          </Logo>
        </header>

        <div className="grid gap-6">
          {sortedTeams.map((team) => (
            <section
              key={team.id}
              className={`rounded-3xl border border-white/20 bg-gradient-to-b ${team.gradient} bg-opacity-80 p-4 shadow-2xl overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/90">{team.label}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {playersByTeam[team.id]?.length ?? 0} jugadores
                </span>
              </div>
              <div className="h-48">
                <TeamCarousel players={playersByTeam[team.id] ?? []} />
              </div>
              <div className="mt-3 text-center">
                <p className="text-4xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{scoresByTeam[team.id]} puntos</p>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Layout desktop: una fila por equipo, ancho completo */}
      <div className="hidden lg:block w-full h-screen px-8 py-4 relative">
        {/* Logo FSN - Desktop */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
          <Logo>
            <h1>FSN</h1>
          </Logo>
        </div>

        <div className="flex flex-col h-full gap-4">
          {sortedTeams.map((team) => {
            const currentPlayers = playersByTeam[team.id] ?? [];
            const emptySlots = maxPlayers - currentPlayers.length;

            return (
              <div key={team.id} className="flex-1 flex items-center justify-center">
                <section
                  className={`inline-flex rounded-3xl border border-white/20 bg-gradient-to-r ${team.gradient} bg-opacity-80 p-4 shadow-2xl h-full`}
                >
                  <div className="flex items-center gap-6 h-full">
                    {/* Info del equipo - izquierda */}
                    <div className="flex-shrink-0 w-44">
                      <p className="text-xl font-bold uppercase tracking-wider text-white mb-1">{team.label}</p>
                      <span className="text-xs uppercase tracking-wider text-white/80">
                        {currentPlayers.length} jugadores
                      </span>
                    </div>

                    {/* Carrusel de jugadores - centro */}
                    <div className="flex-shrink-0 h-full flex gap-3">
                      <TeamCarousel players={currentPlayers} />
                      {/* Espacios vacíos para igualar el ancho */}
                      {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="flex-shrink-0 h-full aspect-[3/5] rounded-3xl border border-white/10 bg-black/20"
                        />
                      ))}
                    </div>

                    {/* Puntaje - derecha */}
                    <div className="flex-shrink-0 w-28 flex flex-col items-start justify-center pl-4">
                      <p className="text-7xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none">{scoresByTeam[team.id]}</p>
                      <p className="text-2xl font-bold uppercase tracking-wider text-white/90 mt-1">puntos</p>
                    </div>
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

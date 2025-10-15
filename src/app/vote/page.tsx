"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { db } from "../../utils/firebase";
import styles from "./vote-bloody.module.css";

const STORAGE_KEY = "fsnVoteParticipant";

// IDs de participantes definidos en la BD
const PARTICIPANT_IDS = [
  "participante1",
  "participante2",
  "participante3",
  "participante4",
] as const;

type ParticipantId = (typeof PARTICIPANT_IDS)[number];
type ParticipantNode = {
  name?: string;
  description?: string;
  votes?: number;
};
type VoteDoc = {
  mostrarResultados?: boolean;
} & Partial<Record<ParticipantId, ParticipantNode>>;

type SyncState = "connecting" | "ready" | "syncing";

export default function VotePage() {
  const [syncState, setSyncState] = useState<SyncState>("connecting");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const voteDocRef = useMemo(() => doc(db, "votation", "current"), []);
  const [showResults, setShowResults] = useState(false);
  const [votesMap, setVotesMap] = useState<Record<string, number>>({});
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [descMap, setDescMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedVote = window.localStorage.getItem(STORAGE_KEY);
    if (storedVote) {
      setSelectedId(storedVote);
      setHasVoted(true);
      setSyncState("ready");
      return;
    }

    const timer = window.setTimeout(() => {
      setSyncState("ready");
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(voteDocRef, (snapshot) => {
      const data = snapshot.data() as VoteDoc | undefined;

      if (data) {
        setShowResults(Boolean(data?.mostrarResultados));

        let total = 0;
        const vMap: Record<string, number> = {};
        const nMap: Record<string, string> = {};
        const dMap: Record<string, string> = {};
        for (const id of PARTICIPANT_IDS) {
          const node = data?.[id];
          const name = typeof node?.name === "string" && node.name.trim() !== "" ? node.name : id;
          const votes = typeof node?.votes === "number" ? node.votes : 0;
          const desc = typeof node?.description === "string" ? node.description : "";
          nMap[id] = name;
          vMap[id] = votes;
          dMap[id] = desc;
          total += votes;
        }
        setNameMap(nMap);
        setDescMap(dMap);
        setVotesMap(vMap);
        setTotalVotes(total);
      } else {
        setTotalVotes(0);
        setVotesMap({});
        setNameMap({});
        setDescMap({});
        setShowResults(false);
      }
    });

    return () => unsubscribe();
  }, [voteDocRef]);

  const statusMessage = useMemo(() => {
    if (syncState === "connecting") return "Conectando con base de datos...";
    if (syncState === "syncing") return "Sincronizando voto...";
    if (hasVoted) return "Voto registrado. Podés cambiarlo cuando quieras.";
    return "Listo para votar";
  }, [syncState, hasVoted]);

  const handleVote = async (optionId: string) => {
    if (syncState === "syncing") return;

    const previousId = selectedId;
    if (previousId === optionId) return;

    setSelectedId(optionId);
    setSyncState("syncing");

    try {
      await runTransaction(db, async (trx) => {
        const snap = await trx.get(voteDocRef);
        const data = (snap.exists() ? (snap.data() as VoteDoc) : undefined);

        const getVotes = (id: string) => {
          const node = data?.[id as ParticipantId];
          const val = node && typeof node.votes === "number" ? node.votes : 0;
          return Math.max(0, val);
        };

        const updates: Record<string, number | string> = {};

        // Ensure names exist for both participants we touch
        const ensureName = (id: string) => {
          const currentName = data?.[id as ParticipantId]?.name;
          if (typeof currentName !== "string" || currentName.trim() === "") {
            updates[`${id}.name`] = nameMap[id] ?? id;
          }
        };

        // Increment new selection
        const nextCount = getVotes(optionId) + 1;
        updates[`${optionId}.votes`] = nextCount;
        ensureName(optionId);

        // Decrement previous only if > 0
        if (previousId) {
          const prevCount = getVotes(previousId);
          const newPrev = prevCount > 0 ? prevCount - 1 : 0;
          updates[`${previousId}.votes`] = newPrev;
          ensureName(previousId);
        }

        if (snap.exists()) {
          trx.update(voteDocRef, updates);
        } else {
          trx.set(voteDocRef, updates, { merge: true });
        }
      });
      window.localStorage.setItem(STORAGE_KEY, optionId);
      setHasVoted(true);
      setSyncState("ready");
    } catch (error) {
      console.error("Error al registrar el voto:", error);
      alert("No se pudo registrar tu voto. Intenta de nuevo.");
      if (previousId) {
        setSelectedId(previousId);
        window.localStorage.setItem(STORAGE_KEY, previousId);
      } else {
        setSelectedId(null);
        window.localStorage.removeItem(STORAGE_KEY);
        setHasVoted(false);
      }
      setSyncState("ready");
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.brand}>FSN</div>
        <div className={styles.titleBlock}>
          <span className={styles.kicker}>EL RITO</span>
          <h1 className={styles.pageTitle}>Votación de outfit</h1>
        </div>
      </header>

      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>Votos registrados: {totalVotes}</h1>
      </div>

      <h3></h3>

      <div className={styles.statusBar} data-state={syncState}>
        <span className={styles.pulsingDot} aria-hidden />
        <span>{statusMessage}</span>
      </div>

      <main className={styles.content}>
        <p className={styles.intro}>
          Elegí a un participante para apoyarlo con su outfit/makeup. Podrás cambiar tu voto antes de que cierre la votación. Evitá elegir solo porque es de tu equipo, votá por el que más de guste y reconozcamos su esfuerzo 😉. El ganador se lleva 5 puntos al equipo.
        </p>

        <div className={styles.grid}>
          {(showResults
            ? [...PARTICIPANT_IDS].sort(
                (a, b) => (votesMap[b as string] ?? 0) - (votesMap[a as string] ?? 0)
              )
            : PARTICIPANT_IDS
          ).map((id: ParticipantId) => {
            const isSelected = id === selectedId;
            const count = Math.max(0, Number(votesMap[id] ?? 0));
            const name = nameMap[id] ?? id;
            const desc = descMap[id] ?? "";
            const index = PARTICIPANT_IDS.indexOf(id);
            const badge = `Participante ${index >= 0 ? index + 1 : ""}`;
            return (
              <button
                key={id}
                type="button"
                className={`${styles.card} ${
                  isSelected ? styles.cardSelected : ""
                }`}
                onClick={() => handleVote(id)}
                disabled={syncState === "syncing"}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardBadge}>{badge}</span>
                  <h2 className={styles.cardTitle}>{name}</h2>
                </div>
                <p className={styles.cardDescription}>{desc}</p>
                {showResults && (
                  <div className={styles.cardCount}>{count} votos</div>
                )}
                <div className={styles.cardFooter}>
                  {isSelected ? "Seleccion actual" : "Elegir participante"}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

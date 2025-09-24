"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import styles from "./stats-bloody.module.css";

interface Attempts {
  [key: string]: number | string | null;
}

export default function Stats() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempts>({});
  const [, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, "games", "current");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Attempts;
        setAttempts(data);

        if (data.winner && data.winner !== "") {
          setWinner(data.winner as string);
          router.push("/celebration");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const teams = ["Rojo", "Verde", "Azul", "Amarillo"];

  // clases de color por equipo (texto + resplandor)
  const teamClass: Record<string, string> = {
    Rojo: styles.rojo,
    Verde: styles.verde,
    Azul: styles.azul,
    Amarillo: styles.amarillo,
  };

  return (
    <div className={`${styles.wrapper} h-screen w-screen relative`}>
      {/* Título */}
      <div className={`${styles.title} absolute top-4 left-1/2 -translate-x-1/2`}>
        Intentos por equipo
      </div>

      {/* Imagen central con parpadeo */}
      <div className={`${styles.centerImgWrap}`}>
        <img src="/elritobg.png" alt="El rito de sangre" className={styles.centerImg} />
      </div>

      {/* Cuadrantes */}
      <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
        {teams.map((team) => (
          <div key={team} className={styles.quad}>
            <div className={`${styles.count} ${teamClass[team] || ""}`}>
              {attempts[team] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

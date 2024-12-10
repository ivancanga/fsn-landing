"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Stats() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<any>({});
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, "games", "current");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setAttempts(data);

        // Redirigir si hay un ganador
        if (data.winner && data.winner !== "") {
          setWinner(data.winner);
          router.push("/celebration");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Filtra el campo "winner" para no mostrarlo en la lista
  const filteredAttempts = Object.keys(attempts).reduce((acc, key) => {
    if (key !== "winner") acc[key] = attempts[key];
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Intentos por equipo</h1>
      <ul className="list-disc">
        {Object.keys(filteredAttempts).map((team) => (
          <li key={team}>
            {team}: {filteredAttempts[team]}
          </li>
        ))}
      </ul>
    </div>
  );
}

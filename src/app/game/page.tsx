"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // App Router
import { checkWinner } from "../../utils/checkWinner";
import GameComponent from "./component";

export default function GamePage() {
  const router = useRouter(); // Usa el router del cliente
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyWinner = async () => {
      await checkWinner(() => {
        router.push("/celebration"); // Redirige a celebración
      });
      setLoading(false); // Continúa cargando la página si no hay ganador
    };

    verifyWinner();
  }, [router]);

  if (loading) return <div>Cargando...</div>;

  return (
    <Suspense fallback={<div>Cargando juego...</div>}>
      <GameComponent />
    </Suspense>
  );
}

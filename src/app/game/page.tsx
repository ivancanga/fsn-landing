"use client";

import { Suspense } from "react";
import GameComponent from "./component";

export default function GamePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <GameComponent />
    </Suspense>
  );
}

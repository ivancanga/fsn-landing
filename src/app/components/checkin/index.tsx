"use client";

import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../utils/firebase";
import { useRouter } from "next/navigation";
import { Logo } from "../../styled";

const teamColors = {
  Rojo: "#ef4444",
  Verde: "#22c55e",
  Azul: "#3b82f6",
  Amarillo: "#facc15",
};

// Cambia esto a false para deshabilitar la validación de check-in duplicado
const ENABLE_CHECK_IN_VALIDATION = false;

const CheckIn = () => {
  const router = useRouter();
  const teams = useMemo(() => Object.keys(teamColors), []);
  const [playerName, setPlayerName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (ENABLE_CHECK_IN_VALIDATION) {
      const hasRegistered = sessionStorage.getItem("hasCheckedIn");
      if (hasRegistered === "true") {
        router.push("/teams");
      }
    }
  }, [router]);

  const canRegister = !!playerName.trim() && !!selectedTeam && !!photoFile && !isRedirecting;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPhotoPreview(result);
      }
    };
    reader.readAsDataURL(file);
    setPhotoFile(file);
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
    setHasSpun(true);
    const randomIndex = Math.floor(Math.random() * teams.length);
    const segmentAngle = 360 / teams.length;
    const extraSpins = 5;

    // La flecha apunta arriba (0°), entonces necesitamos que el centro del segmento seleccionado esté en 0°
    // Cada segmento va: Rojo (0-90), Verde (90-180), Azul (180-270), Amarillo (270-360)
    // Para que el centro del segmento quede arriba, rotamos negativamente
    const segmentCenter = randomIndex * segmentAngle + segmentAngle / 2;
    const targetRotation = extraSpins * 360 - segmentCenter;

    setRotation(targetRotation);

    setTimeout(() => {
      setSelectedTeam(teams[randomIndex]);
      setIsSpinning(false);
    }, 3500);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canRegister) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const safeName = playerName.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "jugador";
      let photoUrl: string | null = null;

      if (photoFile) {
        const teamPath = selectedTeam ?? "sinEquipo";
        const storageRef = ref(storage, `checkins/${teamPath}/${Date.now()}_${safeName}.jpg`);
        const uploadResult = await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(uploadResult.ref);
      }

      const teamId = selectedTeam!.toLowerCase();
      const teamDocRef = doc(db, "teams", teamId);

      await updateDoc(teamDocRef, {
        players: arrayUnion({
          name: playerName.trim(),
          photo: photoUrl,
          createdAt: new Date().toISOString(),
        }),
      });

      if (ENABLE_CHECK_IN_VALIDATION) {
        sessionStorage.setItem("hasCheckedIn", "true");
      }
      setStatusMessage("¡Check-in completado! Redirigiendo...");
      setIsRedirecting(true);

      setTimeout(() => {
        router.push("/teams");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar check-in", error);
      setStatusMessage("No pudimos registrar tu check-in. Reintentá en un rato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-0 w-full max-w-4xl mx-auto bg-white/5 border border-white/30 rounded-3xl p-8 shadow-2xl text-white text-xl transform-gpu">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-4xl font-bold tracking-tight [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">Check-in</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-m font-semibold text-gray-300 mb-2 [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">👉 Tu nombre</label>
          <input
            type="text"
            placeholder=""
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            className="w-full rounded-2xl bg-white/10 border border-white/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="block text-m font-semibold text-gray-300 [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">👉 Equipo</label>
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning || hasSpun}
              className={`text-m rounded-full px-4 py-2 font-bold transition-all ${isSpinning || hasSpun ? "bg-gray-500/60 text-white" : "bg-[#f3b0da] text-white hover:bg-[#f3b0da]/80"}`}
            >
              {isSpinning ? "Girando..." : hasSpun ? "Ya giraste" : "Girar rueda"}
            </button>
          </div>

          <div className="relative flex items-center justify-center w-full aspect-square max-w-md mx-auto overflow-hidden">
            <div
              className="w-full h-full rounded-full border-4 border-white/40 shadow-xl will-change-transform"
              style={{
                backgroundImage:
                  "conic-gradient(#ef4444 0deg 90deg, #22c55e 90deg 180deg, #3b82f6 180deg 270deg, #facc15 270deg 360deg)",
                transform: `rotate(${rotation}deg) translateZ(0)`,
                transition: "transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            />
            <div className="pointer-events-none absolute top-[-8px] w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
            <div className="absolute flex items-center justify-center [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">
              <Logo size="small" color="white">
                <h1>FSN</h1>
              </Logo>
            </div>
          </div>

          {selectedTeam && (
            <div
              className="text-center text-3xl text-white font-bold mt-2 py-4 px-6 rounded-2xl min-h-[3rem]"
              style={{ backgroundColor: `${teamColors[selectedTeam as keyof typeof teamColors]}CC` }}
            >
              Tu equipo: {selectedTeam}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-m font-semibold text-gray-300 [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">👉 Tu foto</label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer rounded-2xl bg-white/10 border-2 border-white/30 px-6 py-4 text-center text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📸</span>
            <span className="font-semibold [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">
              {photoFile ? photoFile.name : "Seleccionar foto"}
            </span>
          </label>
          {photoPreview && (
            <div className="mt-4">
              <p className="text-m font-semibold text-gray-300 [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">Vista previa</p>
              <div className="relative mt-1 rounded-2xl border border-white/30 w-full max-h-60 overflow-hidden bg-black/40 aspect-[3/4]">
                <Image
                  src={photoPreview}
                  alt="Foto de check-in"
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canRegister || isSubmitting}
          className={`rounded-2xl px-6 py-4 font-bold text-xl transition ${
            canRegister && !isSubmitting
              ? `text-white hover:opacity-90 shadow-lg ${
                  selectedTeam === "Rojo"
                    ? "bg-[#ef4444]"
                    : selectedTeam === "Verde"
                    ? "bg-[#22c55e]"
                    : selectedTeam === "Azul"
                    ? "bg-[#3b82f6]"
                    : selectedTeam === "Amarillo"
                    ? "bg-[#facc15]"
                    : "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
                }`
              : "bg-gray-700/40 text-gray-500 cursor-not-allowed"
          }`}
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
        >
          {isSubmitting ? "Registrando..." : isRedirecting ? "Redirigiendo..." : "Registrarse"}
        </button>

        {statusMessage && <p className="text-center text-m text-gray-200/80 [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">{statusMessage}</p>}
      </form>
    </section>
  );
};

export default CheckIn;


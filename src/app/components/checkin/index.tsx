"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../utils/firebase";

const teamColors = {
  Rojo: "#ef4444",
  Verde: "#22c55e",
  Azul: "#3b82f6",
  Amarillo: "#facc15",
};

const CheckIn = () => {
  const teams = useMemo(() => Object.keys(teamColors), []);
  const [playerName, setPlayerName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canRegister = !!playerName.trim() && !!selectedTeam && !!photoFile;

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
    if (isSpinning) return;
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * teams.length);
    const segmentAngle = 360 / teams.length;
    const extraSpins = 4;
    const targetRotation = extraSpins * 360 + randomIndex * segmentAngle + segmentAngle / 2;

    setRotation((prev) => prev + targetRotation);

    setTimeout(() => {
      setSelectedTeam(teams[randomIndex]);
      setIsSpinning(false);
      setStatusMessage(`Te tocó el equipo ${teams[randomIndex]}!`);
    }, 2000);
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

      await addDoc(collection(db, "checkins"), {
        name: playerName.trim(),
        team: selectedTeam,
        photo: photoUrl,
        createdAt: serverTimestamp(),
      });

      setStatusMessage("¡Check-in completado! Nos vemos en el evento.");
      setPlayerName("");
      setSelectedTeam(null);
      setPhotoPreview(null);
      setPhotoFile(null);
    } catch (error) {
      console.error("Error al registrar check-in", error);
      setStatusMessage("No pudimos registrar tu check-in. Reintentá en un rato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 w-full max-w-4xl mx-auto bg-white/5 border border-white/30 rounded-3xl backdrop-blur-md p-8 shadow-2xl text-white">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-4xl font-bold tracking-tight">Check-in de llegada</h2>
        <p className="text-lg text-gray-200">
          Registrá tu llegada al evento: indicá tu nombre, rotá la ruleta para elegir un equipo y subí una foto con tu cámara.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Tu nombre</label>
          <input
            type="text"
            placeholder="Escribí tu nombre aquí"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            className="w-full rounded-2xl bg-white/10 border border-white/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-300">Equipo</label>
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className={`text-sm rounded-full px-4 py-2 ${isSpinning ? "bg-gray-500/60" : "bg-white/20 hover:bg-white/40"} transition-all`}
            >
              {isSpinning ? "Girando..." : "Girar rueda"}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              className="w-64 h-64 rounded-full border-4 border-white/40 shadow-xl"
              style={{
                backgroundImage:
                  "conic-gradient(#ef4444 0deg 90deg, #22c55e 90deg 180deg, #3b82f6 180deg 270deg, #facc15 270deg 360deg)",
                transform: `rotate(${rotation}deg)`,
                transition: "transform 2s cubic-bezier(0.33, 1, 0.68, 1)",
              }}
            />
            <div className="pointer-events-none absolute top-2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-white" />
          </div>

          <p className="text-center text-white/80 mt-2">
            Equipo seleccionado: <span className="font-bold">{selectedTeam ?? "—"}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-gray-300">Foto para el check-in</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="text-sm text-white"
          />
          {photoPreview && (
            <div className="mt-4">
              <p className="text-xs text-gray-400">Vista previa</p>
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
              ? "bg-gradient-to-r from-[#f97316] to-[#facc15] text-black"
              : "bg-gray-500/60 text-white"
          }`}
        >
          {isSubmitting ? "Registrando..." : "Registrarte"}
        </button>

        {statusMessage && <p className="text-center text-sm text-gray-200/80">{statusMessage}</p>}
      </form>
    </section>
  );
};

export default CheckIn;


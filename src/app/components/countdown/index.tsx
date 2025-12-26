"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [hasEventStarted, setHasEventStarted] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-01-17T12:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setHasEventStarted(true);
        setTimeLeft("¡El evento ha comenzado!");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      setTimeLeft(`${days} días<br />${hours} horas, ${minutes} minutos`);
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white w-full text-center">
      {!hasEventStarted ? (
        <>
          <h2 className="text-4xl font-extrabold [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]" dangerouslySetInnerHTML={{ __html: timeLeft }} />
          <div className="mt-4 text-5xl">🍹🃏☀️</div>
        </>
      ) : (
        <Link
          href="/checkin"
          className="mt-10 px-10 py-5 rounded-full bg-[#FFE478] text-black font-extrabold text-3xl shadow-lg shadow-black/40 uppercase no-underline inline-block"
        >
          Hacer check-in
        </Link>
      )}
    </div>
  );
};

export default Countdown;

"use client";

import Image from "next/image";
import { Logo } from "./styled";
import Countdown from "./components/countdown";

export default function Home() {
  return (
    <div className="min-h-screen w-full py-8 px-4">
      <div className={`flex flex-col items-center text-white relative`}>
        <div className="relative z-10 flex flex-col items-center">
          <Logo>
            <h1>FSN</h1>
          </Logo>
          <Image
            src="/9web.png"
            alt="summer edition"
            width={300}
            height={300}
            className="mx-auto mt-10 animate-bounce-slow"
            priority
          />
          <Countdown />
        </div>
      </div>

      <div className="text-white w-full text-center mt-24 pb-8">
        <h2 className="text-4xl font-extrabold [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">
          sábado 17 de enero <br /> 12:00 hs
        </h2>
        <p className="text-2xl font-bold mt-2 [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)]">
          Villa Devoto, CABA
        </p>
        <a
          href="https://www.instagram.com/fiestasinnombre/"
          className="inline-block hover:opacity-80 transition-opacity mt-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/instagram-icon.png"
            alt="Instagram - @fiestasinnombre"
            width={64}
            height={64}
          />
        </a>
      </div>
    </div>
  );
}

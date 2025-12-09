"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "./styled";
import Countdown from "./components/countdown";

export default function Home() {
  return (
    <>
      <div className={`flex flex-col items-center text-white relative`}>
        <div className="relative z-10 flex flex-col items-center">
          <Logo>
            <h1>FSN</h1>
          </Logo>
          <h4>ESPECIAL CUMPLEAÑOS</h4>
          <Image
            src="/9web.png"
            alt="summer edition"
            width={300}
            height={300}
            className="mx-auto mt-10"
            priority
          />
          <Countdown />
        </div>
        <Link
          href="/checkin"
          className="mt-10 px-6 py-3 rounded-full bg-gradient-to-r from-[#f97316] to-[#facc15] text-black font-bold text-lg shadow-lg shadow-black/40"
        >
          Hacer check-in
        </Link>
      </div>

      <div className="text-white w-full text-center mt-6">
        <h2>
          sábado 17 de enero <br /> 12:00 hs
        </h2>
        <a href="https://www.instagram.com/fiestasinnombre/">
          @fiestasinnombre
        </a>
      </div>
    </>
  );
}

"use client";

import { Logo } from "./styled";
import Countdown from "./components/countdown";

export default function Home() {
  return (
    <>
      <div
        className="flex flex-col items-center bg-black text-white overflow-hidden h-screen p-18"
        style={{
          backgroundImage: "url('/elritobg.png')",
          backgroundSize: "80%", // <- contiene toda la imagen dentro del div
          backgroundRepeat: "no-repeat", // <- evita la repetición
          backgroundPosition: "center",
          padding: "20px"
        }}
      >
        <Logo>
          <h1>FSN</h1>
        </Logo>
        <Countdown />
      </div>
      <div className="text-white w-full text-center">
        <h2>sábado 18 de octubre, 21:00 hs</h2>
        <img src="/elrito.png" />
        <a href="https://www.instagram.com/fiestasinnombre/">@fiestasinnombre</a>
      </div>
    </>
  );
}

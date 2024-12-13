"use client";

import { Logo, Diagonal, DiagonalInverted, DiamondContainer, Laser, Laser2, ImageContainer } from "./styled";
import Countdown from "./components/countdown";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen bg-black text-white overflow-hidden">
      <Logo>
        <h1>FSN 7</h1>
      </Logo>
      <DiagonalInverted />
      <Countdown />
      <Diagonal />
      <ImageContainer src="/fsn7-web.jpeg" alt="Diamond GIF" className="" />
      <DiamondContainer>
        <Laser />
        <Laser2 />
        <img src="/diamond.gif" className="w-32 h-32" />
      </DiamondContainer>

      <DiagonalInverted />
      <div className="bg-white text-black w-full text-center">
        <h2>17 de enero, 21:30 hs</h2>
        <h3>Especial cumpleaños 29</h3>
      </div>
      <Diagonal />
    </div>
  );
}

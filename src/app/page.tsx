"use client";

import Image from "next/image";
import { Logo } from "./styled";
import Countdown from "./components/countdown";
import styles from "./home-bloody.module.css";

export default function Home() {
  return (
    <>
      <div className={`${styles.wrapper} flex flex-col items-center text-white h-screen relative`}>
        {/* Imagen central con parpadeo */}
        <div className={styles.bgAnimated}>
          <Image src="/elritobg.png" alt="El rito de sangre" width={1200} height={800} priority />
        </div>

        {/* Contenido en foreground */}
        <div className="relative z-10 flex flex-col items-center">
          <Logo>
            <h1>FSN</h1>
          </Logo>
          <Countdown />
        </div>
      </div>

      <div className="text-white w-full text-center mt-6">
        <h2>sábado 18 de octubre, 21:00 hs</h2>
        <Image src="/elrito.png" alt="El rito logo" width={300} height={300} className="mx-auto" priority />
        <a href="https://www.instagram.com/fiestasinnombre/">@fiestasinnombre</a>
      </div>
    </>
  );
}

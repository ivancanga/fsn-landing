import styled, { keyframes } from "styled-components";

export const Logo = styled.div`
  h1 {
    height: 120px;
    font-size: 18vh; /* Tamaño del texto */
    font-weight: 900;
    color: #ffffff; /* Texto blanco */
    transform: translateY(-20%) rotate(-6deg); /* Ajuste e inclinación del texto */
    margin: 0;
    line-height: 160px;
    white-space: nowrap; /* Evita cortes de línea */

    /* Animación de parpadeo rápido */
    animation: quick-blink 2s infinite; /* Parpadeo cada 3 segundos */
  }

  /* Animación para parpadeo rápido */
  @keyframes quick-blink {
    0%,
    98% {
      opacity: 1; /* Visible */
    }
    98.5%,
    99.5% {
      opacity: 0; /* Invisible por milisegundos */
    }
    100% {
      opacity: 1; /* Visible nuevamente */
    }
  }
`;

export const Diagonal = styled.div`
  width: 100%;
  height: 50px; /* Altura de la diagonal */
  background-color: white; /* Fondo blanco */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* Opcional: Ajustes de color dinámico */
  filter: none; /* Sin inversión de colores */
  mix-blend-mode: normal; /* Modo de mezcla estándar */
`;

export const DiagonalInverted = styled.div`
  width: 100%;
  height: 50px;
  background-color: black; /* Fondo negro inicial */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* Inversión de colores */
  filter: invert(1); /* Invierte los colores */
  mix-blend-mode: difference; /* Mezcla los colores invertidos con el fondo */
  transform: scaleY(-1); /* Invierte verticalmente la diagonal */
  margin-top: -10px; /* Ajuste para eliminar espacios */
`;

// Animación para el parpadeo del láser
const blink = keyframes`
  0%, 49.9%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

// Styled component para el láser verde horizontal
export const Laser = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: limegreen;
  top: 30%;
  left: 0;
  transform: translateY(-50%) rotate(133deg) scale(1.5);
  animation: ${blink} 0.1s infinite;
  z-index: 10;
`;

export const Laser2 = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: limegreen;
  top: 60%;
  left: 0;
  transform: translateY(-50%) rotate(-8deg);
  animation: ${blink} 0.1s infinite;
  z-index: 10;
`;

export const DiamondContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

export const ImageContainer = styled.img`
  transform: scale(1.3) rotate(-6deg);
  filter: blur(1.5px);
`;

export const PasswordContaianer = styled.div`
  font-size: 96px;
  border: 3px solid gray;
  border-radius: 12px;
  line-height: 75px;
  height: 96px;
  padding: 0 24px;
`
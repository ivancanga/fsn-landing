import styled from "styled-components";

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
    animation: quick-blink 3s infinite; /* Parpadeo cada 3 segundos */
  }

  /* Animación para parpadeo rápido */
  @keyframes quick-blink {
    0%, 98% {
      opacity: 1; /* Visible */
    }
    98.5%, 99.5% {
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



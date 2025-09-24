import styled, { keyframes } from "styled-components";

export const Logo = styled.div`
  h1 {
    text-align: center;
    height: 120px;
    font-size: 16vh; /* Tamaño del texto */
    font-weight: 900;
    color:rgb(255, 255, 255); /* Texto blanco */
    transform: translateY(-20%); /* Ajuste e inclinación del texto */
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
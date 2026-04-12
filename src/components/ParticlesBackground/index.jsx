import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { createGlobalStyle } from 'styled-components';

// ✅ CSS global que força o canvas injetado pelo tsparticles a ser fantasma
// O style prop do React NÃO é transferido para o <canvas> interno gerado pela lib
const ParticlesCanvasFix = createGlobalStyle`
  #tsparticles {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: -1 !important;
    pointer-events: none !important;
  }
  #tsparticles canvas {
    pointer-events: none !important;
  }
`;

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <>
      {/* CSS global garante que o canvas real seja fantasma, sem interferir nos botões */}
      <ParticlesCanvasFix />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          // ✅ fullScreen: o canvas é injetado no body e cobre toda a viewport
          fullScreen: { enable: true, zIndex: -1 },
          fpsLimit: 60,
          interactivity: {
            // ✅ Mantemos "window" para detectar o mouse mesmo com o z-index: -1
            detectsOn: "window",
            events: {
              // 🚀 ADICIONADO: Reativa a teia neon seguindo o mouse
              onHover: {
                enable: true,
                mode: "grab"
              },
              // ✅ MANTIDO: Clique gera novas partículas
              onClick: {
                enable: true,
                mode: "push"
              },
            },
            modes: {
              // 🚀 ADICIONADO: Configuração da conexão com o mouse
              grab: {
                distance: 100,      // Alcance da linha até o mouse
                links: {
                  opacity: 0.5      // Brilho da linha que segue o mouse
                }
              },
              // ✅ MANTIDO: Apenas 1 partícula por clique para suavidade
              push: {
                quantity: 1
              },
            },
          },
          particles: {
            color: { value: "#00c2ff" },
            links: {
              color: "#00c2ff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.6,
              direction: "none",
              outModes: { default: "out" },
            },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />
    </>
  );
}
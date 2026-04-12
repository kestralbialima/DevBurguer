import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../Header';
import { ParticlesBackground } from '../ParticlesBackground';

export function DefaultLayout() {
  return (
    <>
      {/* ✅ Ponto único de renderização das partículas para todas as rotas públicas */}
      <ParticlesBackground />

      <Header />

      {/* ✅ Tarefa 2: Container transparente — não deve ter fundo sólido */}
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}

// ✅ Tarefa 2: background transparente garante que o canvas de partículas
// (fixo no body com z-index:-1) seja visível por baixo de todo o conteúdo
const PageContainer = styled.main`
  background: transparent;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
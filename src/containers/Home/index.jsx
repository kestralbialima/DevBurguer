import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { api } from '../../services/api';
import { ParticlesBackground } from '../../components/ParticlesBackground';
import Logo from '../../assets/Logo.png';
import { Header } from '../../components/Header';
import { HomePromos } from '../../components/HomePromos';
import { HomeCategories } from '../../components/HomeCategories';
import { Products } from '../../components/Products';
import { Title, LogoTitleImage } from '../../components/Title';
import { HomeFooterInfo } from '../../components/HomeFooterInfo';

export function Home() {
  // 📦 Estado inicial como array vazia para evitar erros de .filter() nos filhos
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        // 📡 Chamada para a API
        const { data } = await api.get('/products');

        /**
         * ⚙️ LÓGICA DE EXTRAÇÃO:
         * Garante que sempre teremos uma array, independente do formato da resposta.
         */
        const allProducts = data.products || data;

        setProducts(allProducts);

      } catch (err) {
        console.error("Erro ao carregar produtos na Home:", err);
      }
    }
    loadProducts();
  }, []);

  return (
    <Container className="page-enter">
      {/* ✅ ParticlesBackground renderizado pelo DefaultLayout — não duplicar aqui */}
      <Content>
        {/* 🏔️ SEÇÃO 1: HERO — Titulo + Logo como bloco único */}
        <WelcomeBox>
          {/* ✅ HeroContainer: gap de 2rem garante que o title não sobreponha a logo animada */}
          <HeroContainer>
            <Title $size="clamp(28px, 3.5vw, 52px)">BEM VINDO AO</Title>
            <LogoTitleImage
              src={Logo}
              alt="Dev Burger"
              $maxWidth="clamp(260px, 28vw, 480px)"
            />
          </HeroContainer>
          <MissionText>
            🍔 MISSÃO: COLETE OS MELHORES LOOTS E SUBA DE NÍVEL!
          </MissionText>
        </WelcomeBox>

        {/* 🍡 SEÇÃO 2: BÔNUS DA FASE
            Componente filtra internamente por 'is_bonus'
        */}
        <HomePromos products={products} />

        {/* 📂 SEÇÃO 3: CATEGORIAS */}
        <HomeCategories />

        {/* 🏆 SEÇÃO 4: LOOT LENDÁRIO
            🚩 Atenção: Verifique se dentro deste componente 'Products'
            existe o 'toast.success' ao clicar em adicionar.
        */}
        <Products products={products} />

        {/* 🚀 SEÇÃO 5: CHECKPOINT FINAL */}
        <HomeFooterInfo />
      </Content>

    </Container>
  );
}

// ✅ HeroContainer — bloco único, gap mínimo de 2rem para evitar sobreposição da logoPulse
const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;              /* 📌 mínimo 2rem — evita sobreposição com o translateY(-20px) da animação */
  width: 100%;
  margin-top: 1rem;
  background: transparent;
  position: relative;
  z-index: 1;

  /* Escala da logo em UltraWide */
  @media (min-width: 1440px) {
    gap: 2.5rem;
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  /* ✅ Tarefa 3: transparent — apenas o body (#0e0e0e) tem cor sólida */
  background: transparent;
  overflow-x: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  /* 65px (header fixo) + 2rem respiro */
  padding-top: clamp(5rem, 10vh, 7rem);
  padding-bottom: 5rem;
  padding-left: clamp(1rem, 4vw, 3rem);
  padding-right: clamp(1rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Gap genéroso entre seções — nenhum texto à menos de 4rem de animações */
  gap: clamp(3rem, 5vw, 5rem);
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  @media (min-width: 1920px) {
    max-width: 1700px;
  }
`;

const WelcomeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  width: 100%;
  max-width: clamp(480px, 55vw, 860px);
  padding-bottom: 1rem;
  /* Margem inferior separa hero de seção de bônus (mínimo 4rem de animações) */
  margin-bottom: 2rem;
`;

const MissionText = styled.p`
  font-family: 'Poppins', sans-serif;
  color: #00c2ff;
  font-weight: bold;
  font-size: clamp(0.85rem, 1.2vw, 1.25rem);
  text-transform: uppercase;
  letter-spacing: clamp(2px, 0.4vw, 5px);
  text-shadow: 0 0 10px rgba(0, 194, 255, 0.4);
  margin-top: 0.5rem;
`;
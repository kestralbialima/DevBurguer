import React, { useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { toast } from 'react-toastify';

import 'swiper/css';
import 'swiper/css/navigation';

import { ProductModal } from '../ProductModal';
import { Title } from '../Title';

// --- 🎨 ESTILIZAÇÃO ---

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: clamp(1rem, 3vw, 2.5rem) 0; /* Removido padding lateral para o carrossel sangrar */

  > h1, > h2 {
    margin-bottom: clamp(1.5rem, 2.5vw, 3.5rem);
    letter-spacing: clamp(6px, 1vw, 14px);
    padding: 0 clamp(1rem, 3vw, 2rem); /* Título mantém o alinhamento */
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  
  .swiper {
    padding: clamp(40px, 6vh, 80px) 0 clamp(80px, 10vh, 140px) 0;
    width: 100%;
    overflow: visible; /* Importante para não cortar o brilho/glow */
  }

  /* 🚀 CORREÇÃO DE CENTRALIZAÇÃO: Força o wrapper a alinhar corretamente */
  .swiper-wrapper {
    display: flex;
    align-items: stretch;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-self: stretch; 
    transition: all 0.4s ease-in-out;
    transform: scale(0.85);
    opacity: 0.4;
    height: auto !important;

    /* 📱 Mobile: 160px */
    width: 160px !important;

    /* 💻 Tablet */
    @media (min-width: 768px) {
      width: 220px !important;
    }

    /* 🎮 Desktop Grande (Onde o problema ocorria) */
    @media (min-width: 1440px) {
      width: 380px !important; /* 🚀 Definido como fixo para o Swiper não errar o cálculo */
      min-height: 580px !important; 
    }

    @media (min-width: 1600px) {
      width: 420px !important;
      min-height: 640px !important;
    }
  }

  .swiper-slide-active {
    transform: scale(1.05) translateY(-20px);
    opacity: 1;
    z-index: 10;
  }

  /* 🔶 Botões de navegação */
  .swiper-button-next, .swiper-button-prev {
    color: #fff;
    background: linear-gradient(180deg, #ff8c00, #d35400);
    border: 3px solid #2d1300;
    width: 50px;
    height: 50px;
    border-radius: 12px;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.8);
    z-index: 100;

    &::after { font-size: 20px; font-weight: bold; }
  }

  .swiper-button-prev { left: 20px; }
  .swiper-button-next { right: 20px; }
`;

const TopSellerCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; 
  height: 100%;
  width: 100%;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  .image-box {
    width: 100%;
    aspect-ratio: 1 / 1; 
    border-radius: 15px;
    background-image: url(${props => props.$bg});
    background-size: cover;
    background-position: center;
    flex-shrink: 0; 

    @media (min-width: 1440px) {
      aspect-ratio: 4 / 5; /* 🚀 Portrait: Aumenta a altura sem zoom lateral */
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 15px 5px 5px;
    gap: 10px;

    p.name {
      color: #fff;
      font-weight: bold;
      font-size: clamp(14px, 1.2vw, 18px);
      text-transform: uppercase;
    }

    p.price {
      color: #fbbf24;
      font-family: 'Bangers', cursive;
      font-size: clamp(18px, 1.6vw, 26px);
    }

    .action-btn {
      margin-top: auto;
      background: #ef4444; /* Cor de destaque para o Lendário */
      color: #fff;
      font-family: 'Bangers', cursive;
      padding: 10px;
      border: none;
      border-radius: 8px;
      display: none;

      @media (min-width: 1440px) { display: block; }
    }
  }

  &:hover {
    border-color: #fbbf24;
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
  }
`;

export function HomeTopSellers({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const lootItems = Array.isArray(products)
    ? products.filter(p => p.offer === true || p.offer === 'true')
    : [];

  return (
    <SectionContainer>
      <Title as="h2" $lined $size="clamp(36px, 4vw, 56px)">LOOT LENDÁRIO</Title>

      {lootItems.length > 0 ? (
        <CarouselWrapper>
          <Swiper
            modules={[Navigation, Autoplay]}
            centeredSlides={true}
            loop={lootItems.length >= 5} /* Aumentado para garantir preenchimento */
            slidesPerView={'auto'} /* 🚀 O CSS manda agora */
            initialSlide={2}
            navigation
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            // 🚀 Breakpoints ajustados para não conflitar com o CSS
            breakpoints={{
              320: { spaceBetween: 15 },
              768: { spaceBetween: 25 },
              1440: { spaceBetween: 40 },
              1600: { spaceBetween: 50 },
            }}
          >
            {lootItems.map((product) => (
              <SwiperSlide key={product.id}>
                <TopSellerCard
                  onClick={() => setSelectedProduct(product)}
                  $bg={product.url}
                >
                  <div className="image-box" />
                  <div className="info">
                    <p className="name">{product.name}</p>
                    <p className="price">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                    <button className="action-btn">COLETAR LOOT</button>
                  </div>
                </TopSellerCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselWrapper>
      ) : (
        <p style={{ color: '#888', textAlign: 'center' }}>Buscando loots...</p>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={(item) => toast.success(`${item.name} adicionado!`)}
      />
    </SectionContainer>
  );
}
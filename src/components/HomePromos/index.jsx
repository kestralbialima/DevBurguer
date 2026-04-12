import React, { useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useCart } from '../../hooks/CartContext';
import { toast } from 'react-toastify';
import { FiPlus, FiMinus } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import { Title } from '../Title';
import { ProductModal } from '../ProductModal';

// --- 🎨 ESTILIZAÇÃO (Controle de Quantidade Gamer) ---
const QtySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 194, 255, 0.1);
  padding: 4px 8px;
  border-radius: 10px;
  border: 1px solid #ffcc00;

  button {
    background: #ffcc00;
    border: none;
    border-radius: 6px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-weight: bold;
    &:hover { background: #fff; }
  }
  span { font-family: 'Bangers'; color: #fff; font-size: 18px; min-width: 15px; text-align: center; }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: clamp(2rem, 5vh, 4rem) 0;
  overflow: hidden;
  position: relative;
  z-index: 5;

  /* Hierarquia de títulos: separa o h2 do carrossel por pelo menos 4rem */
  > h1, > h2 {
    margin-bottom: clamp(2rem, 3vw, 4rem);
    letter-spacing: clamp(6px, 1vw, 14px);
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1920px;
  z-index: 10;

  .swiper {
    padding: clamp(40px, 6vh, 80px) 0 clamp(80px, 10vh, 140px) 0;
    width: 100%;
    overflow: visible;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    /* 📱 Mobile */
    width: 280px;
    filter: brightness(0.4) blur(1px);

    /* 💻 Tablet/Laptop */
    @media (min-width: 768px) {
      width: 340px;
    }

    /* 🖥️ Desktop ≥1440px — card portrait, mais alto que largo */
    @media (min-width: 1440px) {
      width: 380px;
    }

    /* 🖥️ UltraWide ≥1600px */
    @media (min-width: 1600px) {
      width: 400px;
    }
  }

  .swiper-slide-active {
    filter: brightness(1) blur(0);
    transform: translateY(-20px) scale(1.03);
    z-index: 20;
  }

  /* 🎮 Botões de Navegação Gamer */
  .swiper-button-next,
  .swiper-button-prev {
    color: transparent !important;
    width: 45px;
    height: 45px;
    background: linear-gradient(180deg, #ffcc00 0%, #ff8c00 100%);
    border: 3px solid #4e2700;
    border-radius: 12px;
    box-shadow: 0 4px 0 #2d1400;
    top: 50%;

    &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-top: 4px solid #4e2700;
      border-right: 4px solid #4e2700;
    }
  }

  .swiper-button-prev {
    left: 10px;
    &::after { transform: rotate(-135deg); left: 16px; }
  }

  .swiper-button-next {
    right: 10px;
    &::after { transform: rotate(45deg); right: 12px; }
  }
`;


const PromoCard = styled.div`
  /* 🃏 Layout Portrait: card em coluna, mais alto que largo */
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(15, 15, 15, 0.98);
  border: 2px solid #333;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.9);
  transition: all 0.5s ease-in-out;
  cursor: pointer;

  /* ✨ Card ativo: borda dourada neon */
  .swiper-slide-active & {
    border-color: #ffcc00;
    box-shadow: 0 0 15px #ffcc00, 0 0 30px #ff8c00, 0 25px 50px rgba(0, 0, 0, 0.9);
  }

  /* 🖼️ Imagem: aspect-ratio portrait, sem zoom agressivo */
  .card-image {
    width: 100%;
    aspect-ratio: 3 / 2;   /* Mobile: paisagem padrão */
    object-fit: cover;
    object-position: center;
    display: block;
    border-bottom: 2px solid #333;
    transition: aspect-ratio 0.3s ease;

    /* 💻 Tablet: início da transição para portrait */
    @media (min-width: 768px) {
      aspect-ratio: 4 / 3;
    }

    /* 🖥️ Desktop ≥1440px: portrait — ocupa ~60% da altura do card */
    @media (min-width: 1440px) {
      aspect-ratio: 4 / 5;
    }
  }

  /* 📝 Body dos textos: flex-grow para empurrar o botão para baixo */
  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: clamp(12px, 1.5vh, 20px) clamp(14px, 1.5vw, 22px);
    gap: 8px;

    .title {
      font-family: 'Bangers';
      font-size: clamp(20px, 2vw, 26px);
      color: #fff;
      line-height: 1.2;
    }

    .description {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(11px, 0.9vw, 13px);
      color: #bbb;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      flex-grow: 1; /* 💡 Empurra o price-row para a base */
    }

    /* 💰 Price-row: botão COLETAR ancorado na base */
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto; /* 🔑 Ancora na base do .content */
      padding-top: 10px;

      .price {
        color: #fff;
        font-family: 'Bangers';
        font-size: clamp(22px, 2.2vw, 30px);
        transition: 0.5s;
      }

      .swiper-slide-active & .price {
        color: #ffcc00;
        text-shadow: 0 0 8px #ffcc00;
      }

      .add-btn {
        background: #ff0000;
        color: #fff;
        font-family: 'Bangers';
        font-size: clamp(15px, 1.4vw, 20px);
        padding: clamp(6px, 0.8vh, 10px) clamp(14px, 1.2vw, 22px);
        border-radius: 8px;
        border: 2px solid #000;
        box-shadow: 2px 2px 0px #000;
        cursor: pointer;
        transition: 0.2s;
        white-space: nowrap;

        &:hover {
          background: #ff0055;
          transform: scale(1.05);
        }
      }
    }
  }
`;


// --- 🕹️ COMPONENTE PRINCIPAL ---
export function HomePromos({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { putProductInCart, cartProducts, increaseProduct, decreaseProduct } = useCart();

  // 📡 Filtro para identificar itens de Bônus (Azul no Admin)
  const promoItems = Array.isArray(products)
    ? products.filter(p => p.is_bonus === true || p.is_bonus === 'true')
    : [];

  const getProductQty = (id) => {
    const product = cartProducts.find(p => p.id === id);
    return product ? product.quantity : 0;
  };

  return (
    <SectionContainer>
      <Title as="h2" $lined $size="clamp(36px, 4vw, 56px)">BÔNUS DA FASE</Title>

      {promoItems.length > 0 ? (
        <CarouselWrapper>
          <Swiper
            modules={[Navigation, Autoplay, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={promoItems.length >= 3}
            coverflowEffect={{ rotate: 20, stretch: 0, depth: 150, modifier: 1, slideShadows: false }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={true}
            spaceBetween={20}
            breakpoints={{
              768:  { spaceBetween: 30 },
              1440: { spaceBetween: 50 },
              1600: { spaceBetween: 60 },
            }}
          >
            {promoItems.map((product) => {
              const qty = getProductQty(product.id);

              return (
                <SwiperSlide key={product.id}>
                  <PromoCard onClick={() => setSelectedProduct(product)}>

                    <img
                      className="card-image"
                      src={`${product.url}`}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/400x500/0f0f0f/ffcc00?text=LOOT';
                      }}
                    />
                    <div className="content">
                      <p className="title">{product.name}</p>
                      <p className="description">{product.description || "O buff de sabor que você precisava!"}</p>

                      <div className="price-row">
                        <p className="price">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </p>

                        <div onClick={(e) => e.stopPropagation()}>
                          {qty > 0 ? (
                            <QtySelector>
                              <button onClick={() => decreaseProduct(product.id)}><FiMinus /></button>
                              <span>{qty}</span>
                              <button onClick={() => increaseProduct(product.id)}><FiPlus /></button>
                            </QtySelector>
                          ) : (
                            <button
                              className="add-btn"
                              onClick={() => {
                                putProductInCart(product);
                                toast.success(`${product.name} coletado! 🍔`);
                              }}
                            >
                              COLETAR
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </PromoCard>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </CarouselWrapper>
      ) : (
        <p style={{ color: '#aaa', marginTop: '20px' }}>Nenhum bônus ativo nesta fase...</p>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={(p) => {
          putProductInCart(p);
          toast.success(`${p.name} coletado! 🍔`);
        }}
        cartQty={getProductQty(selectedProduct?.id)}
        increase={increaseProduct}
        decrease={decreaseProduct}
      />
    </SectionContainer>
  );
}
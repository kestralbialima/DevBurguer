import React, { useState } from 'react'; 
import styled, { keyframes } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import { useCart } from '../../hooks/CartContext'; 
import { FiPlus, FiMinus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Title } from '../Title';
import { ProductModal } from '../ProductModal'; 

// Estilos Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// --- 🎮 ANIMAÇÕES E ESTILOS ---
const float = keyframes`
  0% { transform: translateY(-15px); }
  50% { transform: translateY(-25px); }
  100% { transform: translateY(-15px); }
`;

const SectionContainer = styled.section`
  display: flex; flex-direction: column; align-items: center;
  width: 100%; padding: 60px 0; overflow: hidden; position: relative;
`;

const CarouselWrapper = styled.div`
  width: 100%; max-width: 1400px; position: relative;
  .swiper { padding: 60px 0 80px 0; overflow: visible; }
  .swiper-slide { 
    display: flex; justify-content: center; width: 280px; 
    filter: brightness(0.4); transition: all 0.5s ease; 
  }
  .swiper-slide-active { 
    filter: brightness(1); z-index: 20; animation: ${float} 3s ease-in-out infinite; 
  }
`;

const LootCard = styled.div`
  width: 100%; background: rgba(15, 15, 15, 0.98); border: 2px solid #333;
  border-radius: 25px; overflow: hidden; transition: all 0.5s ease;
  cursor: pointer; 
  &:hover { border-color: #ff4500; }
  .swiper-slide-active & { border-color: #ff4500; box-shadow: 0 0 20px rgba(255, 69, 0, 0.6); }
`;

const NavButton = styled.button`
  position: absolute; top: 50%; transform: translateY(-50%);
  background: linear-gradient(180deg, #ff8c00 0%, #ff4500 100%);
  border: 3px solid #3e2723; color: #3e2723; width: 50px; height: 50px;
  border-radius: 12px; cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 24px; z-index: 100;
  box-shadow: 0 6px 0 #3e2723;
  &.prev-loot { left: 20px; } &.next-loot { right: 20px; }
`;

// --- 🕹️ COMPONENTE ---
export function Products({ products }) {
  const { putProductInCart, cartProducts, increaseProduct, decreaseProduct } = useCart();
  const [modalProduct, setModalProduct] = useState(null);

  /** * 🚩 O SEGREDO DA SINCRONIZAÇÃO:
   * Filtramos a lista para exibir APENAS itens onde 'offer' é verdadeiro no Admin.
   */
  const offerProducts = Array.isArray(products) 
    ? products.filter(p => p.offer === true || p.offer === 'true') 
    : [];

  const getProductQty = (id) => {
    const product = cartProducts.find(p => p.id === id);
    return product ? product.quantity : 0;
  };

  return (
    <SectionContainer>
      <Title as="h2" $lined $size="48px" style={{ textAlign: 'center' }}>
        LOOT LENDÁRIO
      </Title>

      <CarouselWrapper>
        <NavButton className="prev-loot" id="prev-loot"><FiChevronLeft /></NavButton>
        <NavButton className="next-loot" id="next-loot"><FiChevronRight /></NavButton>

        {/* ✅ Usamos offerProducts aqui em vez de products */}
        {offerProducts && offerProducts.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={offerProducts.length >= 5}
            navigation={{ prevEl: '#prev-loot', nextEl: '#next-loot' }}
            coverflowEffect={{ rotate: 25, stretch: 0, depth: 150, modifier: 1, slideShadows: false }}
          >
            {offerProducts.map((product) => {
              const qty = getProductQty(product.id);
              return (
                <SwiperSlide key={product.id}>
                  <LootCard onClick={() => setModalProduct(product)}>
                    
                    <img
                      src={`${product.url}?t=${Date.now()}`}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/280x200/0f0f0f/ff4500?text=LOOT';
                      }}
                      style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: 20 }}>
                      <p style={{ fontFamily: 'Bangers', fontSize: 24, color: '#fff', textAlign: 'center' }}>{product.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <p style={{ color: '#ff4500', fontFamily: 'Bangers', fontSize: 26 }}>R$ {product.price}</p>
                        
                        <div onClick={(e) => e.stopPropagation()}>
                           {qty > 0 ? (
                             <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                               <button onClick={() => decreaseProduct(product.id)} style={{ background: '#ff4500', border: 'none', borderRadius: 5, cursor: 'pointer' }}><FiMinus color="#fff" /></button>
                               <span style={{ color: '#fff', fontFamily: 'Bangers' }}>{qty}</span>
                               <button onClick={() => increaseProduct(product.id)} style={{ background: '#ff4500', border: 'none', borderRadius: 5, cursor: 'pointer' }}><FiPlus color="#fff" /></button>
                             </div>
                           ) : (
                             <button onClick={() => putProductInCart(product)} style={{ background: '#db2721', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Bangers' }}>COLETAR</button>
                           )}
                        </div>
                      </div>
                    </div>
                  </LootCard>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p style={{ color: '#888', fontFamily: 'Bangers', marginTop: 20 }}>Nenhum Loot Lendário ativo no momento...</p>
        )}
      </CarouselWrapper>

      <ProductModal 
        product={modalProduct} 
        onClose={() => setModalProduct(null)} 
        onAdd={putProductInCart}
        cartQty={getProductQty(modalProduct?.id)}
        increase={increaseProduct}
        decrease={decreaseProduct}
      />
    </SectionContainer>
  );
}
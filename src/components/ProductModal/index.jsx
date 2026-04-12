import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { FiX, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { Title } from '../Title';

// --- 🎮 ANIMAÇÕES (ESTILO POP-UP GAME) ---
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

// --- 🎨 ESTILIZAÇÃO ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9); /* Fundo quase preto para foco */
  backdrop-filter: blur(8px); /* Desfoca o fundo */
  z-index: 10000; /* Sempre no topo */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: pointer;
`;

const ModalBox = styled.div`
  background: #0a0a0a;
  border: 2px solid #ff4500; /* Borda Neon Laranja/Vermelha */
  border-radius: 20px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  position: relative;
  animation: ${fadeIn} 0.2s ease-out;
  cursor: auto;
  box-shadow: 0 0 50px rgba(255, 69, 0, 0.3); /* Brilho neon */

  /* Estilização da barra de rolagem rústica */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #ff4500; border-radius: 10px; }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #ff0055;
  font-size: 35px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  &:hover { transform: scale(1.1); color: #fff; }
`;

// ... (Estilo do seletor de quantidade QtySelector, igual dos outros carrosséis)
const QtySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: #1a1a1a;
  padding: 8px 15px;
  border-radius: 12px;
  border: 1px solid #ff4500;

  button {
    background: #ff4500;
    border: none;
    border-radius: 8px;
    width: 35px;
    height: 35px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: 0.2s;
    &:hover { background: #fff; color: #ff4500; }
  }
  span { font-family: 'Bangers'; color: #fff; font-size: 24px; min-width: 30px; text-align: center; }
`;

export function ProductModal({ product, onClose, onAdd, cartQty, increase, decrease, isAdminView }) {
  // Trava o scroll do fundo quando o modal abre
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [product]);

  if (!product) return null;

  // Usamos Portal para o modal ficar acima de tudo
  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FiX /></CloseButton>

        {/* ✅ Auditoria: <img> real (permite onError) em vez de backgroundImage */}
        <img
          src={`${product.url}?t=${Date.now()}`}
          alt={product.name}
          onError={(e) => {
            // ✅ Fallback: placeholder quando a URL falha
            e.currentTarget.onerror = null; // evita loop infinito
            e.currentTarget.src = 'https://placehold.co/550x300/0a0a0a/ff4500?text=LOOT+NOT+FOUND';
          }}
          style={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            borderRadius: 15,
            marginBottom: 20,
            border: '2px solid #333',
            display: 'block', // ✅ Garante que não seja inline (evita gap embaixo)
          }}
        />

        {/* Título */}
        <Title as="h2" $size="36px" style={{ color: '#ff4500' }}>{product.name}</Title>

        {/* Descrição Detalhada */}
        <p style={{ color: '#bbb', fontSize: 16, lineHeight: 1.6, margin: '20px 0' }}>
          {product.description || "Este item lendário aumentará seus atributos de felicidade e saciedade!"}
        </p>

        {/* Rodapé: Preço e Botão */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #333' }}>
          <div>
             <p style={{ color: '#aaa', fontSize: 14, textTransform: 'uppercase', marginBottom: 5 }}>Preço do Loot</p>
             <p style={{ color: '#fff', fontSize: 32, fontFamily: 'Bangers' }}>R$ {product.price}</p>
          </div>

          {/* Sincronização de quantidade no Modal - Desabilitada na visualização Admin */}
          {!isAdminView ? (
            cartQty > 0 ? (
              <QtySelector>
                <button onClick={() => decrease(product.id)}><FiMinus /></button>
                <span>{cartQty}</span>
                <button onClick={() => increase(product.id)}><FiPlus /></button>
              </QtySelector>
            ) : (
              <button 
                onClick={() => onAdd(product)}
                style={{ background: '#ff4500', color: '#fff', padding: '12px 25px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '22px', boxShadow: '4px 4px 0 #000', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <FiShoppingBag /> COLETAR
              </button>
            )
          ) : (
            <div style={{ padding: '8px 15px', background: 'rgba(255, 69, 0, 0.2)', border: '1px solid #ff4500', borderRadius: '10px' }}>
              <span style={{ color: '#ff4500', fontFamily: 'Bangers', fontSize: 24 }}>VISUALIZAÇÃO</span>
            </div>
          )}
        </div>
      </ModalBox>
    </Overlay>,
    document.body
  );
}
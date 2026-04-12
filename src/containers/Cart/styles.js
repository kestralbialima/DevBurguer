import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 120px 10px 40px; // Diminuímos o padding lateral no mobile
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    padding: 120px 20px 40px;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  width: 100%;
  max-width: 1280px;
  margin-top: 40px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

// TABELA (INVENTÁRIO) - MANTER AZUL NEON
export const ItemContainer = styled.div`
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid #00c2ff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 194, 255, 0.2);
  width: 100%;

  /* Esconde o cabeçalho em telas pequenas para ganhar espaço */
  .header-table {
    display: none; 
    
    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 80px 1fr 100px 120px 100px;
      gap: 10px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
      color: #00c2ff;
      font-family: 'Bangers';
      font-size: 18px;
    }
  }

  .product-line {
    display: grid;
    /* No Mobile: Foto à esquerda, Info à direita em 2 colunas */
    grid-template-areas: 
      "image name name"
      "image price qty"
      "image total total";
    grid-template-columns: 80px 1fr 1fr;
    gap: 10px;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #222;

    /* No Desktop: Volta para a linha única */
    @media (min-width: 768px) {
      grid-template-areas: none;
      display: grid;
      grid-template-columns: 80px 1fr 100px 120px 100px;
    }

    img {
      grid-area: image;
    }

    .product-name {
      grid-area: name;
      font-family: 'Bangers';
      font-size: 18px;
      @media (min-width: 768px) { font-size: 22px; }
    }

    .product-price {
      grid-area: price;
      font-size: 14px;
      color: #aaa;
      @media (min-width: 768px) { color: #fff; font-size: 16px; }
    }

    .product-qty {
      grid-area: qty;
      display: flex;
      justify-content: center;
    }

    .product-total {
      grid-area: total;
      text-align: right;
      font-weight: bold;
      color: #ffca28;
    }
  }
`;

// PAINEL DO USUÁRIO - TROCAR PARA ALARANJADO/AMARELO
export const UserPanel = styled.aside`
  background: rgba(15, 15, 15, 0.95);
  border: 2px solid #ff8c00; /* Laranja Lendário */
  border-radius: 20px;
  padding: 30px;
  height: fit-content;
  box-shadow: 0 0 25px rgba(255, 140, 0, 0.2);

  h3 {
    font-family: 'Bangers';
    color: #ff8c00;
    font-size: 32px;
    margin-bottom: 20px;
    border-bottom: 2px solid #ff8c00;
    padding-bottom: 10px;
    text-align: center;
  }

  .nav-buttons button {
    background: #1a1a1a;
    border: 1px solid #333;
    color: #fff;
    margin-bottom: 15px;
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Poppins';
    display: flex;
    align-items: center;
    gap: 15px;
    transition: 0.2s;

    &:hover {
      border-color: #ff8c00;
      background: rgba(255, 140, 0, 0.1);
    }
    
    svg { color: #ff8c00; font-size: 22px; }
  }
`;

// 🚀 BOTÃO DE FINALIZAR (ESTILO CRASH)
export const CheckoutButton = styled.button`
  width: 100%;
  height: 60px;
  margin-top: 20px;
  background: linear-gradient(180deg, #ffca28 0%, #ff8c00 100%); /* Amarelo para Laranja */
  border: 3px solid #3e2723;
  border-radius: 15px;
  color: #3e2723;
  font-family: 'Bangers';
  font-size: 26px;
  cursor: pointer;
  box-shadow: 0 6px 0 #3e2723;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    box-shadow: 0 2px 0 #3e2723;
    transform: translateY(4px);
  }
`;
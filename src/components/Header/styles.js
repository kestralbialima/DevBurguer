import styled, { keyframes } from 'styled-components';

// 🎈 ANIMAÇÃO: Flutuação constante para o número do carrinho (Loot)
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

export const Container = styled.div`
  height: 65px; /* UX UX UX: Altura mais elegante */
  width: 100%;
  background: rgba(5, 0, 10, 0.65); /* Fundo translúcido para fundir com as partículas */
  backdrop-filter: blur(12px); /* Efeito Glassmorphism Premium */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  border-bottom: 1px solid rgba(0, 194, 255, 0.15); /* Borda sutil de neon */
  position: fixed;
  top: 0; left: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;

export const Navigation = styled.nav`
  display: flex; gap: 25px;
  @media (max-width: 1100px) { display: none; }
  
  button {
    background: none; border: none; color: #e0e0e0;
    font-family: 'Bangers', cursive; font-size: 19px;
    cursor: pointer; transition: 0.2s;
    letter-spacing: 1px;
    &:hover { color: #00c2ff; transform: translateY(-2px); }
    &.active { color: #ff007f; text-shadow: 0 0 10px rgba(255, 0, 127, 0.5); }
  }
`;

export const NavRight = styled.div`
  display: flex; align-items: center; gap: 20px;
`;

// 🕹️ BOTÃO CONTATO (Rosa com Levante 3D UX aprimorado)
export const ContactButton = styled.button`
  background: linear-gradient(135deg, #ff007f, #d4006a); 
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-family: 'Bangers', cursive;
  font-size: 18px;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0px 4px 0px rgba(0, 194, 255, 0.7); 
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 0px rgba(0, 194, 255, 0.9);
    filter: brightness(1.15);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0px 0px 0px rgba(0, 194, 255, 0.2);
  }
`;

export const CartButton = styled.button`
  background: rgba(0,0,0,0.3); border: 2px solid #00c2ff;
  border-radius: 50%; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  position: relative; cursor: pointer; color: #fff;
  transition: 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover { border-color: #ff007f; color: #ff007f; transform: scale(1.08); box-shadow: 0 0 10px rgba(255, 0, 127, 0.4); }

  span {
    position: absolute; top: -6px; right: -6px;
    background: #ff007f; border-radius: 50%;
    width: 20px; height: 20px; font-size: 11px; font-weight: bold;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 5px rgba(255,0,127,0.5);
    animation: ${float} 2.5s infinite ease-in-out;
  }
`;

// 🍔 MENU HAMBÚRGUER
export const HamburgerIcon = styled.div`
  display: none; color: #00c2ff; cursor: pointer; transition: 0.3s;
  
  svg { 
    font-size: 32px; 
    filter: drop-shadow(0 0 3px rgba(0, 194, 255, 0.5));
  }

  &:hover { 
    transform: scale(1.1); 
    filter: brightness(1.3) drop-shadow(0 0 8px #00c2ff); 
  }

  @media (max-width: 1100px) { display: block; }
`;

export const SideMenu = styled.div`
  position: fixed; top: 0; left: ${props => props.$isOpen ? '0' : '-100%'};
  width: 320px; height: 100vh;
  background: #0b0b0b;
  border-right: 5px solid #ff007f;
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2000;
  display: flex; flex-direction: column; padding: 40px 30px;
  gap: 25px;

  button, a {
    background: none; border: none; color: #fff;
    font-family: 'Bangers'; font-size: 28px;
    display: flex; align-items: center; gap: 15px;
    cursor: pointer; text-decoration: none; transition: 0.2s;
    svg { font-size: 30px; color: #00c2ff; transition: 0.2s; }
    
    &:hover { 
      color: #ff007f; 
      transform: translateX(10px);
      svg { color: #ff007f; }
    }
  }
`;

// 🔴 BOTÃO PRESS START VERMELHO (Design de Bloco 3D com máxima interatividade)
export const PressStartButton = styled.button`
  && {
    background: #ff0000 !important;
    color: #000 !important;
    border: none;
    padding: ${props => props.$inHeader ? '6px 14px' : '16px'};
    border-radius: ${props => props.$inHeader ? '8px' : '12px'};
    font-family: 'Bangers', cursive;
    font-size: ${props => props.$inHeader ? '16px' : '30px'};
    cursor: pointer;
    display: flex; justify-content: center; align-items: center;
    width: ${props => props.$inHeader ? 'auto' : '100%'};
    margin-top: ${props => props.$inHeader ? '0' : 'auto'};
    
    box-shadow: 0px ${props => props.$inHeader ? '4' : '6'}px 0px #00c2ff;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0px 14px 0px #00c2ff;
      color: #fff !important; /* Letra branca no hover */
    }

    &:active {
      transform: translateY(4px);
      box-shadow: 0px 2px 0px #00c2ff;
    }
  }
`;

export const Overlay = styled.div`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85); z-index: 1500;
`;
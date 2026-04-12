import styled, { keyframes, css } from 'styled-components';

export const neonPulse = keyframes`
  0%, 100% { text-shadow: 2px 2px 0px #000, 0 0 10px #00c2ff, 0 0 20px #00c2ff; color: #00c2ff; }
  50% { text-shadow: 2px 2px 0px #000, 0 0 5px #00c2ff, 0 0 10px #00c2ff; color: #b3ecff; }
`;

export const logoPulse = keyframes`
  0% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 15px rgba(0, 194, 255, 0.4)); }
  50% { transform: translateY(-20px) scale(1.05); filter: drop-shadow(0 0 35px rgba(0, 194, 255, 0.8)); }
  100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 15px rgba(0, 194, 255, 0.4)); }
`;

export const Title = styled.h1`
  color: #fff;
  letter-spacing: clamp(4px, 0.5vw, 10px);
  font-size: ${props => props.$size || '38px'};
  text-align: center;
  text-transform: uppercase;
  animation: ${neonPulse} 3s ease-in-out infinite;
  margin: 0;

  ${props => props.$font === 'bangers' && css`
    font-family: 'Bangers', cursive;
  `}

  ${props => props.$lined && css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 10px;
    
    &::before,
    &::after {
      content: '';
      display: inline-block;
      width: 6px;
      height: 28px;
      background: #00c2ff;
      border-radius: 4px;
      box-shadow: 0 0 8px #00c2ff;
    }
  `}
`;

export const LogoTitleImage = styled.img`
  width: 100%;
  /* Reduzimos o padrão de 350px para 280px para um visual mais clean em telas médias */
  max-width: ${props => props.$maxWidth || '280px'};
  animation: ${logoPulse} 3s ease-in-out infinite;

  /* 🦸 Ajuste de Escala Hero: Reduzida para manter a elegância em 1440px */
  @media (min-width: 1440px) {
    /* Antes chegava a 600px, agora limitamos a 480px */
    max-width: clamp(350px, 25vw, 480px);
  }

  /* 🖥️ Ajuste para UltraWide: Evita que a logo domine todo o viewport */
  @media (min-width: 1920px) {
    /* Antes chegava a 760px, agora o teto é 580px */
    max-width: clamp(450px, 28vw, 580px);
  }
`;
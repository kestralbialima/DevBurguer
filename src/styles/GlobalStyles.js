import { createGlobalStyle, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
  }

  /* ✅ Tarefa 1: Cor sólida SOMENTE no body — única fonte de fundo */
  body {
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    color: #fff;
    min-height: 100vh;
    background-color: #0e0e0e;
    margin: 0;
  }

  /* ✅ Tarefa 1: #root transparente — canvas de partículas (z-index:-1 no body) fica visível */
  #root {
    background: transparent !important;
    min-height: 100vh;
  }

  h1, h2, h3 { font-family: 'Road Rage', cursive; letter-spacing: 2px; }
  button, label { font-family: 'Bangers', cursive; letter-spacing: 1.5px; }
  label { font-size: 1.2rem; margin-bottom: 8px; display: inline-block; }
  button { cursor: pointer; }

  .page-enter { animation: ${fadeIn} 0.6s ease-out forwards; }

  /* 📱 MOBILE: Previne scroll horizontal */
  @media (max-width: 768px) {
    body {
      overflow-x: hidden;
    }
  }
`;
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// 🎨 Estilização Gamer High-End Unificada
const ContainerButton = styled.button`
  font-family: 'Bangers', cursive;
  height: clamp(45px, 6.5vh, 60px);
  width: 100%;
  
  /* 🕹️ Lógica de Fundo: Se for black=true, fundo preto. Caso contrário, vermelho. */
  background: ${props => (props.$black ? '#000' : '#ff0000')};
  
  /* 🕹️ Lógica do Texto: Se for black=true, texto azul neon. Caso contrário, branco. */
  color: ${props => (props.$black ? '#00c2ff' : '#fff')};
  
  /* 🕹️ Lógica da Borda: No modo black, a borda vira azul neon para destacar. */
  border: 4px solid ${props => (props.$black ? '#00c2ff' : '#000')};
  
  border-radius: clamp(10px, 2vh, 15px);
  font-size: clamp(20px, 3vh, 26px);
  cursor: pointer;
  box-shadow: 6px 6px 0px #00c2ff; /* 🎮 Sombra sólida azul neon fixa para manter o tema */
  transition: 0.2s ease-in-out;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #00c2ff;
    
    /* 🕹️ Ajuste de cor no hover para ambos os estados */
    background: ${props => (props.black ? '#1a1a1a' : '#e60000')};
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #00c2ff;
  }
`;

// ⚙️ Lógica do Componente
export function Button({ children, black, ...props }) {
  return (
    /* Passamos a prop 'black' explicitamente para o styled-component ler */
    <ContainerButton $black={black} {...props}>
      {children}
    </ContainerButton>
  );
}

// 🛡️ Validação de Propriedades (Boas práticas)
Button.propTypes = {
  children: PropTypes.node.isRequired, // Permite strings, ícones ou outros elementos
  black: PropTypes.bool,               // Define que black deve ser verdadeiro ou falso
};

// Define um valor padrão caso a prop não seja enviada
Button.defaultProps = {
  black: false,
};
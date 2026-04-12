import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Title } from '../Title';

import CatBurger from '../../assets/cat-burger.jpg';
import CatPortion from '../../assets/cat-portions.jpg';
import CatDrink from '../../assets/cat-drink.jpg';
import CatDessert from '../../assets/cat-dessert.jpg';

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  aspect-ratio: 1 / 1; 
  background-image: url(${props => props.$bg});
  background-size: cover;
  background-position: center;
  border: 2px solid #00c2ff;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  /* ✅ Adicionado Padding para o texto não encostar nas bordas do card */
  padding: 15px; 

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    /* Gradiente mais escuro para garantir que o texto azul brilhe */
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
    z-index: 1;
    transition: background 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0, 194, 255, 0.4);
    border-color: #ffa500;
    
    &::after {
      background: rgba(0, 0, 0, 0.5);
    }

    h3 {
      color: #ffa500;
      text-shadow: 2px 2px 0px #000, 0 0 15px #ffa500;
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(2px) scale(0.98);
  }
`;

const CategoryTitle = styled.h3`
  font-family: 'Bangers', cursive;
  color: #00c2ff;
  font-size: 35px; /* Ajustado levemente para caber melhor em telas pequenas */
  letter-spacing: 2px;
  text-shadow: 3px 3px 0px #000; 
  transition: all 0.3s ease;
  margin: 0;
  text-align: center;
  position: relative;
  z-index: 2;
  /* ✅ Garante que o texto quebre linha se for muito grande, sem sair do card */
  word-wrap: break-word;
  width: 100%;
`;

export function HomeCategories() {
  const navigate = useNavigate();

  /**
   * 🚀 AJUSTE DE ROTA:
   * Para o filtro funcionar, o valor de 'category' na URL deve ser o ID 
   * que o seu banco de dados usa (ex: 1, 2, 3...). 
   * Ajustei os paths abaixo para baterem com a lógica do seu Cardapio.
   */
  const categories = [
    { id: 1, name: 'BURGUER', image: CatBurger, path: '/cardapio?category=1' },
    { id: 2, name: 'PORÇÕES', image: CatPortion, path: '/cardapio?category=2' },
    { id: 3, name: 'BEBIDAS', image: CatDrink, path: '/cardapio?category=3' },
    { id: 4, name: 'DOCES', image: CatDessert, path: '/cardapio?category=4' }
  ];

  return (
    <SectionContainer>
      <Title as="h2" $lined $size="38px">ESCOLHA SEU HP</Title>
      <CategoryGrid>
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            $bg={category.image} 
            onClick={() => navigate(category.path)}
          >
            <CategoryTitle>{category.name}</CategoryTitle>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </SectionContainer>
  );
}
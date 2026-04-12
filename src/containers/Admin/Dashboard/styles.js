import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding-bottom: 50px;
`;

export const GridCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

export const StatCard = styled.div`
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid #333;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  transition: all 0.3s ease;

  h3 {
    color: #fff;
    font-family: 'Bangers', cursive;
    font-size: 26px;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  p {
    font-size: 32px;
    font-weight: bold;
    color: \${props => props.$color || '#00c2ff'};
    text-shadow: 0 0 10px \${props => props.$color || '#00c2ff'};
  }

  svg {
    font-size: 40px;
    margin-bottom: 10px;
    color: \${props => props.$color || '#00c2ff'};
  }

  &:hover {
    border-color: \${props => props.$color || '#00c2ff'};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
    transform: translateY(-5px);
  }
`;

export const TopSellersContainer = styled.div`
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid #333;
  border-radius: 15px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);

  h3 {
    color: #ffca28;
    font-family: 'Bangers', cursive;
    font-size: 28px;
    margin-bottom: 10px;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
  }
`;

const fillBar = keyframes`
  from { width: 0; }
`;

export const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span.name {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }

  span.qty {
    color: #00ff55;
    font-family: 'Bangers', cursive;
    font-size: 18px;
    letter-spacing: 2px;
  }
`;

export const ProgressContainer = styled.div`
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #333;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
`;

export const ProgressBar = styled.div`
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #ff007f, #00c2ff);
  width: \${props => props.$percentage}%;
  animation: \${fillBar} 1.5s cubic-bezier(0.175, 0.885, 0.32, 1) forwards;
  box-shadow: 0 0 10px rgba(0, 194, 255, 0.8);
`;

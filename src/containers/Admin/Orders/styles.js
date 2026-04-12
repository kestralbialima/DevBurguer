import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding-bottom: 50px;
`;

export const OrderCard = styled.div`
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid #333;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  transition: all 0.3s ease;

  &:hover {
    border-color: #00c2ff;
    box-shadow: 0 0 15px rgba(0, 194, 255, 0.2);
  }
`;

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #222;
  padding-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  h3 { color: #00c2ff; font-family: 'Bangers', cursive; font-size: 24px; letter-spacing: 1px; }
  p { color: #ccc; font-size: 14px; font-weight: bold; }
`;

export const StatusSelect = styled.select`
  appearance: none;
  background-color: \${props => 
    props.$status === 'Pedido realizado' ? '#003366' : 
    props.$status === 'Em preparação' ? '#665200' : 
    props.$status === 'Saiu para a entrega' ? '#004d1a' : '#222'
  };
  color: \${props => 
    props.$status === 'Pedido realizado' ? '#66ccff' : 
    props.$status === 'Em preparação' ? '#ffcc00' : 
    props.$status === 'Saiu para a entrega' ? '#00ff55' : '#fff'
  };
  border: 1px solid \${props => 
    props.$status === 'Pedido realizado' ? '#00c2ff' : 
    props.$status === 'Em preparação' ? '#ffca28' : 
    props.$status === 'Saiu para a entrega' ? '#00ff55' : '#555'
  };
  padding: 10px 15px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: 0.3s;

  &:hover {
    filter: brightness(1.2);
  }

  option {
    background-color: #111;
    color: #fff;
  }
`;

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  .product-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(0,0,0,0.4);
    padding: 10px;
    border-radius: 10px;
    border-left: 3px solid #ff007f;

    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #333;
    }

    .product-info {
      h4 { color: #fff; margin-bottom: 4px; font-size: 16px; font-family: 'Bangers', cursive; letter-spacing: 1px; }
      p { color: #aaa; font-size: 12px; }
    }
  }
`;

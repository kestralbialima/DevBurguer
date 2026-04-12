import styled from 'styled-components';

// 🏠 WRAPPER PRINCIPAL: Espaço do módulo de cupons
export const PageWrapper = styled.div`
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

// 🏷️ TÍTULO DA PÁGINA: Estilo Bangers com glow dourado
export const PageTitle = styled.h2`
  font-family: 'Bangers', cursive;
  color: #ffca28;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 202, 40, 0.5), 0 0 40px rgba(255, 202, 40, 0.2);
  letter-spacing: 1px;
`;

// 📐 GRID DE CONTEÚDO: Formulário + Tabela lado a lado
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 🃏 CARD DO FORMULÁRIO: Painel dourado de criação
export const FormCard = styled.div`
  background: rgba(15, 15, 15, 0.95);
  border: 2px solid #ffca28;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 0 30px rgba(255, 202, 40, 0.1);
`;

// 📋 TÍTULO DE SEÇÃO: Cabeçalho dos painéis
export const SectionTitle = styled.h3`
  font-family: 'Bangers', cursive;
  color: #ffca28;
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// 📦 GRUPO DE INPUT: Wrapper vertical para cada campo
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
`;

// 🏷️ LABEL: Rótulo dos campos do formulário
export const Label = styled.label`
  color: #aaa;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #ffca28;
  }
`;

// ⌨️ INPUT: Campo de entrada escuro com borda dourada no foco
export const Input = styled.input`
  background: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 12px 15px;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-size: 0.95rem;

  &:focus {
    border-color: #ffca28;
    outline: none;
    box-shadow: 0 0 10px rgba(255, 202, 40, 0.2);
  }

  &::placeholder {
    color: #555;
  }
`;

// 🔽 SELECT: Seleção de status com mesmo estilo do Input
export const Select = styled.select`
  background: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 12px 15px;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-size: 0.95rem;
  cursor: pointer;

  &:focus {
    border-color: #ffca28;
    outline: none;
    box-shadow: 0 0 10px rgba(255, 202, 40, 0.2);
  }

  option {
    background: #111;
    color: #fff;
  }
`;

// ✅ BOTÃO DE SUBMIT: Gradiente dourado, estilo lendário
export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ffca28, #ff9800);
  color: #000;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  font-family: 'Bangers', cursive;
  font-size: 1.1rem;
  letter-spacing: 1px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 202, 40, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// 📊 CARD DA TABELA: Container da listagem de cupons
export const TableCard = styled.div`
  background: rgba(15, 15, 15, 0.95);
  border: 1px solid #222;
  border-radius: 20px;
  overflow: hidden;
`;

// 🗂️ CABEÇALHO DA TABELA: Barra superior com título
export const TableHeader = styled.div`
  padding: 20px 25px;
  border-bottom: 1px solid #222;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// 📋 TABELA DE CUPONS: Estilizada com modo card para mobile
export const CouponTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead tr {
    background: rgba(255, 202, 40, 0.05);
  }

  th {
    padding: 12px 15px;
    text-align: left;
    color: #ffca28;
    font-family: 'Bangers', cursive;
    font-size: 1rem;
    font-weight: normal;
    border-bottom: 1px solid #333;
    letter-spacing: 0.5px;
  }

  td {
    padding: 12px 15px;
    color: #ddd;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    border-bottom: 1px solid #111;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.03);
    transition: background 0.2s;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  /* 📱 MODO MOBILE: Vira um card vertical */
  @media (max-width: 600px) {
    thead {
      display: none;
    }

    tbody tr {
      display: flex;
      flex-direction: column;
      padding: 15px;
      border-bottom: 2px solid #222;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border: none;

      &::before {
        content: attr(data-label);
        color: #ffca28;
        font-family: 'Bangers', cursive;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
      }
    }
  }
`;

// 🏷️ BADGE DO CÓDIGO: Destaque monospace para o código do cupom
export const CodeBadge = styled.span`
  background: rgba(255, 202, 40, 0.1);
  border: 1px solid rgba(255, 202, 40, 0.3);
  color: #ffca28;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: monospace;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

// 🚦 BADGE DE STATUS: Verde = ativo, vermelho = inativo
export const StatusBadge = styled.span`
  background: ${(props) =>
    props.$active ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 69, 0, 0.15)'};
  border: 1px solid ${(props) => (props.$active ? '#00c853' : '#ff4500')};
  color: ${(props) => (props.$active ? '#00c853' : '#ff4500')};
  
  /* 🚀 CORREÇÃO DE CORTE E ALINHAMENTO */
  padding: 6px 14px;       /* Aumentamos levemente para o texto respirar */
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  
  display: inline-flex;    /* Garante que o badge se ajuste ao conteúdo */
  align-items: center;     /* Centraliza o texto e a bolinha verticalmente */
  justify-content: center;
  gap: 8px;                /* Dá espaço entre a bolinha verde e o texto 'Ativo' */
  white-space: nowrap;     /* 🔒 IMPEDE que o texto quebre ou seja cortado */
  
  min-width: 85px;         /* Garante um tamanho padrão para não variar muito */
`;

// 🗑️ BOTÃO DELETAR: Vermelho fantasma com hover sólido
export const DeleteButton = styled.button`
  background: rgba(255, 69, 0, 0.1);
  border: 1px solid rgba(255, 69, 0, 0.4);
  color: #ff4500;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;

  &:hover {
    background: #ff4500;
    color: #fff;
    box-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
  }
`;

// 📭 ESTADO VAZIO: Quando não há cupons cadastrados
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #555;
  font-family: 'Poppins', sans-serif;

  p {
    margin-top: 15px;
    font-size: 0.9rem;
  }
`;

// ⏳ TEXTO DE CARREGAMENTO: Feedback enquanto busca dados
export const LoadingText = styled.p`
  color: #555;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  padding: 40px 20px;
  font-style: italic;
`;

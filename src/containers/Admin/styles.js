import styled from 'styled-components';

// 🌎 ESTRUTURA GLOBAL: O palco principal do Admin
export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #000;
  position: relative;
  overflow-x: hidden;
`;

// 📟 SIDEBAR (MENU): O painel de controle lateral
export const AdminMenu = styled.aside`
  background: #0b0b0b;
  width: 300px;
  height: 100vh;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #ffca28;
  position: fixed;
  top: 0; left: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 900px) {
    left: ${props => (props.$isOpen ? '0' : '-300px')};
    box-shadow: ${props => (props.$isOpen ? '10px 0 30px rgba(0,0,0,0.9)' : 'none')};
  }
`;

// ✅ CLOSE MENU: Botão de fechar exclusivo para Mobile
export const CloseMenu = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: block;
    align-self: flex-end;
    cursor: pointer;
    color: #ffca28;
    margin-bottom: 20px;
  }
`;

// 🔘 MENU BUTTON: Itens de navegação (Vendas, Inventário...)
export const MenuButton = styled.button`
  background: ${props => props.$active ? 'rgba(255, 202, 40, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#ffca28' : '#333'};
  color: ${props => props.$active ? '#ffca28' : '#fff'};
  padding: 15px;
  border-radius: 12px;
  display: flex; align-items: center; gap: 15px;
  cursor: pointer; transition: 0.3s;
  font-family: 'Poppins'; width: 100%; margin-bottom: 15px;
  &:hover { border-color: #ffca28; transform: translateX(5px); }
`;

// 🍔 MOBILE TOGGLE: O botão hambúrguer que aparece em telas pequenas
export const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 15px; left: 15px; z-index: 1100;
  background: #ffca28; color: #000; border: none;
  border-radius: 8px; padding: 10px; cursor: pointer;
  @media (max-width: 900px) { display: flex; align-items: center; justify-content: center; }
`;

// 🖼️ ÁREA DE CONTEÚDO: Onde as tabelas e formulários são renderizados
export const AdminContent = styled.main`
  flex: 1;
  padding: 40px;
  background: #121212;
  margin-left: 300px;
  @media (max-width: 900px) { margin-left: 0; padding: 80px 20px 20px; }
`;

// 📦 COMPONENTES DE LISTAGEM: Estilo das seções de produtos
export const CategorySection = styled.section`
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.02);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #222;
`;

export const CategoryHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 15px; border-bottom: 2px solid #ffca28; padding-bottom: 10px;
  h2 { font-family: 'Bangers'; color: #ffca28; font-size: 28px; display: flex; align-items: center; gap: 10px; }
`;

export const AddItemButton = styled.button`
  background: rgba(0, 194, 255, 0.1);
  border: 1px dashed #00c2ff;
  color: #00c2ff;
  padding: 8px 16px; border-radius: 8px; font-family: 'Bangers'; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  &:hover { background: #00c2ff; color: #000; box-shadow: 0 0 15px #00c2ff; }
`;

export const TableWrapper = styled.div`
  width: 100%; overflow-x: hidden; border-radius: 15px; background: #0a0a0a;
`;

// 📊 TABELA: Adaptável para Mobile (vira um Card)
export const ProductTable = styled.table`
  width: 100%; border-collapse: collapse;
  thead { @media (max-width: 700px) { display: none; } }
  tr {
    @media (max-width: 700px) {
      display: flex; flex-direction: column; padding: 15px;
      border-bottom: 2px solid #222; align-items: center; gap: 8px;
    }
  }
  td {
    padding: 10px; color: #fff; text-align: center; border-bottom: 1px solid #1a1a1a;
    @media (max-width: 700px) { border: none; width: 100%; padding: 2px; }
    img { border-radius: 12px; border: 2px solid #ffca28; object-fit: cover; }
  }
  .actions {
    display: flex; gap: 10px; justify-content: center;
    button {
      padding: 8px; border-radius: 8px; cursor: pointer; border: none;
      &.info, &.edit { background: #ffca28; color: #000; }
      &.delete { background: #ff4500; color: #fff; }
    }
  }
`;

// 🟡 BOTÃO LOOT LENDÁRIO (Amarelo)
export const StatusButton = styled.button`
  background: ${props => props.$isOffer ? 'rgba(255, 202, 40, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isOffer ? '#ffca28' : '#444'};
  color: ${props => props.$isOffer ? '#ffca28' : '#888'};
  padding: 8px 14px;
  border-radius: 10px;
  font-family: 'Bangers';
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: 0.3s;
`;
// 🔵 BONUS BUTTON (Azul - Bônus) - REVISADO
export const BonusButton = styled.button`
  /* 🕵️‍♀️ O SEGREDO: Ele precisa ler a prop '$isBonus' que mandamos no index */
  background: ${props => props.$isBonus ? 'rgba(0, 194, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isBonus ? '#00c2ff' : '#444'};
  color: ${props => props.$isBonus ? '#00c2ff' : '#888'};
  
  padding: 8px 14px;
  border-radius: 10px;
  font-family: 'Bangers';
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: 0.3s;

  &:hover {
    background: ${props => props.$isBonus ? '#00c2ff' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$isBonus ? '#000' : '#fff'};
  }
`;

// 📝 FORMULÁRIO (PARA ADICIONAR NOVOS ITENS)
export const FormContainer = styled.form`
  background: rgba(15, 15, 15, 0.95); border: 2px solid #ffca28;
  padding: 40px; border-radius: 25px; width: 100%; max-width: 650px; margin: 0 auto;
`;

export const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;
  input, select, textarea { background: #111; border: 1px solid #333; color: #fff; padding: 14px; border-radius: 10px; }
`;

export const Label = styled.label`
  color: #fff; font-family: 'Poppins'; font-weight: 500; display: flex; align-items: center; gap: 10px;
  svg { color: #ffca28; }
`;

export const CheckboxGroup = styled.div`
  display: flex; align-items: center; gap: 10px; color: #fff;
  input { width: 20px; height: 20px; accent-color: #ffca28; }
`;
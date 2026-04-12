import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiArrowLeft } from 'react-icons/fi';

import { useUser } from '../../hooks/UserContext'; // 🚀 Hook para pegar dados do Player
import { Title } from '../../components/Title';      // Seu componente de título neon
import { Button } from '../../components/Button';    // Seu componente de botão padrão

// --- 🎨 ESTILIZAÇÃO ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  /* 🛠️ Ajuste de Padding: 140px no topo garante que o Header não corte o título */
  padding: 140px 20px 60px 20px; 
  min-height: 100vh;
  width: 100%;
  background: transparent; // Deixa as partículas do fundo aparecerem
`;

const InfoCard = styled.div`
  background: rgba(15, 15, 15, 0.9);
  border: 2px solid #00c2ff;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 25px rgba(0, 194, 255, 0.2);
  backdrop-filter: blur(10px); // Efeito de vidro (Glassmorphism)

  .field {
    margin-bottom: 25px;
    border-bottom: 1px solid rgba(0, 194, 255, 0.1);
    padding-bottom: 10px;

    label {
      display: block;
      color: #00c2ff;
      font-family: 'Bangers', cursive;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 5px;
    }

    p {
      color: #fff;
      font-size: 20px;
      font-weight: 300;
    }
  }

  .status-badge {
    color: #ff0055;
    font-weight: bold;
    text-transform: uppercase;
    font-family: 'Bangers', cursive;
    font-size: 22px;
    letter-spacing: 1px;
  }
`;

// --- 🕹️ COMPONENTE PRINCIPAL ---

export function Perfil() {
  const { userData } = useUser(); // 👤 Puxa os dados reais do jogador (nome, email, admin)
  const navigate = useNavigate(); // 🧭 Hook para navegação

  return (
    <Container>
      {/* Título com brilho azul neon */}
      <Title $size="40px" style={{ textShadow: '0 0 15px #00c2ff' }}>
        STATUS DO PLAYER
      </Title>
      
      <InfoCard>
        <div className="field">
          <label>Codinome (Nome)</label>
          <p>{userData?.name || "Carregando..."}</p>
        </div>

        <div className="field">
          <label>ID de Acesso (E-mail)</label>
          <p>{userData?.email || "usuario@corebuild.com"}</p>
        </div>

        <div className="field" style={{ border: 'none' }}>
          <label>Nível de Acesso</label>
          <p className="status-badge">
            {userData?.admin ? 'ADMINISTRADOR' : 'PLAYER VIP'}
          </p>
        </div>
      </InfoCard>

      {/* 🔙 Botão de Voltar: Reutiliza o seu componente Button. 
          O navigate(-1) faz o usuário voltar exatamente de onde ele veio. */}
      <Button 
        onClick={() => navigate(-1)} 
        style={{ 
            marginTop: '20px', 
            width: 'fit-content', 
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}
      >
        <FiArrowLeft size={20} /> VOLTAR AO MAPA
      </Button>
    </Container>
  );
}
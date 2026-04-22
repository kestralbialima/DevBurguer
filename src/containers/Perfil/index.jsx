import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi'; 
import { toast } from 'react-toastify';

import api from '../../services/api';
import { useUser } from '../../hooks/UserContext'; 
import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

// --- 🎨 ESTILIZAÇÃO (Componentes Internos para evitar erro 500) ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 140px 20px 60px 20px; 
  min-height: 100vh;
  width: 100%;
  background: transparent;
`;

const InfoCard = styled.div`
  background: rgba(15, 15, 15, 0.9);
  border: 2px solid #00c2ff;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 25px rgba(0, 194, 255, 0.2);
  backdrop-filter: blur(10px);

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

// 🚨 Botão de Exclusão (Estilo Alerta Vermelho Neon)
const DeleteAccountButton = styled.button`
  background: transparent;
  color: #ff4444;
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'Bangers', cursive;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;

  &:hover {
    background: #ff4444;
    color: #fff;
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
  }
`;

// --- 🕹️ COMPONENTE PRINCIPAL ---

export function Perfil() {
  const { userData, logout } = useUser(); 
  const navigate = useNavigate();

  // 🛡️ FUNÇÃO: Excluir a própria conta
  const handleDeleteAccount = async () => {
    // Confirmação de segurança nativa do browser
    const confirmDelete = window.confirm(
      "ATENÇÃO, PLAYER! Você está prestes a apagar sua conta permanentemente. Confirmar exclusão?"
    );

    if (confirmDelete) {
      try {
        // Chamada ao backend passando o ID do usuário logado
        await api.delete(`/users/${userData.id}`);
        
        toast.success("Conta excluída com sucesso. Até a próxima!");
        
        logout(); // Limpa os dados do LocalStorage e encerra a sessão
        navigate('/login'); // Redireciona para o início
      } catch (err) {
        // Se der erro 404 ou 500 no banco, avisa o usuário
        toast.error("Ocorreu um erro ao tentar excluir sua conta.");
      }
    }
  };

  return (
    <Container>
      {/* Título com brilho azul neon via Prop do componente Title */}
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

        {/* 🚨 ZONA DE RISCO: Só aparece para usuários que NÃO são administradores 
            Proteção lógica para não deletar a conta Master por aqui.
        */}
        {!userData?.admin && (
          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255, 68, 68, 0.2)', paddingTop: '20px' }}>
            <label style={{ color: '#ff4444', fontSize: '11px', display: 'block', marginBottom: '10px' }}>
              GERENCIAMENTO DE CONTA
            </label>
            <DeleteAccountButton onClick={handleDeleteAccount}>
              <FiTrash2 size={18} /> DELETAR MINHA CONTA
            </DeleteAccountButton>
          </div>
        )}
      </InfoCard>

      {/* Botão de Voltar */}
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
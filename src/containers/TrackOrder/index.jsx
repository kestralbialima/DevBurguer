import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

import { api } from '../../services/api';
import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

// --- 🎨 ESTILIZAÇÃO (Mantendo seus nomes originais) ---

const Container = styled.div`
  padding: 140px 20px 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;

  /* 🚀 ADICIONE ESTE TRECHO ABAIXO PARA CORRIGIR A SOBREPOSIÇÃO */
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; /* Cria o espaço vertical entre o Título e o ID */
    margin-bottom: 20px;
  }
`;

const StatusList = styled.div`
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 400px;
`;

const StatusStep = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.5s ease;
  
  /* 💡 Lógica visual baseada na prop $isCompleted */
  opacity: ${props => (props.$isCompleted ? 1 : 0.2)};
  filter: ${props => (props.$isCompleted ? 'drop-shadow(0 0 8px #00c2ff)' : 'none')};

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #00c2ff;
    background: ${props => (props.$isCompleted ? '#00c2ff' : 'transparent')};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  p {
    color: #fff;
    font-family: 'Bangers', cursive;
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;

// --- 🕹️ COMPONENTE PRINCIPAL ---

export function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  /** * 🚩 ALINHAMENTO DE STATUS:
   * Estes nomes devem ser IDÊNTICOS aos que você definiu no OrderController.
   * Ajustei as letras para bater com o padrão 'Pedido realizado'.
   */
  const statusSteps = [
    "Pedido realizado",
    "Em preparação",
    "Saiu para a entrega",
    "Finalizado"
  ];

  useEffect(() => {
    let interval;

    async function loadOrder() {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        if (err.response?.status === 404) {
          clearInterval(interval);
        }
      }
    }

    loadOrder();
    // 🔄 Checa por atualizações a cada 5 segundos
    interval = setInterval(loadOrder, 5000);

    return () => clearInterval(interval);
  }, [id]);

  /**
   * 🧐 Lógica de Progresso:
   * Comparamos a posição (index) do status atual com a posição de cada etapa.
   */
  const checkStatus = (stepName) => {
    if (!order || !order.status) return false;
    
    // Encontra em que fase o pedido está no banco
    const currentStatusIndex = statusSteps.indexOf(order.status);
    // Encontra em que fase esta bolinha específica está
    const stepIndex = statusSteps.indexOf(stepName);

    // Se a etapa for menor ou igual à fase atual, ela está concluída!
    return stepIndex <= currentStatusIndex;
  };

  return (
    <Container>
      <header>
      <Title $size="40px">ACOMPANHANDO MISSÃO</Title>
      
        {/* Exibição do ID formatado */}
        <p style={{ color: '#00c2ff', fontFamily: 'Bangers', marginTop: '-20px' }}>
          #{id?.substring(0, 8).toUpperCase()}
        </p>
      </header>

      <StatusList>
        {statusSteps.map((step) => (
          <StatusStep key={step} $isCompleted={checkStatus(step)}>
            <div className="circle">
              {checkStatus(step) && <FiCheckCircle size={14} color="#000" />}
            </div>
            {/* Transformamos em uppercase apenas na exibição para manter o estilo gamer */}
            <p>{step.toUpperCase()}</p>
          </StatusStep>
        ))}
      </StatusList>

      <Button 
        onClick={() => navigate('/meus-pedidos')} 
        style={{ marginTop: '20px', background: 'transparent', border: '1px solid #333' }}
      >
        <FiArrowLeft /> VOLTAR AO HISTÓRICO
      </Button>
    </Container>
  );
}
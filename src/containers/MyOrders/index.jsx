import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPackage, FiArrowLeft, FiActivity, FiEye } from 'react-icons/fi';

import { api } from '../../services/api';
import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

// --- 🎨 ESTILIZAÇÃO ---

const Container = styled.div`
  padding: 140px 20px 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const EmptyState = styled.div`
  text-align: center;
  background: rgba(15, 15, 15, 0.9);
  padding: 40px;
  border-radius: 20px;
  border: 1px dashed #00c2ff;
  max-width: 500px;
  
  p { color: #888; margin: 20px 0; font-size: 18px; }
`;

const OrderCard = styled.div`
  background: rgba(20, 20, 20, 0.9);
  /* Borda esquerda dinâmica: Rosa para missões ativas, Azul para finalizadas */
  border-left: 5px solid ${props => props.$isFinished ? '#00c2ff' : '#ff0055'};
  box-shadow: ${props => props.$isFinished ? 'none' : '0 0 15px rgba(255, 0, 85, 0.2)'};
  
  padding: 20px;
  margin-bottom: 15px;
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.01);
  }
`;

// --- 🕹️ COMPONENTE PRINCIPAL ---

export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // 🚀 ESTADO: Controla se mostra tudo ou só os 5 primeiros
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data } = await api.get('/orders');
        
        // Ordena para que os mais recentes apareçam primeiro
        const sortedOrders = data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (err) {
        console.error("Erro ao carregar missões:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  /**
   * ✂️ LÓGICA DE EXIBIÇÃO:
   * Se showAll for falso, pegamos apenas do índice 0 ao 5 do array.
   */
  const displayedOrders = showAll ? orders : orders.slice(0, 5);

  if (loading) return null;

  return (
    <Container>
      <Title $size="40px">HISTÓRICO DE MISSÕES</Title>

      {orders.length === 0 ? (
        <EmptyState>
          <FiPackage size={50} color="#00c2ff" />
          <p>Você ainda não completou nenhuma missão. Seu inventário está vazio!</p>
          <Button onClick={() => navigate('/cardapio')}>
            INICIAR NOVA MISSÃO
          </Button>
        </EmptyState>
      ) : (
        <>
          {displayedOrders.map(order => {
            const isFinished = order.status === 'Finalizado';

            return (
              <OrderCard 
                key={order._id} 
                $isFinished={isFinished}
                onClick={() => !isFinished && navigate(`/acompanhar-pedido/${order._id}`)}
                style={{ cursor: isFinished ? 'default' : 'pointer' }}
              >
                <div>
                  <span style={{ color: '#888', fontSize: '12px' }}>ID: #{order._id.substring(order._id.length - 8)}</span>
                  
                  <p style={{ 
                      color: isFinished ? '#fff' : '#ff0055', 
                      fontFamily: 'Bangers', 
                      fontSize: '20px',
                      marginTop: '5px'
                  }}>
                    STATUS: {order.status.toUpperCase()}
                  </p>

                  {!isFinished && (
                      <span style={{ color: '#ff0055', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FiActivity /> MISSÃO EM ANDAMENTO...
                      </span>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#00c2ff', fontFamily: 'Bangers', fontSize: '18px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#888', fontSize: '12px' }}>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </OrderCard>
            );
          })}

          {/* 👁️ BOTÃO VER TUDO: Só aparece se houver mais de 5 pedidos e não estivermos mostrando todos */}
          {orders.length > 5 && !showAll && (
            <Button 
              onClick={() => setShowAll(true)}
              style={{ background: 'rgba(0, 194, 255, 0.1)', border: '1px solid #00c2ff', marginBottom: '20px' }}
            >
              <FiEye /> VER TODAS AS MISSÕES ({orders.length})
            </Button>
          )}
        </>
      )}

      {/* 🧭 NAVEGAÇÃO: Corrigido para voltar à Home (/) em vez do carrinho */}
      <Button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '20px', background: 'transparent', border: '1px solid #333' }}
      >
        <FiArrowLeft /> VOLTAR AO INVENTÁRIO
      </Button>
    </Container>
  );
}
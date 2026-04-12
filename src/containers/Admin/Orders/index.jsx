import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';
import { Container, OrderCard, OrderHeader, UserInfo, ProductsList, StatusSelect } from './styles';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status mapping based on backend logic
  const statusOptions = [
    { value: 'Pedido realizado', label: '🔵 Pedido Realizado' },
    { value: 'Em preparação', label: '🟡 Em Preparação' },
    { value: 'Saiu para a entrega', label: '🟢 Saiu para a Entrega' }
  ];

  async function loadOrders() {
    try {
      setLoading(true);
      const { data } = await api.get('orders');
      
      // Ordena por data mais recente e filtra os já finalizados
      const sorted = (Array.isArray(data) ? data : [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter(order => order.status !== 'Finalizado');
        
      setOrders(sorted);
    } catch (err) {
      toast.error('❌ Falha ao carregar os pedidos no banco de dados MongoDB.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      const toastId = toast.loading('Atualizando status no MongoDB...');
      
      await api.put(`orders/${orderId}`, { status: newStatus });
      
      toast.update(toastId, {
        render: 'Status atualizado com sucesso! 🚀',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      // Atualiza o estado local para rápida resposta da interface
      if (newStatus === 'Finalizado') {
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      }
    } catch (err) {
      toast.error('Erro ao atualizar. Servidor indisponível.');
    }
  }

  if (loading) return <h2 style={{color: '#00c2ff', textAlign: 'center', marginTop: '40px', fontFamily: 'Bangers'}}>Buscando Transmissões...</h2>;

  return (
    <Container>
      <h2 style={{color: '#ffca28', fontFamily: 'Bangers', fontSize: '30px', marginBottom: '20px'}}>PAINEL DE LOGÍSTICA (PEDIDOS)</h2>

      {orders.length === 0 ? (
        <p style={{color: '#888'}}>Nenhum pedido foi feito ainda.</p>
      ) : (
        orders.map(order => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <UserInfo>
                <h3>ID: #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                <p>👤 Player: {order.user.name}</p>
                <p>🕒 {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                <h4 style={{ color: '#00ff55', marginTop: '5px' }}>
                  Total: R$ {order.products.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)}
                </h4>
              </UserInfo>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <StatusSelect 
                  value={order.status} 
                  $status={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </StatusSelect>

                <button 
                  onClick={() => {
                    if(window.confirm('Arquivar este pedido como FINALIZADO?')) {
                      handleStatusChange(order._id, 'Finalizado');
                    }
                  }}
                  style={{
                    background: '#ff0000', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '10px 15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Bangers',
                    fontSize: '16px', boxShadow: '0 4px 0 #990000', transition: '0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  🏁 FINALIZAR
                </button>
              </div>
            </OrderHeader>

            <ProductsList>
              {order.products.map(product => (
                <div key={product.id} className="product-item">
                  <img src={product.url} alt={product.name} />
                  <div className="product-info">
                    <h4>{product.quantity}x {product.name}</h4>
                    <p>Cat: {product.Category} | R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </ProductsList>
          </OrderCard>
        ))
      )}
    </Container>
  );
}

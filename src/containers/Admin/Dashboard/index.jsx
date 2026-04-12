import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';
import { FiDollarSign, FiShoppingBag, FiStar } from 'react-icons/fi';
import { Container, GridCards, StatCard, TopSellersContainer, BarWrapper, BarHeader, ProgressContainer, ProgressBar } from './styles';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalItems: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const { data } = await api.get('orders');
        
        // 1. Filtrar Apenas Pedidos Finalizados
        const finalOrders = (Array.isArray(data) ? data : []).filter(order => order.status === 'Finalizado');

        let revenue = 0;
        let itemsSold = 0;
        const productsMap = {};

        // 2. Extração de Números
        finalOrders.forEach(order => {
          order.products.forEach(product => {
            // Soma Receita
            revenue += (product.price * product.quantity);
            // Soma Quantidade
            itemsSold += product.quantity;

            // Mapeamento para os Mais Vendidos
            if (productsMap[product.name]) {
              productsMap[product.name] += product.quantity;
            } else {
              productsMap[product.name] = product.quantity;
            }
          });
        });

        // 3. Organiza o Top 5
        const sortedProducts = Object.keys(productsMap)
          .map(name => ({ name, quantity: productsMap[name] }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setStats({
          totalRevenue: revenue,
          totalItems: itemsSold,
          topProducts: sortedProducts
        });

      } catch (err) {
        toast.error('Gamer Over ao tentar extrair estatísticas.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <h2 style={{color: '#00c2ff', textAlign: 'center', marginTop: '40px', fontFamily: 'Bangers'}}>DECIFRANDO DADOS...</h2>;

  // Pegamos o produto mais vendido como referência de 100% para a barra de XP
  const maxQty = stats.topProducts.length > 0 ? stats.topProducts[0].quantity : 1;

  return (
    <Container>
      <h2 style={{color: '#ffca28', fontFamily: 'Bangers', fontSize: '30px', marginBottom: '10px'}}>VISÃO DE LUCROS E MÉTRICAS</h2>
      
      <GridCards>
        <StatCard $color="#00ff55">
          <FiDollarSign />
          <h3>FATURAMENTO BRUTO</h3>
          <p>R$ {stats.totalRevenue.toFixed(2)}</p>
        </StatCard>

        <StatCard $color="#ff007f">
          <FiShoppingBag />
          <h3>ITENS VENDIDOS</h3>
          <p>{stats.totalItems}</p>
        </StatCard>
      </GridCards>

      <TopSellersContainer>
        <h3><FiStar style={{marginRight: '10px'}}/> TOP 5 DROPS MAIS VENDIDOS</h3>
        
        {stats.topProducts.length === 0 ? (
          <p style={{color: '#888'}}>Nenhum pedido finalizado ainda para gerar estatísticas.</p>
        ) : (
          stats.topProducts.map((p, index) => {
            const percentage = (p.quantity / maxQty) * 100;
            return (
              <BarWrapper key={index}>
                <BarHeader>
                  <span className="name">{index + 1}. {p.name}</span>
                  <span className="qty">{p.quantity}x</span>
                </BarHeader>
                <ProgressContainer>
                  <ProgressBar $percentage={percentage} />
                </ProgressContainer>
              </BarWrapper>
            );
          })
        )}
      </TopSellersContainer>
    </Container>
  );
}

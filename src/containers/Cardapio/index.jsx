import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

import { useCart } from '../../hooks/CartContext';
import { Header } from '../../components/Header';
import { ProductModal } from '../../components/ProductModal';
import { api } from '../../services/api';

// --- 🎨 ESTILIZAÇÃO ---

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 1;
  padding: 100px 20px 60px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
  flex-wrap: wrap;

  button {
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-family: 'Bangers', cursive;
    font-size: 20px;
    padding: 8px 25px;
    border: 2px solid #00c2ff;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;

    &.active {
      background: #00c2ff;
      color: #000;
      box-shadow: 0 0 15px #00c2ff;
    }
  }
`;

export const GridMenu = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 500px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  @media (min-width: 1200px) { grid-template-columns: repeat(5, 1fr); }
`;

const QtySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #222;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #00c2ff;

  button {
    background: #00c2ff;
    border: none;
    border-radius: 6px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover { background: #ff0055; }
  }
  span { font-family: 'Bangers'; color: #fff; font-size: 16px; }
`;

export const GridCard = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(10, 10, 10, 0.85);
  border: 2px solid ${props => props.$inCart ? '#00c2ff' : '#333'};
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;

  .badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #00c2ff;
    color: #000;
    padding: 3px 8px;
    border-radius: 10px;
    font-family: 'Bangers';
    font-size: 12px;
    z-index: 10;
  }

  .image-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* 🛠️ encodeURI resolve problemas de espaços ou acentos no nome do arquivo */
    background-image: ${props => `url('${encodeURI(props.$bg)}')`};
    background-size: cover;
    background-position: center;
  }

  .content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

// --- 🕹️ COMPONENTE PRINCIPAL ---

export function Cardapio() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { putProductInCart, cartProducts, increaseProduct, decreaseProduct } = useCart();

  const activeCategoryId = searchParams.get('category') || 'todos';

  // --- 🚀 EFEITO 1: Carregar Dados da API ---
  useEffect(() => {
    async function loadData() {
      try {
        const [responseProducts, responseCategories] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(responseProducts.data.products || responseProducts.data);
        setCategories(responseCategories.data.categories || responseCategories.data);
      } catch (err) {
        // Erro silencioso no console conforme solicitado, apenas log interno para você
        // console.error("Erro ao carregar cardápio:", err);
      }
    }
    loadData();
  }, []);

  // --- 🎯 EFEITO 2: Scroll to Top (Correção manual aplicada) ---
  useEffect(() => {
    // Sempre que a categoria ativa mudar, o navegador volta ao topo suavemente
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeCategoryId]);

  const getProductQty = (id) => {
    const product = cartProducts.find(p => p.id === id);
    return product ? product.quantity : 0;
  };

  const filteredProducts = activeCategoryId === 'todos'
    ? products
    : products.filter(p => p.category_id === Number(activeCategoryId));

  const handleFilter = (id) => {
    if (id === 'todos') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <Container className="page-enter">
      <Header />
      <Content>
        {/* Barra de Filtros */}
        <FilterBar>
          <button 
            className={activeCategoryId === 'todos' ? 'active' : ''} 
            onClick={() => handleFilter('todos')}
          >
            TUDO
          </button>
          {Array.isArray(categories) && categories.map(cat => (
            <button 
              key={cat.id}
              className={activeCategoryId === String(cat.id) ? 'active' : ''} 
              onClick={() => handleFilter(cat.id)}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </FilterBar>

        {/* Listagem de Produtos */}
        <GridMenu>
          {filteredProducts.map((item) => {
            const qty = getProductQty(item.id);
            return (
             <GridCard key={item.id} $bg={item.url} $inCart={qty > 0}>
                {qty > 0 && <div className="badge">{qty} NA SACOLA</div>}
                
                {/* Imagem com clique para abrir o Modal de detalhes */}
                <div 
                  className="image-container" 
                  onClick={() => setSelectedProduct(item)} 
                  style={{ cursor: 'pointer' }} 
                />
                
                <div className="content">
                  <h3 style={{ color: '#fff', fontFamily: 'Bangers' }}>{item.name}</h3>
                  
                  <div className="price-row">
                    <span style={{ color: '#00c2ff', fontFamily: 'Bangers', fontSize: '20px' }}>
                      R$ {item.price}
                    </span>

                    {/* Controle de Quantidade - Sincronizado com o Hook de Carrinho */}
                    {qty > 0 ? (
                      <QtySelector>
                        <button onClick={() => decreaseProduct(item.id)}><FiMinus /></button>
                        <span>{qty}</span>
                        <button onClick={() => increaseProduct(item.id)}><FiPlus /></button>
                      </QtySelector>
                    ) : (
                      <button 
                        onClick={() => {
                          putProductInCart(item);
                          toast.success("Adicionado ao loot! 🍔");
                        }}
                        style={{ 
                          background: '#00c2ff', 
                          border: 'none', 
                          borderRadius: '50%', 
                          padding: '8px', 
                          cursor: 'pointer' 
                        }}
                      >
                        <FiShoppingBag size={18} color="#000" />
                      </button>
                    )}
                  </div>
                </div>
              </GridCard>
            );
          })}
        </GridMenu>
      </Content>

      {/* Modal de Zoom do Produto */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </Container>
  );
}
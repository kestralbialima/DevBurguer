import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiStar, FiPlus, FiChevronRight, FiChevronDown, FiFileText } from 'react-icons/fi';

import { ProductModal } from '../../components/ProductModal';

import {
  ProductTable, CategorySection, TableWrapper, StatusButton,
  BonusButton, CategoryHeader, AddItemButton
} from './styles';

export function ListProducts({ onEditProduct, onNewProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // 🛡️ Estados Modais (Preservados)
  const [productToDelete, setProductToDelete] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  /**
   * 📡 FUNÇÃO: loadData
   * Sincroniza o Front com o Banco do Render.
   * REMOVIDO: categoryNames fixo (Agora o Banco manda no nome).
   */
  async function loadData() {
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      if (!userData) return toast.error("Usuário não autenticado.");

      const config = { headers: { Authorization: `Bearer ${userData.token}` } };

      const [resProducts, resCategories] = await Promise.all([
        api.get('products', config),
        api.get('categories', config)
      ]);

      const categoriesList = resCategories.data.categories || resCategories.data;
      const productsList = resProducts.data.products || resProducts.data;

      setProducts(Array.isArray(productsList) ? productsList : []);
      setCategories(Array.isArray(categoriesList) ? categoriesList : []);

      if (categoriesList.length > 0 && !activeCategory) {
        setActiveCategory(categoriesList[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  /**
   * 🔄 FUNÇÃO: toggleOffer
   * Inverte o estado de 'offer' no PostgreSQL.
   */
  const toggleOffer = async (product) => {
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      await api.put(`products/${product.id}`,
        { ...product, offer: !product.offer },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      toast.success(`${product.name} atualizado no Loot!`);
      loadData(); 
    } catch (err) { toast.error("Falha ao atualizar oferta."); }
  };

  /**
   * 🔄 FUNÇÃO: toggleBonus
   */
  const toggleBonus = async (product) => {
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };

      await api.put(`products/${product.id}`,
        { ...product, is_bonus: !product.is_bonus },
        config
      );

      toast.success(`${product.name} atualizado no Bônus!`);
      loadData();
    } catch (err) {
      toast.error("Erro ao sincronizar bônus.");
    }
  };

  /**
   * 🗑️ FUNÇÃO: confirmDelete
   * Remove permanentemente o registro do PostgreSQL.
   */
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    const toastId = toast.loading("Apagando do mapa...");
    
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      await api.delete(`products/${productToDelete.id}`, { 
        headers: { Authorization: `Bearer ${userData.token}` } 
      });
      
      toast.update(toastId, {
        render: "Item banido permanentemente!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      setProductToDelete(null); 
      loadData(); 
    } catch (err) { 
      toast.update(toastId, {
        render: "Erro ao deletar item.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (loading) return (
    <p style={{ color: '#ffca28', textAlign: 'center', marginTop: '50px', fontFamily: 'Bangers', fontSize: '24px' }}>
      SINCRONIZANDO COM O RENDER...
    </p>
  );

  return (
    <div style={{ paddingBottom: '80px' }}>
      {categories.map(category => {
        const isOpen = activeCategory === category.id;
        
        // 🎯 Lógica Dinâmica: O nome vem direto do Banco e fica em CAIXA ALTA
        const displayName = category.name.toUpperCase();

        return (
          <CategorySection key={category.id}>
            <CategoryHeader onClick={() => setActiveCategory(isOpen ? null : category.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {isOpen ? <FiChevronDown color="#ffca28" /> : <FiChevronRight />}
                <h2>{displayName}</h2>
              </div>
              <AddItemButton onClick={(e) => { 
                e.stopPropagation(); 
                if (onNewProduct) onNewProduct(category.id); 
              }}>
                <FiPlus /> NOVO DROP
              </AddItemButton>
            </CategoryHeader>

            {isOpen && (
              <TableWrapper>
                <ProductTable>
                  <thead>
                    <tr>
                      <th>DROP</th>
                      <th>DESCRIÇÃO</th>
                      <th>PREÇO</th>
                      <th>AÇÕES</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.category_id === category.id).map(product => (
                      <tr key={product.id}>
                        <td>
                          <img 
                            src={`${product.url}?t=${Date.now()}`} 
                            alt={product.name} 
                            width="90" height="90" 
                            style={{ border: '2px solid #ffca28', borderRadius: '12px', objectFit: 'cover' }} 
                          />
                        </td>
                        <td>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Bangers', fontSize: '24px', color: '#ffca28', display: 'block' }}>
                              {product.name}
                            </span>
                            <span style={{ fontSize: '12px', color: '#888', display: 'block' }}>
                              {product.description}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
                          R$ {product.price.toFixed(2)}
                        </td>
                        <td className="actions">
                          <button className="info" onClick={() => setPreviewProduct(product)}><FiFileText /></button>
                          <button className="edit" onClick={() => onEditProduct && onEditProduct(product)}><FiEdit /></button>
                          <button className="delete" onClick={() => setProductToDelete(product)}><FiTrash2 /></button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <StatusButton
                              $isOffer={product.offer}
                              onClick={() => toggleOffer(product)}
                            >
                              <FiStar /> {product.offer ? "LOOT ATIVO" : "LOOT LENDÁRIO"}
                            </StatusButton>

                            <BonusButton
                              $isBonus={product.is_bonus}
                              onClick={() => toggleBonus(product)}
                            >
                              <FiPlus /> {product.is_bonus ? "BÔNUS ATIVO" : "BÔNUS DA FASE"}
                            </BonusButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ProductTable>
              </TableWrapper>
            )}
          </CategorySection>
        );
      })}

      {/* ⚠️ MODAL DE CONFIRMAÇÃO DE DELETE (Preservado) */}
      {productToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#0b0b0b', border: '2px solid #ff007f', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 0 40px rgba(255,0,127,0.3)', maxWidth: '400px' }}>
            <h2 style={{color: '#ffca28', fontFamily: 'Bangers', fontSize: '32px'}}>⚠️ ALERTA DE BANIMENTO ⚠️</h2>
            <p style={{color: '#e0e0e0', margin: '20px 0', fontSize: '18px', fontFamily: 'Poppins'}}>
              Tem certeza que deseja banir o item <strong style={{color: '#00c2ff'}}>{productToDelete.name}</strong> permanentemente?
            </p>
            <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px'}}>
              <button onClick={() => setProductToDelete(null)} style={{padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '20px'}}>CANCELAR</button>
              <button onClick={confirmDelete} style={{padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#ff007f', color: '#fff', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '20px', boxShadow: '0 4px 0 #99004d'}}>SIM, EXCLUIR</button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ MODAL DE VISUALIZAÇÃO (Preservado) */}
      <ProductModal 
        product={previewProduct} 
        onClose={() => setPreviewProduct(null)} 
        isAdminView={true} 
      />
    </div>
  );
}
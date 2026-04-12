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
  
  // 🛡️ Estados Modais:
  const [productToDelete, setProductToDelete] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null); // Preview do Item

  const categoryNames = {
    "Hambúrgueres": "LOOT LENDÁRIO",
    "Bebidas": "BÔNUS DA FASE",
    "Sobremesas": "EXTRA EXP"
  };

  /**
   * 📡 FUNÇÃO: loadData
   * Responsável por sincronizar o Front-end com o Banco de Dados (PostgreSQL).
   * Ela busca produtos e categorias e atualiza o estado local.
   */
  async function loadData() {
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
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
      toast.error("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  /**
   * 🔄 FUNÇÃO: toggleOffer (Loot Lendário)
   * Envia uma requisição PUT para o Back-end invertendo o valor de 'offer'.
   * Se era true, vira false (e sai do carrossel da Home).
   */
  const toggleOffer = async (product) => {
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      await api.put(`products/${product.id}`,
        { ...product, offer: !product.offer },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      toast.success(`${product.name} atualizado no Loot!`);
      loadData(); // 🔄 Recarrega para refletir a mudança visual
    } catch (err) { toast.error("Falha ao atualizar oferta."); }
  };

  /**
    * 🔄 FUNÇÃO: toggleBonus
    * Inverte o estado no PostgreSQL. Se o banco retornar sucesso, 
    * chamamos loadData() para buscar a lista nova e "acender" o botão.
    */
  const toggleBonus = async (product) => {
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };

      // 📡 Enviamos para a API o produto com o campo is_bonus invertido
      await api.put(`products/${product.id}`,
        { ...product, is_bonus: !product.is_bonus },
        config
      );

      toast.success(`${product.name} atualizado no Bônus!`);

      // 🔄 AQUI ESTÁ O PULO DO GATO:
      // Precisamos recarregar os dados para que o 'product.is_bonus' 
      loadData();
    } catch (err) {
      toast.error("Erro ao sincronizar com o servidor.");
    }
  };

  /**
   * 🗑️ FUNÇÃO: confirmDelete
   * Remove permanentemente o registro do PostgreSQL após confirmação pelo Modal Mágico.
   */
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    const toastId = toast.loading("Apagando do mapa...");
    
    try {
      const userData = JSON.parse(localStorage.getItem('devburger:userData'));
      await api.delete(`products/${productToDelete.id}`, { headers: { Authorization: `Bearer ${userData.token}` } });
      
      toast.update(toastId, {
        render: "Item banido permanentemente!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      setProductToDelete(null); // Fecha modal
      loadData(); // Atualiza lista
    } catch (err) { 
      toast.update(toastId, {
        render: "Erro crasso ao deletar.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (loading) return <p style={{ color: '#ffca28', textAlign: 'center', marginTop: '50px', fontFamily: 'Bangers' }}>SINCRONIZANDO...</p>;

  return (
    <div style={{ paddingBottom: '80px' }}>
      {categories.map(category => {
        const isOpen = activeCategory === category.id;
        const displayName = categoryNames[category.name] || category.name.toUpperCase();

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
                        {/* ✅ Tarefa 1: ?t= force cache-bust após edição de imagem */}
                        <td><img src={`${product.url}?t=${Date.now()}`} alt={product.name} width="90" height="90" style={{ border: '2px solid #ffca28', borderRadius: '12px' }} /></td>
                        <td>
                          <div style={{ textAlign: 'center', marginTop: '-10px' }}>
                            <span style={{ fontFamily: 'Bangers', fontSize: '24px', color: '#ffca28', display: 'block' }}>{product.name}</span>
                            <span style={{ fontSize: '12px', color: '#888', display: 'block', marginTop: '-5px' }}>{product.description}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>R$ {product.price.toFixed(2)}</td>
                        <td className="actions">
                          <button className="info" onClick={() => setPreviewProduct(product)}><FiFileText /></button>
                          <button className="edit" onClick={() => onEditProduct && onEditProduct(product)}><FiEdit /></button>
                          <button className="delete" onClick={() => setProductToDelete(product)}><FiTrash2 /></button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            {/* 🟡 Loot Lendário */}
                            <StatusButton
                              $isOffer={product.offer}
                              onClick={() => toggleOffer(product)}
                            >
                              <FiStar /> {product.offer ? "LOOT ATIVO" : "LOOT LENDÁRIO"}
                            </StatusButton>

                            {/* 🔵 Bônus da Fase - REVISADO */}
                            <BonusButton
                              /* 🚩 CRUCIAL: O nome aqui ($isBonus) deve ser IGUAL ao que está no styles.js */
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

      {/* ⚠️ MODAL DE CONFIRMAÇÃO DE DELETE (2 STEPS) */}
      {productToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#0b0b0b', border: '2px solid #ff007f', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 0 40px rgba(255,0,127,0.3)', maxWidth: '400px' }}>
            <h2 style={{color: '#ffca28', fontFamily: 'Bangers', fontSize: '32px'}}>⚠️ ALERTA DE BANIMENTO ⚠️</h2>
            <p style={{color: '#e0e0e0', margin: '20px 0', fontSize: '18px', fontFamily: 'Poppins'}}>
              Tem certeza que deseja banir o item <strong style={{color: '#00c2ff'}}>{productToDelete.name}</strong> permanentemente do banco de dados?
            </p>
            <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px'}}>
              <button onClick={() => setProductToDelete(null)} style={{padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '20px', transition: '0.2s'}}>CANCELAR</button>
              <button onClick={confirmDelete} style={{padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#ff007f', color: '#fff', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '20px', transition: '0.2s', boxShadow: '0 4px 0 #99004d'}}>SIM, EXCLUIR</button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ MODAL DE VISUALIZAÇÃO (PREVIEW ADMIN) */}
      <ProductModal 
        product={previewProduct} 
        onClose={() => setPreviewProduct(null)} 
        isAdminView={true} 
      />
    </div>
  );
}
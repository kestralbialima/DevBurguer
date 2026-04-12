import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { FiUpload, FiPackage, FiDollarSign, FiTag, FiAlignLeft, FiArrowLeft } from 'react-icons/fi';

import { FormContainer, InputGroup, Label, CheckboxGroup } from './styles';

export function NewProduct({ preSelectedCategory, onSuccessReturn }) {
  const [categories, setCategories] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 📡 Carrega as categorias para o Select
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await api.get('categories');
        setCategories(Array.isArray(data) ? data : (data.categories || []));
      } catch (err) {
        console.error("Erro ao carregar categorias no NewProduct:", err);
        toast.error("Erro ao carregar categorias. O servidor está online?");
      }
    }
    loadCategories();
  }, []);

  // 🚀 Função para criar o item no Banco de Dados
  async function onSubmit(event) {
    event.preventDefault();
    
    try {
      const data = new FormData(event.target); 
      
      const file = data.get('file');
      if (!file || file.size === 0) {
        return toast.error("⚠️ Todo Loot Lendário precisa de uma imagem!");
      }

      data.set('offer', event.target.offer.checked);
      data.set('is_bonus', event.target.is_bonus.checked);

      await api.post('products', data);
      
      toast.success("🔥 ITEM FORJADO! O inventário foi atualizado.");
      
      event.target.reset();
      setFileName(null);
      setImagePreview(null);
      
      // ✅ Redireciona de volta ao Inventário automaticamente
      if (onSuccessReturn) onSuccessReturn();
    } catch (err) {
      console.error(err);
      toast.error("❌ Falha na forja. Verifique os campos ou o servidor.");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          type="button" 
          onClick={onSuccessReturn} 
          style={{ background: 'transparent', border: 'none', color: '#ffca28', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <FiArrowLeft size={28} />
        </button>
        <h2 style={{ margin: 0 }}>ADICIONAR NOVO ITEM AO MAPA</h2>
      </div>

      {/* 1. NOME */}
      <InputGroup>
        <Label><FiPackage /> Nome do Produto</Label>
        <input 
          name="name" 
          placeholder="Ex: Burguer Boss" 
          required 
        />
      </InputGroup>

      {/* 2. PREÇO */}
      <InputGroup>
        <Label><FiDollarSign /> Preço (Moedas)</Label>
        <input 
          name="price" 
          type="number" 
          step="0.01" 
          placeholder="0.00" 
          required 
        />
      </InputGroup>

      {/* 3. DESCRIÇÃO (Item Novo!) */}
      <InputGroup>
        <Label><FiAlignLeft /> Descrição / Poderes</Label>
        <textarea 
          name="description" 
          placeholder="O que este item faz? (Ex: +50 de Fome, Crítico de sabor)" 
          rows="3"
          required 
          style={{ 
            background: '#111', 
            color: '#fff', 
            borderRadius: '10px', 
            padding: '12px', 
            border: '1px solid #333',
            fontFamily: 'Poppins'
          }}
        />
      </InputGroup>

      <InputGroup>
        <Label><FiTag /> Categoria</Label>
        <select name="category_id" required defaultValue={preSelectedCategory || ""}>
          <option value="">Selecione uma categoria...</option>
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Carregando categorias...</option>
          )}
        </select>
      </InputGroup>

      <Label style={{ cursor: 'pointer', border: '2px dashed #ffca28', padding: '15px', borderRadius: '15px', textAlign: 'center', background: 'rgba(255, 202, 40, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {imagePreview ? (
          <img src={imagePreview} alt="Preview do Upload" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ffca28' }} />
        ) : (
          <FiUpload size={40} color="#ffca28" />
        )}
        <div style={{ color: '#ffca28', fontFamily: 'Bangers', fontSize: '18px', marginTop: '5px' }}>
          {fileName || "SOLTAR IMAGEM AQUI (DROP)"}
        </div>
        <input type="file" name="file" accept="image/*" hidden onChange={handleImageChange} />
      </Label>

      {/* 6. STATUS DO ITEM */}
      <CheckboxGroup style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="offer" id="offer" />
          <Label htmlFor="offer" style={{ color: '#ffca28', margin: 0 }}>Loot Lendário (Dourado)</Label>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="is_bonus" id="is_bonus" />
          <Label htmlFor="is_bonus" style={{ color: '#00c2ff', margin: 0 }}>Bônus da Fase (Azul)</Label>
        </div>
      </CheckboxGroup>

      <button 
        type="submit" 
        style={{
          background: '#ffca28', color: '#000', border: 'none', borderRadius: '10px',
          padding: '18px 25px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Bangers',
          fontSize: '28px', boxShadow: '0 0 25px rgba(255, 202, 40, 0.5)', transition: '0.3s', 
          marginTop: '20px', textTransform: 'uppercase', letterSpacing: '2px'
        }}
        onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px) scale(1.02)'; e.target.style.boxShadow = '0 0 35px rgba(255, 202, 40, 0.8)'; }}
        onMouseOut={(e) => { e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = '0 0 25px rgba(255, 202, 40, 0.5)'; }}
      >
        🔥 FORJAR PRODUTO
      </button>
    </FormContainer>
  );
}
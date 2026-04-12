import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { FiUpload, FiPackage, FiDollarSign, FiTag, FiAlignLeft, FiArrowLeft } from 'react-icons/fi';

import { FormContainer, InputGroup, Label, CheckboxGroup } from './styles';

export function EditProduct({ product, onBack, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file)); // Pré-visualização sem precisar upar
    }
  };

  // 📡 Carrega categorias ao iniciar
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await api.get('categories');
        // Prevenção: assegura que se vier dentro de um objeto { categories: [] }, pegaremos o array
        setCategories(Array.isArray(data) ? data : (data.categories || []));
      } catch (err) {
        toast.error("Falha ao puxar categorias do backend.");
      }
    }
    loadCategories();
  }, []);

  // 🚀 FUNÇÃO DE ATUALIZAÇÃO
  async function onSubmit(event) {
    event.preventDefault();
    
    try {
      // ✅ Tarefa 3: FormData captura todos os campos pelo 'name=', incluindo 'file'
      const formData = new FormData(event.target);
      
      // ✅ Tarefa 3: Booleanos explicitados (checkbox retorna 'on'/undefined sem isso)
      formData.set('offer', event.target.offer.checked);
      formData.set('is_bonus', event.target.is_bonus.checked);

      // ✅ Tarefa 3: Axios detecta FormData automaticamente e envia multipart/form-data
      // O campo 'file' é exatamente o nome que o Multer espera no backend
      await api.put(`products/${product.id}`, formData);
      
      toast.success("✨ LOOT ATUALIZADO! As alterações já estão no mapa.");

      // ✅ Tarefa 2: Chama onSuccess para recarregar a lista ANTES de navegar
      if (onSuccess) onSuccess();

      onBack(); // Retorna para a lista
    } catch (err) {
      // ✅ Exibe a mensagem real da API se existir
      const apiMsg = err.response?.data?.error || err.response?.data?.message;
      toast.error(apiMsg || "Erro ao atualizar o item. Verifique os campos.");
    }
  }

  // 🛡️ Segurança: Evita chutar render nulo antes da aba receber a prop
  if (!product) return null;

  return (
    <FormContainer onSubmit={onSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          type="button" 
          onClick={onBack} 
          style={{ background: 'transparent', border: 'none', color: '#ffca28', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <FiArrowLeft size={28} />
        </button>
        <h2 style={{ margin: 0 }}>EDITAR ITEM DO INVENTÁRIO</h2>
      </div>

      <InputGroup>
        <Label><FiPackage /> Nome</Label>
        <input name="name" defaultValue={product?.name} required />
      </InputGroup>

      <InputGroup>
        <Label><FiDollarSign /> Preço</Label>
        <input name="price" type="number" step="0.01" defaultValue={product?.price} required />
      </InputGroup>

      <InputGroup>
        <Label><FiAlignLeft /> Descrição</Label>
        <textarea 
          name="description" 
          defaultValue={product?.description} 
          rows="3"
          style={{ background: '#111', color: '#fff', borderRadius: '10px', padding: '12px', border: '1px solid #333' }}
          required 
        />
      </InputGroup>

      <InputGroup>
        <Label><FiTag /> Categoria</Label>
        <select name="category_id" defaultValue={product?.category_id}>
          {categories && categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </InputGroup>

      <Label style={{ cursor: 'pointer', border: '2px dashed #00c2ff', padding: '15px', borderRadius: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {imagePreview ? (
          <img src={imagePreview} alt="Preview do Upload" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #00c2ff' }} />
        ) : (
          <img src={product?.url} alt="Imagem Atual" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #333', opacity: 0.5 }} />
        )}
        <div style={{ color: '#00c2ff', fontFamily: 'Bangers', fontSize: '18px', marginTop: '5px' }}>
          {fileName || <><FiUpload style={{marginRight: '5px'}}/> ALTERAR IMAGEM (OPCIONAL)</>}
        </div>
        <input type="file" name="file" accept="image/*" hidden onChange={handleImageChange} />
      </Label>

      <CheckboxGroup>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <input type="checkbox" name="offer" id="offer" defaultChecked={product?.offer} />
          <Label htmlFor="offer" style={{ color: '#ffca28', margin: 0 }}>Loot Lendário (Dourado)</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="is_bonus" id="is_bonus" defaultChecked={product?.is_bonus} />
          <Label htmlFor="is_bonus" style={{ color: '#00c2ff', margin: 0 }}>Bônus da Fase (Azul)</Label>
        </div>
      </CheckboxGroup>

      <button type="submit" className="submit-btn" style={{ background: '#00c2ff' }}>SALVAR ALTERAÇÕES</button>
    </FormContainer>
  );
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/CartContext';
import { useUser } from '../../hooks/UserContext'; // 🚀 Hook global de usuário
import { Title } from '../../components/Title';
import { FiClock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

// Importação dos componentes estilizados (Styled Components)
import {
    Container,
    Content,
    ItemContainer,
    UserPanel,
    CheckoutButton
} from './styles';

/**
 * Componente: Cart
 * Interface do inventário do jogador onde ele revisa o loot antes do checkout.
 */
export function Cart() {
    const navigate = useNavigate();

    // 🛡️ BUSCA GLOBAL: Pegamos os dados do usuário direto do Contexto.
    // Isso evita o uso de estados locais vazios que causam o erro de 'Olá, Player'.
    const { userData } = useUser();

    // Extrai funções e dados do Contexto Global do Carrinho.
  const { cartProducts, increaseProduct, decreaseProduct, setCartProducts } = useCart();

    // Estados do Cupom de Desconto
    const [couponInput, setCouponInput] = useState('');
    const [couponCode, setCouponCode] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    /**
     * Cálculos de Valores (Memoização Simples)
     * Realiza a soma de todos os itens multiplicados por suas quantidades.
     */
    const totalValue = cartProducts.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
    }, 0);

    const discountValue = (totalValue * discountPercentage) / 100;
    const finalCartValue = totalValue - discountValue;
    const deliveryFee = 5.00;
    const totalWithDelivery = finalCartValue + deliveryFee;

    /**
     * Função: handleApplyCoupon
     * Valida o cupom no backend e aplica o desconto em tempo real.
     */
    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        try {
            const { data } = await api.post('/coupons/validate', { 
                code: couponInput.trim().toUpperCase() 
            });
            setCouponCode(data.code);
            setDiscountPercentage(data.discountPercentage);
            toast.success(`🎟️ Cupom "${data.code}" aplicado! ${data.discountPercentage}% de desconto.`);
        } catch (err) {
            setCouponCode(null);
            setDiscountPercentage(0);
            toast.error(err.response?.data?.error || 'Cupom inválido.');
        }
    };

    /**
     * Função: handleCheckout
     * Envia o array de produtos e o cupom (se houver) para o backend gerar o pedido.
     */
const handleCheckout = async () => {
    try {
      // Prepara os itens para o Backend
      const products = cartProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));

      toast.info("Processando pagamento via Core.Pay... 🛡️", { autoClose: 1500 });

      const payload = { products };
      if (couponCode) {
        payload.coupon_code = couponCode;
      }

      // 📡 Envia para o servidor
      const { data } = await api.post('/orders', payload);
      
      toast.success('Loot garantido! Pedido realizado com sucesso! 🍔');

      /**
       * 🧹 LIMPEZA DO CARRINHO (Sem Erros)
       * Verificamos se a função existe antes de chamar para não quebrar o código.
       */
      if (setCartProducts) {
        setCartProducts([]); // Esvazia o array de produtos no estado global
        
        // Também limpamos o LocalStorage para o carrinho não voltar ao dar F5
        localStorage.removeItem('devburger:cartInfo'); 
      }

      // 🧭 Navegação para a tela que acabamos de arrumar
      navigate(`/acompanhar-pedido/${data._id}`); 
        
    } catch (error) {
      console.error("Erro no Checkout:", error);
      toast.error('Falha na transação. Verifique sua conexão.');
    }
  };

    /**
     * useEffect: Proteção de Rota
     * Se o userData não existir (usuário deslogou ou limpou cache), volta para o login.
     */
    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
    }, [userData, navigate]);

    return (
        <Container>
            {/* Título Neon Azul */}
            <Title $size="60px" style={{ textShadow: '0 0 20px #00c2ff', marginBottom: '50px' }}>
                MEU INVENTÁRIO
            </Title>

            <Content>
                {/* --- SEÇÃO ESQUERDA: LISTAGEM DE ITENS (LOOT) --- */}
                <ItemContainer>
                    <div className="header-table">
                        <p></p> {/* Espaço da Imagem */}
                        <p>ITEM</p>
                        <p>PREÇO</p>
                        <p>QTD</p>
                        <p>TOTAL</p>
                    </div>

                    {cartProducts.map(product => (
                        <div key={product.id} className="product-line">
                            <div style={{ position: 'relative', width: 70, height: 70 }}>
                                <img
                                    // 🛠️ encodeURI: Garante que imagens com espaços ou acentos carreguem corretamente
                                    src={encodeURI(product.url)}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 12,
                                        objectFit: 'cover',
                                        border: '2px solid #00c2ff'
                                    }}
                                />
                            </div>
                            <p style={{ fontFamily: 'Bangers', fontSize: '18px', marginLeft: '10px', color: '#fff' }}>
                                {product.name}
                            </p>
                            <p style={{ textAlign: 'center', color: '#fff' }}>
                                R$ {product.price.toFixed(2)}
                            </p>

                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                <button onClick={() => decreaseProduct(product.id)} style={{ background: '#ff4500', border: 'none', color: '#fff', borderRadius: 5, cursor: 'pointer', padding: '5px 8px' }}>-</button>
                                <span style={{ fontFamily: 'Bangers', fontSize: '18px', color: '#fff' }}>{product.quantity}</span>
                                <button onClick={() => increaseProduct(product.id)} style={{ background: '#00c2ff', border: 'none', color: '#fff', borderRadius: 5, cursor: 'pointer', padding: '5px 8px' }}>+</button>
                            </div>

                            <p style={{ fontWeight: 'bold', color: '#ffca28', textAlign: 'right' }}>
                                R$ {(product.quantity * product.price).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </ItemContainer>

                {/* --- SEÇÃO DIREITA: PLAYER STATS --- */}
                <UserPanel>
                    <h3>PLAYER STATS</h3>

                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <p style={{ color: '#fff', fontSize: '18px' }}>
                            {/* 👤 Exibição dinâmica do nome do Player vindo do Contexto */}
                            Olá, <span style={{ color: '#00c2ff', fontWeight: 'bold' }}>
                                {userData?.name || "Player"}
                            </span>
                        </p>
                    </div>

                    {/* Botões de Navegação Profissional */}
                    <div className="nav-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={() => navigate('/meus-pedidos')}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '12px', borderRadius: '8px', border: '1px solid #333',
                                background: 'rgba(255, 255, 255, 0.05)', color: '#fff', cursor: 'pointer'
                            }}
                        >
                            <FiClock /> HISTÓRICO DE MISSÕES
                        </button>

                        <button
                            onClick={() => navigate('/perfil')}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '12px', borderRadius: '8px', border: '1px solid #00c2ff',
                                background: 'rgba(0, 194, 255, 0.1)', color: '#00c2ff', cursor: 'pointer'
                            }}
                        >
                            <FiUser /> DADOS DO PLAYER
                        </button>
                    </div>

                    {/* Sistema de Cupom */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="CÓDIGO DO CUPOM"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            style={{
                                flex: 1, padding: '10px', borderRadius: '8px',
                                border: '1px solid #00c2ff', background: '#111',
                                color: '#fff', fontFamily: 'Bangers'
                            }}
                        />
                        <button
                            onClick={handleApplyCoupon}
                            style={{
                                padding: '10px 15px', borderRadius: '8px', border: 'none',
                                background: '#00c2ff', color: '#000', cursor: 'pointer',
                                fontFamily: 'Bangers', fontWeight: 'bold'
                            }}
                        >
                            APLICAR
                        </button>
                    </div>

                    {/* Resumo Final de Valores */}
                    <div style={{ marginTop: '30px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                            <span>SUBTOTAL:</span>
                            <span>R$ {totalValue.toFixed(2)}</span>
                        </div>
                        {discountPercentage > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff88' }}>
                                <span>DESCONTO ({discountPercentage}%):</span>
                                <span>- R$ {discountValue.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginTop: '5px' }}>
                            <span>TAXA DE ENTREGA:</span>
                            <span>R$ {deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginTop: '15px', fontSize: '22px', fontFamily: 'Bangers' }}>
                            <span>TOTAL FINAL:</span>
                            <span style={{ color: '#00c2ff' }}>R$ {totalWithDelivery.toFixed(2)}</span>
                        </div>
                    </div>

                    <CheckoutButton onClick={handleCheckout} style={{ marginTop: '30px' }}>
                        FINALIZAR MISSÃO <FiArrowRight />
                    </CheckoutButton>
                </UserPanel>
            </Content>
        </Container>
    );
}
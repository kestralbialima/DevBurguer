import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiList, FiActivity, FiLogOut, FiMenu, FiX, FiTag } from 'react-icons/fi';

import { Dashboard } from './Dashboard'; 
import { ListProducts } from './ListProducts';
import { Orders } from './Orders'; 
import { EditProduct } from './EditProduct';
import { NewProduct } from './NewProduct'; // 🆕 Reativação da forja!
import { CouponManager } from './CouponManager'; // 🎟️ Módulo de Cupons

import { 
    Container, AdminMenu, AdminContent, MenuButton, 
    MobileToggle, CloseMenu 
} from './styles';

export function Admin() {
    const navigate = useNavigate();
    const [activeScreen, setActiveScreen] = useState('ORDERS'); // Pedidos passa a ser a inicial
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    
    // 🕹️ ESTADO NOVO: Guarda o produto que a Lista enviou para editar
    const [productToEdit, setProductToEdit] = useState(null);
    const [preSelectedCategory, setPreSelectedCategory] = useState(null);
    // ✅ Tarefa 2: chave increm. forja remontagem do ListProducts após edição
    const [refreshKey, setRefreshKey] = useState(0);

    const logout = () => {
        localStorage.removeItem('devburger:userData');
        navigate('/login');
    };

    // Função para mudar de tela
    const handleScreenChange = (screen) => {
        setActiveScreen(screen);
        setIsMenuOpen(false); 
    };

    /** * 🛠️ FUNÇÃO DE PONTE: 
     * A ListProducts vai chamar essa função quando você clicar no ícone de editar.
     */
    const handleEditProduct = (product) => {
        setProductToEdit(product);    // Salva o produto
        setActiveScreen('EDIT_PRODUCT'); // Muda para a tela de edição
    };

    const handleNewProduct = (categoryId) => {
        setPreSelectedCategory(categoryId);
        setActiveScreen('NEW_PRODUCT');
    };

    return (
        <Container>
            <MobileToggle onClick={() => setIsMenuOpen(true)}>
                <FiMenu size={28} />
            </MobileToggle>

            <AdminMenu $isOpen={isMenuOpen}>
                <CloseMenu onClick={() => setIsMenuOpen(false)}>
                    <FiX size={30} />
                </CloseMenu>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: '#ffca28', fontFamily: 'Bangers', fontSize: '28px' }}>
                        COMMAND CENTER
                    </h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <MenuButton 
                        $active={activeScreen === 'ORDERS'} 
                        onClick={() => handleScreenChange('ORDERS')}
                    >
                        <FiShoppingCart /> PEDIDOS
                    </MenuButton>

                    <MenuButton 
                        $active={activeScreen === 'DASHBOARD'} 
                        onClick={() => handleScreenChange('DASHBOARD')}
                    >
                        <FiActivity /> ESTATÍSTICAS
                    </MenuButton>

                    <MenuButton 
                        $active={activeScreen === 'LIST_PRODUCTS' || activeScreen === 'EDIT_PRODUCT'} 
                        onClick={() => handleScreenChange('LIST_PRODUCTS')}
                    >
                        <FiList /> INVENTÁRIO
                    </MenuButton>

                    {/* 🎟️ NOVO: Gerenciamento de Cupons */}
                    <MenuButton 
                        $active={activeScreen === 'COUPONS'} 
                        onClick={() => handleScreenChange('COUPONS')}
                    >
                        <FiTag /> CUPONS
                    </MenuButton>
                </nav>

                <button 
                    onClick={logout} 
                    style={{ 
                        background: 'none', border: 'none', color: '#ffca28', 
                        marginTop: 'auto', display: 'flex', alignItems: 'center', 
                        gap: '10px', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 'bold' 
                    }}
                >
                    <FiLogOut /> SAIR
                </button>
            </AdminMenu>

            <AdminContent>
                {/* 📊 DASHBOARD: Métricas e Vendas (Top 5) */}
                {activeScreen === 'DASHBOARD' && <Dashboard />}

                {/* 🛒 PEDIDOS: Renderiza a tela Orders ligada ao Mongo */}
                {activeScreen === 'ORDERS' && <Orders />}
                
                {/* 📋 LISTA: Passamos a função de ponte como Prop */}
                {activeScreen === 'LIST_PRODUCTS' && (
                    <ListProducts
                      key={refreshKey}
                      onEditProduct={handleEditProduct}
                      onNewProduct={handleNewProduct}
                    />
                )}

                {/* ✨ FORJA: Tela para Novo Item vindo direto da aba correta */}
                {activeScreen === 'NEW_PRODUCT' && (
                    <NewProduct 
                      preSelectedCategory={preSelectedCategory} 
                      onSuccessReturn={() => setActiveScreen('LIST_PRODUCTS')} 
                    />
                )}

                {/* ✏️ EDITAR: Tela de Edição (passando o produto selecionado) */}
                {activeScreen === 'EDIT_PRODUCT' && (
                    <EditProduct
                        product={productToEdit}
                        onBack={() => setActiveScreen('LIST_PRODUCTS')}
                        // ✅ Tarefa 2: onSuccess incrementa refreshKey -> ListProducts remonta e chama loadData()
                        onSuccess={() => setRefreshKey(k => k + 1)}
                    />
                )}

                {/* 🎟️ CUPONS: Gerenciamento de cupons de desconto */}
                {activeScreen === 'COUPONS' && <CouponManager />}
            </AdminContent>
        </Container>
    );
}
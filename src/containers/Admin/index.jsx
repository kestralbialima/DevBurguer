import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiShoppingCart, FiList, FiActivity, FiLogOut, 
    FiMenu, FiX, FiTag, FiUsers // 👥 Ícone de Usuários adicionado
} from 'react-icons/fi';

import { Dashboard } from './Dashboard'; 
import { ListProducts } from './ListProducts';
import { Orders } from './Orders'; 
import { EditProduct } from './EditProduct';
import { NewProduct } from './NewProduct';
import { CouponManager } from './CouponManager'; 
import { UserManager } from './UserManager'; // 👈 Importação da nova tela

import { 
    Container, AdminMenu, AdminContent, MenuButton, 
    MobileToggle, CloseMenu 
} from './styles';

export function Admin() {
    const navigate = useNavigate();
    const [activeScreen, setActiveScreen] = useState('ORDERS'); 
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    
    const [productToEdit, setProductToEdit] = useState(null);
    const [preSelectedCategory, setPreSelectedCategory] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const logout = () => {
        localStorage.removeItem('devburger:userData');
        navigate('/login');
    };

    const handleScreenChange = (screen) => {
        setActiveScreen(screen);
        setIsMenuOpen(false); 
    };

    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setActiveScreen('EDIT_PRODUCT');
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

                    <MenuButton 
                        $active={activeScreen === 'COUPONS'} 
                        onClick={() => handleScreenChange('COUPONS')}
                    >
                        <FiTag /> CUPONS
                    </MenuButton>

                    {/* 👥 NOVO: Botão de Gestão de Usuários */}
                    <MenuButton 
                        $active={activeScreen === 'USERS'} 
                        onClick={() => handleScreenChange('USERS')}
                    >
                        <FiUsers /> USUÁRIOS
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
                {activeScreen === 'DASHBOARD' && <Dashboard />}
                {activeScreen === 'ORDERS' && <Orders />}
                
                {activeScreen === 'LIST_PRODUCTS' && (
                    <ListProducts
                      key={refreshKey}
                      onEditProduct={handleEditProduct}
                      onNewProduct={handleNewProduct}
                    />
                )}

                {activeScreen === 'NEW_PRODUCT' && (
                    <NewProduct 
                      preSelectedCategory={preSelectedCategory} 
                      onSuccessReturn={() => setActiveScreen('LIST_PRODUCTS')} 
                    />
                )}

                {activeScreen === 'EDIT_PRODUCT' && (
                    <EditProduct
                        product={productToEdit}
                        onBack={() => setActiveScreen('LIST_PRODUCTS')}
                        onSuccess={() => setRefreshKey(k => k + 1)}
                    />
                )}

                {activeScreen === 'COUPONS' && <CouponManager />}

                {/* 🛡️ NOVO: Renderização da tela de Usuários */}
                {activeScreen === 'USERS' && <UserManager />}
            </AdminContent>
        </Container>
    );
}
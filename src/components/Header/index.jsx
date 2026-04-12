import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPhone, FiSettings, FiShoppingCart, FiMenu, FiX, FiMapPin, FiHome, FiList } from 'react-icons/fi';
import { useCart } from '../../hooks/CartContext';
import { 
    Container, Navigation, NavRight, ContactButton, 
    CartButton, HamburgerIcon, SideMenu, Overlay, PressStartButton 
} from './styles';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { cartProducts } = useCart();

    // 🕵️‍♀️ Verifica se o usuário está logado
    const userData = JSON.parse(localStorage.getItem('devburger:userData'));
    
    useEffect(() => {
        setIsAdmin(userData?.admin === true);
    }, [pathname, userData]);

    const userName = userData?.name ? userData.name.split(' ')[0].toUpperCase() : '';

    return (
        <>
            <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
            
            <SideMenu $isOpen={isMenuOpen}>
                <FiX 
                    style={{color: '#ff007f', fontSize: '45px', cursor: 'pointer', alignSelf: 'flex-end'}} 
                    onClick={() => setIsMenuOpen(false)} 
                />
                
                <button onClick={() => { navigate('/'); setIsMenuOpen(false); }}><FiHome /> HOME</button>
                <button onClick={() => { navigate('/cardapio'); setIsMenuOpen(false); }}><FiList /> CARDÁPIO</button>
                
                <a href="#onde-estamos" onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    navigate('/');
                    setTimeout(() => document.getElementById('onde-estamos')?.scrollIntoView({behavior:'smooth'}), 100);
                }}>
                    <FiMapPin style={{color: '#ff007f'}} /> LOCALIZAÇÃO
                </a>

                <button onClick={() => window.open('https://wa.me/seunumerowhatsapp')}><FiPhone /> CONTATO</button>
                
                {/* 🔴 Press Start no final do menu lateral */}
                {!userData && (
                    <PressStartButton onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                        PRESS START
                    </PressStartButton>
                )}
            </SideMenu>

            <Container>
                {/* 🍔 As 3 setas agora com 45px e brilho neon interativo */}
                <HamburgerIcon onClick={() => setIsMenuOpen(true)}>
                    <FiMenu />
                </HamburgerIcon>

                <Navigation>
                    <button onClick={() => navigate('/')} className={pathname === '/' ? 'active' : ''}>HOME</button>
                    <button onClick={() => navigate('/cardapio')} className={pathname === '/cardapio' ? 'active' : ''}>CARDÁPIO</button>
                </Navigation>

                <NavRight>
                    {/* Botão de Bloco Rosa (Administrador ou Cliente) */}
                    <ContactButton onClick={() => isAdmin ? navigate('/admin') : window.open('https://wa.me/seunumero')}>
                        {isAdmin ? <><FiSettings /> ADMIN</> : <><FiPhone /> CONTATO</>}
                    </ContactButton>

                    <CartButton onClick={() => navigate('/carrinho')}>
                        <FiShoppingCart size={28} />
                        {cartProducts?.length > 0 && <span>{cartProducts.length}</span>}
                    </CartButton>

                    {/* 🕹️ TROCA INTELIGENTE: Nome do Player vs Botão Vermelho Gamer */}
                    {userData ? (
                        <div style={{ color: '#fff', textAlign: 'right', fontFamily: 'Poppins' }}>
                            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>HELLO, {userName}!</p>
                            <button 
                                onClick={() => { localStorage.removeItem('devburger:userData'); navigate('/login'); }} 
                                style={{ background: 'none', border: 'none', color: '#ff007f', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <PressStartButton $inHeader onClick={() => navigate('/login')}>
                            PRESS START
                        </PressStartButton>
                    )}
                </NavRight>
            </Container>
        </>
    );
}
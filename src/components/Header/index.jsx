import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPhone, FiSettings, FiShoppingCart, FiMenu, FiX, FiMapPin, FiHome, FiList, FiUser } from 'react-icons/fi';
import { useCart } from '../../hooks/CartContext';
import {
    Container, Navigation, NavRight, ContactButton,
    CartButton, HamburgerIcon, SideMenu, Overlay, PressStartButton
} from './styles';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { cartProducts } = useCart();

    // 🕵️‍♀️ Busca os dados do usuário.
    const userData = JSON.parse(localStorage.getItem('devburger:userData'));

    // ✅ Proteção: Só tenta formatar o nome se userData existir.
    const userName = userData?.name ? userData.name.split(' ')[0].toUpperCase() : '';

    /**
     * 🛡️ LÓGICA DE ACESSO:
     * Criamos uma variável simples para saber se quem está logado faz parte da equipe.
     */
    const isStaff = userData?.role === 'master' || userData?.role === 'manager' || userData?.role === 'operator';

    return (
        <>
            <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />

            <SideMenu $isOpen={isMenuOpen}>
                <FiX
                    style={{ color: '#ff007f', fontSize: '45px', cursor: 'pointer', alignSelf: 'flex-end' }}
                    onClick={() => setIsMenuOpen(false)}
                />

                <button onClick={() => { navigate('/'); setIsMenuOpen(false); }}><FiHome /> HOME</button>
                <button onClick={() => { navigate('/cardapio'); setIsMenuOpen(false); }}><FiList /> CARDÁPIO</button>

                {/* 🔒 SIDEBAR: Se for Staff, mostra atalho para o Admin no celular */}
                {isStaff && (
                    <button onClick={() => { navigate('/admin/pedidos'); setIsMenuOpen(false); }} style={{ color: '#ffca28' }}>
                        <FiSettings /> PAINEL ADMIN
                    </button>
                )}

                <a href="#onde-estamos" onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    navigate('/');
                    setTimeout(() => document.getElementById('onde-estamos')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}>
                    <FiMapPin style={{ color: '#ff007f' }} /> LOCALIZAÇÃO
                </a>

                <button onClick={() => window.open('https://wa.me/seunumerowhatsapp')}><FiPhone /> CONTATO</button>

                {!userData && (
                    <PressStartButton onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                        PRESS START
                    </PressStartButton>
                )}
            </SideMenu>

            <Container>
                <HamburgerIcon onClick={() => setIsMenuOpen(true)}>
                    <FiMenu />
                </HamburgerIcon>

                <Navigation>
                    <button onClick={() => navigate('/')} className={pathname === '/' ? 'active' : ''}>HOME</button>
                    <button onClick={() => navigate('/cardapio')} className={pathname === '/cardapio' ? 'active' : ''}>CARDÁPIO</button>
                </Navigation>

                <NavRight>
                    {/* 🛡️ BOTÃO DINÂMICO (Admin vs Contato):
                        Se for Staff (Master, Manager ou Operator), o botão vira ADMIN.
                        Se for 'user' ou não estiver logado, o botão vira CONTATO.
                    */}
                    <ContactButton
                        onClick={() =>
                            isStaff
                                ? navigate('/admin/pedidos')
                                : window.open('https://wa.me/5541999999999')
                        }>
                        
                        {isStaff ? (
                            <><FiSettings /> ADMIN</>
                        ) : (
                            <><FiPhone /> CONTATO</>
                        )}
                    </ContactButton>

                    <CartButton onClick={() => navigate('/carrinho')}>
                        <FiShoppingCart size={28} />
                        {cartProducts?.length > 0 && <span>{cartProducts.length}</span>}
                    </CartButton>

                    {userData ? (
                        <div style={{ color: '#fff', textAlign: 'right', fontFamily: 'Poppins', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/perfil')}>
                                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>HELLO, {userName}!</p>
                                <button
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        localStorage.removeItem('devburger:userData'); 
                                        navigate('/login'); 
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#ff007f', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', padding: 0 }}
                                >
                                    LOGOUT
                                </button>
                            </div>
                            <FiUser size={20} color="#ffca28" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }} />
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
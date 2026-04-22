import React from "react";
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/UserContext'; 

// 🚀 IMPORTAÇÕES DE CONTAINERS (PÁGINAS)
import { Home } from '../containers/Home';
import { Login } from '../containers/Login';
import { Register } from '../containers/Register';
import { Cardapio } from '../containers/Cardapio';
import { Cart } from '../containers/Cart';
import { Admin } from '../containers/Admin';
import { Perfil } from '../containers/Perfil'; 
import { MyOrders } from '../containers/MyOrders';
import { TrackOrder } from '../containers/TrackOrder';
import { ResetPassword } from '../containers/ResetPassword';

// 🛠️ IMPORTAÇÕES DO ADMIN
import { ListProducts } from '../containers/Admin/ListProducts';
import { NewProduct } from '../containers/Admin/NewProduct';
import { EditProduct } from '../containers/Admin/EditProduct';
import { UserManager } from '../containers/Admin/UserManager';

// 🏗️ LAYOUTS
import { DefaultLayout } from '../components/DefaultLayout';

/**
 * 🛡️ COMPONENTE PROTECTED ROUTE
 * O "Segurança" da plataforma Core Build.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { userData, loading } = useUser(); 
    const location = useLocation();

    // ⏳ Enquanto o Contexto estiver lendo o LocalStorage, mostramos uma tela neutra
    if (loading) {
        return (
            <div style={{ 
                height: '100vh', background: '#000', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', color: '#00c2ff',
                fontFamily: 'Bangers', fontSize: '24px'
            }}>
                CARREGANDO INVENTÁRIO...
            </div>
        );
    }

    // 1️⃣ VERIFICAÇÃO DE LOGIN: Se não houver dados, manda para o login.
    if (!userData || !userData.role) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // 2️⃣ VERIFICAÇÃO DE CARGO (RBAC):
    // Se a rota exige cargos específicos (como Admin) e o usuário logado NÃO tem esse cargo.
    if (allowedRoles && !allowedRoles.includes(userData.role)) {
        /**
         * 🚨 AJUSTE CORE BUILD: Se um 'user' tentar acessar o /admin, 
         * ele será redirecionado para a Home ou Cardápio.
         */
        return <Navigate to="/" replace />;
    }

    return children;
};

/**
 * 🗺️ MAPEAMENTO DE ROTAS (React Router v6)
 */
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/cadastro",
        element: <Register />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
    {
        // 🏠 ÁREA DO CLIENTE (Com Layout Padrão)
        element: <DefaultLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/cardapio", element: <Cardapio /> },
            { 
                path: "/carrinho", 
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager', 'operator', 'user']}> 
                        <Cart /> 
                    </ProtectedRoute>
                ) 
            },
            { 
                path: "/perfil", 
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager', 'operator', 'user']}> 
                        <Perfil /> 
                    </ProtectedRoute>
                ) 
            },
            { 
                path: "/meus-pedidos", 
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager', 'operator', 'user']}> 
                        <MyOrders /> 
                    </ProtectedRoute>
                ) 
            },
            { 
                path: "/acompanhar-pedido/:id", 
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager', 'operator', 'user']}> 
                        <TrackOrder /> 
                    </ProtectedRoute>
                ) 
            },
        ],
    },
    {
        // 🛡️ PAINEL ADMINISTRATIVO
        path: "/admin",
        element: (
            /**
             * 🔒 TRAVA DE SEGURANÇA: 
             * Removemos 'user' daqui. Agora apenas master, manager e operator entram.
             */
            <ProtectedRoute allowedRoles={['master', 'manager', 'operator']}>
                <Admin />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "pedidos",
                element: <h1>Pedidos em Tempo Real</h1>,
            },
            {
                path: "listar-produtos",
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager']}>
                        <ListProducts />
                    </ProtectedRoute>
                ),
            },
            {
                path: "novo-product",
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager']}>
                        <NewProduct />
                    </ProtectedRoute>
                ),
            },
            {
                path: "editar-produto",
                element: (
                    <ProtectedRoute allowedRoles={['master', 'manager']}>
                        <EditProduct />
                    </ProtectedRoute>
                ),
            },
            {
                path: "faturamento",
                element: (
                    <ProtectedRoute allowedRoles={['master']}>
                        <h1>Relatórios Financeiros</h1>
                    </ProtectedRoute>
                ),
            },
            {
                path: "usuarios",
                element: (
                    <ProtectedRoute allowedRoles={['master']}>
                        <UserManager />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// 🚀 IMPORTAÇÕES DE CONTAINERS (PÁGINAS)
import { Home } from '../containers/Home';
import { Login } from '../containers/Login';
import { Register } from '../containers/Register';
import { Cardapio } from '../containers/Cardapio';
import { Cart } from '../containers/Cart';
import { Admin } from '../containers/Admin';
import { Perfil } from '../containers/Perfil'; 
import { MyOrders } from '../containers/MyOrders';
import { TrackOrder } from '../containers/TrackOrder'; // 👈 Nova página de acompanhamento

// 🛠️ IMPORTAÇÕES DO ADMIN
import { ListProducts } from '../containers/Admin/ListProducts';
import { NewProduct } from '../containers/Admin/NewProduct';
import { EditProduct } from '../containers/Admin/EditProduct';

// 🏗️ LAYOUTS
import { DefaultLayout } from '../components/DefaultLayout';

/**
 * Definição do Roteador (BrowserRouter)
 * Aqui mapeamos cada URL do navegador para um componente do React.
 */
export const router = createBrowserRouter([
  {
    // 🚪 ROTAS PÚBLICAS
    // Login e Cadastro não possuem o Header para manter o foco total no formulário.
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Register />,
  },
  {
    // 🏠 ROTAS DO CLIENTE (Com Header e Fundo de Partículas)
    // O DefaultLayout serve como uma "moldura". Tudo o que estiver em 'children'
    // será renderizado dentro do <Outlet /> do DefaultLayout.
    element: <DefaultLayout />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/cardapio", element: <Cardapio /> },
      { path: "/carrinho", element: <Cart /> },
      { path: "/perfil", element: <Perfil /> },
      { path: "/meus-pedidos", element: <MyOrders /> },
      
      /**
       * 📍 ROTA DINÂMICA: Acompanhar Pedido
       * O ':id' é um parâmetro. Isso significa que qualquer valor colocado após
       * a barra (ex: /acompanhar-pedido/123) será capturado pelo componente.
       */
      { path: "/acompanhar-pedido/:id", element: <TrackOrder /> },
    ],
  },
  {
    // 🛡️ ROTAS ADMINISTRATIVAS
    // O container Admin geralmente possui sua própria barra lateral (Sidebar).
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "pedidos", // Acessível via /admin/pedidos
        element: <h1>Pedidos em Tempo Real</h1>, 
      },
      {
        path: "listar-produtos",
        element: <ListProducts />,
      },
      {
        path: "novo-produto",
        element: <NewProduct />,
      },
      {
        path: "editar-produto",
        element: <EditProduct />,
      },
    ],
  },
]);
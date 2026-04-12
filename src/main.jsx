import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// 🚀 IMPORTANTE: Importamos o UserProvider que você acabou de criar
import { UserProvider } from './hooks/UserContext'; 
import { CartProvider } from './hooks/CartContext';
import { router } from './Routes'; 
import GlobalStyles from './styles/globalStyles';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👤 O UserProvider deve vir primeiro para que o Carrinho 
        possa saber qual usuário está comprando */}
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} /> 
        <GlobalStyles />
        <ToastContainer autoClose={2000} theme="dark" position="bottom-right" />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>,
);
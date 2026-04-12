import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  // Carrega o carrinho do localStorage ao iniciar
  useEffect(() => {
    const clientCartData = localStorage.getItem('devburger:cartInfo');
    if (clientCartData) {
      setCartProducts(JSON.parse(clientCartData));
    }
  }, []);

  const updateLocalStorage = (products) => {
    localStorage.setItem('devburger:cartInfo', JSON.stringify(products));
  };

  const putProductInCart = (product) => {
    const cartIndex = cartProducts.findIndex(prd => prd.id === product.id);
    let newCartProducts = [...cartProducts];

    if (cartIndex >= 0) {
      newCartProducts[cartIndex].quantity += 1;
    } else {
      product.quantity = 1;
      newCartProducts.push(product);
    }

    setCartProducts(newCartProducts);
    updateLocalStorage(newCartProducts);
  };

  const deleteProduct = (productId) => {
    const newCart = cartProducts.filter(prd => prd.id !== productId);
    setCartProducts(newCart);
    updateLocalStorage(newCart);
  };

  const increaseProduct = (productId) => {
    const newCart = cartProducts.map(prd => 
      prd.id === productId ? { ...prd, quantity: prd.quantity + 1 } : prd
    );
    setCartProducts(newCart);
    updateLocalStorage(newCart);
  };

  const decreaseProduct = (productId) => {
    const cartIndex = cartProducts.findIndex(prd => prd.id === productId);
    
    if (cartIndex === -1) return; // Segurança caso o item não exista

    if (cartProducts[cartIndex].quantity > 1) {
      const newCart = cartProducts.map(prd => 
        prd.id === productId ? { ...prd, quantity: prd.quantity - 1 } : prd
      );
      setCartProducts(newCart);
      updateLocalStorage(newCart);
    } else {
      deleteProduct(productId);
    }
  };

  return (
    <CartContext.Provider value={{ 
      putProductInCart, 
      cartProducts, 
      increaseProduct, 
      decreaseProduct,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
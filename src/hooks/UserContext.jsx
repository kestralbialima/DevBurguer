import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({});

    // 💾 Recupera os dados do usuário do LocalStorage ao carregar a página
    useEffect(() => {
        const loadUserData = async () => {
            const clientInfo = localStorage.getItem('devburger:userData');
            if (clientInfo) {
                setUserData(JSON.parse(clientInfo));
            }
        };
        loadUserData();
    }, []);

    const putUserData = async (userInfo) => {
        setUserData(userInfo);
        await localStorage.setItem('devburger:userData', JSON.stringify(userInfo));
    };

    const logout = async () => {
        await localStorage.removeItem('devburger:userData');
        setUserData({});
    };

    return (
        <UserContext.Provider value={{ userData, putUserData, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado com UserProvider');
    }
    return context;
};
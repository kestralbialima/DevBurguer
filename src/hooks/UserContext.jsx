import React, { createContext, useContext, useState, useEffect } from 'react';

// 1️⃣ Criação do Contexto: Onde os dados do usuário "viverão" para toda a aplicação
const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({});

    // 💾 2️⃣ Efeito de Inicialização:
    // Sempre que o app abrir ou der F5, buscamos se existe um usuário logado no navegador.
    useEffect(() => {
        const loadUserData = async () => {
            const clientInfo = localStorage.getItem('devburger:userData');
            
            if (clientInfo) {
                // Se encontrar, transforma a string do LocalStorage em objeto e coloca no estado
                // Aqui o 'role' (master, manager ou operator) já entra automaticamente no userData.
                setUserData(JSON.parse(clientInfo));
            }
        };
        loadUserData();
    }, []);

    /**
     * 🚀 3️⃣ Gravação de Dados:
     * Função chamada no Login para salvar as informações vindas do Backend.
     * Agora o 'userInfo' contém: id, name, email, role e o token JWT.
     */
    const putUserData = async (userInfo) => {
        setUserData(userInfo);
        
        // Salva no LocalStorage para que o login persista mesmo fechando a aba
        await localStorage.setItem('devburger:userData', JSON.stringify(userInfo));
    };

    /**
     * 🚪 4️⃣ Encerramento de Sessão:
     * Limpa o LocalStorage e reseta o estado do usuário, forçando o logout.
     */
    const logout = async () => {
        await localStorage.removeItem('devburger:userData');
        setUserData({});
    };

    // 5️⃣ Disponibilização: O Provider entrega os dados e as funções para o restante do App
    return (
        <UserContext.Provider value={{ userData, putUserData, logout }}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * 🎣 6️⃣ Hook Personalizado (useUser):
 * Facilita a vida nos componentes. Em vez de importar o Context e o useContext,
 * basta chamar const { userData } = useUser() em qualquer lugar do projeto.
 */
export const useUser = () => {
    const context = useContext(UserContext);
    
    // Verificação de segurança para garantir que o Hook está dentro do Provider
    if (!context) {
        throw new Error('useUser deve ser usado com UserProvider');
    }
    return context;
};
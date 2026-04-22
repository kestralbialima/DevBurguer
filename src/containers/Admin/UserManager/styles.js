import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap; 
        gap: 20px;
        margin-bottom: 30px;
    }

    .search-wrapper {
        display: flex;
        align-items: center;
        background: #323c42;
        border-radius: 8px;
        padding: 5px 15px;
        margin-top: 15px;
        border: 1px solid #48545c;
        max-width: 350px;

        input {
            background: transparent;
            border: none;
            color: #fff;
            padding: 8px;
            outline: none;
            width: 100%;
            font-size: 14px;
        }

        svg { color: #9758a6; }
    }

    h1 {
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 24px;
    }
`;

export const ContainerTable = styled.div`
    width: 100%;
    margin-top: 10px;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;

    @media (max-width: 600px) {
        display: block; /* Transforma a tabela em bloco no mobile */
    }
`;

export const TableHead = styled.thead`
    color: #efefef;
    text-align: left;

    @media (max-width: 600px) {
        display: none; /* Esconde o cabeçalho no mobile para economizar espaço */
    }
`;

export const TableBody = styled.tbody`
    @media (max-width: 600px) {
        display: block;
        width: 100%;
    }
`;

export const TableRow = styled.tr`
    background: rgba(255, 255, 255, 0.08);

    @media (max-width: 600px) {
        display: flex;
        flex-direction: column; /* 🚀 EMPILHAMENTO: Faz o select cair para baixo */
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        gap: 10px;
    }
`;

export const TableCell = styled.td`
    padding: 10px 15px;
    color: #fff;
    font-size: 14px;

    /* Classe para esconder colunas repetitivas no mobile */
    &.desktop-only {
        @media (max-width: 600px) {
            display: none;
        }
    }

    .user-main-info {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .user-email-mobile {
            display: none; /* Escondido no Desktop */
            font-size: 12px;
            color: #aaa;
            padding-left: 23px; /* Alinha com o texto do nome ignorando o ícone */

            @media (max-width: 600px) {
                display: block; /* ✅ Aparece embaixo do nome no mobile */
            }
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #9758a6;
    }

    @media (max-width: 600px) {
        padding: 0;
        width: 100% !important;

        &:first-child { border-radius: 0; }
        &:last-child { border-radius: 0; }
    }
`;

export const SelectRole = styled.select`
    background: #323c42;
    color: #fff;
    border: 1px solid #48545c;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    width: 100%;
    outline: none;

    /* 🛡️ Bordas dinâmicas conforme o poder */
    border-left: 5px solid ${props => 
        props.$role === 'master' ? '#ff8c05' : 
        props.$role === 'manager' ? '#9758a6' : '#555' 
    };

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const AddButton = styled.button`
    background: #9758a6;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;

    &:hover { background: #ac6dbb; }
`;
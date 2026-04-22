import React, { useEffect, useState } from 'react';
import { useUser } from '../../../hooks/UserContext';
import api from '../../../services/api';
import { toast } from 'react-toastify';

// 🛠️ Ícones: FiUser para o cliente comum e os outros para a equipe
import { FiUserCheck, FiShield, FiUserPlus, FiSearch, FiUser } from 'react-icons/fi';

import {
    Container,
    Table,
    SelectRole,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    AddButton,
    ContainerTable
} from './styles';

export function UserManager() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 🔍 Busca em tempo real
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userData } = useUser();

    // 📥 Carrega todos os usuários (agora incluindo os 'users' comuns)
    async function loadUsers() {
        try {
            const { data } = await api.get('users');
            setUsers(data);
        } catch (err) {
            toast.error('Erro ao carregar a base de usuários.');
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    // 🛡️ Função para trocar permissões (Sincronizada com o Backend Core.Build)
    const handleRoleChange = async (userId, newRole) => {
        try {
            // Chamada para a rota de atualização de cargo que ajustamos no Backend
            await api.patch('/admin/users/role', { userId, role: newRole });

            // Atualização otimista da UI para refletir a mudança na hora
            const updatedList = users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            );
            setUsers(updatedList);

            toast.success('Nível de acesso atualizado com sucesso!');
        } catch (err) {
            toast.error('Não foi possível alterar a permissão.');
        }
    };

    // 🔍 Filtro dinâmico: busca por nome ou e-mail
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Container>
        <header>
            <div>
                <h1><FiShield /> Gestão de Permissões</h1>
                
                <div className="search-wrapper">
                    <FiSearch size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou e-mail..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <AddButton onClick={() => setIsModalOpen(true)}>
                <FiUserPlus /> Novo Colaborador
            </AddButton>
        </header>

        <ContainerTable>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Colaborador / E-mail</TableCell>
                        <TableCell className="desktop-only">E-mail</TableCell>
                        <TableCell>Nível de Acesso</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsers && filteredUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="user-main-info">
                                    <div className="user-info">
                                        {/* 🎨 ÍCONE DINÂMICO: Se for cliente, mostra um ícone diferente */}
                                        {user.role === 'user' ? <FiUser color="#888" /> : <FiUserCheck color="#ffca28" />} 
                                        <span style={{ color: user.role === 'master' ? '#ffca28' : '#fff' }}>
                                            {user.name}
                                        </span>
                                    </div>
                                    <span className="user-email-mobile">{user.email}</span>
                                </div>
                            </TableCell>

                            <TableCell className="desktop-only">
                                {user.email}
                            </TableCell>

                            <TableCell>
                                <SelectRole
                                    /* 🎯 IMPORTANTE: Agora o valor default é 'user' (Clientes) */
                                    value={user.role || 'user'} 
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    
                                    /* 🔒 SEGURANÇA: Master não pode se auto-rebaixar */
                                    disabled={user.id === userData.id} 
                                    $role={user.role}
                                >
                                    {/* 📋 OPÇÕES DE CARGO (Mapeadas com o Backend) */}
                                    <option value="user">Cliente (Acesso Comum)</option>
                                    <option value="operator">Operator (Equipe Base)</option>
                                    <option value="manager">Manager (Gerência)</option>
                                    <option value="master">Master (Dono)</option>
                                </SelectRole>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ContainerTable>
    </Container>
  );
}
import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../../services/api';
import { Button } from '../../components/Button';
import Logo from '../../assets/Logo.png';
import Background from '../../assets/Background.png';
import { Title, LogoTitleImage } from '../../components/Title';
// Animations and titles are now globalized in src/components/Title
/**
 * COMPONENTE: Register
 * Tela de cadastro de novos jogadores. Cria o usuário via API
 * e valida dados usando yup/react-hook-form.
 */
export function Register() {
  const navigate = useNavigate();

  const schema = yup.object({
    name: yup.string().required('O nome é obrigatório'),
    email: yup.string().email('Digite um e-mail válido').required('O e-mail é obrigatório'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required('Confirme sua senha'),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // 🚀 O axios retorna o 'status' dentro do objeto de resposta
      const { status } = await api.post('/user', {
        name: data.name,
        email: data.email,
        password: data.password
      }, { validateStatus: () => true }); // Isso permite que tratemos o 409 sem cair direto no 'catch'

      if (status === 200 || status === 201) {
        toast.success('CONTA CRIADA COM SUCESSO! 🍔');
        navigate('/login');
      } else if (status === 409) {
        // 🎮 Tratamento específico para e-mail duplicado
        toast.error('EMAIL JÁ CADASTRADO! Faça login para continuar.');
      } else {
        // ⚠️ Força o erro para cair no catch em outros casos (ex: 500, 400)
        throw new Error();
      }

    } catch (error) {
      // ❌ Falha geral (servidor fora do ar, erro de conexão, etc)
      toast.error('🤯 Falha no Sistema! Tente novamente mais tarde.');
    }
  };

  return (
    // 🎯 Passo 1: Adicione a classe para a transição de tela aqui
    <Container className="page-enter">
      {/* ✅ ParticlesBackground renderizado globalmente pelo DefaultLayout */}
      <LeftSide>
        {/* 🎯 Passo 3: A LogoImage já deve estar com o estilo 'breathe' configurado nos seus styled-components */}
        <LogoTitleImage src={Logo} alt="logo-devburger" $maxWidth="clamp(140px, 20vh, 350px)" style={{ marginBottom: 'clamp(5px, 1.5vh, 20px)' }} />
        <Title $size="clamp(24px, 4vh, 54px)">JOIN THE GAME</Title>
      </LeftSide>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title as="h2" $size="clamp(20px, 3.5vh, 30px)">NEW PLAYER</Title>

        <InputContainer>
          <label>NAME</label>
          <input type="text" {...register("name")} />
          <p style={{ color: 'red', fontSize: '13px' }}>{errors?.name?.message}</p>
        </InputContainer>

        <InputContainer>
          <label>EMAIL</label>
          <input type="email" {...register("email")} />
          <p style={{ color: 'red', fontSize: '13px' }}>{errors?.email?.message}</p>
        </InputContainer>

        <InputContainer>
          <label>PASSWORD</label>
          <input type="password" {...register("password")} />
          <p style={{ color: 'red', fontSize: '13px' }}>{errors?.password?.message}</p>
        </InputContainer>

        <InputContainer>
          <label>CONFIRM PASSWORD</label>
          <input type="password" {...register("confirmPassword")} />
          <p style={{ color: 'red', fontSize: '13px' }}>{errors?.confirmPassword?.message}</p>
        </InputContainer>

        <Button type="submit">START ADVENTURE</Button>

        <LinkItem to="/login">ALREADY A PLAYER? LOGIN</LinkItem>
      </Form>
    </Container>
  );
}
// --- 🎨 ESTILOS ---
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Use min-height para permitir rolagem se necessário */
  width: 100vw;
  flex-direction: column;
  padding: clamp(5px, 1vh, 20px);
  gap: clamp(5px, 1.5vh, 80px);
  /* 🚀 REMOVIDOS: background, background-blend-mode e background-size */

  @media (min-width: 900px) {
    flex-direction: row;
    gap: 80px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;



const Form = styled.form`
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: clamp(15px, 2.5vh, 25px);
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.2vh, 12px);
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  border: 2px solid #00c2ff;
`;



const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(2px, 0.5vh, 4px);

  label { 
    color: #fff; 
    font-size: clamp(12px, 1.8vh, 16px); 
    font-weight: bold;
  }

  input {
    height: clamp(32px, 4.5vh, 45px); /* Menor que login pois tem mais inputs */
    border-radius: clamp(6px, 1.2vh, 8px);
    padding: 0 10px;
    font-size: clamp(13px, 1.8vh, 16px);
    border: 2px solid #00c2ff;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      transform: scale(1.05) translateY(-5px); /* 🌀 Pulo do Crash Bandicoot */
      box-shadow: 0 0 15px #00c2ff;
    }
  }
`;

const LinkItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
  &:hover { color: #00c2ff; }
`;
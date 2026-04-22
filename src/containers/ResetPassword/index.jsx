import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import styled, { keyframes } from 'styled-components'; // 🆕 Importamos keyframes

import { api } from '../../services/api';
import { Button } from '../../components/Button';
import Logo from '../../assets/Logo.png';
import { Title } from '../../components/Title'; // ⚠️ Importamos apenas o Title
import { ParticlesBackground } from '../../components/ParticlesBackground';

// 🚀 1. DEFINIÇÃO DA ANIMAÇÃO: Ajustada para não crescer excessivamente
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); } /* Cresce apenas 3% para não invadir o texto */
  100% { transform: scale(1); }
`;

// 🚀 2. ESTILO DA LOGO: Com margens de segurança
const CustomLogo = styled.img`
  width: 100%;
  max-width: 280px;
  margin: 25px 0; /* 📐 Espaçamento vertical para proteger os textos acima e abaixo */
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: 2;
`;

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const schema = yup.object({
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Nova senha obrigatória'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
      .required('Confirme sua nova senha'),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    if (!token) return toast.error('Token inválido ou expirado.');

    try {
      await api.post('/reset-password', { token, password: data.password });
      toast.success('SENHA ATUALIZADA! 🛡️');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao redefinir. O link pode ter expirado.');
    }
  };

  return (
    <Container>
      <ParticlesBackground />
      
      <LeftSide>
        <Title $size="32px">LEVEL UP YOUR</Title>
        {/* 🍔 Usamos o CustomLogo com a margem e animação controlada */}
        <CustomLogo src={Logo} alt="logo-devburger" />
        <Title $size="24px">SECURITY</Title>
      </LeftSide>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title as="h2" $size="26px" style={{ textAlign: 'center', marginBottom: '20px' }}>
          NEW PASSWORD
        </Title>

        <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', marginBottom: '15px' }}>
            Crie uma nova senha de herói para proteger sua conta.
        </p>

        <InputContainer>
          <label>NOVA SENHA</label>
          <input type="password" placeholder="Mínimo 6 caracteres" {...register("password")} />
          <p className="error-msg">{errors?.password?.message}</p>
        </InputContainer>

        <InputContainer>
          <label>CONFIRMAR NOVA SENHA</label>
          <input type="password" placeholder="Repita sua senha" {...register("confirmPassword")} />
          <p className="error-msg">{errors?.confirmPassword?.message}</p>
        </InputContainer>

        <Button type="submit" style={{ marginTop: '20px' }}>
          UPDATE PASSWORD
        </Button>
      </Form>
    </Container>
  );
}

// --- ESTILOS MANTIDOS E OTIMIZADOS ---
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  background: #000;
  position: relative;
  overflow: hidden;

  @media (min-width: 900px) { flex-direction: row; gap: 100px; }
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
  padding: 30px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  border: 2px solid #00c2ff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px rgba(0, 194, 255, 0.2);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;

  label { color: #fff; font-size: 14px; font-weight: bold; }
  input { 
      height: 45px; 
      border-radius: 8px; 
      border: 1px solid #333; 
      padding: 0 15px;
      background: #fff;
      &:focus { border-color: #00c2ff; outline: none; }
  }
  .error-msg { color: #ff4444; font-size: 11px; height: 12px; }
`;
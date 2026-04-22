import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import styled from 'styled-components';

// 🛡️ IMPORTAÇÃO CORRIGIDA: Adicionando o useUser que estava faltando
import { useUser } from '../../hooks/UserContext'; 

import { api } from '../../services/api';
import { Button } from '../../components/Button';
import Logo from '../../assets/Logo.png';
import { Title, LogoTitleImage } from '../../components/Title';
import { ParticlesBackground } from '../../components/ParticlesBackground';

export function Login() {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  
  // ✅ Agora o useUser está devidamente importado e pronto para uso
  const { putUserData } = useUser(); 
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  /**
   * 📝 ESQUEMA DE VALIDAÇÃO (YUP):
   * Define as regras para os campos antes de enviar os dados.
   */
  const schema = yup.object({
    email: yup.string().email("Digite um e-mail válido").required("O e-mail é obrigatório"),
    password: isForgotPassword 
      ? yup.string() // Se for recuperação, a senha não é validada aqui
      : yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * 🚀 FUNÇÃO 1: Login de Sessão
   */
  const onSubmitLogin = async (data) => {
    try {
      const { data: userData } = await api.post('/sessions', {
        email: data.email,
        password: data.password
      });

      toast.success('WELCOME BACK, PLAYER! 🍔');

      // 💾 SALVAMENTO GLOBAL: Atualiza Context e LocalStorage
      await putUserData(userData);

      // 🧠 LÓGICA DE REDIRECIONAMENTO:
      const from = state?.from;

      if (from) {
        navigate(from, { replace: true });
      } else {
        if (userData.role !== 'client') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }

    } catch (error) {
      console.error(error);
      toast.error('GAME OVER: Credenciais incorretas ❌');
    }
  };

  /**
   * 📩 FUNÇÃO 2: Recuperação de Senha
   */
  const onSubmitForgot = async (data) => {
    try {
      await api.post('/forgot-password', { email: data.email });
      
      toast.info('Se o e-mail estiver na nossa base, as instruções foram enviadas! 📬');
      setIsForgotPassword(false); 
    } catch (error) {
      toast.error('Erro ao processar solicitação.');
    }
  };

  return (
    <Container className="page-enter">
      <ParticlesBackground />
      
      <LeftSide>
        <Title $size="clamp(26px, 4vh, 44px)">PRESS START TO</Title>
        <LogoTitleImage src={Logo} alt="logo-devburger" $maxWidth="clamp(200px, 22vh, 350px)" />
      </LeftSide>

      {/* 🛠️ O handleSubmit escolhe a função correta baseada no estado isForgotPassword */}
      <Form onSubmit={handleSubmit(isForgotPassword ? onSubmitForgot : onSubmitLogin)}>
        
        <Title as="h2" $size="28px" style={{ textAlign: 'center', marginBottom: '10px' }}>
          {isForgotPassword ? 'PASSWORD RECOVERY' : 'READY? LOGIN!'}
        </Title>

        <InputContainer>
          <label>PLAYER EMAIL</label>
          <input type="email" placeholder="Seu e-mail de herói" {...register("email")} />
          <p className="error-msg">{errors?.email?.message}</p>
        </InputContainer>

        {!isForgotPassword && (
          <>
            <InputContainer>
              <label>PASSWORD</label>
              <input type="password" placeholder="Sua senha secreta" {...register("password")} />
              <p className="error-msg">{errors?.password?.message}</p>
            </InputContainer>

            <ForgotPasswordLink type="button" onClick={() => setIsForgotPassword(true)}>
                FORGOT PASSWORD?
            </ForgotPasswordLink>
          </>
        )}

        <Button type="submit" style={{ marginTop: '10px' }}>
          {isForgotPassword ? 'SEND INSTRUCTIONS' : 'START GAME'}
        </Button>

        <SignUpSection>
          {isForgotPassword ? (
              <LinkItem as="button" type="button" onClick={() => setIsForgotPassword(false)}>
                  BACK TO LOGIN
              </LinkItem>
          ) : (
            <>
              <span>NEW PLAYER?</span>
              <LinkItem to="/cadastro">SIGN UP HERE</LinkItem>
            </>
          )}
        </SignUpSection>

        {!isForgotPassword && (
          <Button 
            type="button" 
            $black={true} 
            onClick={() => navigate('/')}
            style={{ height: '40px', fontSize: '18px' }}
          >
            EXIT TO HOME
          </Button>
        )}
      </Form>
    </Container>
  );
}

// --- 🎨 ESTILIZAÇÃO MANTIDA ---
const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 11px;
  text-align: right;
  cursor: pointer;
  margin-top: -5px;
  text-decoration: underline;
  transition: 0.2s;

  &:hover { color: #00c2ff; }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  flex-direction: column;
  padding: clamp(1rem, 3vw, 2rem);
  gap: clamp(1rem, 3vw, 2.5rem);
  position: relative;
  z-index: 0;

  @media (min-width: 900px) {
    flex-direction: row;
    gap: clamp(4rem, 8vw, 10rem);
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  z-index: 1;
  width: 100%;
  max-width: clamp(340px, 90vw, 420px);
  padding: clamp(1rem, 2.5vh, 1.75rem) clamp(1.25rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  border-radius: 25px;
  border: 2px solid #00c2ff;
  box-shadow: 0 0 40px rgba(0, 194, 255, 0.25);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: clamp(13px, 1.1vw, 16px);
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
  }

  input {
    height: clamp(40px, 5vh, 52px);
    border-radius: 8px;
    border: 2px solid #333;
    padding: 0 1rem;
    background: #fff;
  }

  .error-msg {
    color: #ff4444;
    font-size: 11px;
    height: 14px;
  }
`;

const SignUpSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  
  span { color: #fff; font-size: 13px; }
`;

const LinkItem = styled(Link)`
  color: #00c2ff;
  font-family: 'Bangers', cursive;
  font-size: 18px;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #fff;
    text-shadow: 0 0 10px #00c2ff;
  }
`;
import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { api } from '../../services/api';
import { Button } from '../../components/Button';
import Logo from '../../assets/Logo.png';
import { Title, LogoTitleImage } from '../../components/Title';
import { ParticlesBackground } from '../../components/ParticlesBackground';

export function Login() {
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const { data: userData } = await api.post('/sessions', {
        email: data.email,
        password: data.password
      });

      toast.success('WELCOME BACK, PLAYER! 🍔');
      localStorage.setItem('devburger:userData', JSON.stringify(userData));
      navigate('/');
    } catch (error) {
      toast.error('GAME OVER: Credenciais incorretas ❌');
    }
  };

  return (
    <Container className="page-enter">
      {/* 🎆 ParticlesBackground exclusivo da tela de login — consistência visual com a Home */}
      <ParticlesBackground />
      <LeftSide>
        <Title $size="clamp(26px, 4vh, 44px)">PRESS START TO</Title>
        <LogoTitleImage src={Logo} alt="logo-devburger" $maxWidth="clamp(200px, 22vh, 350px)" />
      </LeftSide>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title as="h2" $size="28px" style={{ textAlign: 'center', marginBottom: '10px' }}>
          READY? LOGIN!
        </Title>

        <InputContainer>
          <label>PLAYER EMAIL</label>
          <input type="email" placeholder="Seu e-mail de herói" {...register("email")} />
          <p className="error-msg">{errors?.email?.message}</p>
        </InputContainer>

        <InputContainer>
          <label>PASSWORD</label>
          <input type="password" placeholder="Sua senha secreta" {...register("password")} />
          <p className="error-msg">{errors?.password?.message}</p>
        </InputContainer>

        {/* 🚀 BOTÃO PRINCIPAL: Cor forte para chamar o clique */}
        <Button type="submit" style={{ marginTop: '10px' }}>
          START GAME
        </Button>

        {/* 🚀 DESTAQUE CADASTRO: Usando estilo de link gamer */}
        <SignUpSection>
           <span>NEW PLAYER?</span>
           <LinkItem to="/cadastro">SIGN UP HERE</LinkItem>
        </SignUpSection>

        {/* 🚀 BOTÃO EXIT: Adicionado novamente com estilo neutro */}
        <Button 
          type="button" 
          $black={true} 
          onClick={() => navigate('/')}
          style={{ height: '40px', fontSize: '18px' }}
        >
          EXIT TO HOME
        </Button>
      </Form>
    </Container>
  );
}

// --- 🎨 ESTILIZAÇÃO PARA UX/UI ---

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

  /* 🦸 Logo como herói: escala +40% em telas acima de 1440px */
  @media (min-width: 1440px) {
    gap: 2.5rem;

    img {
      max-width: clamp(350px, 25vw, 560px) !important;
    }
  }

  @media (min-width: 1920px) {
    img {
      max-width: clamp(490px, 28vw, 680px) !important;
    }
  }
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

  /* 📐 Formulário proporcional em telas grandes */
  @media (min-width: 1440px) {
    max-width: 550px;
    gap: 1rem;
    padding: 2rem 2.5rem;
  }

  @media (min-width: 1920px) {
    max-width: 620px;
    padding: 2.5rem 3rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: clamp(13px, 1.1vw, 16px);
    color: #fff;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  input {
    height: clamp(40px, 5vh, 52px);
    border-radius: 8px;
    border: 2px solid #333;
    padding: 0 clamp(0.75rem, 1.5vw, 1.25rem);
    background: #fff;
    font-size: clamp(14px, 1.1vw, 17px);
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #00c2ff;
      box-shadow: 0 0 8px rgba(0, 194, 255, 0.4);
    }

    @media (min-width: 1440px) {
      height: 56px;
      font-size: 1rem;
    }
  }

  .error-msg {
    color: #ff4444;
    font-size: 11px;
    height: 14px;
    margin-top: 2px;
  }
`;

const SignUpSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 2px 0; /* 🚀 Margem reduzida para quase zero */
  
  span {
    color: #fff;
    font-size: 13px;
  }
`;

const LinkItem = styled(Link)`
  color: #00c2ff;
  font-family: 'Bangers', cursive;
  font-size: 18px;
  text-decoration: underline;
  transition: 0.2s;

  &:hover {
    color: #fff;
    text-shadow: 0 0 10px #00c2ff;
  }
`;
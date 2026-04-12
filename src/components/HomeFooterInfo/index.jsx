import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiInstagram, FiFacebook, FiMessageCircle, FiClock, FiMapPin } from 'react-icons/fi';
import { Title } from '../Title';

// --- 🎮 ANIMAÇÕES ---
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;
const glow = keyframes`
  0% { filter: drop-shadow(0 0 5px #00c2ff); opacity: 0.7; }
  50% { filter: drop-shadow(0 0 20px #00c2ff); opacity: 1; }
  100% { filter: drop-shadow(0 0 5px #00c2ff); opacity: 0.7; }
`;

// --- 🎨 ESTILIZAÇÃO ---
const InfoContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  border: 1px solid #333;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  @media (min-width: 900px) { grid-template-columns: 1.2fr 0.8fr; }
`;

const MapsBox = styled.div`
  border: 3px solid #ff4500;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.3);
  height: 350px;
  
  iframe { width: 100%; height: 100%; border: 0; filter: grayscale(1) invert(0.9) hue-rotate(170deg); }
`;

const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const InfoCard = styled.div`
  background: rgba(20, 20, 20, 0.8);
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #ff4500;
  
  h4 { font-family: 'Bangers'; color: #ff4500; font-size: 24px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
  p { color: #ccc; font-size: 16px; line-height: 1.5; }
`;

const SocialGrid = styled.div`
  display: flex;
  gap: 30px;
  
  a {
    width: 80px;
    height: 80px;
    background: #111;
    border: 2px solid #333;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28px;
    transition: all 0.4s;

    &:hover {
      border-color: #ff4500;
      color: #ff4500;
      box-shadow: 0 0 15px #ff4500;
      animation: ${float} 2s infinite ease-in-out;
    }
  }
`;

const FinalActionButton = styled.button`
  width: 100%;
  padding: 25px;
  background: linear-gradient(90deg, #ff4500 0%, #ff8c00 100%);
  border: none;
  border-radius: 20px;
  font-family: 'Bangers';
  font-size: 32px;
  color: #fff;
  cursor: pointer;
  text-shadow: 2px 2px 0 #000;
  box-shadow: 0 10px 0 #900, 0 20px 40px rgba(255, 69, 0, 0.4);
  transition: all 0.2s;
  margin-top: 20px;

  &:hover { transform: translateY(-5px); box-shadow: 0 15px 0 #900, 0 25px 50px rgba(255, 69, 0, 0.5); }
  &:active { transform: translateY(5px); box-shadow: 0 5px 0 #900; }
`;
const CoreBuildSignature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;

  img {
    width: 140px; /* Ajuste conforme o tamanho da sua imagem */
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s;
    /* 🚀 Aplica flutuação e brilho simultâneos */
    animation: ${float} 4s ease-in-out infinite, ${glow} 3s ease-in-out infinite;

    &:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 30px #00c2ff);
    }
  }

  span {
    font-family: 'Poppins', sans-serif;
    font-size: 10px;
    letter-spacing: 4px;
    color: #555;
    text-transform: uppercase;
  }
`;


export function HomeFooterInfo() {
  return (
    <InfoContainer>
      <Title as="h2" $lined $size="44px" style={{ textAlign: 'center' }}>CHECKPOINT FINAL</Title>

      <ContentRow>
        <MapsBox>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.658!3d-23.56!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzM2LjAiUyA0NsKwMzknMjguOCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
            allowFullScreen=""
            loading="lazy"
            title="Endereço Dev Burger"
          />
        </MapsBox>

        <DetailsBox>
          <InfoCard>
            <h4><FiMapPin /> LOCALIZAÇÃO</h4>
            <p>Rua dos Gamers, 1024 - Bairro Level Up<br />São Paulo - SP</p>
          </InfoCard>

          <InfoCard>
            <h4><FiClock /> HORÁRIO DA FASE</h4>
            <p>Segunda a Sexta: 18h às 23:30h<br />Sábados e Domingos: 18h às 01h</p>
          </InfoCard>

          <div>
            <h4 style={{ fontFamily: 'Bangers', color: '#fff', fontSize: '24px', marginBottom: '15px' }}>SIGA NAS REDES</h4>
            <SocialGrid>
              <a href="#"><FiInstagram /></a>
              <a href="#"><FiFacebook /></a>
            </SocialGrid>
          </div>
        </DetailsBox>
      </ContentRow>

      <FinalActionButton onClick={() => window.open('https://wa.me/seunumeroaqui', '_blank')}>
        <FiMessageCircle style={{ marginRight: '15px' }} />
        INICIAR EXPERIÊNCIA LENDÁRIA
      </FinalActionButton>
      {/* 🚀 NOVA SEÇÃO: ASSINATURA CORE.BUILD */}
      <CoreBuildSignature>
        <a
          href="https://seu-portfolio-ou-linkedin.com" // 👈 Coloque seu link aqui
          target="_blank"
          rel="noopener noreferrer"
        >
          CORE BUILD
        </a>
        <span>DEVELOPED BY </span>
      </CoreBuildSignature>
    </InfoContainer>
  );
}
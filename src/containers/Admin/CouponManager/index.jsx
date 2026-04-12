import React, { useState, useEffect } from 'react';
import { FiTag, FiPlusCircle, FiList, FiPercent, FiHash, FiTrash2, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { api } from '../../../services/api';

import {
  PageWrapper,
  PageTitle,
  ContentGrid,
  FormCard,
  SectionTitle,
  InputGroup,
  Label,
  Input,
  Select,
  SubmitButton,
  TableCard,
  TableHeader,
  CouponTable,
  CodeBadge,
  StatusBadge,
  DeleteButton,
  EmptyState,
  LoadingText,
} from './styles';

export function CouponManager() {
  // ─── 📝 ESTADO DO FORMULÁRIO ───────────────────────────────────────────────
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState('');
  const [isActive, setIsActive] = useState(true);    // ✅ Backend espera boolean
  const [expirationDate, setExpirationDate] = useState(''); // 🗓️ Data de expiração

  // ─── 📋 ESTADO DA LISTAGEM ─────────────────────────────────────────────────
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── 🔄 BUSCA OS CUPONS EXISTENTES AO MONTAR ─────────────────────────────
  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      toast.error('Falha ao carregar cupons. Verifique a conexão com o servidor.');
      console.error('[CouponManager] Erro ao buscar cupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ─── ✅ VALIDAÇÃO E CRIAÇÃO ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Validação: Código não pode ser vazio
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      toast.warn('⚠️ O código do cupom não pode ser vazio!');
      return;
    }

    // 🛡️ Validação: Porcentagem entre 1 e 100
    const parsedPercentage = Number(percentage);
    if (
      !percentage ||
      isNaN(parsedPercentage) ||
      parsedPercentage < 1 ||
      parsedPercentage > 100
    ) {
      toast.warn('⚠️ A porcentagem deve ser um número entre 1 e 100!');
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ Nomes sincronizados com o CouponController.js do backend
      await api.post('/coupons', {
        code: trimmedCode,
        discountPercentage: parsedPercentage, // ✅ camelCase igual ao Yup do controller
        isActive,                              // ✅ boolean, não string
        ...(expirationDate && { expirationDate }), // 🗓️ opcional
      });

      toast.success(`✅ Cupom "${trimmedCode}" criado com sucesso!`);

      // Limpa o formulário
      setCode('');
      setPercentage('');
      setIsActive(true);
      setExpirationDate('');

      // Recarrega a lista
      await fetchCoupons();
    } catch (err) {
      // 🛡️ Tratamento canônico: usa a mensagem da API se existir
      const apiMessage = err.response?.data?.error;

      if (err.response?.status === 400 && apiMessage?.toLowerCase().includes('already exists')) {
        // Cupom duplicado (mensagem do controller: 'Coupon already exists.')
        toast.error(`❌ Cupom duplicado! O código "${trimmedCode}" já existe.`);
      } else {
        toast.error(apiMessage || 'Erro interno. Tente novamente.');
      }

      console.error('[CouponManager] Erro ao criar cupom:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── 🗑️ DELETAR CUPOM ────────────────────────────────────────────────────
  const handleDelete = async (couponId, couponCode) => {
    if (!window.confirm(`Deseja realmente remover o cupom "${couponCode}"?`)) return;

    try {
      await api.delete(`/coupons/${couponId}`);
      toast.success(`🗑️ Cupom "${couponCode}" removido com sucesso!`);
      await fetchCoupons();
    } catch (error) {
      toast.error('❌ Falha ao remover o cupom. Tente novamente.');
      console.error('[CouponManager] Erro ao deletar cupom:', error);
    }
  };

  // ─── 🖥️ RENDER ────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <PageTitle>
        <FiTag />
        CENTRAL DE CUPONS
      </PageTitle>

      <ContentGrid>
        {/* ─── 📝 FORMULÁRIO DE CRIAÇÃO ─────────────────────────────────── */}
        <FormCard>
          <SectionTitle>
            <FiPlusCircle />
            Novo Cupom
          </SectionTitle>

          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="coupon-code">
                <FiHash />
                Código do Cupom
              </Label>
              <Input
                id="coupon-code"
                type="text"
                placeholder="Ex: BURGER20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={30}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="coupon-percentage">
                <FiPercent />
                Desconto (%)
              </Label>
              <Input
                id="coupon-percentage"
                type="number"
                placeholder="Ex: 20"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="1"
                max="100"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="coupon-status">Status</Label>
              <Select
                id="coupon-status"
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
              >
                <option value="true">✅ Ativo</option>
                <option value="false">⛔ Inativo</option>
              </Select>
            </InputGroup>

            {/* 🗓️ NOVO: Data de expiração do cupom */}
            <InputGroup>
              <Label htmlFor="coupon-expiration">
                <FiCalendar />
                Expiração (opcional)
              </Label>
              <Input
                id="coupon-expiration"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : <><FiPlusCircle /> CRIAR CUPOM</>}
            </SubmitButton>
          </form>
        </FormCard>

        {/* ─── 📋 LISTAGEM DE CUPONS ────────────────────────────────────── */}
        <TableCard>
          <TableHeader>
            <SectionTitle style={{ margin: 0, border: 'none', padding: 0 }}>
              <FiList />
              Cupons Ativos ({coupons.length})
            </SectionTitle>
          </TableHeader>

          {isLoading ? (
            <LoadingText>⏳ Carregando cupons...</LoadingText>
          ) : coupons.length === 0 ? (
            <EmptyState>
              <FiTag size={48} />
              <p>Nenhum cupom cadastrado ainda.</p>
              <p>Crie o primeiro usando o formulário ao lado!</p>
            </EmptyState>
          ) : (
            <CouponTable>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Desconto</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id || coupon._id}>
                    <td data-label="Código">
                      <CodeBadge>{coupon.code}</CodeBadge>
                    </td>
                    <td data-label="Desconto">
                      {/* ✅ Campo correto: discountPercentage (vem do model Sequelize) */}
                      <strong style={{ color: '#ffca28' }}>{coupon.discountPercentage}%</strong>
                    </td>
                    <td data-label="Status">
                      {/* ✅ Campo correto: isActive (boolean vindo do backend) */}
                      <StatusBadge $active={coupon.isActive}>
                        {coupon.isActive ? '● Ativo' : '● Inativo'}
                      </StatusBadge>
                    </td>
                    <td data-label="Ação">
                      <DeleteButton
                        type="button"
                        onClick={() => handleDelete(coupon.id || coupon._id, coupon.code)}
                        title={`Remover cupom ${coupon.code}`}
                      >
                        <FiTrash2 size={14} />
                        Remover
                      </DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CouponTable>
          )}
        </TableCard>
      </ContentGrid>
    </PageWrapper>
  );
}

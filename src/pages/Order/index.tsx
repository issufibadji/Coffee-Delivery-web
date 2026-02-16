import { OrderContainer } from './styles';

import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { ptBR } from 'date-fns/locale';

import { v4 as uuid } from 'uuid';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { CartInfo } from './components/CartInfo';
import { PaymentForm } from './components/PaymentForm';

import { OrdersContext } from '../../providers/OrdersProvider';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import {
  CheckoutFormData,
  clearCheckoutSnapshot,
  getCheckoutSnapshot,
  saveCheckoutSnapshot,
  saveRedirect,
} from '../../storage/redirect';

const newCompleteOrderFormSchema: zod.ZodType<CheckoutFormData> = zod.object({
  CEP: zod.string().regex(/^[0-9]{5}-[0-9]{3}$/),
  road: zod.string().min(10),
  number: zod.string().min(1).max(3),
  complement: zod.string().min(1),
  district: zod.string().min(3),
  city: zod.string(),
  estate: zod.string(),
});

export type NewCompleteOrderData = CheckoutFormData;

export const Order = () => {
  const { completeCurrentOrder } = useContext(OrdersContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [paymentPreference, setPaymentPreference] = useState('');
  const navigate = useNavigate();

  const handleSelectPaymentPreference = (newPaymentPreference: string) => {
    setPaymentPreference(newPaymentPreference);
  };

  const newOrderForm = useForm<NewCompleteOrderData>({
    resolver: zodResolver(newCompleteOrderFormSchema),
    defaultValues: {
      CEP: '',
      road: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      estate: '',
    },
  });

  const { reset } = newOrderForm;

  // if (Object.keys(errors).length > 0) {
  //   const key = Object.keys(errors)[0];
  //   toast.warning(errors[key].message);
  // }

  useEffect(() => {
    const snapshot = getCheckoutSnapshot();

    if (snapshot) {
      reset(snapshot.formData);
      setPaymentPreference(snapshot.paymentPreference);
      clearCheckoutSnapshot();
    }
  }, [reset]);

  const completeOrder = async (data: NewCompleteOrderData) => {
    if (!isAuthenticated) {
      saveRedirect({
        path: '/checkout',
        message: 'Faça login para confirmar o pedido.',
      });
      saveCheckoutSnapshot({ formData: data, paymentPreference });
      navigate('/login');
      return;
    }

    if (paymentPreference.length === 0) {
      toast.warning('Selecione um meio de pagamento!');
      return;
    }

    const newOrderData = {
      ...data,
      paymentPreference,
      date: format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
      id: uuid(),
    };

    await completeCurrentOrder(newOrderData);
    reset();
  };

  return (
    <OrderContainer>
      <FormProvider {...newOrderForm}>
        <PaymentForm
          completeOrder={completeOrder}
          handleSelectPaymentPreference={handleSelectPaymentPreference}
          paymentPreference={paymentPreference}
        />
        <CartInfo />
      </FormProvider>
    </OrderContainer>
  );
};

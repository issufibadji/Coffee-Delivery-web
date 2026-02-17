import { HistoryCardContainer } from './styles';

import { GiShoppingBag } from 'react-icons/gi';
import { getPaymentPreference } from '../../../../utils/get-payment-preference';

interface HistoryCardProps {
  date?: string;
  itemsCount: number;
  city: string;
  estate: string;
  totalPrice: number;
  paymentPreference: string;
}

export const HistoryCard = ({
  date,
  itemsCount,
  estate,
  city,
  totalPrice,
  paymentPreference,
}: HistoryCardProps) => {
  const translatedPaymentPreference = getPaymentPreference(paymentPreference);

  const formattedDate = date
    ? new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
    : 'Data desconhecida';

  return (
    <HistoryCardContainer>
      <div>
        <GiShoppingBag />
        <p>{formattedDate}</p>
      </div>
      <p>
        Sabores: <span>{itemsCount}</span>
      </p>
      <p>{`${city}, ${estate}`}</p>
      <div>
        <p>
          <span>{`R$ ${totalPrice.toFixed(2).replace('.', ',')}`}</span>
          {` - Pago com ${translatedPaymentPreference}`}
        </p>
      </div>
    </HistoryCardContainer>
  );
};

export type OrdersByUser<OrderType> = Record<string, OrderType[]>;

export type OrdersState<OrderType, CurrentOrderType> = {
  ordersByUser: OrdersByUser<OrderType>;
  currentOrder: CurrentOrderType;
};

const ORDERS_STORAGE_KEY = '@coffee-delivery:orders-state';
const LEGACY_STORAGE_KEY = '@coffee-delivery/orders';

export const getOrdersState = <OrderType, CurrentOrderType>(
  fallbackState: OrdersState<OrderType, CurrentOrderType>,
): OrdersState<OrderType, CurrentOrderType> => {
  const storedState = localStorage.getItem(ORDERS_STORAGE_KEY);

  if (storedState) {
    try {
      return JSON.parse(storedState) as OrdersState<OrderType, CurrentOrderType>;
    } catch {
      return fallbackState;
    }
  }

  const legacyState = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacyState) {
    try {
      const parsed = JSON.parse(legacyState) as OrdersState<
        OrderType,
        CurrentOrderType
      >;
      return {
        ...fallbackState,
        currentOrder: parsed.currentOrder ?? fallbackState.currentOrder,
      };
    } catch {
      return fallbackState;
    }
  }

  return fallbackState;
};

export const saveOrdersState = <OrderType, CurrentOrderType>(
  state: OrdersState<OrderType, CurrentOrderType>,
) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(state));
};

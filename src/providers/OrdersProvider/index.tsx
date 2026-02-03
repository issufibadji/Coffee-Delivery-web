import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { toast } from 'react-toastify';

import { getNewOrderInfo } from '../../utils/get-new-order-info';
import { AuthContext } from '../../contexts/AuthContext';
import { getOrdersState, OrdersState, saveOrdersState } from '../../storage/orders';

export type CoffeeType = {
  title: string;
  tags: string[];
  amount: number;
  description: string;
  srcImg: string;
  price: string;
  id: string;
};

type OrderData = {
  CEP: string;
  road: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  estate: string;
  date: string;
  id: string;
  paymentPreference: string;
};

interface OrderProps {
  totalPrice: number;
  cart: CoffeeType[];
  date: string;
  paymentPreference: string;
  road: string;
  number: string;
  city: string;
  estate: string;
  id: string;
  district: string;
  userId: string;
}

interface OrdersContextProps {
  orders: OrderProps[];
  cart: CoffeeType[];
  productsPrice: number;
  deliveryPrice: number;
  totalPrice: number;
  addCoffeeToCart: (coffee: CoffeeType, amount: number) => void;
  removeCoffeeFromCart: (coffeeId: string) => void;
  completeCurrentOrder: (orderData: OrderData) => void;
}

export const OrdersContext = createContext({} as OrdersContextProps);

interface OrdersContextProviderProps {
  children: ReactNode;
}

type CurrentOrderType = {
  cart: CoffeeType[];
  totalPrice: number;
  deliveryPrice: number;
  productsPrice: number;
};

export const OrdersProvider = ({ children }: OrdersContextProviderProps) => {
  const { user } = useContext(AuthContext);

  const userId = user?.id ?? user?.email ?? '';
  const fallbackState: OrdersState<OrderProps, CurrentOrderType> = {
    ordersByUser: {},
    currentOrder: {
      cart: [],
      totalPrice: 0,
      deliveryPrice: 0,
      productsPrice: 0,
    },
  };

  const [ordersState, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case 'ADD_COFFEE_TO_CART': {
          const { ordersByUser, currentOrder } = state;
          const { cart } = currentOrder;

          let newCart = cart.filter((coffee: CoffeeType) => {
            return coffee.id !== action.payload.id;
          });

          newCart.push(action.payload);

          const newCurrentOrder = getNewOrderInfo(newCart);
          toast.success('Café adicionado ao carrinho com sucesso!');
          return { ordersByUser, currentOrder: newCurrentOrder };
        }

        case 'REMOVE_COFFEE_FROM_CART': {
          const { ordersByUser, currentOrder } = state;
          const { cart } = currentOrder;

          let newCart = cart.filter((coffee: CoffeeType) => {
            return coffee.id !== action.payload.id;
          });

          const newCurrentOrder = getNewOrderInfo(newCart);
          toast.success('Café removido do carrinho com sucesso!');
          return { ordersByUser, currentOrder: newCurrentOrder };
        }

        case 'COMPLETE_CURRENT_ORDER':
          const { ordersByUser, currentOrder } = state;
          const { cart, totalPrice } = currentOrder;
          const { userId } = action.payload;
          const userOrders = ordersByUser[userId] ?? [];

          const newCompleteOrder = {
            cart,
            totalPrice,
            ...action.payload.orderData,
            userId,
          };

          window.location.href = '/order/success';
          return {
            ordersByUser: {
              ...ordersByUser,
              [userId]: [...userOrders, newCompleteOrder],
            },
            currentOrder: {
              cart: [],
              totalPrice: 0,
              deliveryPrice: 0,
              productsPrice: 0,
            },
          };

        default:
          return state;
      }
    },
    fallbackState,
    () => getOrdersState(fallbackState),
  );

  useEffect(() => {
    saveOrdersState(ordersState);
  }, [ordersState]);

  const { ordersByUser, currentOrder } = ordersState;
  const { cart, totalPrice, deliveryPrice, productsPrice } = currentOrder;
  const orders = userId ? ordersByUser[userId] ?? [] : [];

  const addCoffeeToCart = (coffee: CoffeeType, amount: number) => {
    dispatch({
      type: 'ADD_COFFEE_TO_CART',
      payload: {
        ...coffee,
        amount,
      },
    });
  };

  const removeCoffeeFromCart = (coffeeId: string) => {
    dispatch({
      type: 'REMOVE_COFFEE_FROM_CART',
      payload: {
        id: coffeeId,
      },
    });
  };

  const completeCurrentOrder = (orderData: OrderData) => {
    if (!userId) {
      return;
    }

    dispatch({
      type: 'COMPLETE_CURRENT_ORDER',
      payload: {
        cart,
        orderData,
        userId,
      },
    });
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        cart,
        totalPrice,
        deliveryPrice,
        productsPrice,
        addCoffeeToCart,
        removeCoffeeFromCart,
        completeCurrentOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

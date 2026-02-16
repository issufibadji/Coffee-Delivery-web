import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { getNewOrderInfo } from '../../utils/get-new-order-info';
import { AuthContext } from '../../contexts/AuthContext';
import { orderService, Order, OrderItem } from '../../services/orderService';
import { addressService } from '../../services/addressService';

export type CoffeeType = {
  title: string;
  tags: string[];
  amount: number;
  description: string;
  srcImg: string;
  price: string;
  id: string;
};

export type OrderData = {
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

interface OrdersContextProps {
  orders: Order[];
  cart: CoffeeType[];
  productsPrice: number;
  deliveryPrice: number;
  totalPrice: number;
  isLoadingOrders: boolean;
  addCoffeeToCart: (coffee: CoffeeType, amount: number) => void;
  removeCoffeeFromCart: (coffeeId: string) => void;
  completeCurrentOrder: (orderData: OrderData) => Promise<void>;
  refreshOrders: () => Promise<void>;
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

const CART_STORAGE_KEY = '@coffee-delivery:cart-state';

export const OrdersProvider = ({ children }: OrdersContextProviderProps) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [cartState, dispatch] = useReducer(
    (state: CurrentOrderType, action: any) => {
      switch (action.type) {
        case 'ADD_COFFEE_TO_CART': {
          const { cart } = state;
          let newCart = cart.filter((coffee: CoffeeType) => coffee.id !== action.payload.id);
          newCart.push(action.payload);
          toast.success('Café adicionado ao carrinho com sucesso!');
          return getNewOrderInfo(newCart);
        }

        case 'REMOVE_COFFEE_FROM_CART': {
          const { cart } = state;
          let newCart = cart.filter((coffee: CoffeeType) => coffee.id !== action.payload.id);
          toast.success('Café removido do carrinho com sucesso!');
          return getNewOrderInfo(newCart);
        }

        case 'CLEAR_CART':
          return {
            cart: [],
            totalPrice: 0,
            deliveryPrice: 0,
            productsPrice: 0,
          };

        case 'SET_CART':
          return action.payload;

        default:
          return state;
      }
    },
    {
      cart: [],
      totalPrice: 0,
      deliveryPrice: 0,
      productsPrice: 0,
    },
    (initialValue) => {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          return JSON.parse(storedCart);
        } catch {
          return initialValue;
        }
      }
      return initialValue;
    }
  );

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Não foi possível carregar seu histórico de pedidos.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  }, [cartState]);

  const { cart, totalPrice, deliveryPrice, productsPrice } = cartState;

  const addCoffeeToCart = (coffee: CoffeeType, amount: number) => {
    dispatch({ type: 'ADD_COFFEE_TO_CART', payload: { ...coffee, amount } });
  };

  const removeCoffeeFromCart = (coffeeId: string) => {
    dispatch({ type: 'REMOVE_COFFEE_FROM_CART', payload: { id: coffeeId } });
  };

  const completeCurrentOrder = async (orderData: OrderData) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para finalizar o pedido.');
      return;
    }

    try {
      // Save address to address book if needed
      // (Optional: we could check if it exists, but for now we'll just save it)
      const { ...addressData } = orderData;
      await addressService.createAddress({
        cep: addressData.CEP,
        road: addressData.road,
        number: addressData.number,
        complement: addressData.complement,
        district: addressData.district,
        city: addressData.city,
        estate: addressData.estate,
        is_default: true // Making the latest address default for now
      });

      const orderItems: OrderItem[] = cart.map((item: CoffeeType) => ({
        coffee_id: item.id,
        amount: item.amount,
        unit_price: parseFloat(item.price),
        title: item.title,
        src_img: item.srcImg
      }));

      await orderService.createOrder({
        total_price: totalPrice,
        delivery_price: deliveryPrice,
        payment_method: orderData.paymentPreference,
        road: orderData.road,
        number: orderData.number,
        city: orderData.city,
        estate: orderData.estate,
        district: orderData.district,
      }, orderItems);

      dispatch({ type: 'CLEAR_CART' });
      await fetchOrders();
      window.location.href = '/order/success';
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Ocorreu um erro ao finalizar seu pedido.');
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        cart,
        totalPrice,
        deliveryPrice,
        productsPrice,
        isLoadingOrders,
        addCoffeeToCart,
        removeCoffeeFromCart,
        completeCurrentOrder,
        refreshOrders: fetchOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};


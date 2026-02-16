import { supabase } from '../lib/supabase';

export type OrderItem = {
    coffee_id: string;
    amount: number;
    unit_price: number;
    title: string;
    src_img: string;
};

export type Order = {
    id?: string;
    created_at?: string;
    total_price: number;
    delivery_price: number;
    payment_method: string;
    road: string;
    number: string;
    city: string;
    estate: string;
    district: string;
    items?: OrderItem[];
};

export const orderService = {
    async getOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        items:order_items(*)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async createOrder(order: Omit<Order, 'id' | 'created_at' | 'items'>, items: OrderItem[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Start a manual "transaction" by inserting the order first
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{ ...order, user_id: user.id }])
            .select()
            .single();

        if (orderError) throw orderError;

        const orderItemsWithId = items.map(item => ({
            ...item,
            order_id: orderData.id
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsWithId);

        if (itemsError) {
            // In a real app we might want to delete the order if items fail
            // but Supabase doesn't easily support cross-table transactions in JS without RPC
            console.error('Failed to insert order items:', itemsError);
            throw itemsError;
        }

        return orderData;
    }
};

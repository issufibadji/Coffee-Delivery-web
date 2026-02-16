import { supabase } from '../lib/supabase';

export type Address = {
    id?: string;
    user_id?: string;
    cep: string;
    road: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    estate: string;
    is_default?: boolean;
};

export const addressService = {
    async getAddresses() {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Address[];
    },

    async createAddress(address: Omit<Address, 'id' | 'user_id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('addresses')
            .insert([{ ...address, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async updateAddress(id: string, address: Partial<Address>) {
        const { data, error } = await supabase
            .from('addresses')
            .update(address)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async deleteAddress(id: string) {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// services/authService.ts
import { createClient } from '@supabase/supabase-js';

// Инициализация Supabase (эти данные у вас уже есть)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
    id: string;
    name: string;
    password_hash: string;
    created_at: string;
}

interface LoginResponse {
    success: boolean;
    userId?: string;
    userName?: string;
    error?: string;
}


export const loginWithPassword = async (password: string): Promise<LoginResponse> => {
    try {
        // 1. Ищем пользователя с таким паролем в таблице users
        const { data, error } = await supabase
            .from('users')
            .select('id, name, password')
            .eq('password', password) // ВАЖНО: потом замените на хеш-сравнение
            .maybeSingle();

        // 2. Ошибка запроса
        if (error) {
            console.error('Supabase error:', error);
            return {
                success: false,
                error: 'Ошибка сервера. Попробуйте позже.'
            };
        }

        // 3. Пользователь не найден
        if (!data) {
            console.log({ data })
            return {
                success: false,
                error: 'Неверный пароль. Попробуйте снова.'
            };
        }

        // 4. Успешный вход
        return {
            success: true,
            userId: data.id,
            userName: data.name
        };

    } catch (err) {
        console.error('Login error:', err);
        return {
            success: false,
            error: 'Произошла ошибка. Проверьте подключение к интернету.'
        };
    }
};



export const checkUserExists = async (userId: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .maybeSingle();

        if (error) throw error;
        return !!data;
    } catch (err) {
        console.error('Check user error:', err);
        return false;
    }
};
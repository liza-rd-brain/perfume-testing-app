
import { supabase } from "~/lib/supabase";
import type { PerfumeInSet, SavedNotes } from '~/types';


export const loadAllSavedNotes = async (userId: number): Promise<Omit<SavedNotes, "user_id" | "id">[] | undefined> => {
    if (!userId) return;

    try {
        const { data, error } = await supabase
            .from("user-experience")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("❌ Ошибка запроса:", error);
            return undefined;
        }

        if (!data || data.length === 0) {

            return undefined;
        }

        // Преобразуем данные в удобный формат
        const result = data.map(item => ({
            perfume_id: item.perfume_id,

            top: item.notes?.top || [],
            middle: item.notes?.middle || [],
            base: item.notes?.base || [],

            impression: item.impression || "",
            isDone: item.isDone || false,
        }));

        return result;

    } catch (error) {
        console.error("💥 Ошибка:", error);
        return undefined;
    }
}




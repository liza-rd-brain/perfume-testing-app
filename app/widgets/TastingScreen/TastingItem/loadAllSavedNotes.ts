
import { supabase } from "~/lib/supabase";


export const loadAllSavedNotes = async (userId: number): Promise<{
    perfume_id: number;
    top: any[];
    middle: any[];
    base: any[];
    impression: string;
}[] | undefined> => {
    if (!userId) return;

    try {
        const { data, error } = await supabase
            .from("user_experience")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("❌ Ошибка запроса:", error);
            return undefined;
        }

        if (!data || data.length === 0) {
            console.log("📭 Нет сохраненных заметок");
            return undefined;
        }

        // Преобразуем данные в удобный формат
        const result = data.map(item => ({
            perfume_id: item.perfume_id,
            top: item.notes?.top || [],
            middle: item.notes?.middle || [],
            base: item.notes?.base || [],
            impression: item.impression || ""
        }));

        return result;

    } catch (error) {
        console.error("💥 Ошибка:", error);
        return undefined;
    }
}




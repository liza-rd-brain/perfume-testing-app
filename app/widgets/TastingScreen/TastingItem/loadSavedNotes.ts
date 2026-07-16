
import { supabase } from "~/lib/supabase";


export const loadSavedNotes = async ({ userId, perfumeId }: { userId: number, perfumeId: number }): Promise<{ top: any, middle: any, base: any, impression: string } | undefined> => {
    if (!userId) return;

    // setIsLoading(true);
    try {


        const { data, error } = await supabase
            .from("user_experience")
            .select("*")
            .eq("user_id", userId)
            .eq("perfume_id", perfumeId);



        // ✅ Если есть данные - берем notes
        if (data && data.length > 0) {

            const top = data
                .reduce((prev, item) => {
                    return [...prev, ...item.notes.top || []];
                }, [])
            const middle = data
                .reduce((prev, item) => {
                    return [...prev, ...item.notes.middle || []];
                }, [])
            const base = data
                .reduce((prev, item) => {
                    return [...prev, ...item.notes.base || []];
                }, [])

            const impression = data[0].impression

            console.log({ impression })
            return { top, middle, base, impression }

        } else {
            console.log("📭 Нет сохраненных нот для этого парфюма");
            return undefined
        }
    } catch (error) {
        console.error("💥 Ошибка:", error);
        return undefined
    } finally {
        // setIsLoading(false);
    }
}


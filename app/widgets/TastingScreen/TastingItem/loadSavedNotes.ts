
import { supabase } from "~/lib/supabase";


export const loadSavedNotes = async ({ userId, perfumeId }: { userId: number, perfumeId: number }): Promise<{ top: any, middle: any, base: any } | undefined> => {
    if (!userId) return;

    // setIsLoading(true);
    try {
        const { data: userAllData, error: userAllError } = await supabase
            .from("user_experience")
            .select("*")
            .eq("user_id", userId);

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
            // .filter(
            //     (note: { id: any }, index: any, self: any[]) =>
            //         index === self.findIndex((n) => n.id === note.id),
            // );

            console.log({ data, top, middle, base })
            return { top, middle, base }

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



import { supabase } from "~/lib/supabase";


export const loadSavedNotes = async ({ userId, perfumeId }: { userId: number, perfumeId: number }) => {
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

        debugger;

        // ✅ Если есть данные - берем notes
        if (data && data.length > 0) {
            const savedNotes = data
                .reduce((prev, item) => {
                    return [...prev, ...(item.notes?.middle || [])];
                }, [])
                .filter(
                    (note: { id: any }, index: any, self: any[]) =>
                        index === self.findIndex((n) => n.id === note.id),
                );
            debugger;

            return savedNotes

        } else {
            console.log("📭 Нет сохраненных нот для этого парфюма");
            return []
        }
    } catch (error) {
        console.error("💥 Ошибка:", error);
        return []
    } finally {
        // setIsLoading(false);
    }
}


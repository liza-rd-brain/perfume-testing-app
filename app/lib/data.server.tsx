// app/lib/data.server.ts
import { supabaseAdmin } from "./supabase";
import { notesCache } from "./notes-cache";

export async function getAllNotes() {
  const cacheKey = "all-notes";

  const cached = notesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let allNotes: any[] = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    try {
      const { data, error } = await supabaseAdmin
        .from("notes")
        .select("id, name, image")
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error(`❌ Error fetching notes at offset ${from}:`, error);
        break;
      }

      if (!data || data.length === 0) {
        break;
      }

      allNotes = [...allNotes, ...data];

      if (data.length < pageSize) {
        break;
      }

      from += pageSize;
    } catch (error) {
      console.error(`💥 Error fetching notes at offset ${from}:`, error);
      break;
    }
  }

  notesCache.set(cacheKey, allNotes);

  return allNotes;
}

export async function getPerfumeList() {
  const { data: perfumeData, error: perfumeError } = await supabaseAdmin
    .from("perfume-set-1")
    .select("id, name, perfumer, brand, link, notes, image")
    .order("id");

  console.log({ perfumeData });

  if (perfumeError) {
    console.error("❌ Perfume error:", perfumeError);
  }

  return perfumeData || [];
}

import { useState } from "react";
import { useLoaderData } from "react-router";

export const TastingList = () => {
  const { notes, perfumeList } = useLoaderData<{
    notes: any[];
    user: any;
    error: string | null;
    perfumeList: any[];
  }>();

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  return (
    <>
      {perfumeList.map(
        ({ id, name, perfumer, brand, notes: notesPerfume }: any) => {
          const isLoaded = loadedImages.has(id);

          return (
            <div key={id}>
              {name} - {perfumer} - {brand}
              <div>
                {notesPerfume?.top &&
                notesPerfume.top.length > 0 &&
                notes &&
                notes.length > 0
                  ? notesPerfume.top.map((item: any) => {
                      const itemTest = notes.find(
                        (note: any) => note.id === item.id,
                      );
                      const image = itemTest?.image || null;

                      return (
                        <div key={item.id}>
                          {image && (
                            <img
                              src={image}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onLoad={() => {
                                setLoadedImages((prev) =>
                                  new Set(prev).add(id),
                                );
                              }}
                              style={{
                                opacity: isLoaded ? 1 : 0,
                                transition: "opacity 0.3s ease",
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                // borderRadius: "50%",
                              }}
                            />
                          )}
                          <div>{itemTest?.name || item.name}</div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          );
        },
      )}
    </>
  );
};

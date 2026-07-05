import { useLoaderData } from "react-router";

export const TastingList = () => {
  const { notes, perfumeList } = useLoaderData<{
    notes: any[];
    user: any;
    error: string | null;
    perfumeList: any[];
  }>();
  return (
    <>
      {!perfumeList || !perfumeList?.length
        ? null
        : perfumeList?.map(
            ({ id, name, perfumer, brand, notes: notesPerfume }: any) => {
              console.log({ notes: notesPerfume.top });
              return (
                <div key={id}>
                  {name} -{perfumer}-{brand}
                  <div>
                    {!notesPerfume.top || !notesPerfume.top.length
                      ? null
                      : notesPerfume.top.map((item: any) => {
                          const itemTest = notes.find(
                            (note: any) => note.id === item.id,
                          );

                          const image = itemTest?.image || null;

                          console.log({ itemTest, image });

                          return (
                            <div key={item.id}>
                              <img src={image} />
                            </div>
                          );
                        })}
                  </div>
                  {/* {notes.base}
                {notes.middle} */}
                </div>
              );
            },
          )}
    </>
  );
};

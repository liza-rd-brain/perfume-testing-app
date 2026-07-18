type TArray = number[] | undefined

export const getIntersections = (arr1: TArray, arr2: TArray) => {
    let set2: Record<number, boolean> = {};
    let result = [];

    if (Array.isArray(arr1) && Array.isArray(arr2)) {

        // Создаём хеш-таблицу из второго массива
        for (var i = 0; i < arr2.length; i++) {
            set2[arr2[i]] = true;
        }

        // Фильтруем первый массив
        for (var j = 0; j < arr1.length; j++) {
            if (set2[arr1[j]] !== undefined) {
                result.push(arr1[j]);
            }
        }

        return result;
    }
    return []

}
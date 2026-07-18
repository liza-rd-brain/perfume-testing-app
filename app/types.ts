

export enum Base {
    TOP = "top",
    MIDDLE = "middle",
    BASE = "base",
    COMMON = "middle"

}


export type Perfume = {
    id: number;
    name: string;
    perfumer: string;
    brand: string;
    link?: string;
    notes?: {
        top?: [{ id: number, name: string }];
        middle: [{ id: number, name: string }]
        base?: [{ id: number, name: string }]
    };
    impression: string;
}


export type UserData = {
    top: number[];
    middle: number[];
    base: number[],
    impression: string;

}

export type Note = {
    id: number;
    name: string;
    image?: string;
    url?: string;
}

export type User = number | null

export type SavedNotes = {
    id: number;
    perfume_id: number;
    user_id: number;
    impression: string;
    isDone: boolean
    notes: {
        top: number[];
        middle: number[];
        base: number[]
    }
}


export type PerfumeInSet = {
    brand: string;
    id: number;
    image: string;
    link: string;
    name: string
    notes?: {
        top?: [{ id: number }];
        middle: [{ id: number }]
        base?: [{ id: number }]
    };
    perfumer: string
}




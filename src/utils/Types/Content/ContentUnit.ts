export type ContentUnit = {
    number: number,
    title: string,
    categories: string,
    creationDate: string,
    content: string,
    gallery: string[]
}

export function GetDummyContent(): ContentUnit {
    return {
        number: -1,
        title: "",
        categories: "",
        creationDate: "",
        content: "",
        gallery: []
    }
}
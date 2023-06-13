export type ContentUnit = {
    contentID: number,
    title: string,
    categories: string,
    creationDate: string,
    body: string,
    galleryImageLinks: string[],
    fileLinks: string[]
}

export function GetDummyContentUnit(): ContentUnit {
    return {
        contentID: -1,
        title: "",
        categories: "",
        creationDate: "",
        body: "",
        galleryImageLinks: [],
        fileLinks: []
    }
}
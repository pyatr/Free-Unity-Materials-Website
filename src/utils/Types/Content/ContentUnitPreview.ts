export type ContentUnitPreview = {
    contentID: number,
    title: string,
    categories: string,
    body: string,
    primaryCategory: string,
    titlepicLink: string
}

export function GetDummyPreview(): ContentUnitPreview {
    return (
        {
            contentID: -1,
            title: "",
            categories: "",
            body: "",
            primaryCategory: "",
            titlepicLink: ""
        }
    )
}
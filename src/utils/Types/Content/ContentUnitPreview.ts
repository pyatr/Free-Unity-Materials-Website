export type ContentUnitPreview = {
    contentID: number,
    title: string,
    categories: string,
    body: string,
    titlepicLink: string
}

export function GetDummyPreview(): ContentUnitPreview {
    return (
        {
            contentID: -1,
            title: "",
            categories: "",
            body: "",
            titlepicLink: ""
        }
    )
}
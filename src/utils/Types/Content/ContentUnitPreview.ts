export type ContentUnitPreview = {
    number: number,
    title: string,
    categories: string,
    content: string,
    titlepicLink: string
}

export function GetDummyPreview(): ContentUnitPreview {
    return (
        {
            number: -1,
            title: "",
            categories: "",
            content: "",
            titlepicLink: ""
        }
    )
}
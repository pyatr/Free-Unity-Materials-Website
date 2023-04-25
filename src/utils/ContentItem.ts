export type ContentItem = {
    NUMBER: number,
    TITLE: string,
    SHORTTITLE: string,
    CATEGORIES: string,
    CREATION_DATE: string,
    CONTENT: string
}

export function GetDummyContent(): ContentItem {
    return {
        NUMBER: -1,
        TITLE: "",
        SHORTTITLE: "",
        CATEGORIES: "",
        CREATION_DATE: "",
        CONTENT: ""
    }
}
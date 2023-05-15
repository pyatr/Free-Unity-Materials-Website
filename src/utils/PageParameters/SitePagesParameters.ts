import {PageProperties} from "./PageProperties";

interface PageDictionary<PageData> {
    [key: string]: PageData;
}

export module SitePagesParameters {
    export var page: PageDictionary<PageProperties> = {
        assets: new PageProperties(3, 4, 6, 2, "asset"),
        articles: new PageProperties(10, 1, 10, 1, "article"),
        scripts: new PageProperties(10, 1, 10, 1, "script")
    }
}
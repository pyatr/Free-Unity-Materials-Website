import {PageParameters} from "./PageParameters";

interface PageDictionary<PageData> {
    [key: string]: PageData;
}

export module SitePagesParameters {
    export var page: PageDictionary<PageParameters> = {
        AssetsPage: new PageParameters(3, 4, 6, 2, "asset"),
        ArticlesPage: new PageParameters(10, 1, 10, 1, "article"),
        ScriptsPage: new PageParameters(10, 1, 10, 1, "script")
    }
}
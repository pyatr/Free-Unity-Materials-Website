import {PageParameters} from "./PageParameters";

interface Dictionary<PageData> {
    [key: string]: PageData;
}

export module SitePagesParameters {
    export var page: Dictionary<PageParameters> = {
        AssetsPage: new PageParameters(3, 4, 6, 2, "asset"),
        ArticlesPage: new PageParameters(10, 1, 10, 1, "article"),
        ScriptsPage: new PageParameters(10, 1, 10, 1, "script")
    }
}
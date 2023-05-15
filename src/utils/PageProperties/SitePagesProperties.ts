import {PageProperties} from "./PageProperties";

interface PageDictionary<PageProperties> {
    [key: string]: PageProperties;
}

export module SitePagesProperties {
    export var page: PageDictionary<PageProperties> = {
        AssetsPage: new PageProperties(3, 4, 6, 2, "asset"),
        ArticlesPage: new PageProperties(10, 1, 10, 1, "article"),
        ScriptsPage: new PageProperties(10, 1, 10, 1, "script")
    }
}
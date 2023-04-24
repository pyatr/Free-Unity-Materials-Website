import {PageData} from "./PageData";

interface Dictionary<PageData> {
    [key: string]: PageData;
}

export module SitePages {
    export var page: Dictionary<PageData> = {
        AssetsPage: new PageData(3, 4, 6, 2, "getPreviews"),
        ArticlesPage: new PageData(10, 1, 10, 1, "getArticles"),
        ScriptsPage: new PageData(10, 1, 10, 1, "getScripts")
    }
}
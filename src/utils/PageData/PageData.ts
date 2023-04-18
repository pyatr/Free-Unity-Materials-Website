import {MouseEventHandler} from "react";

class PageData {
    landscapeRowColumnCount: number[];
    mobileRowColumnCount: number[];

    pageSize: number;
    currentPage: number;

    onClickBack: MouseEventHandler<HTMLSpanElement> | undefined;
    onClickForward: MouseEventHandler<HTMLSpanElement> | undefined;

    constructor(lrc: number, lcc: number, mrc: number, mcc: number) {//, onClickBack: Function, onClickForward: Function
        this.landscapeRowColumnCount = [lrc, lcc];
        this.mobileRowColumnCount = [mrc, mcc];
        this.pageSize = Math.max(this.landscapeRowColumnCount[0] * this.landscapeRowColumnCount[1], this.mobileRowColumnCount[0] * this.mobileRowColumnCount[1]);
        this.currentPage = 1;
    }

    getFirstItemNumber(): number {
        return this.pageSize * (this.currentPage - 1);
    }

    getLastItemNumber(): number {
        return this.getFirstItemNumber() + this.pageSize;
    }
}

interface Dictionary<PageData> {
    [key: string]: PageData;
}

export module SitePages {
    export var page: Dictionary<PageData> = {
        AssetsPage: new PageData(2, 6, 4, 2),
        ArticlesPage: new PageData(10, 1, 10, 1),
        ScriptsPage: new PageData(10, 1, 10, 1)
    }
}
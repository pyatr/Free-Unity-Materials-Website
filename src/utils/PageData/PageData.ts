import {ContentPreview} from "../Types/ContentPreview";

export type PageLoadProps = {
    pageData: PageData,
    rawContent: ContentPreview[]
}

export class PageData {
    landscapeRowColumnCount: number[];
    mobileRowColumnCount: number[];

    pageSize: number;
    currentPage: number;

    private postsCount: number;
    private pagesCount: number;

    private requestName: string;

    constructor(landscapeRowCount: number, landscapeColumnCount: number, mobileRowCount: number, mobileColumnCount: number, requestName: string) {
        this.landscapeRowColumnCount = [landscapeRowCount, landscapeColumnCount];
        this.mobileRowColumnCount = [mobileRowCount, mobileColumnCount];
        this.pageSize = Math.max(this.landscapeRowColumnCount[0] * this.landscapeRowColumnCount[1], this.mobileRowColumnCount[0] * this.mobileRowColumnCount[1]);
        this.currentPage = 1;
        this.postsCount = 0;
        this.pagesCount = 0;
        this.requestName = requestName;
    }

    setPostsCount(newNum: number) {
        this.postsCount = newNum;
        this.pagesCount = Math.max(1, Math.ceil(newNum / this.pageSize));
    }

    getPostsCount() {
        return this.postsCount;
    }

    getRequestName() {
        return this.requestName;
    }

    getPagesCount() {
        return this.pagesCount;
    }

    getFirstItemNumber(): number {
        return this.pageSize * (this.currentPage - 1);
    }

    getLastItemNumber(): number {
        return Math.min(this.getFirstItemNumber() + this.pageSize, this.getPostsCount());
    }
}
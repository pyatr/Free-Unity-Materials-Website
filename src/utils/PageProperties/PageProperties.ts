import {ContentUnitPreview} from "../Types/Content/ContentUnitPreview";

export type PageLoadProps = {
    pageProperties: PageProperties,
    previewContent: ContentUnitPreview[]
}

export class PageProperties {
    landscapeRowColumnCount: number[];
    mobileRowColumnCount: number[];

    pageSize: number;
    currentPage: number;

    private postsCount: number;
    private pagesCount: number;

    private categoryName: string;
    private linkForCategory: string;

    constructor(landscapeRowCount: number, landscapeColumnCount: number, mobileRowCount: number, mobileColumnCount: number, categoryName: string, linkForCategory: string) {
        this.landscapeRowColumnCount = [landscapeRowCount, landscapeColumnCount];
        this.mobileRowColumnCount = [mobileRowCount, mobileColumnCount];
        this.pageSize = Math.max(this.landscapeRowColumnCount[0] * this.landscapeRowColumnCount[1], this.mobileRowColumnCount[0] * this.mobileRowColumnCount[1]);
        this.currentPage = 1;
        this.postsCount = 0;
        this.pagesCount = 0;
        this.categoryName = categoryName;
        this.linkForCategory = linkForCategory;
    }

    setPostsCount(newNum: number) {
        this.postsCount = newNum;
        this.pagesCount = Math.max(1, Math.ceil(newNum / this.pageSize));
    }

    getPostsCount() {
        return this.postsCount;
    }

    getCategoryName() {
        return this.categoryName;
    }

    getLinkForCategory() {
        return this.linkForCategory;
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
import React, {useEffect, useState} from "react";
import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {Route, Routes, useParams, useSearchParams} from "react-router-dom";
import {PageProperties} from "../../utils/PageProperties/PageProperties";
import {SitePagesProperties} from "../../utils/PageProperties/SitePagesProperties";
import {GetLastURLPart} from "../../utils/GetLastURLPart";
import GetPreviews, {GetAllPreviews} from "../../utils/ContentInteraction/GetPreviews";
import AssetsPreviewGridPage from "../../pages/Assets/AssetsPreviewGridPage";
import {ArticlesPreviewListPage} from "../../pages/Articles/ArticlesPreviewListPage";
import {ScriptsPreviewListPage} from "../../pages/Scripts/ScriptsPreviewListPage";
import ContentUnitPage from "../../pages/ContentUnit/ContentUnitPage";
import ContentUnitEditForm from "../../pages/ContentUnitEdit/ContentUnitEditForm";
import {LoadingOverlay} from "../LoadingOverlay";
import {Typography} from "@mui/material";
import TextContentPreviewListPage from "../../pages/TextContent/TextContentPreviewListPage";
import {AllContentPreviewListPage} from "../../pages/AllContent/AllContentPreviewListPage";

type PreviewLoaderProps = {
    elementTypeName: string,
    onContentLoaded: Function
}

export function PreviewLoader({elementTypeName, onContentLoaded}: PreviewLoaderProps) {
    const [previewContent, setPreviewContent] = useState<ContentUnitPreview[] | undefined>();
    const [searchName, setSearchName] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    if (searchParams !== undefined) {
        const searchKeyword = searchParams.get("keyword");
        if (searchKeyword !== null) {
            if (searchName !== searchKeyword) {
                setSearchName(searchKeyword);
                setPreviewContent(undefined);
            }
        }
    }

    const currentPageProperties: PageProperties = SitePagesProperties.page[elementTypeName];

    let currentCategory: string = "idk";
    if (currentPageProperties !== undefined) {
        currentCategory = currentPageProperties.getCategoryName();
    }

    let currentContentID: number = -1;
    const lastURLPart: number = Number(GetLastURLPart());

    if (!isNaN(lastURLPart) && window.location.pathname != "/") {
        currentContentID = lastURLPart;
    }

    const loadPreviews = async () => {
        if (previewContent === undefined && currentPageProperties !== undefined && !isLoading) {
            setLoadingStatus(true);
            let loadedPreviews: ContentUnitPreview[];
            let totalContentCount: number;
            if (elementTypeName === "AllContentPage") {
                loadedPreviews = await GetAllPreviews(searchName);
                totalContentCount = loadedPreviews.length;
            } else {
                [loadedPreviews, totalContentCount] = await GetPreviews(currentPageProperties, searchName);
            }
            currentPageProperties.setPostsCount(totalContentCount);
            setPreviewContent(loadedPreviews);
            window.scrollTo(0, 0);
            onContentLoaded();
            setLoadingStatus(false);
        }
    }

    useEffect(() => {
        loadPreviews();
    });

    const previewPages = [
        ["AssetsPage", <AssetsPreviewGridPage pageProperties={currentPageProperties}
                                              previewContent={previewContent as ContentUnitPreview[]}/>],
        ["ArticlesPage", <ArticlesPreviewListPage pageProperties={currentPageProperties}
                                                  previewContent={previewContent as ContentUnitPreview[]}/>],
        ["ScriptsPage", <ScriptsPreviewListPage pageProperties={currentPageProperties}
                                                previewContent={previewContent as ContentUnitPreview[]}/>],
        ["AllContentPage", <AllContentPreviewListPage pageProperties={currentPageProperties}
                                                       previewContent={previewContent as ContentUnitPreview[]}/>]
    ]

    const currentPreviewPageData = previewPages.filter(page => page[0] === elementTypeName)[0];
    const currentPreviewPage: JSX.Element = currentPreviewPageData[1] as JSX.Element;

    if (previewContent === undefined || isLoading) {
        return (<LoadingOverlay position={"inherit"}/>);
    }

    if (previewContent.length === 0) {
        if (searchName === "") {
            return (<Typography>This category is empty.</Typography>);
        } else {
            return (<Typography>{"No results matching '" + searchName + "'"}</Typography>);
        }
    }

    return (
        <Routes>
            <Route path={"/"}
                   element={currentPreviewPage}/>
            <Route path={"/view/:currentContentID"}
                   element={<ContentUnitPage requestedContentCategory={currentCategory}
                                             requestedContentID={currentContentID}/>}/>
            <Route path={"/edit/:currentContentID"}
                   element={<ContentUnitEditForm requestedContentCategory={currentCategory}
                                                 requestedContentID={currentContentID}/>}/>
            <Route path={"/create"}
                   element={<ContentUnitEditForm requestedContentCategory={currentCategory}
                                                 requestedContentID={-1}/>}/>
        </Routes>);
}
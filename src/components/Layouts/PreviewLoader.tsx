import React, {useEffect, useState} from "react";
import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {Route, Routes, useParams} from "react-router-dom";
import {PageProperties} from "../../utils/PageProperties/PageProperties";
import {SitePagesProperties} from "../../utils/PageProperties/SitePagesProperties";
import {GetLastURLPart} from "../../utils/GetLastURLPart";
import GetPreviews from "../../utils/ContentInteraction/GetPreviews";
import AssetsPreviewGridPage from "../../pages/Assets/AssetsPreviewGridPage";
import {ArticlesPreviewListPage} from "../../pages/Articles/ArticlesPreviewListPage";
import {ScriptsPreviewListPage} from "../../pages/Scripts/ScriptsPreviewListPage";
import ContentUnitPage from "../../pages/ContentUnit/ContentUnitPage";
import ContentUnitEditForm from "../../pages/ContentUnitEdit/ContentUnitEditForm";

type PreviewLoaderProps = {
    elementTypeName: string,
    onContentLoaded: Function
}

export function PreviewLoader({elementTypeName, onContentLoaded}: PreviewLoaderProps) {
    const [previewContent, setPreviewContent] = useState<ContentUnitPreview[]>([]);
    const [totalContentCount, setTotalContentCount] = useState(-1);
    const [isLoading, setLoadingStatus] = useState(false);

    const {searchname} = useParams();
    if (searchname != null) {

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

    const loadPreviews = () => {
        if ((previewContent.length === 0) && totalContentCount !== 0 && currentPageProperties !== undefined && !isLoading) {
            setLoadingStatus(true);
            setPreviewContent([]);
            GetPreviews(currentPageProperties).then((previews: ContentUnitPreview[]) => {
                setLoadingStatus(false);
                window.scrollTo(0, 0);
                setTotalContentCount(currentPageProperties.getPostsCount())
                setPreviewContent(previews);
                onContentLoaded();
            });
        }
    }

    useEffect(() => {
        loadPreviews();
    });

    const previewPages = [
        ["AssetsPage", <AssetsPreviewGridPage pageProperties={currentPageProperties}
                                              previewContent={previewContent}/>],
        ["ArticlesPage", <ArticlesPreviewListPage pageProperties={currentPageProperties}
                                                  previewContent={previewContent}/>],
        ["ScriptsPage", <ScriptsPreviewListPage pageProperties={currentPageProperties}
                                                previewContent={previewContent}/>]
    ]

    const currentPreviewPageData = previewPages.filter(page => page[0] === elementTypeName)[0];
    const currentPreviewPage: JSX.Element = currentPreviewPageData[1] as JSX.Element;

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
import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import {ContentProps} from "../../App";
import {Route, Routes} from "react-router-dom";

import CategoryMenu from "./CategoryMenu";
import ContentPageSwitch from "./ContentPageSwitch";

import AssetsPage from "../../pages/AssetsPage/AssetsPage";
import ScriptsPage from "../../pages/Scripts/ScriptsPage";
import ArticlesPage from "../../pages/Articles/ArticlesPage";
import NonExistentPage from "../../pages/NonExistent/NonExistentPage";
import ContentPage from "../../pages/Content/ContentPage";
import ContentEditPage from "../../pages/Content/ContentEditPage";

import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {IsMobileResolution} from "../../utils/MobileUtilities";
import {GetLastURLPart} from "../../utils/GetLastURLPart";

import CreateContentButton from "../Buttons/CreateContentButton";
import {SitePagesParameters} from "../../utils/PageParameters/SitePagesParameters";
import {PageParameters} from "../../utils/PageParameters/PageParameters";
import GetPreviews from "../../utils/ContentInteraction/GetPreviews";

const mainContentGrid = {
    width: '70%',
    gap: '32px',
    paddingBottom: '96px',
    display: 'grid'
}

const mainContentBox = {
    width: '100%',
    border: '2px solid',
    //Works in border property in ItemPage but not here. Why?
    borderColor: 'primary.main',
    borderRadius: '4px',
    padding: '16px'
}

const sideButtonStyle = {
    border: '2px solid',
    borderColor: 'primary.main',
    borderRadius: '4px',
    fontWeight: '700'
}

export {sideButtonStyle}

export default function MainContent({mainElement}: ContentProps) {
    const landW = "15%";
    const portW = "30%";
    const isPortrait = IsMobileResolution();
    const selectedWidth = isPortrait ? portW : landW;

    const [currentPage, setCurrentPage] = useState(1);
    const [previewContent, setPreviewContent] = useState(Array<ContentUnitPreview>);

    const elementPageData: PageParameters = SitePagesParameters.page[mainElement];

    const setPageNum = (newNum: number) => {
        if (elementPageData.currentPage != newNum) {
            setCurrentPage(newNum);
        }
    }

    const clickBack = () => {
        setPageNum(Math.max(1, elementPageData.currentPage - 1));
    }

    const clickForward = () => {
        setPageNum(Math.min(elementPageData.getPagesCount(), elementPageData.currentPage + 1));
    }

    let shouldUpdate = false;
    if (elementPageData != undefined) {
        shouldUpdate = elementPageData.currentPage != currentPage;
        elementPageData.currentPage = currentPage;
    }
    useEffect(() => {
        if ((previewContent.length == 0 || shouldUpdate) && elementPageData !== undefined) {
            GetPreviews(elementPageData).then((rawPreviews) => {
                const preparedPreviews: ContentUnitPreview[] = [];
                rawPreviews.content.forEach((contentUnit: any) =>
                    preparedPreviews.push({
                            number: contentUnit.NUMBER,
                            title: contentUnit.TITLE,
                            categories: contentUnit.CATEGORIES,
                            content: contentUnit.CONTENT,
                            titlepicLink: "http://" + window.location.host + ":8000/" + contentUnit.titlepicLink
                        }
                    )
                );
                elementPageData.setPostsCount(rawPreviews.contentCount);
                window.scrollTo(0, 0);
                setPreviewContent(preparedPreviews);
            });
        }
    });

    const elements = new Map();
    if (elementPageData != undefined) {
        elements.set("AssetsPage", <AssetsPage pageData={elementPageData} rawContent={previewContent}/>);
        elements.set("ArticlesPage", <ArticlesPage/>);
        elements.set("ScriptsPage", <ScriptsPage/>);
        elements.set("NonExistentPage", <NonExistentPage/>);
    }

    let pageFinishedLoading = previewContent.length > 0;
    const lastUrlPart = GetLastURLPart();
    const lastPart = Number(lastUrlPart);
    let itemNum = -1;
    if (!isNaN(lastPart)) {
        itemNum = lastPart;
    }
    return (
        <Grid display="flex" padding="8px" gap="8px" paddingTop="16px">
            <Grid display="grid" width={selectedWidth} height="fit-content" gap="8px">
                <CategoryMenu/>
                <CreateContentButton/>
            </Grid>
            <Grid sx={mainContentGrid}>
                <Box sx={mainContentBox} id="mainElementBox">
                    <Routes>
                        <Route path="/" element={elements.get(mainElement)}/>
                        <Route path={"/" + itemNum}
                               element={<ContentPage contentCategory={"asset"} contentNumber={itemNum}/>}/>
                        <Route path={"/articles/" + itemNum}
                               element={<ContentPage contentCategory={"article"} contentNumber={itemNum}/>}/>
                        <Route path={"/scripts/" + itemNum}
                               element={<ContentPage contentCategory={"script"} contentNumber={itemNum}/>}/>

                        <Route path={"/edit/" + itemNum}
                               element={<ContentEditPage contentNumber={itemNum}
                                                         contentCategory={"asset"}/>}/>

                        <Route path={"/create"}
                               element={<ContentEditPage contentCategory={"asset"} contentNumber={-1}/>}/>
                        <Route path={"/articles/create"}
                               element={<ContentEditPage contentCategory={"article"} contentNumber={-1}/>}/>
                        <Route path={"/scripts/create"}
                               element={<ContentEditPage contentCategory={"script"} contentNumber={-1}/>}/>
                    </Routes>
                </Box>
                {pageFinishedLoading ?
                    <ContentPageSwitch pageName={mainElement} onClickBack={clickBack} onClickForward={clickForward}
                                       onClickNum={setPageNum}/> :
                    <Fragment/>}
            </Grid>
            {/*Right page content placeholder*/}
            {isPortrait ? <Fragment/> : <Box width={selectedWidth}/>}
        </Grid>);
}
import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import {Route, Routes} from "react-router-dom";

import CategoryMenu from "./CategoryMenu";
import ContentPageSwitch from "./ContentPageSwitch";

import AssetsPage from "../../pages/AssetsPage/AssetsPage";
import ScriptsPage from "../../pages/Scripts/ScriptsPage";
import ArticlesPage from "../../pages/Articles/ArticlesPage";

import ContentUnitPage from "../../pages/Content/ContentUnitPage";
import ContentUnitEditForm from "../../pages/ContentEdit/ContentUnitEditForm";

import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {IsMobileResolution} from "../../utils/MobileUtilities";

import CreateContentButton from "../Buttons/CreateContentButton";
import {SitePagesParameters} from "../../utils/PageParameters/SitePagesParameters";
import {PageParameters} from "../../utils/PageParameters/PageParameters";
import GetPreviews from "../../utils/ContentInteraction/GetPreviews";
import {GetLastURLPart} from "../../utils/GetLastURLPart";

const mainContentGrid = {
    width: '70%',
    gap: '32px',
    paddingBottom: '96px',
    display: 'grid'
}

const mainContentBox = {
    width: '100%',
    border: '2px solid',
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

export default function MainContent() {
    const permittedCreationLinks = ["", "articles", "scripts"];

    const pages = new Map();
    pages.set("", "AssetsPage");
    pages.set("articles", "ArticlesPage");
    pages.set("scripts", "ScriptsPage");

    const currentPathnameSplit = window.location.pathname.split('/');
    let currentCategory = "";
    let currentContentID = -1;
    if (!isNaN(Number(currentPathnameSplit[1]))) {
        currentContentID = Number(currentPathnameSplit[1]);
    } else {
        currentCategory = currentPathnameSplit[1];
    }
    if (!isNaN(Number(currentPathnameSplit[2]))) {
        currentCategory = currentPathnameSplit[1];
        currentContentID = Number(currentPathnameSplit[2]);
    }

    const canShowCreateButton = permittedCreationLinks.includes(currentCategory) && currentPathnameSplit.length <= 2;
    const elementTypeName = pages.get(currentCategory);

    const isPreviewPage = permittedCreationLinks.includes(GetLastURLPart());

    const landW = "15%";
    const portW = "30%";
    const isPortrait = IsMobileResolution();
    const selectedWidth = isPortrait ? portW : landW;

    const [currentPage, setCurrentPage] = useState(1);
    const [previewContent, setPreviewContent] = useState(Array<ContentUnitPreview>);

    const currentPageData: PageParameters = SitePagesParameters.page[elementTypeName];

    let shouldUpdate = false;
    if (currentPageData != undefined) {
        shouldUpdate = currentPageData.currentPage != currentPage;
        currentPageData.currentPage = currentPage;
    }

    const setPageNum = (newNum: number) => {
        if (currentPageData.currentPage != newNum) {
            setCurrentPage(newNum);
        }
    }

    const clickBack = () => setPageNum(Math.max(1, currentPageData.currentPage - 1));

    const clickForward = () => setPageNum(Math.min(currentPageData.getPagesCount(), currentPageData.currentPage + 1));

    const loadPreviews = () => {
        if ((previewContent.length == 0 || shouldUpdate) && currentPageData !== undefined) {
            GetPreviews(currentPageData).then((previews: ContentUnitPreview[]) => {
                window.scrollTo(0, 0);
                setPreviewContent(previews);
            });
        }
    }

    useEffect(() => {
        loadPreviews();
    });

    return (
        <Grid display="flex" padding="8px" gap="8px" paddingTop="16px">
            {/*Menu on the left*/}
            <Grid display="grid" width={selectedWidth} height="fit-content" gap="8px">
                <CategoryMenu propValue={currentCategory}/>
                {canShowCreateButton ?
                    <CreateContentButton
                        propValue={(currentCategory === "" ? "" : "/") + currentCategory + "/create"}/> :
                    <Fragment/>}
            </Grid>
            {/*Content selection and display*/}

            <Grid sx={mainContentGrid}>
                <Box sx={mainContentBox} id="mainElementBox">
                    <Routes>
                        <Route index
                               element={<AssetsPage pageData={currentPageData} previewContent={previewContent}/>}/>
                        <Route path=":currentContentID"
                               element={<ContentUnitPage requestedContentCategory={"asset"}
                                                         requestedContentID={currentContentID}/>}/>
                        <Route path={"edit/:currentContentID"}
                               element={<ContentUnitEditForm requestedContentID={currentContentID}
                                                             requestedContentCategory={"asset"}/>}/>
                        <Route path={"create"}
                               element={<ContentUnitEditForm requestedContentCategory={"asset"}
                                                             requestedContentID={-1}/>}/>

                        <Route path={"/articles"} element={<ArticlesPage/>}/>
                        <Route path={"/articles/:currentContentID"}
                               element={<ContentUnitPage requestedContentCategory={"article"}
                                                         requestedContentID={currentContentID}/>}/>
                        <Route path={"/articles/edit/:currentContentID"}
                               element={<ContentUnitEditForm requestedContentID={currentContentID}
                                                             requestedContentCategory={"article"}/>}/>
                        <Route path={"/articles/create"}
                               element={<ContentUnitEditForm requestedContentCategory={"article"}
                                                             requestedContentID={-1}/>}/>

                        <Route path={"/scripts"} element={<ScriptsPage/>}/>
                        <Route path={"/scripts/:currentContentID"}
                               element={<ContentUnitPage requestedContentCategory={"script"}
                                                         requestedContentID={currentContentID}/>}/>
                        <Route path={"/scripts/edit/:currentContentID"}
                               element={<ContentUnitEditForm requestedContentID={currentContentID}
                                                             requestedContentCategory={"script"}/>}/>
                        <Route path={"/scripts/create"}
                               element={<ContentUnitEditForm requestedContentCategory={"script"}
                                                             requestedContentID={-1}/>}/>
                    </Routes>
                </Box>

                {previewContent.length > 0 && isPreviewPage ?
                    <ContentPageSwitch pageName={elementTypeName} onClickBack={clickBack}
                                       onClickForward={clickForward}
                                       onClickNum={setPageNum}/> :
                    <Fragment/>}
            </Grid>
            {/*Right page content placeholder*/}
            {isPortrait ? <Fragment/> : <Box width={selectedWidth}/>}
        </Grid>);
}
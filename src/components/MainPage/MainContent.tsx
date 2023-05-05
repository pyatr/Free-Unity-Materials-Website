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
import ContentUnitPage from "../../pages/Content/ContentUnitPage";
import ContentUnitEditForm from "../../pages/ContentEdit/ContentUnitEditForm";

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

    let shouldUpdate = false;
    if (elementPageData != undefined) {
        shouldUpdate = elementPageData.currentPage != currentPage;
        elementPageData.currentPage = currentPage;
    }

    const setPageNum = (newNum: number) => {
        if (elementPageData.currentPage != newNum) {
            setCurrentPage(newNum);
        }
    }

    const clickBack = () => setPageNum(Math.max(1, elementPageData.currentPage - 1));

    const clickForward = () => setPageNum(Math.min(elementPageData.getPagesCount(), elementPageData.currentPage + 1));

    const loadPreviews = () => {
        if ((previewContent.length == 0 || shouldUpdate) && elementPageData !== undefined) {
            GetPreviews(elementPageData).then((previews: ContentUnitPreview[]) => {
                window.scrollTo(0, 0);
                setPreviewContent(previews);
            });
        }
    }

    useEffect(() => {
        loadPreviews();
    });

    const pages = new Map();
    if (elementPageData != undefined) {
        pages.set("AssetsPage", <AssetsPage pageData={elementPageData} rawContent={previewContent}/>);
        pages.set("ArticlesPage", <ArticlesPage/>);
        pages.set("ScriptsPage", <ScriptsPage/>);
        pages.set("NonExistentPage", <NonExistentPage/>);
    }

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

    const permittedCreationLinks = ["", "articles", "scripts"];
    const canShowCreateButton = permittedCreationLinks.includes(currentCategory) && currentPathnameSplit.length <= 2;

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
                        <Route path="/" element={pages.get(mainElement)}/>
                        <Route path={"/" + currentContentID}
                               element={<ContentUnitPage requestedContentCategory={"asset"}
                                                         requestedContentID={currentContentID}/>}/>
                        <Route path={"/articles/" + currentContentID}
                               element={<ContentUnitPage requestedContentCategory={"article"}
                                                         requestedContentID={currentContentID}/>}/>
                        <Route path={"/scripts/" + currentContentID}
                               element={<ContentUnitPage requestedContentCategory={"script"}
                                                         requestedContentID={currentContentID}/>}/>

                        <Route path={"/edit/" + currentContentID}
                               element={<ContentUnitEditForm requestedContentID={currentContentID}
                                                             requestedContentCategory={"asset"}/>}/>
                        <Route path={"/articles/edit/" + currentContentID}
                               element={<ContentUnitEditForm requestedContentID={currentContentID}
                                                             requestedContentCategory={"article"}/>}/>
                        <Route path={"/scripts/edit/" + currentContentID}
                               element={<ContentUnitEditForm requestedContentID={currentContentID}
                                                             requestedContentCategory={"script"}/>}/>

                        <Route path={"/create"}
                               element={<ContentUnitEditForm requestedContentCategory={"asset"}
                                                             requestedContentID={-1}/>}/>
                        <Route path={"/articles/create"}
                               element={<ContentUnitEditForm requestedContentCategory={"article"}
                                                             requestedContentID={-1}/>}/>
                        <Route path={"/scripts/create"}
                               element={<ContentUnitEditForm requestedContentCategory={"script"}
                                                             requestedContentID={-1}/>}/>
                    </Routes>
                </Box>
                {previewContent.length > 0 ?
                    <ContentPageSwitch pageName={mainElement} onClickBack={clickBack} onClickForward={clickForward}
                                       onClickNum={setPageNum}/> :
                    <Fragment/>}
            </Grid>
            {/*Right page content placeholder*/}
            {isPortrait ? <Fragment/> : <Box width={selectedWidth}/>}
        </Grid>);
}
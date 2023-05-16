import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import {Route, Routes} from "react-router-dom";

import CategoryMenu from "./CategoryMenu";

import AssetsPage from "../../pages/AssetsPage/AssetsPage";
import ScriptsPage from "../../pages/Scripts/ScriptsPage";
import ArticlesPage from "../../pages/Articles/ArticlesPage";

import ContentUnitPage from "../../pages/Content/ContentUnitPage";
import ContentUnitEditForm from "../../pages/ContentEdit/ContentUnitEditForm";

import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {IsMobileResolution} from "../../utils/MobileUtilities";

import CreateContentButton from "../Buttons/CreateContentButton";
import {SitePagesProperties} from "../../utils/PageProperties/SitePagesProperties";
import {PageProperties} from "../../utils/PageProperties/PageProperties";
import GetPreviews from "../../utils/ContentInteraction/GetPreviews";
import {GetLastURLPart} from "../../utils/GetLastURLPart";
import {GenericStringProp} from "../../utils/Types/GenericProps/GenericStringProp";

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

export default function MainContent({propValue}: GenericStringProp) {
    const [currentPage, setCurrentPage] = useState(1);
    const [previewContent, setPreviewContent] = useState<ContentUnitPreview[]>([]);
    const [totalContentCount, setTotalContentCount] = useState(-1);

    const elementTypeName: string = propValue;

    const landscapeWidth: string = "15%";
    const portraitWidth: string = "30%";
    const isPortrait: boolean = IsMobileResolution();
    const selectedWidth: string = isPortrait ? portraitWidth : landscapeWidth;

    const currentPageProperties: PageProperties = SitePagesProperties.page[elementTypeName];

    const canShowCreateButton: boolean = true;

    let currentCategory: string = "idk";
    let shouldUpdate: boolean = false;
    if (currentPageProperties !== undefined) {
        currentCategory = currentPageProperties.getCategoryName();
        shouldUpdate = currentPageProperties.currentPage !== currentPage;
        currentPageProperties.currentPage = currentPage;
    }

    let currentContentID = -1;
    const lastURLPart = Number(GetLastURLPart());

    if (!isNaN(lastURLPart) && window.location.pathname != "/") {
        currentContentID = lastURLPart;
    }

    const setPageNumber = (newNumber: number) => {
        if (currentPageProperties.currentPage !== newNumber) {
            setCurrentPage(newNumber);
        }
    }

    const clickBack = () => setPageNumber(Math.max(1, currentPageProperties.currentPage - 1));

    const clickForward = () => setPageNumber(Math.min(currentPageProperties.getPagesCount(), currentPageProperties.currentPage + 1));

    const loadPreviews = () => {
        if ((previewContent.length === 0 || shouldUpdate) && totalContentCount !== 0 && currentPageProperties !== undefined) {
            setPreviewContent([]);
            GetPreviews(currentPageProperties).then((previews: ContentUnitPreview[]) => {
                window.scrollTo(0, 0);
                setTotalContentCount(currentPageProperties.getPostsCount())
                setPreviewContent(previews);
            });
        }
    }

    useEffect(() => {
        loadPreviews();
    });

    const previewPages = [
        ["AssetsPage", <AssetsPage pageProperties={currentPageProperties}
                                   previewContent={previewContent}
                                   onClickBack={clickBack}
                                   onClickForward={clickForward}
                                   onClickNum={setPageNumber}/>, ""],
        ["ArticlesPage", <ArticlesPage/>, "articles"],
        ["ScriptsPage", <ScriptsPage/>, "scripts"]
    ]

    const currentPreviewPageData = previewPages.filter(page => page[0] === elementTypeName)[0];
    const currentPreviewPage = currentPreviewPageData[1];
    const currentPreviewPageLink = currentPreviewPageData[2];

    return (
        <Grid display="flex" padding="8px" gap="8px" paddingTop="16px">
            {/*Menu on the left*/}
            <Grid display="grid" width={selectedWidth} height="fit-content" gap="8px">
                <CategoryMenu propValue={elementTypeName}/>
                {canShowCreateButton ?
                    <CreateContentButton
                        propValue={(currentCategory === "asset" ? "/create" : "/" + currentPreviewPageLink + "/create")}/> :
                    <Fragment/>}
            </Grid>
            {/*Content selection and display*/}
            <Grid sx={mainContentGrid}>
                <Box sx={mainContentBox} id="mainElementBox">
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
                    </Routes>
                </Box>
            </Grid>
            {/*Right page content placeholder*/}
            {isPortrait ? <Fragment/> : <Box width={selectedWidth}/>}
        </Grid>);
}
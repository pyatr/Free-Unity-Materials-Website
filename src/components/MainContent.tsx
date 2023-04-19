import React, {Fragment, useEffect, useState} from "react";
import CategoryMenu from "./CategoryMenu";
import {Box, Grid} from "@mui/material";
import {ContentProps} from "../App";
import {IsMobileResolution} from "../utils/MobileUtilities";
import ContentPageSwitch from "./ContentPageSwitch";
import AssetsPage from "../pages/AssetsPage/AssetsPage";
import ScriptsPage from "../pages/Scripts/ScriptsPage";
import ArticlesPage from "../pages/Articles/ArticlesPage";
import NonExistentPage from "../pages/NonExistent/NonExistentPage";
import {SitePages} from "../utils/PageData/SitePages";
import {PageData} from "../utils/PageData/PageData";

function GetMainStyles() {
    const landHeight = "65vh";
    const mobileHeight = "90vh";
    let realHeight = IsMobileResolution() ? mobileHeight : landHeight;
    return ([{
        width: "71%",
        justifyContent: "center",
        margin: '0.5%',
        paddingTop: "16px",
        gap: "32px",
        paddingBottom: "96px",
    }, {
        p: 2,
        //71+12+12+1.5+1.5+1+1 = 100%
        minHeight: realHeight,
        width: "100%",
        border: 2,
        borderColor: 'primary.main',
        borderRadius: 1,
        justifySelf: "stretch",
        alignSelf: "stretch",
    }]);
}

export default function MainContent({mainElement}: ContentProps) {
    const [gridStyle, boxStyle] = GetMainStyles();

    const [pageFinishedLoading, setPageLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const elementPageData: PageData = SitePages.page[mainElement];

    const pageLoaded = () => {
        setPageLoaded(true);
    };

    const setPageNum = (newNum: number) => {
        SitePages.page[mainElement].shouldUpdate = true;
        setCurrentPage(newNum);
    }

    const clickBack = () => {
        setPageNum(Math.max(1, elementPageData.currentPage - 1));
    }

    const clickForward = () => {
        setPageNum(Math.min(elementPageData.getPagesCount(), elementPageData.currentPage + 1));
    }

    elementPageData.currentPage = currentPage;

    const elements = new Map();
    elements.set("AssetsPage", <AssetsPage pageData={elementPageData} onPageLoaded={pageLoaded}/>);
    elements.set("ArticlesPage", <ArticlesPage pageData={elementPageData} onPageLoaded={pageLoaded}/>);
    elements.set("ScriptsPage", <ScriptsPage pageData={elementPageData} onPageLoaded={pageLoaded}/>);
    elements.set("NonExistentPage", <NonExistentPage pageData={elementPageData} onPageLoaded={pageLoaded}/>);

    return (
        <Fragment>
            <CategoryMenu/>
            <Grid container sx={gridStyle}>
                {pageFinishedLoading ?
                    <ContentPageSwitch pageName={mainElement} onClickBack={clickBack} onClickForward={clickForward}
                                       onClickNum={setPageNum}/> :
                    <Fragment/>}
                <Box sx={boxStyle} id="mainElementBox">
                    {elements.get(mainElement)}
                </Box>
                {pageFinishedLoading ?
                    <ContentPageSwitch pageName={mainElement} onClickBack={clickBack} onClickForward={clickForward}
                                       onClickNum={setPageNum}/> :
                    <Fragment/>}
            </Grid>
        </Fragment>);
}
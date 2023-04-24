import React, {Fragment, useEffect, useState} from "react";
import CategoryMenu from "./CategoryMenu";
import {Box, Button, Grid} from "@mui/material";
import {ContentProps} from "../App";
import ContentPageSwitch from "./ContentPageSwitch";
import AssetsPage from "../pages/AssetsPage/AssetsPage";
import ScriptsPage from "../pages/Scripts/ScriptsPage";
import ArticlesPage from "../pages/Articles/ArticlesPage";
import NonExistentPage from "../pages/NonExistent/NonExistentPage";
import {SitePages} from "../utils/PageData/SitePages";
import {PageData} from "../utils/PageData/PageData";
import ServerConnection from "../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {Link, Route, Routes} from "react-router-dom";
import ItemPage from "../pages/Item/ItemPage";
import {ContentPreview} from "../utils/ContentPreview";
import {GetSubURL} from "../utils/GetSubURL";
import {IsMobileResolution} from "../utils/MobileUtilities";
import {CanUserEditContent} from "../utils/Login";
import ItemEditPage from "../pages/Item/ItemEditPage";
import "../assets/HomePage.css";

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
    const [rawContent, setRawContent] = useState(Array<ContentPreview>);

    const elementPageData: PageData = SitePages.page[mainElement];

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
        const waitForContent = async () => {
            //Do not reload content if its loaded and if page was not told to update
            if ((rawContent.length > 0 && !shouldUpdate) || elementPageData === undefined) {
                return;
            }
            let scon = new ServerConnection();
            let params = {
                pageSize: elementPageData.pageSize,
                page: elementPageData.currentPage
            };
            await scon.SendPostRequest(elementPageData.getRequestName(), params,
                (response: AxiosResponse) => {
                    //Use response.data.code for SQL request code and response.data.requesterror for error details
                    if (response.data.result === "success") {
                        (response.data.content as ContentPreview[]).forEach(assItem => assItem.TITLEPIC_LINK = "http://" + window.location.host + assItem.TITLEPIC_LINK);
                        elementPageData.setPostsCount(response.data.contentCount);
                        window.scrollTo(0, 0);
                        setRawContent(response.data.content);
                    } else {
                        console.log("request " + elementPageData.getRequestName() + " failed: " + response.data.code + "\nError: " + response.data.requesterror);
                    }
                });
        }
        waitForContent();
    });

    const elements = new Map();
    if (elementPageData != undefined) {
        elements.set("AssetsPage", <AssetsPage pageData={elementPageData} rawContent={rawContent}/>);
        elements.set("ArticlesPage", <ArticlesPage/>);
        elements.set("ScriptsPage", <ScriptsPage/>);
        elements.set("NonExistentPage", <NonExistentPage/>);
    }

    let pageFinishedLoading = rawContent.length > 0;

    const lastPart = Number(GetSubURL());
    let itemNum = -1;
    if (!isNaN(lastPart)) {
        itemNum = lastPart;
    }
    return (
        <Grid display="flex" padding="8px" gap="8px" paddingTop="16px">
            <Grid display="grid" width={selectedWidth} height="fit-content" gap="8px">
                <CategoryMenu/>
                {CanUserEditContent() ?
                    <Button sx={sideButtonStyle} component={Link} to={"/create"}>Add new item</Button> : <Fragment/>}
            </Grid>
            <Grid sx={mainContentGrid}>
                <Box sx={mainContentBox} id="mainElementBox">
                    <Routes>
                        <Route path="/" element={elements.get(mainElement)}/>
                        <Route path={"/" + itemNum} element={<ItemPage itemNumber={itemNum}/>}/>
                        <Route path={"/create"} element={<ItemEditPage itemContent={null}/>}/>
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
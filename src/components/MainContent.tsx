import React, {Fragment, useEffect, useState} from "react";
import CategoryMenu from "./CategoryMenu";
import {Box, Grid} from "@mui/material";
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
import {ContentItem} from "../utils/ContentItem";

function GetMainStyles() {
    return ([{
        width: "71%",
        justifyContent: "center",
        margin: '0.5%',
        gap: "32px",
        paddingBottom: "96px",
    }, {
        p: 2,
        //71+12+12+1.5+1.5+1+1 = 100%
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

    const [currentPage, setCurrentPage] = useState(1);
    const [rawContent, setRawContent] = useState(Array<ContentItem>);

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

    let shouldUpdate = elementPageData.currentPage != currentPage;
    elementPageData.currentPage = currentPage;

    useEffect(() => {
        const waitForContent = async () => {
            //Do not reload content if its loaded and if page was not told to update
            if (rawContent.length > 0 && !shouldUpdate) {
                return;
            }
            let scon = new ServerConnection();
            let params = {
                pageSize: elementPageData.pageSize,
                page: elementPageData.currentPage
            };
            await scon.sendPostRequest(elementPageData.getRequestName(), params,
                (response: AxiosResponse) => {
                    //Use response.data.code for SQL request code and response.data.requesterror for error details
                    if (response.data.result === "success") {
                        (response.data.content as ContentItem[]).forEach(assItem => assItem.TITLEPIC_LINK = "http://" + window.location.host + assItem.TITLEPIC_LINK);
                        elementPageData.setPostsCount(response.data.postsCount);
                        window.scrollTo(0, 0);
                        setRawContent(response.data.content);
                    } else {
                        console.log("request failed: " + response.data.code + "\nError: " + response.data.requesterror);
                    }
                });
        }
        waitForContent();
    });

    const elements = new Map();
    elements.set("AssetsPage", <AssetsPage pageData={elementPageData} rawContent={rawContent}/>);
    elements.set("ArticlesPage", <ArticlesPage/>);
    elements.set("ScriptsPage", <ScriptsPage/>);
    elements.set("NonExistentPage", <NonExistentPage/>);

    let pageFinishedLoading = rawContent.length > 0;
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
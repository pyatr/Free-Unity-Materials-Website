import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";

import CategoryMenu from "../CategoryMenu";

import {IsMobileResolution} from "../../utils/MobileUtilities";

import CreateContentButton from "../Buttons/CreateContentButton";
import {SitePagesProperties} from "../../utils/PageProperties/SitePagesProperties";
import {PageProperties} from "../../utils/PageProperties/PageProperties";
import {GetLastURLPart} from "../../utils/GetLastURLPart";
import ContentPageSwitch from "../ContentPageSwitch";
import {PreviewLoader} from "./PreviewLoader";
import {GetFirstURLPart} from "../../utils/GetFirstURLPart";

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

export type MainContentProps = {
    elementTypeName: string
}

export default function MainContentLayout({elementTypeName}: MainContentProps) {
    const currentPageProperties: PageProperties = SitePagesProperties.page[elementTypeName];

    const [currentPageNumber, setCurrentPageNumber] = useState(currentPageProperties.currentPage);
    const [isLoading, setLoadingStatus] = useState(false);
    const [lastSearch, setLastSearch] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const history = useNavigate();

    useEffect(() => {
        //This is an empty hook to ensure that page is updated when link is changed
    }, [history]);

    const setCurrentPageNumberCallback = (newPageNumber: number) => setCurrentPageNumber(newPageNumber);

    const landscapeWidth: string = "15%";
    const portraitWidth: string = "30%";
    const isPortrait: boolean = IsMobileResolution();
    const selectedWidth: string = isPortrait ? portraitWidth : landscapeWidth;
    const currentPreviewPageLink: string = GetFirstURLPart();

    let currentCategory: string = "";
    currentCategory = currentPageProperties.getCategoryName();

    useEffect(() => {
        if (searchParams !== undefined) {
            const searchKeyword = searchParams.get("keyword");
            if (searchKeyword !== null && searchKeyword !== lastSearch) {
                if (currentPageNumber > currentPageProperties.getPagesCount()) {
                    currentPageProperties.currentPage = 1;
                    setCurrentPageNumber(1);
                }
                setLastSearch(searchKeyword);
            }
        }
    }, [searchParams]);

    const canShowCreateButton: boolean = GetLastURLPart() === currentPreviewPageLink && currentCategory != "everything";

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
                    <PreviewLoader key={currentPageNumber}
                                   elementTypeName={elementTypeName}
                                   onContentLoaded={() => setLoadingStatus(!isLoading)}/>
                </Box>
                {["/", "/articles", "/scripts", "/search-all"].includes(window.location.pathname) ?
                    <ContentPageSwitch key={isLoading.toString()} elementTypeName={elementTypeName}
                                       onNumberChanged={setCurrentPageNumberCallback}/> : <Fragment/>}
            </Grid>
            {/*Right page content placeholder*/}
            {isPortrait ? <Fragment/> : <Box width={selectedWidth}/>}
        </Grid>);
}
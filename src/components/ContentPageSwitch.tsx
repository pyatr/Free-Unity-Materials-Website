import {Box, Button, Grid, Typography} from "@mui/material";
import React, {Fragment, useState} from "react";
import {PageProperties} from "../utils/PageProperties/PageProperties";
import {SitePagesProperties} from "../utils/PageProperties/SitePagesProperties";

type ContentPageSwitchProps = {
    elementTypeName: string,
    onNumberChanged: Function
}

const style = {
    variant: "h3",
    fontSize: "1.5rem",
    margin: "auto",
    color: "black"
}

const gridStyle = {
    width: "100%",
    display: "grid"
}

const pageNumberButton = {
    fontSize: "1.5em",
    color: "grey",
    fontWeight: "normal"
}

const currentPageNumberButton = {
    fontSize: "1.5em",
    color: "black",
    fontWeight: "bold"
}

export default function ContentPageSwitch({elementTypeName, onNumberChanged}: ContentPageSwitchProps) {
    let currentPageProperties: PageProperties = SitePagesProperties.page[elementTypeName];

    if (currentPageProperties.getPostsCount() === 0) {
        //Not initialized, display nothing
        return (<Fragment/>);
    }

    const setPageNumber = (newNumber: number) => {
        if (currentPageProperties.currentPage !== newNumber) {
            onNumberChanged(newNumber);
            currentPageProperties.currentPage = newNumber;
        }
    }

    const clickBack = () => setPageNumber(Math.max(1, currentPageProperties.currentPage - 1));

    const clickForward = () => setPageNumber(Math.min(currentPageProperties.getPagesCount(), currentPageProperties.currentPage + 1));

    let pageCount = currentPageProperties.getPagesCount()
    let pageNumbers: number[] = [];
    for (let i = 0; i < pageCount; i++) {
        pageNumbers.push(i + 1);
    }

    let pagesAsText = pageNumbers.map((num: number) => {
        let isCurrentPage = currentPageProperties.currentPage === num;
        return <Button key={currentPageProperties.getCategoryName() + "Page" + num}
                       style={isCurrentPage ? currentPageNumberButton : pageNumberButton}
                       onClick={clickEvent => setPageNumber(num)}>{num}</Button>;
    });
    const pageCountText = (currentPageProperties.getFirstItemNumber() + 1) + "-" + currentPageProperties.getLastItemNumber();
    if (pageCount > 1) {
        return (
            <Grid style={gridStyle}>
                <Box display="flex" width="fit-content" justifySelf="center">
                    <Button style={style} onClick={clickEvent => clickBack()}>{"<"}</Button>
                    <Typography style={style}>{pageCountText}</Typography>
                    <Button style={style} onClick={clickEvent => clickForward()}>{">"}</Button>
                </Box>
                <Grid justifySelf="center">
                    {pagesAsText}
                </Grid>
            </Grid>);
    } else {
        return (
            <Grid style={gridStyle}>
                <Box display="flex" width="fit-content" justifySelf="center">
                    <Typography style={style}>{pageCountText}</Typography>
                </Box>
            </Grid>);
    }
}
import {Box, Button, Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {SitePages} from "../utils/PageData/SitePages";

export type PageSwitchProps = {
    pageName: string,
    onClickBack: Function,
    onClickForward: Function,
    onClickNum: Function
}

export default function ContentPageSwitch({pageName, onClickBack, onClickForward, onClickNum}: PageSwitchProps) {
    let elementPageData = SitePages.page[pageName];
    if (elementPageData.getPostsCount() == 0) {
        //Not initialized, display nothing
        return (<Fragment/>);
    }
    const style = {
        variant: "h3",
        fontSize: "1.5rem",
        margin: "auto",
        color: "black"
    }
    const gridStyle = {
        width: "auto",
        display: "grid"
    }
    let pageCount = elementPageData.getPagesCount()
    let pageNumbers: number[] = [];
    for (let i = 0; i < pageCount; i++) {
        pageNumbers.push(i + 1);
    }
    let pagesAsText = pageNumbers.map((num) => {
        let isCurrentPage = elementPageData.currentPage == num;
        return <Button style={isCurrentPage ? {
            fontSize: "1.5rem",
            color: "black",
            fontWeight: "bold"
        } : {
            fontSize: "1.5rem",
            color: "grey",
            fontWeight: "normal"
        }} onClick={e => onClickNum(num)}>{num}</Button>;
    });
    const pageCountText = (elementPageData.getFirstItemNumber() + 1) + "-" + elementPageData.getLastItemNumber();
    return (
        <Grid style={gridStyle}>
            <Box display="flex" width="fit-content" justifySelf="center">
                <Button style={style} onClick={e => onClickBack()}>{"<"}</Button>
                <Typography style={style}>{pageCountText}</Typography>
                <Button style={style} onClick={e => onClickForward()}>{">"}</Button>
            </Box>
            <Grid justifySelf="center">
                {pagesAsText}
            </Grid>
        </Grid>
    );
}
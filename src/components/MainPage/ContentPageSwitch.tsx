import {Box, Button, Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {PageLoadProps} from "../../utils/PageProperties/PageProperties";

export default function ContentPageSwitch({pageProperties, previewContent, onClickBack, onClickForward, onClickNum}: PageLoadProps) {
    if (pageProperties.getPostsCount() == 0) {
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
        width: "100%",
        display: "grid"
    }
    let pageCount = pageProperties.getPagesCount()
    let pageNumbers: number[] = [];
    for (let i = 0; i < pageCount; i++) {
        pageNumbers.push(i + 1);
    }
    let pagesAsText = pageNumbers.map((num) => {
        let isCurrentPage = pageProperties.currentPage == num;
        return <Button key={pageProperties + "Page" + num} style={isCurrentPage ? {
            fontSize: "1.5rem",
            color: "black",
            fontWeight: "bold"
        } : {
            fontSize: "1.5rem",
            color: "grey",
            fontWeight: "normal"
        }} onClick={e => onClickNum(num)}>{num}</Button>;
    });
    const pageCountText = (pageProperties.getFirstItemNumber() + 1) + "-" + pageProperties.getLastItemNumber();
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
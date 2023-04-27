import React, {Fragment, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import PixelSummForCSS from "../utils/PixelSummForCSS";
import {ContentUnitPreview} from "../utils/Types/Content/ContentUnitPreview";
import {StripHTMLFromString} from "../utils/StripHTMLFromString";
import {CanUserEditContent} from "../utils/Login";
import {Cancel, CheckCircle, Delete} from "@mui/icons-material";
import {Create} from "@mui/icons-material";
import {Link} from "react-router-dom";
import MessageBoxYesNo from "./MessageBoxes/MessageBoxYesNo";

export type AssetItemDisplay = {
    itemData: ContentUnitPreview,
    itemStyle: React.CSSProperties
}

const adminButtonsGrid = {
    padding: '24px',
    display: 'flex',
    width: 'inherit',
    justifyContent: 'space-between',
    position: 'absolute',
    pointerEvents: "none"
}

const textBoxLink = {
    width: 'inherit',
    height: 'inherit',
    position: 'absolute'
}

const adminButtonsStyle = {
    border: '2px',
    borderStyle: 'solid',
    color: 'white',
    background: 'black',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    pointerEvents: 'all',
    zIndex: 10
}

const gridStyle = {
    padding: '4px',
    color: 'black',
    textDecoration: 'none'
}

export default function AssetItemDisplay({itemData, itemStyle}: AssetItemDisplay) {
    const [showingAdminButtons, setAdminButtonStatus] = useState(false);
    const [deleteWindowOpen, setDeleteWindowStatus] = useState(false);

    if (itemData.number < 0) {
        //Dummy item in case there are not enough items in row
        let newWidth = PixelSummForCSS(itemStyle.width as string, "4");
        let newHeight = PixelSummForCSS(itemStyle.height as string, "4");
        return (<Box width={newWidth} height={newHeight} margin="auto"/>);
    }
    const canEdit: boolean = CanUserEditContent();
    const shortTitleLimit = 20;
    const shortTitle = itemData.title.length > shortTitleLimit ? itemData.title.substring(0, shortTitleLimit) + "..." : itemData.title;

    const showAdminButtons = () => {
        setAdminButtonStatus(canEdit);
    }

    const hideAdminButtons = () => {
        setAdminButtonStatus(false);
    }

    const openEditPage = () => {

    }

    const askToDelete = () => {
        setDeleteWindowStatus(true);
    }

    const confirmDelete = () => {
        setDeleteWindowStatus(false);
    }

    const cancelDelete = () => {
        setDeleteWindowStatus(false);
    }

    const imageStyle = {
        width: itemStyle.width,
        height: itemStyle.width,
        color: "black",
        borderBottom: "inherit"
    }

    const startPictureWidth = 187;
    let fontSizeMod = parseFloat(itemStyle.width as string) / startPictureWidth;

    const titleFontSize = fontSizeMod + "rem";
    const subtitleFontSite = (fontSizeMod * 0.7) + "rem";

    let link = "/" + itemData.number;
    return (
        <Grid style={itemStyle} onMouseEnter={showAdminButtons}
              onMouseLeave={hideAdminButtons}>
            <Box component={Link} to={link} sx={textBoxLink}/>
            <Box width="inherit">
                {showingAdminButtons ?
                    <Grid sx={adminButtonsGrid}>
                        <Create sx={adminButtonsStyle} onClick={openEditPage}/>
                        <Delete sx={adminButtonsStyle} onClick={askToDelete}/>
                    </Grid> :
                    <Fragment/>}
                {deleteWindowOpen ?
                    <MessageBoxYesNo
                        message={"Delete " + itemData.title + "?"}
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        parentWidth={imageStyle.width as string}
                        parentHeight={imageStyle.width as string}/> :
                    <Fragment/>}
                {<img src={itemData.titlepicLink} style={imageStyle}/>}
            </Box>
            <Grid style={gridStyle} fontSize={subtitleFontSite}>
                <Typography component="h6" fontSize={titleFontSize}>{shortTitle}</Typography>
                <Typography variant="subtitle1" fontSize={subtitleFontSite}
                            color="#999999"> {itemData.categories}</Typography>
                <Typography sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordWrap: "anywhere",
                    WebkitLineClamp: "4",
                    WebkitBoxOrient: "vertical",
                    display: "-webkit-box",
                    fontSize: subtitleFontSite
                }}> {StripHTMLFromString(itemData.content)}</Typography>
            </Grid>
        </Grid>
    )
        ;
}
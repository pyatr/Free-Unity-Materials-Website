import React, {Fragment, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import PixelSumm from "../utils/PixelSumm";
import {ContentPreview} from "../utils/ContentPreview";
import {StripHTMLFromString} from "../utils/StripHTMLFromString";
import {CanUserEditContent} from "../utils/Login";
import {Close} from "@mui/icons-material";
import {Create} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {hover} from "@testing-library/user-event/dist/hover";

export type AssetItemDisplay = {
    itemData: ContentPreview,
    itemStyle: React.CSSProperties
}

const adminButtonsGrid = {
    padding: '24px',
    display: 'flex',
    width: 'inherit',
    justifyContent: 'space-between',
    position: 'absolute'
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
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    zIndex: 10
}

const gridStyle = {
    padding: '4px',
    color: 'black',
    textDecoration: 'none'
}

export default function AssetItemDisplay({itemData, itemStyle}: AssetItemDisplay) {
    const [showingAdminButtons, setAdminButtonStatus] = useState(false);

    if (itemData.NUMBER < 0) {
        //Dummy item in case there are not enough items in row
        let newWidth = PixelSumm(itemStyle.width as string, "4");
        let newHeight = PixelSumm(itemStyle.height as string, "4");
        return (<Box width={newWidth} height={newHeight} margin="auto"/>);
    }
    const canEdit: boolean = CanUserEditContent();

    const showAdminButtons = () => {
        setAdminButtonStatus(canEdit);
    }

    const hideAdminButtons = () => {
        setAdminButtonStatus(false);
    }

    const openEditPage = () => {

    }

    const askToDelete = () => {
        
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

    let link = "/" + itemData.NUMBER;
    return (
        <Grid item style={itemStyle} onMouseEnter={showAdminButtons}
              onMouseLeave={hideAdminButtons}>
            <Box component={Link} to={link} sx={textBoxLink}/>
            <Box width="inherit">
                {showingAdminButtons ?
                    <Grid sx={adminButtonsGrid}>
                        <Create sx={adminButtonsStyle} onClick={openEditPage}/>
                        <Close sx={adminButtonsStyle} onClick={askToDelete}/>
                    </Grid> :
                    <Fragment/>}
                {<img src={itemData.TITLEPIC_LINK} style={imageStyle}/>}
            </Box>
            <Grid style={gridStyle} fontSize={subtitleFontSite}>
                <Typography component="h6" fontSize={titleFontSize}>{itemData.SHORTTITLE}</Typography>
                <Typography variant="subtitle1" fontSize={subtitleFontSite}
                            color="#999999"> {itemData.CATEGORIES}</Typography>
                <Typography sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordWrap: "anywhere",
                    WebkitLineClamp: "4",
                    WebkitBoxOrient: "vertical",
                    display: "-webkit-box",
                    fontSize: subtitleFontSite
                }}> {StripHTMLFromString(itemData.CONTENT)}</Typography>
            </Grid>
        </Grid>
    );
}
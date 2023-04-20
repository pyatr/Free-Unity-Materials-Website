import React from "react";
import {Box, Grid, Typography} from "@mui/material";
import TextTruncate from "react-text-truncate";
import PixelSumm from "../utils/PixelSumm";
import {IsMobileResolution} from "../utils/MobileUtilities";
import {Link} from "react-router-dom";
import {ContentPreview} from "../utils/ContentPreview";

export type AssetItemDisplay = {
    itemData: ContentPreview,
    itemStyle: React.CSSProperties
}

export default function AssetItemDisplay({itemData, itemStyle}: AssetItemDisplay) {
    if (itemData.NUMBER < 0) {
        //Dummy item in case there are not enough items in row
        let newWidth = PixelSumm(itemStyle.width as string, "4");
        let newHeight = PixelSumm(itemStyle.height as string, "4");
        return (<Box width={newWidth} height={newHeight} margin="auto"/>);
    }

    const gridStyle = {
        padding: "4px"
    }
    const imageStyle = {
        width: itemStyle.width,
        height: itemStyle.width,
        color: "black",
        borderBottom: "inherit"
    }
    const startPictureWidth = 187;
    let fontSizeMod = parseFloat(itemStyle.width as string) / startPictureWidth;
    //Truncate doesn't work well on mobile browsers (ok in mobile mode on desktop) so we have to use different line parameter
    const truncateLine = IsMobileResolution() ? 3 : 4;

    const titleFontSize = fontSizeMod + "rem";
    const subtitleFontSite = (fontSizeMod * 0.7) + "rem";

    let link = "/" + itemData.NUMBER;
    return (<Grid item component={Link} to={link} style={itemStyle} sx={{boxSizing: "content-box"}}>
        {<img src={itemData.TITLEPIC_LINK} style={imageStyle}/>}
        <Grid style={gridStyle} fontSize={subtitleFontSite}>
            <Typography component="h6" fontSize={titleFontSize}>{itemData.SHORTTITLE}</Typography>
            <Typography variant="subtitle1" fontSize={subtitleFontSite}
                        color="#999999"> {itemData.CATEGORIES}</Typography>
            <TextTruncate line={truncateLine} truncateText="..." text={itemData.CONTENT}/>
        </Grid>
    </Grid>);
}
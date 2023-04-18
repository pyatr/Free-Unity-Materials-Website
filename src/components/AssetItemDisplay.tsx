import React from "react";
import {AssetItem} from "../pages/AssetsPage/AssetsPage";
import {Grid, Typography} from "@mui/material";
//If you get react-scale-text is not a module error, create react-scale-text.d.ts in node_modules package and add "declare module 'react-scale-text';"
//TODO: try use for scaling import {ScaleText} from "react-scale-text"

export type AssetItemDisplay = {
    itemData: AssetItem,
    itemStyle: React.CSSProperties
}

export default function AssetItemDisplay({itemData, itemStyle}: AssetItemDisplay) {
    const gridStyle = {
        padding: "4px"
    }
    const startPictureWidth = 187;
    let fontSizeMod = parseFloat(itemStyle.width as string) / startPictureWidth;
    const imageStyle = {
        width: itemStyle.width,
        height: itemStyle.width
    }
    const titleFontSize = fontSizeMod + "rem";
    const subtitleFontSite = (fontSizeMod * 0.7) + "rem";
    console.log([titleFontSize, subtitleFontSite]);
    return (<Grid item style={itemStyle} sx={{boxSizing: "content-box"}}>
        {<img src={itemData.TITLEPIC_LINK} style={imageStyle}/>}
        <Grid style={gridStyle}>
            <Typography component="h6" fontSize={titleFontSize}>{itemData.SHORTTITLE}</Typography>
            <Typography variant="subtitle1" color="#999999"
                        fontSize={subtitleFontSite}> {itemData.CATEGORIES}</Typography>
            <Typography variant="subtitle1" fontSize={subtitleFontSite}>{itemData.CREATION_DATE}</Typography>
        </Grid>
    </Grid>);
}
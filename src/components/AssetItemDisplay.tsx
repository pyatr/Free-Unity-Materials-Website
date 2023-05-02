import React, {Fragment, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import PixelSummForCSS from "../utils/PixelSummForCSS";
import {ContentUnitPreview} from "../utils/Types/Content/ContentUnitPreview";
import {StripHTMLFromString} from "../utils/StripHTMLFromString";
import {CanUserEditContent} from "../utils/Login";
import {Delete} from "@mui/icons-material";
import {Create} from "@mui/icons-material";
import {Link} from "react-router-dom";
import MessageBoxYesNo from "./MessageBoxes/MessageBoxYesNo";
import DeleteContent from "../utils/ContentInteraction/DeleteContent";

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

const editBoxStyle = {
    border: '2px',
    borderStyle: 'solid',
    width: '40px',
    height: '40px',
    color: 'white',
    background: 'black',
    position: 'relative'
}

const editButtonStyle = {
    color: 'white',
    width: '36px',
    height: '36px',
    pointerEvents: 'none',
    position: 'absolute'
}

const editDummyBoxStyle = {
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    pointerEvents: 'all',
    display: 'inline-block',
    zIndex: 10,
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
        return (<Box width={newWidth}/>);
    }
    const canEdit: boolean = CanUserEditContent();

    const showAdminButtons = () => {
        setAdminButtonStatus(canEdit);
    }

    const hideAdminButtons = () => {
        setAdminButtonStatus(false);
    }

    const askToDelete = () => {
        setDeleteWindowStatus(true);
    }

    const confirmDelete = () => {
        DeleteContent(itemData.number, "asset").then(() => {
            window.location.reload();
        });
    }

    const cancelDelete = () => {
        setDeleteWindowStatus(false);
    }

    const imageStyle = {
        width: itemStyle.width,
        height: itemStyle.width,
        display: "grid",
        color: "black",
        borderBottom: "inherit",
        background: 'black'
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
            <Box style={imageStyle}>
                {showingAdminButtons ?
                    <Grid sx={adminButtonsGrid}>
                        {/*Create icon is transparent when Link is applied, using invisible box instead*/}
                        <Box sx={editBoxStyle}>
                            <Create sx={editButtonStyle}/>
                            <Box sx={editDummyBoxStyle} component={Link} to={"/edit/" + itemData.number}/>
                        </Box>
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
                {<img src={itemData.titlepicLink}/>}
            </Box>
            <Grid style={gridStyle} fontSize={subtitleFontSite}>
                <Typography component="h6" sx={{textOverflow: "ellipsis", overflow: "hidden"}}
                            fontSize={titleFontSize}>{itemData.title}</Typography>
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
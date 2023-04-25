import React, {Fragment, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import PixelSumm from "../utils/PixelSumm";
import {ContentPreview} from "../utils/Types/ContentPreview";
import {StripHTMLFromString} from "../utils/StripHTMLFromString";
import {CanUserEditContent} from "../utils/Login";
import {Cancel, CheckCircle, Delete} from "@mui/icons-material";
import {Create} from "@mui/icons-material";
import {Link} from "react-router-dom";

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
    background: 'black',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    zIndex: 10
}

const messageBoxButtonsStyle = {
    width: '40px',
    height: '40px'
}

const gridStyle = {
    padding: '4px',
    color: 'black',
    textDecoration: 'none'
}

type MessageBoxProps = {
    message: string,
    onConfirm: Function,
    onCancel: Function,
    parentWidth: string,
    parentHeight: string
}

function MessageBoxYesNo({message, onConfirm, onCancel, parentWidth, parentHeight}: MessageBoxProps) {
    return (<Box padding='8px'
                 position='absolute'
                 zIndex='11'
                 width={PixelSumm(parentWidth, "-16px")}
                 height={PixelSumm(parentHeight, "-16px")}>
        <Box style={{border: '2px', borderStyle: 'solid', background: 'white'}}>
            <Grid style={{display: 'grid', padding: '16px', gap: '32px'}}>
                <Typography variant="h5">{message}</Typography>
                <Grid style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <CheckCircle style={messageBoxButtonsStyle} onClick={() => onConfirm()}/>
                    <Cancel style={messageBoxButtonsStyle} onClick={() => onCancel()}/>
                </Grid>
            </Grid>
        </Box>
    </Box>);
}

export default function AssetItemDisplay({itemData, itemStyle}: AssetItemDisplay) {
    const [showingAdminButtons, setAdminButtonStatus] = useState(false);
    const [deleteWindowOpen, setDeleteWindowStatus] = useState(false);

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

    let link = "/" + itemData.NUMBER;
    return (
        <Grid item style={itemStyle} onMouseEnter={showAdminButtons}
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
                        message={"Delete " + itemData.SHORTTITLE + "?"}
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        parentWidth={imageStyle.width as string}
                        parentHeight={imageStyle.width as string}/> :
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
    )
        ;
}
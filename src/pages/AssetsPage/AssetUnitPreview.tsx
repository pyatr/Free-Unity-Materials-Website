import React, {Fragment, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import PixelSummForCSS from "../../utils/PixelSummForCSS";
import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {StripHTMLFromString} from "../../utils/StripHTMLFromString";
import {CanUserEditContent} from "../../utils/Login";
import {Delete} from "@mui/icons-material";
import {Create} from "@mui/icons-material";
import {Link} from "react-router-dom";
import MessageBoxYesNo from "../../components/MessageBoxes/MessageBoxYesNo";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";

type AssetUnitPreviewProps = {
    contentUnitPreview: ContentUnitPreview,
    contentUnitPreviewStyle: React.CSSProperties
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

const previewTitleStyle = {
    textOverflow: "ellipsis", overflow: "hidden"
}

const previewBodyStyle = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "anywhere",
    WebkitLineClamp: "4",
    WebkitBoxOrient: "vertical",
    display: "-webkit-box"
}

export default function AssetUnitPreview({contentUnitPreview, contentUnitPreviewStyle}: AssetUnitPreviewProps) {
    const [showingAdminButtons, setAdminButtonStatus] = useState(false);
    const [deleteWindowOpen, setDeleteWindowStatus] = useState(false);

    if (contentUnitPreview.contentID < 0) {
        //Dummy item in case there are not enough items in row
        let newWidth = PixelSummForCSS(contentUnitPreviewStyle.width as string, "4");
        return (<Box width={newWidth}/>);
    }
    const canEdit: boolean = CanUserEditContent();

    const showAdminButtons = () => setAdminButtonStatus(canEdit)

    const hideAdminButtons = () => setAdminButtonStatus(false);

    const askToDelete = () => setDeleteWindowStatus(true);

    const confirmDelete = () => DeleteContent(contentUnitPreview.contentID, "asset").then(() => window.location.reload());

    const imageStyle = {
        width: contentUnitPreviewStyle.width,
        height: contentUnitPreviewStyle.width,
        display: "grid",
        color: "black",
        borderBottom: "inherit",
        background: 'black'
    }

    const startPictureWidth = 187;
    let fontSizeMod = parseFloat(contentUnitPreviewStyle.width as string) / startPictureWidth;

    const titleFontSize = fontSizeMod + "rem";
    const subtitleFontSite = (fontSizeMod * 0.7) + "rem";

    let link = "/" + contentUnitPreview.contentID;
    return (
        <Grid style={contentUnitPreviewStyle}
              onMouseEnter={showAdminButtons}
              onMouseLeave={hideAdminButtons}>
            <Box component={Link} to={link} sx={textBoxLink}/>
            <Box style={imageStyle}>
                {showingAdminButtons ?
                    <Grid sx={adminButtonsGrid}>
                        {/*Create icon is transparent when Link is applied, using invisible box instead*/}
                        <Box sx={editBoxStyle}>
                            <Create sx={editButtonStyle}/>
                            <Box sx={editDummyBoxStyle} component={Link} to={"/edit/" + contentUnitPreview.contentID}/>
                        </Box>
                        <Delete sx={adminButtonsStyle} onClick={askToDelete}/>
                    </Grid> :
                    <Fragment/>}
                {deleteWindowOpen ?
                    <MessageBoxYesNo
                        message={"Delete " + contentUnitPreview.title + "?"}
                        onConfirm={confirmDelete}
                        onCancel={hideAdminButtons}
                        parentWidth={imageStyle.width as string}
                        parentHeight={imageStyle.width as string}/> :
                    <Fragment/>}
                {<img src={contentUnitPreview.titlepicLink}/>}
            </Box>
            <Grid style={gridStyle} fontSize={subtitleFontSite}>
                <Typography component="h6"
                            sx={previewTitleStyle}
                            fontSize={titleFontSize}>{contentUnitPreview.title}</Typography>
                <Typography variant="subtitle1"
                            color="#999999"
                            fontSize={subtitleFontSite}> {contentUnitPreview.categories}</Typography>
                <Typography sx={previewBodyStyle}
                            fontSize={subtitleFontSite}> {StripHTMLFromString(contentUnitPreview.body)}</Typography>
            </Grid>
        </Grid>
    )
        ;
}
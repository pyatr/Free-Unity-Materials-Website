import React, {Fragment, useEffect, useState} from "react";
import {Button, Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";

import ServerConnection from "../../utils/ServerConnection";
import {ContentItem} from "../../utils/ContentItem";
import {GoToHomePage} from "../../utils/GoToHomePage";

import ItemEditCategorySelection, {SetCategorySelection} from "./ItemEditCategorySelection";
import ItemStateInteractionButtons from "./ItemStateInteractionButtons";
import ItemEditPreviewSelection from "./ItemEditPreviewSelection";
import {AxiosResponse} from "axios/index";
import FileToBase64 from "../../utils/FileToBase64";
import {ErrorRounded} from "@mui/icons-material";
import AssetsPage from "../AssetsPage/AssetsPage";
import ArticlesPage from "../Articles/ArticlesPage";

export type ContentItemContainer = {
    itemContent: ContentItem,
    contentCategory: string
}

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

async function SendItemChangeRequest(itemContent: ContentItem, previewImage: string, requestName: string, callback: Function) {
    const params = {
        title: itemContent.TITLE,
        shortTitle: itemContent.SHORTTITLE,
        content: itemContent.CONTENT,
        categories: itemContent.CATEGORIES,
        number: itemContent.NUMBER,
        preview: previewImage
    };

    if (previewImage != "") {
        let scon = new ServerConnection();
        await scon.SendPostRequest(requestName, params, callback);
    }
}

export default function ItemEditPage({itemContent, contentCategory}: ContentItemContainer) {
    //Displaying category selection menu
    const [categorySelectionDisplayed, setCategorySelectionDisplay] = useState(false);
    //Content preview image as link to blob
    //Get image "http://" + window.location.host + ":8000/TitlePics/" + itemContent.NUMBER + ".png"
    const [previewImage, setPreviewImage] = useState("");
    //Preview image converted to Base64 string
    const [previewAsBase64, setPreview] = useState("");
    //Error notification message
    const [errorNotification, setErrorNotification] = useState("");

    const [currentItemState, setItemState] = useState<ContentItem>(
        {
            NUMBER: itemContent.NUMBER,
            TITLE: itemContent.TITLE,
            SHORTTITLE: itemContent.SHORTTITLE,
            CATEGORIES: itemContent.CATEGORIES,
            CREATION_DATE: itemContent.CREATION_DATE,
            CONTENT: itemContent.CONTENT
        }
    );

    const pageCategoryNames = new Map();

    pageCategoryNames.set("AssetsPage", "Assets");
    pageCategoryNames.set("ArticlesPage", "Articles");
    pageCategoryNames.set("ScriptsPage", "Scripts");
    
    const pageTitle = currentItemState.NUMBER == -1 ? pageCategoryNames.get(contentCategory) + ": Create new item" : "Edit " + itemContent.TITLE;

    const titleLimit = 128;
    const shortTitleLimit = 20;

    function loadImage(e: any) {
        let file = e.target.files[0];
        FileToBase64(file, (result: string) => {
            setPreview(result);
        });
        setPreviewImage(URL.createObjectURL(file));
    }

    const switchCatSelection = () => {
        setCategorySelectionDisplay(!categorySelectionDisplayed);
    }

    const setTitle = (event: any) => {
        setItemState({
            NUMBER: currentItemState.NUMBER,
            TITLE: event.target.value,
            SHORTTITLE: currentItemState.SHORTTITLE,
            CATEGORIES: currentItemState.CATEGORIES,
            CREATION_DATE: currentItemState.CREATION_DATE,
            CONTENT: currentItemState.CONTENT
        });
    }

    const setShortTitle = (event: any) => {
        setItemState({
            NUMBER: currentItemState.NUMBER,
            TITLE: currentItemState.TITLE,
            SHORTTITLE: event.target.value,
            CATEGORIES: currentItemState.CATEGORIES,
            CREATION_DATE: currentItemState.CREATION_DATE,
            CONTENT: currentItemState.CONTENT
        });
    }

    const setContent = (event: any) => {
        setItemState({
            NUMBER: currentItemState.NUMBER,
            TITLE: currentItemState.TITLE,
            SHORTTITLE: currentItemState.SHORTTITLE,
            CATEGORIES: currentItemState.CATEGORIES,
            CREATION_DATE: currentItemState.CREATION_DATE,
            CONTENT: event.target.value
        });
    }

    const submitContent = async () => {
        let error: string = "";
        if (currentItemState.TITLE == "") {
            error += "Title is not defined\n";
        }
        if (currentItemState.SHORTTITLE == "") {
            error += "Short title is not defined\n";
        }
        if (currentItemState.CONTENT == "") {
            error += "No content\n";
        }
        if (error != "") {
            setErrorNotification(error);
            return;
        }

        await SendItemChangeRequest(currentItemState, previewAsBase64, currentItemState.NUMBER == -1 ? "createContent" : "updateContent", (response: AxiosResponse) => {
            window.open("http://" + window.location.host + "/" + response.data.content.itemID, "_self");
        });
    }

    const submitDeletion = async () => {
        await SendItemChangeRequest(currentItemState, previewImage, "deleteContent", () => {
        });
    }

    const cancel = () => {
        GoToHomePage();
    }

    const setCategorySelection = (cat: string) => {
        let newCategorySelection = SetCategorySelection(cat, currentItemState.CATEGORIES);
        setItemState({
            NUMBER: currentItemState.NUMBER,
            TITLE: currentItemState.TITLE,
            SHORTTITLE: currentItemState.SHORTTITLE,
            CATEGORIES: newCategorySelection,
            CREATION_DATE: currentItemState.CREATION_DATE,
            CONTENT: currentItemState.CONTENT
        });
    }

    return (
        <Grid style={{display: "grid", gap: "32px"}}>
            {/*Content grid*/}
            <Grid style={{display: "grid", gap: "16px"}}>
                <Typography variant="h6">{pageTitle}</Typography>
                {errorNotification != "" ?
                    <Grid style={{
                        display: "flex",
                        gap: "16px",
                        color: "red",
                        border: "2px",
                        borderStyle: "solid",
                        borderRadius: "4px",
                        padding: "16px",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <Grid style={{display: "flex", gap: "16px"}}>
                            <ErrorRounded style={{height: "inherit"}}/>
                            <Typography textAlign="center">
                                <pre style={{textAlign: "left"}}>{errorNotification}</pre>
                            </Typography>
                        </Grid>
                        <Button onClick={() => setErrorNotification("")} style={{color: "red"}}>Dismiss</Button>
                    </Grid> :
                    <Fragment/>
                }
                <ItemEditPreviewSelection previewImage={previewImage} loadImageFunction={loadImage}/>
                <TextField onChange={setTitle}
                           label={"Title (" + titleLimit + " characters)"}
                           inputProps={{maxLength: titleLimit}}
                           defaultValue={currentItemState.TITLE}/>
                <TextField onChange={setShortTitle}
                           label={"Preview title (" + shortTitleLimit + " characters)"}
                           inputProps={{maxLength: shortTitleLimit}}
                           defaultValue={currentItemState.SHORTTITLE}/>
                <Grid
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "8px",
                        width: "fit-content",
                        height: "24px",
                        maxHeight: "24px"
                    }}>
                    {currentItemState.CATEGORIES === "" ?
                        <Typography variant="subtitle2" fontStyle="italic">Choose categories</Typography> :
                        <Typography variant="subtitle2">{currentItemState.CATEGORIES}</Typography>}
                    <Button
                        style={{
                            color: categorySelectionDisplayed ? "white" : "black",
                            background: categorySelectionDisplayed ? "black" : "white",
                            border: "1px solid",
                            borderRadius: "50px",
                            borderColor: "black",
                            minWidth: "24px",
                            minHeight: "24px",
                            height: "24px",
                            width: "24px"
                        }}
                        onClick={switchCatSelection}>+</Button>
                    {categorySelectionDisplayed ?
                        <ItemEditCategorySelection currentCategories={currentItemState.CATEGORIES.split(", ")}
                                                   onCategorySelected={setCategorySelection}/> :
                        <Fragment/>}
                </Grid>
                <TextField onChange={setContent}
                           label="Content"
                           multiline={true}
                           sx={itemContentDisplay}
                           defaultValue={currentItemState.CONTENT}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ItemStateInteractionButtons onSave={submitContent} onCancel={cancel} onDelete={submitDeletion}
                                         enableDelete={currentItemState.NUMBER != -1}/>
        </Grid>
    );
}
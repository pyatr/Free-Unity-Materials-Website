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

export type ContentItemContainer = {
    itemContent: ContentItem | null
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

    let scon = new ServerConnection();
    await scon.SendPostRequest(requestName, params, callback);
}

export default function ItemEditPage({itemContent: currentItem}: ContentItemContainer) {
    if (currentItem == null) {
        currentItem = {
            NUMBER: -1,
            TITLE: "No title",
            SHORTTITLE: "No short title",
            CATEGORIES: "",
            CREATION_DATE: "generated",
            CONTENT: ""
        };
    }

    const [categorySelectionDisplayed, setCategorySelectionDisplay] = useState(false);
    const [file, setFile] = useState("");
    const [currentItemCategories, changeCategorySet] = useState(currentItem.CATEGORIES);

    const titleLimit = 128;
    const shortTitleLimit = 20;

    const currentCategories = currentItemCategories.split(", ");

    function loadImage(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const switchCatSelection = () => {
        setCategorySelectionDisplay(!categorySelectionDisplayed);
    }

    const setTitle = (event: any) => {
        if (currentItem != null)
            currentItem.TITLE = event.target.value;
    }

    const setShortTitle = (event: any) => {
        if (currentItem != null)
            currentItem.SHORTTITLE = event.target.value;
    }

    const setContent = (event: any) => {
        if (currentItem != null)
            currentItem.CONTENT = event.target.value;
    }

    const submitContent = async () => {
        if (currentItem == null)
            return;
        await SendItemChangeRequest(currentItem, file, currentItem.NUMBER == -1 ? "createContent" : "updateContent", (response: AxiosResponse) => {
            window.open("http://" + window.location.host + "/" + response.data.content.itemID, "_self");
        });
    }

    const submitDeletion = async () => {
        if (currentItem == null)
            return;
        await SendItemChangeRequest(currentItem, file, "deleteContent", () => {
        });
    }

    const cancel = () => {
        GoToHomePage();
    }

    const setCategorySelection = (cat: string) => {
        let newCategorySelection = SetCategorySelection(cat, currentItemCategories);
        if (currentItem != null)
            currentItem.CATEGORIES = newCategorySelection;
        changeCategorySet(newCategorySelection);
    }

    return (
        <Grid style={{display: "grid", gap: "32px"}}>
            {/*Content grid*/}
            <Grid style={{display: "grid", gap: "16px"}}>
                <ItemEditPreviewSelection previewImage={file} loadImageFunction={loadImage}/>
                <TextField onChange={setTitle}
                           label={"Title (" + titleLimit + " characters)"}
                           inputProps={{maxLength: titleLimit}}
                           defaultValue={currentItem.TITLE}/>
                <TextField onChange={setShortTitle}
                           label={"Preview title (" + shortTitleLimit + " characters)"}
                           inputProps={{maxLength: shortTitleLimit}}
                           defaultValue={currentItem.SHORTTITLE}/>
                <Grid
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "8px",
                        width: "fit-content",
                        height: "24px",
                        maxHeight: "24px"
                    }}>
                    {currentItemCategories === "" ?
                        <Typography variant="subtitle2" fontStyle="italic">Choose categories</Typography> :
                        <Typography variant="subtitle2">{currentItemCategories}</Typography>}
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
                        <ItemEditCategorySelection currentCategories={currentCategories}
                                                   onCategorySelected={setCategorySelection}/> :
                        <Fragment/>}
                </Grid>
                <TextField onChange={setContent}
                           label="Content"
                           multiline={true}
                           sx={itemContentDisplay}
                           defaultValue={currentItem.CONTENT}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ItemStateInteractionButtons onSave={submitContent} onCancel={cancel} onDelete={submitDeletion}
                                         enableDelete={currentItem.NUMBER != -1}/>
        </Grid>
    );
}
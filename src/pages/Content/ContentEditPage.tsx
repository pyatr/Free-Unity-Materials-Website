import React, {Fragment, useEffect, useState} from "react";
import {Button, Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {ErrorRounded} from "@mui/icons-material";

import {ContentUnit, GetDummyContent} from "../../utils/Types/Content/ContentUnit";
import {ContentUnitContainer} from "../../utils/Types/Content/ContentUnitContainer";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";

import {GetContent} from "../../utils/GetContent";
import ServerConnection from "../../utils/ServerConnection";
import {GoToHomePage} from "../../utils/GoToHomePage";
import FileToBase64 from "../../utils/FileToBase64";

import ContentEditCategorySelection, {SetCategorySelection} from "./ContentEditCategorySelection";
import ContentStateInteractionButtons from "./ContentStateInteractionButtons";
import ContentEditPreviewSelection from "./ContentEditPreviewSelection";

import {AxiosResponse} from "axios/index";

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

async function SendContentChangeRequest(itemContent: ContentUnit, previewImage: string, requestName: string, callback: Function) {
    const params = {
        title: itemContent.title,
        content: itemContent.content,
        categories: itemContent.categories,
        number: itemContent.number,
        preview: previewImage
    };

    if (previewImage != "") {
        let serverConnection = new ServerConnection();
        await serverConnection.SendPostRequest(requestName, params, callback);
    }
}

export default function ContentEditPage({contentNumber, contentCategory}: ContentUnitRequestData) {
    const [itemContent, setItemContent] = useState(GetDummyContent());

    useEffect(() => {
        if (itemContent.number == -1 && contentNumber != -1) {
            GetContent(contentNumber, contentCategory).then((conItem: ContentUnit) => {
                setItemContent(conItem);
            });
        }
    });

    if (itemContent.number != -1 || contentNumber == -1) {
        return (<LoadedContentEditPage itemContent={itemContent} contentCategory={contentCategory}/>);
    } else {
        return (<Fragment/>);
    }
}

function LoadedContentEditPage({itemContent, contentCategory}: ContentUnitContainer) {
    //Displaying category selection menu
    const [categorySelectionDisplayed, setCategorySelectionDisplay] = useState(false);
    //Content preview image as link to blob
    const [previewImage, setPreviewImage] = useState("");
    //Preview image converted to Base64 string
    const [previewAsBase64, setPreview] = useState("");
    //Error notification message
    const [errorNotification, setErrorNotification] = useState("");

    const [currentItemState, setItemState] = useState<ContentUnit>(
        {
            number: itemContent.number,
            title: itemContent.title,
            categories: itemContent.categories,
            creationDate: itemContent.creationDate,
            content: itemContent.content
        }
    );

    const pageTitle = currentItemState.number == -1 ? "Create new " + contentCategory : "Edit " + itemContent.title;

    const titleLimit = 128;

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
            number: currentItemState.number,
            title: event.target.value,
            categories: currentItemState.categories,
            creationDate: currentItemState.creationDate,
            content: currentItemState.content
        });
    }

    const setContent = (event: any) => {
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: currentItemState.categories,
            creationDate: currentItemState.creationDate,
            content: event.target.value
        });
    }

    const submitContent = async () => {
        let error: string = "";
        if (currentItemState.title == "") {
            error += "Title is not defined\n";
        }
        if (currentItemState.content == "") {
            error += "No content\n";
        }
        if (error != "") {
            setErrorNotification(error);
            return;
        }

        await SendContentChangeRequest(currentItemState, previewAsBase64, currentItemState.number == -1 ? "createContent" : "updateContent", (response: AxiosResponse) => {
            window.open("http://" + window.location.host + "/" + response.data.content.itemID, "_self");
        });
    }

    const submitDeletion = async () => {
        await SendContentChangeRequest(currentItemState, previewImage, "deleteContent", () => {
        });
    }

    const cancel = () => {
        GoToHomePage();
    }

    const setCategorySelection = (cat: string) => {
        let newCategorySelection = SetCategorySelection(cat, currentItemState.categories);
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: newCategorySelection,
            creationDate: currentItemState.creationDate,
            content: currentItemState.content
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
                <ContentEditPreviewSelection previewImage={previewImage} loadImageFunction={loadImage}/>
                <TextField onChange={setTitle}
                           label={"Title (" + titleLimit + " characters)"}
                           inputProps={{maxLength: titleLimit}}
                           defaultValue={currentItemState.title}/>
                <Grid
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "8px",
                        width: "fit-content",
                        height: "24px",
                        maxHeight: "24px"
                    }}>
                    {currentItemState.categories === "" ?
                        <Typography variant="subtitle2" fontStyle="italic">Choose categories</Typography> :
                        <Typography variant="subtitle2">{currentItemState.categories}</Typography>}
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
                        <ContentEditCategorySelection currentCategories={currentItemState.categories.split(", ")}
                                                      onCategorySelected={setCategorySelection}/> :
                        <Fragment/>}
                </Grid>
                <TextField onChange={setContent}
                           label="Content"
                           multiline={true}
                           sx={itemContentDisplay}
                           defaultValue={currentItemState.content}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ContentStateInteractionButtons onSave={submitContent} onCancel={cancel} onDelete={submitDeletion}
                                            enableDelete={currentItemState.number != -1}/>
        </Grid>
    );
}
import React, {Fragment, useEffect, useState} from "react";
import {Button, Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {ErrorRounded} from "@mui/icons-material";

import {ContentUnit, GetDummyContent} from "../../utils/Types/Content/ContentUnit";
import {ContentUnitContainer} from "../../utils/Types/Content/ContentUnitContainer";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";

import {GetContent} from "../../utils/ContentLoading/GetContent";
import ServerConnection from "../../utils/ServerConnection";
import {GoToHomePage} from "../../utils/GoToHomePage";
import FileToBase64 from "../../utils/Files/FileToBase64";

import ContentEditCategorySelection, {SetCategorySelection} from "./ContentEditCategorySelection";
import ContentStateInteractionButtons from "./ContentStateInteractionButtons";
import ContentEditLoadImages from "./ContentEditLoadImages";

import {AxiosResponse} from "axios/index";
import ErrorNotification from "../../components/ErrorNotification";
import ImageGallery from "../../components/ImageGallery";

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

async function SendContentChangeRequest(itemContent: ContentUnit, imageGallery: string[], requestName: string, callback: Function) {
    const params = {
        title: itemContent.title,
        content: itemContent.content,
        categories: itemContent.categories,
        number: itemContent.number,
        preview: imageGallery
    };

    let serverConnection = new ServerConnection();
    await serverConnection.SendPostRequestPromise(requestName, params).then(() => {
        callback();
    });
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
    const [galleryImages, setGalleryImages] = useState(Array<string>);
    //Preview image converted to Base64 string
    const [galleryImagesBase64, setGalleryImagesBase64] = useState(Array<string>);
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
    const maxFileSize = 20;

    function loadImage(e: any) {
        let files: FileList = e.target.files as FileList;
        e.target.value = null;
        if (files.length > maxFileSize) {
            setErrorNotification("Too many images! Max: " + maxFileSize);
            return;
        }

        let filesBase64: string[] = [];
        let blobs: string[] = [];
        //FileList has no foreach
        for (let i = 0; i < files.length; i++) {
            FileToBase64(files[i], (result: string) => {
                filesBase64.push(result);
            });
            blobs.push(URL.createObjectURL(files[i]));
        }
        setGalleryImagesBase64(galleryImagesBase64.concat(filesBase64));
        setGalleryImages(galleryImages.concat(blobs));
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

        await SendContentChangeRequest(currentItemState, [], currentItemState.number == -1 ? "createContent" : "updateContent", (response: AxiosResponse) => {
            window.open("http://" + window.location.host + "/" + response.data.content.itemID, "_self");
        });
    }

    const submitDeletion = async () => {
        await SendContentChangeRequest(currentItemState, [], "deleteContent", () => {
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
                <ErrorNotification message={errorNotification} onDismiss={() => {
                    setErrorNotification("")
                }}/>
                <ImageGallery imageLinks={galleryImages}/>
                <ContentEditLoadImages loadImageFunction={loadImage}/>
                <TextField onChange={setTitle}
                           label={"Title (" + titleLimit + " characters)"}
                           inputProps={{maxLength: titleLimit}}
                           defaultValue={currentItemState.title}/>
                <Grid style={{
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
                    <Button style={{
                        color: categorySelectionDisplayed ? "white" : "black",
                        background: categorySelectionDisplayed ? "black" : "white",
                        border: "1px solid",
                        borderRadius: "50px",
                        borderColor: "black",
                        minWidth: "24px",
                        minHeight: "24px",
                        height: "24px",
                        width: "24px"
                    }} onClick={switchCatSelection}>+</Button>
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
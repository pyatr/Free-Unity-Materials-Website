import React, {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";

import {AxiosResponse} from "axios/index";

import ContentFormInteractionButtons from "../../pages/ContentEdit/ContentFormInteractionButtons";
import {SetCategorySelection} from "../../pages/ContentEdit/ContentCategorySelectionMenu";
import FileSelection from "./FileSelection";

import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import {ContentUnit, GetDummyContentUnit} from "../../utils/Types/Content/ContentUnit";
import {FileNameBlobPair, GetBlobsFromPairs, GetFileNamesFromPairs} from "../../utils/Types/FileNameBlobPair";

import {GetContentUnit} from "../../utils/ContentInteraction/GetContentUnit";

import {MultipleFilesToBase64} from "../../utils/Files/MultipleFilesToBase64";

import ServerConnection from "../../utils/ServerConnection";
import {GoToHomePage} from "../../utils/GoToHomePage";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";

import {ImageInEditFormGallery} from "../../components/ImageGallery/ImageInEditFormGallery";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import EditFileList from "../../components/DownloadLinks/EditFileList";
import ErrorNotification from "../../components/ErrorNotification";
import {ContentCategorySelection} from "../../pages/ContentEdit/ContentCategorySelection";

const bodyStyle = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

export default function ContentUnitEditForm({requestedContentID, requestedContentCategory}: ContentUnitRequestData) {
    const [errorMessage, setErrorMessage] = useState("");
    const [newFiles, setNewFiles] = useState(Array<FileNameBlobPair>);
    const [filesToDelete, setFileDeletionState] = useState(Array<string>);
    const [contentUnitState, setContentUnitState] = useState<ContentUnit>(GetDummyContentUnit());

    const loadContentIfEmpty = () => {
        //Request content if it's not loaded and given contentNumber is a real post number
        if (contentUnitState.contentID == -1 && requestedContentID != -1) {
            GetContentUnit(requestedContentID, requestedContentCategory).then((downloadedContentUnit: ContentUnit) => setContentUnitState(downloadedContentUnit));
        }
    }

    useEffect(() => loadContentIfEmpty());

    if (contentUnitState.contentID == -1 && requestedContentID != -1) {
        return (<Fragment/>);
    }

    const pageTitle = contentUnitState.contentID == -1 ? "Create new " + requestedContentCategory : "Edit " + contentUnitState.title;

    const titleLimit = 128;
    const maxImageCount = 20;
    const maxFileCount = 50;
    //TODO: add max filesize. file.size / 1000 is size in kilobytes

    const uploadImages = async (e: any) => {
        let files: FileList = e.target.files as FileList;
        if (contentUnitState.galleryImageLinks.length + files.length > maxImageCount) {
            e.target.value = null;
            setErrorMessage("Too many images! Max: " + maxImageCount);
            return;
        }
        let blobs: string[] = [];
        //FileList has no foreach
        for (let i = 0; i < files.length; i++) {
            blobs.push(URL.createObjectURL(files[i]));
        }
        //On some browsers it can delete uploaded files even if they were stored somewhere else
        e.target.value = null;
        setGalleryImageLinks(contentUnitState.galleryImageLinks.concat(blobs));
    }

    const uploadFiles = async (e: any) => {
        let files: FileList = e.target.files as FileList;
        if (contentUnitState.fileLinks.length + files.length > maxFileCount) {
            e.target.value = null;
            setErrorMessage("Too many files! Max: " + maxFileCount);
            return;
        }

        let blobs: FileNameBlobPair[] = [];
        for (let i = 0; i < files.length; i++) {
            blobs.push({
                fileName: files[i].name,
                blobLink: URL.createObjectURL(files[i])
            });
        }
        e.target.value = null;
        setNewFiles(newFiles.concat(blobs));
    }

    const changeContentUnitProperty = (propertyName: string, propertyValue: string | string[] | number) => {
        let newContentUnit: any = {
            contentID: contentUnitState.contentID,
            title: contentUnitState.title,
            categories: contentUnitState.categories,
            creationDate: contentUnitState.creationDate,
            body: contentUnitState.body,
            galleryImageLinks: contentUnitState.galleryImageLinks,
            fileLinks: contentUnitState.fileLinks
        }
        newContentUnit[propertyName] = propertyValue;
        setContentUnitState(newContentUnit);
    }

    const setTitle = (event: any) => {
        changeContentUnitProperty("title", event.target.value);
    }

    const setBody = (event: any) => {
        changeContentUnitProperty("body", event.target.value);
    }

    const setCategorySelection = (categoryToAddOrDelete: string) => {
        let newCategorySelection = SetCategorySelection(categoryToAddOrDelete, contentUnitState.categories);
        changeContentUnitProperty("categories", newCategorySelection);
    }

    const setGalleryImageLinks = (newGalleryImageLinks: string[]) => {
        changeContentUnitProperty("galleryImageLinks", newGalleryImageLinks);
    }

    const submitContent = async () => {
        let errorMessage: string = "";
        if (contentUnitState.title == "") {
            errorMessage += "Title is not defined\n";
        }
        if (contentUnitState.body == "") {
            errorMessage += "No content\n";
        }
        //Only assets need images
        if (contentUnitState.galleryImageLinks.length == 0 && requestedContentCategory == "asset") {
            errorMessage += "Need at least one image in gallery\n";
        }

        if (errorMessage != "") {
            setErrorMessage(errorMessage);
            return;
        }

        const galleryImagesBase64: string[] = await MultipleFilesToBase64(contentUnitState.galleryImageLinks.reverse());
        const fileNames: string[] = GetFileNamesFromPairs(newFiles);
        const filesBase64: string[] = await MultipleFilesToBase64(GetBlobsFromPairs(newFiles));
        let filesArray = [];
        for (let i = 0; i < fileNames.length; i++) {
            filesArray.push({fileName: fileNames[i], fileContent: filesBase64[i]});
        }
        let filesToDeleteNumbers: string[] = [];
        filesToDelete.forEach((fileLink: string) => {
            let splitLink = fileLink.split('/');
            filesToDeleteNumbers.push(splitLink[splitLink.length - 2]);
        });

        const requestProperties = {
            title: contentUnitState.title,
            content: contentUnitState.body,
            categories: contentUnitState.categories,
            number: contentUnitState.contentID,
            category: requestedContentCategory,
            gallery: galleryImagesBase64,
            files: filesArray,
            deleteFiles: filesToDeleteNumbers
        };

        let serverConnection = new ServerConnection();
        await serverConnection.SendPostRequestPromise(contentUnitState.contentID == -1 ? "createContent" : "updateContent", requestProperties).then((response: AxiosResponse) => {
            //TODO: open for all categories
            const currentContentUnitID = contentUnitState.contentID == -1 ? response.data.body.itemID : contentUnitState.contentID;
            window.open("http://" + window.location.host + "/" + currentContentUnitID, "_self");
        });
    }

    const resolveFileDeletionState = (fileLink: string) => {
        if (filesToDelete.includes(fileLink)) {
            setFileDeletionState(filesToDelete.filter(link => link != fileLink))
        } else {
            const isNewFile = fileLink.startsWith("blob:");
            if (isNewFile) {
                setNewFiles(newFiles.filter(newFile => newFile.blobLink != fileLink))
            } else {
                setFileDeletionState(filesToDelete.concat(fileLink));
            }
        }
    }

    const images = contentUnitState.galleryImageLinks.map((currentLink: string) =>
        <ImageInEditFormGallery
            imageLink={currentLink}
            onDeleteClick={() => setGalleryImageLinks(contentUnitState.galleryImageLinks.filter(link => link != currentLink))}/>);

    return (
        <Grid style={{display: "grid", gap: "32px"}}>
            {/*Content grid*/}
            <Grid style={{display: "grid"}}>
                <Typography variant="h6">{pageTitle}</Typography>
                <ErrorNotification message={errorMessage} onDismiss={() => setErrorMessage("")}/>
                <ImageGallery images={images}/>
                <FileSelection title={"Add images to gallery"}
                               inputType={"file"}
                               multiple={true}
                               loadImageFunction={uploadImages}/>
                <EditFileList links={contentUnitState.fileLinks}
                              newFiles={newFiles}
                              onDeletionMarked={resolveFileDeletionState}/>
                <FileSelection title={"Attach files"}
                               inputType={"file"}
                               multiple={true}
                               loadImageFunction={uploadFiles}/>
                <TextField onChange={setTitle}
                           label={"Title (" + titleLimit + " characters)"}
                           inputProps={{maxLength: titleLimit}}
                           defaultValue={contentUnitState.title}
                           style={{marginTop: "16px", marginBottom: "16px"}}/>
                <ContentCategorySelection contentUnitCategories={contentUnitState.categories}
                                          onCategorySelected={setCategorySelection}/>
                <TextField onChange={setBody}
                           label="Content"
                           multiline={true}
                           sx={bodyStyle}
                           defaultValue={contentUnitState.body}
                           style={{marginTop: "16px", marginBottom: "16px"}}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ContentFormInteractionButtons
                onSave={submitContent}
                onCancel={() => GoToHomePage()}
                onDelete={() => DeleteContent(contentUnitState.contentID, requestedContentCategory).then(() => GoToHomePage())}
                enableDelete={contentUnitState.contentID != -1}/>
        </Grid>
    );
}
import React, {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";

import {AxiosResponse} from "axios/index";

import ContentEditFormInteractionButtons from "./ContentEditFormInteractionButtons";

import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import {ContentUnit, GetDummyContentUnit} from "../../utils/Types/Content/ContentUnit";
import {FileNameBlobPair, GetBlobsFromPairs, GetFileNamesFromPairs} from "../../utils/Types/FileNameBlobPair";

import {GetContentUnit} from "../../utils/ContentInteraction/GetContentUnit";

import {MultipleFilesToBase64} from "../../utils/Files/MultipleFilesToBase64";

import ServerConnection from "../../utils/ServerConnection";
import {GoToHomePage} from "../../utils/GoToHomePage";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";

import ErrorNotification from "../../components/ErrorNotification";
import {ContentUnitEditCategory} from "./ContentUnitEditCategory";
import MessageBoxYesNo from "../../components/MessageBoxes/MessageBoxYesNo";
import {ContentUnitEditImages} from "./ContentUnitEditImages";
import ContentUnitEditFiles from "./ContentUnitEditFiles";
import {ContentUnitEditTitle} from "./ContentUnitEditTitle";
import {ContentUnitEditBody} from "./ContentUnitEditBody";
import {useParams} from "react-router-dom";
import {LoadingOverlay} from "../../components/LoadingOverlay";

export type ContentUnitEditCommonProps = {
    setContentUnitProperty: Function,
    setErrorMessage: Function,
    contentUnitState: ContentUnit
}

export default function ContentUnitEditForm({requestedContentID, requestedContentCategory}: ContentUnitRequestData) {
    const [errorMessage, setErrorMessage] = useState("");
    const [newFileLinks, setNewFileLinks] = useState<FileNameBlobPair[]>([]);
    const [linksToFilesMarkedForDeletion, setFileDeletionState] = useState<string[]>([]);
    const [contentUnitState, setContentUnitState] = useState<ContentUnit>(GetDummyContentUnit());
    const [deleteWindowOpen, setDeleteWindowStatus] = useState(false);
    const [isLoading, setLoadingStatus] = useState(false);

    let {currentContentID} = useParams();
    const contentIDNumber = parseInt(currentContentID as string);

    const loadContentIfEmpty = () => {
        //Request content if it's not loaded and given contentNumber is a real post number
        if (contentUnitState.contentID == -1 && contentIDNumber != -1) {
            GetContentUnit(contentIDNumber, requestedContentCategory).then((downloadedContentUnit: ContentUnit) => {
                setContentUnitState(downloadedContentUnit);
            });
        }
    }

    useEffect(() => loadContentIfEmpty());

    if ((contentUnitState.contentID == -1 && contentIDNumber != -1) || isLoading) {
        return (<LoadingOverlay position={"inherit"}/>);
    }

    const editFormTitle = contentUnitState.contentID == -1 ? "Create new " + requestedContentCategory : "Edit " + contentUnitState.title;

    const setContentUnitProperty = (propertyName: string, propertyValue: string | string[] | number) => {
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

    const openDeleteWindow = () => setDeleteWindowStatus(true)

    const closeDeleteWindow = () => setDeleteWindowStatus(false)

    const confirmDelete = () => DeleteContent(contentUnitState.contentID, requestedContentCategory).then(() => GoToHomePage());

    const checkContentValidity = () => {
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
            return false;
        }
        return true;
    }

    const submitContent = async () => {
        if (!checkContentValidity())
            return;

        const galleryImagesBase64: string[] = await MultipleFilesToBase64(contentUnitState.galleryImageLinks.reverse());
        const fileNames: string[] = GetFileNamesFromPairs(newFileLinks);
        const filesBase64: string[] = await MultipleFilesToBase64(GetBlobsFromPairs(newFileLinks));
        let filesArray = [];
        for (let i = 0; i < fileNames.length; i++) {
            filesArray.push({fileName: fileNames[i], fileContent: filesBase64[i]});
        }
        let filesToDeleteNumbers: string[] = [];
        linksToFilesMarkedForDeletion.forEach((fileLink: string) => {
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
        setLoadingStatus(true);
        await serverConnection.SendPostRequestPromise(contentUnitState.contentID == -1 ? "createContent" : "updateContent", requestProperties).then((response: AxiosResponse) => {
            setLoadingStatus(false);
            //TODO: open for all categories
            const currentContentUnitID = contentUnitState.contentID == -1 ? response.data.body.itemID : contentUnitState.contentID;
            window.open("http://" + window.location.host + "/view/" + currentContentUnitID, "_self");
        });
    }

    return (
        <Grid style={{display: "grid", gap: "32px"}}>
            {/*Content grid*/}
            <Grid style={{display: "grid"}}>
                {deleteWindowOpen ?
                    <MessageBoxYesNo
                        message={"Delete " + contentUnitState.title + "?"}
                        onConfirm={confirmDelete}
                        onCancel={closeDeleteWindow}
                        parentWidth={"512px"}
                        parentHeight={"512px"}/> :
                    <Fragment/>}
                <Typography variant="h6">{editFormTitle}</Typography>
                <ErrorNotification message={errorMessage} onDismiss={() => setErrorMessage("")}/>
                <ContentUnitEditImages setContentUnitProperty={setContentUnitProperty}
                                       setErrorMessage={setErrorMessage}
                                       contentUnitState={contentUnitState}/>

                <ContentUnitEditFiles setContentUnitProperty={setContentUnitProperty}
                                      setErrorMessage={setErrorMessage}
                                      contentUnitState={contentUnitState}
                                      newFileLinks={newFileLinks}
                                      linksToFilesMarkedForDeletion={linksToFilesMarkedForDeletion}
                                      setNewFileLinks={setNewFileLinks}
                                      setFileDeletionState={setFileDeletionState}/>

                <ContentUnitEditTitle setContentUnitProperty={setContentUnitProperty}
                                      setErrorMessage={setErrorMessage}
                                      contentUnitState={contentUnitState}/>

                <ContentUnitEditCategory setContentUnitProperty={setContentUnitProperty}
                                         setErrorMessage={setErrorMessage}
                                         contentUnitState={contentUnitState}/>

                <ContentUnitEditBody setContentUnitProperty={setContentUnitProperty}
                                     setErrorMessage={setErrorMessage}
                                     contentUnitState={contentUnitState}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ContentEditFormInteractionButtons
                onSave={submitContent}
                onCancel={() => GoToHomePage()}
                onDelete={() => openDeleteWindow()}
                enableDelete={contentUnitState.contentID != -1}/>
        </Grid>
    );
}
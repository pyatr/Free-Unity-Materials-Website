import React, {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {AddCircle, AddCircleOutline} from "@mui/icons-material";

import {ContentUnit, GetDummyContent} from "../../utils/Types/Content/ContentUnit";
import {ContentUnitContainer} from "../../utils/Types/Content/ContentUnitContainer";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";

import ServerConnection from "../../utils/ServerConnection";
import {GoToHomePage} from "../../utils/GoToHomePage";
import FileToBase64 from "../../utils/Files/FileToBase64";

import ContentEditCategorySelection, {SetCategorySelection} from "./ContentEditCategorySelection";
import ContentStateInteractionButtons from "./ContentStateInteractionButtons";
import FileSelection from "./FileSelection";

import {AxiosResponse} from "axios/index";
import ErrorNotification from "../../components/ErrorNotification";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import {GetContent} from "../../utils/ContentInteraction/GetContent";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";
import {ImageInEditGallery} from "../../components/ImageGallery/ImageInEditGallery";
import DownloadLinksList from "../../components/DownloadLinks/DownloadLinksList";
import DownloadLinksEditList from "../../components/DownloadLinks/DownloadLinksEditList";
import {FileNameBlobPair, GetBlobsFromPairs, GetFileNamesFromPairs} from "../../utils/Types/FileNameBlobPair";

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

const categoryButtonStyle = {
    cursor: 'pointer',
    minWidth: "24px",
    minHeight: "24px",
    height: "24px",
    width: "24px"
}

const categorySelectionHorizontalGrid = {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    width: "fit-content",
    height: "24px",
    maxHeight: "24px"
}
export default function ContentEditPage({contentNumber, contentCategory}: ContentUnitRequestData) {
    const [itemContent, setItemContent] = useState(GetDummyContent());
    useEffect(() => {
            //Request content if it's not loaded and given contentNumber is a real post number
            if (itemContent.number == -1 && contentNumber != -1) {
                GetContent(contentNumber, contentCategory).then((conItem: ContentUnit) => setItemContent(conItem));
            }
        }
    );
    //Go to editing if loaded real page or if received a non-existing contentNumber
    if (itemContent.number != -1 || contentNumber == -1) {
        return (<LoadedContentEditPage itemContent={itemContent} contentCategory={contentCategory}/>);
    } else {
        return (<Fragment/>);
    }
}

const forbiddenSymbols = ["'"];

function LoadedContentEditPage({itemContent, contentCategory}: ContentUnitContainer) {
    //Displaying category selection menu
    const [categorySelectionDisplayed, setCategorySelectionDisplay] = useState(false);
    //Error notification message
    const [errorNotification, setErrorNotification] = useState("");

    const [newFiles, setNewFiles] = useState(Array<FileNameBlobPair>);
    const [filesToDelete, setFileDeletionState] = useState(Array<string>);

    const [currentItemState, setItemState] = useState<ContentUnit>(itemContent);

    const pageTitle = currentItemState.number == -1 ? "Create new " + contentCategory : "Edit " + itemContent.title;

    const titleLimit = 128;
    const maxImageCount = 20;
    const maxFileCount = 50;
    //TODO: add max filesize. file.size / 1000 is size in kilobytes

    const uploadImages = async (e: any) => {
        let files: FileList = e.target.files as FileList;
        e.target.value = null;
        if (currentItemState.gallery.length + files.length > maxImageCount) {
            setErrorNotification("Too many images! Max: " + maxImageCount);
            return;
        }

        let blobs: string[] = [];
        //FileList has no foreach
        for (let i = 0; i < files.length; i++) {
            blobs.push(URL.createObjectURL(files[i]));
        }
        setGallerySelection(currentItemState.gallery.concat(blobs));
    }

    const uploadFiles = async (e: any) => {
        let files: FileList = e.target.files as FileList;
        e.target.value = null;
        if (currentItemState.fileLinks.length + files.length > maxFileCount) {
            setErrorNotification("Too many files! Max: " + maxFileCount);
            return;
        }

        let blobs: FileNameBlobPair[] = [];
        for (let i = 0; i < files.length; i++) {
            blobs.push({
                fileName: files[i].name,
                blobLink: URL.createObjectURL(files[i])
            });
        }
        setNewFiles(newFiles.concat(blobs));
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
            content: currentItemState.content,
            gallery: currentItemState.gallery,
            fileLinks: currentItemState.fileLinks
        });
    }

    const setContent = (event: any) => {
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: currentItemState.categories,
            creationDate: currentItemState.creationDate,
            content: event.target.value,
            gallery: currentItemState.gallery,
            fileLinks: currentItemState.fileLinks
        });
    }

    const setCategorySelection = (category: string) => {
        let newCategorySelection = SetCategorySelection(category, currentItemState.categories);
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: newCategorySelection,
            creationDate: currentItemState.creationDate,
            content: currentItemState.content,
            gallery: currentItemState.gallery,
            fileLinks: currentItemState.fileLinks
        });
    }

    const setGallerySelection = (galleryImages: string[]) => {
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: currentItemState.categories,
            creationDate: currentItemState.creationDate,
            content: currentItemState.content,
            gallery: galleryImages,
            fileLinks: currentItemState.fileLinks
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
        if (currentItemState.gallery.length == 0) {
            error += "Need at least one image in gallery\n";
        }
        forbiddenSymbols.forEach((symbol: string) => {
            let count;
            let index;
            for (count = -1, index = -2; index != -1; count++, index = currentItemState.content.indexOf(symbol, index + 1)) ;
            if (count > 0) {
                error += "Forbidden symbol [" + symbol + "] found " + count + " times\n";
            }
        });

        if (error != "") {
            setErrorNotification(error);
            return;
        }

        const filesToBase64 = async (links: string[]): Promise<string[]> => {
            let base64Files: string[] = [];

            const imageToBase64 = async () => {
                if (links.length > 0)
                    await fetch(links.pop() as string).then((image: Response) =>
                        image.blob().then((dataBlob: Blob) =>
                            FileToBase64(dataBlob).then((blob64) =>
                                base64Files = base64Files.concat(blob64)))).then(() => imageToBase64());
            }
            await imageToBase64();

            return base64Files;
        }
        const galleryImagesBase64: string[] = await filesToBase64(currentItemState.gallery.reverse());
        const filesBase64: string[] = await filesToBase64(GetBlobsFromPairs(newFiles));

        const params = {
            title: currentItemState.title,
            content: currentItemState.content,
            categories: currentItemState.categories,
            number: currentItemState.number,
            category: contentCategory,
            gallery: galleryImagesBase64,
            files: filesBase64
        };

        let serverConnection = new ServerConnection();
        await serverConnection.SendPostRequestPromise(currentItemState.number == -1 ? "createContent" : "updateContent", params).then((response: AxiosResponse) => {
            //TODO: open for all categories
            const itemNumber = itemContent.number == -1 ? response.data.content.itemID : itemContent.number;
            window.open("http://" + window.location.host + "/" + itemNumber, "_self");
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

    const submitDeletion = async () => {
        DeleteContent(itemContent.number, contentCategory).then(() => {
            GoToHomePage();
        });
    }

    const cancel = () => {
        GoToHomePage();
    }

    const images = currentItemState.gallery.map((currentLink: string) => {
        return <ImageInEditGallery imageLink={currentLink} onDeleteClick={() => {
            setGallerySelection(currentItemState.gallery.filter(link => link != currentLink));
        }}/>;
    });
    const newFileNames = GetFileNamesFromPairs(newFiles);

    return (
        <Grid style={{display: "grid", gap: "32px"}}>
            {/*Content grid*/}
            <Grid style={{display: "grid"}}>
                <Typography variant="h6">{pageTitle}</Typography>
                <ErrorNotification message={errorNotification} onDismiss={() => {
                    setErrorNotification("")
                }}/>
                <ImageGallery images={images}/>
                <FileSelection title={"Add images to gallery"}
                               inputType={"file"}
                               multiple={true}
                               loadImageFunction={uploadImages}/>
                <DownloadLinksEditList links={currentItemState.fileLinks.concat(newFileNames)}
                                       newFiles={newFileNames}
                                       onDeletionMarked={resolveFileDeletionState}/>
                <FileSelection title={"Attach files"}
                               inputType={"file"}
                               multiple={true}
                               loadImageFunction={uploadFiles}/>
                <TextField onChange={setTitle}
                           label={"Title (" + titleLimit + " characters)"}
                           inputProps={{maxLength: titleLimit}}
                           defaultValue={currentItemState.title}
                           style={{marginTop: "16px", marginBottom: "16px"}}/>
                <Grid style={categorySelectionHorizontalGrid}>
                    {currentItemState.categories === "" ?
                        <Typography variant="subtitle2" fontStyle="italic">Choose categories</Typography> :
                        <Typography variant="subtitle2">{currentItemState.categories}</Typography>}
                    {categorySelectionDisplayed ?
                        <Fragment>
                            <AddCircle style={categoryButtonStyle} onClick={switchCatSelection}/>
                            <ContentEditCategorySelection
                                currentCategories={currentItemState.categories.split(", ")}
                                onCategorySelected={setCategorySelection}/>
                        </Fragment> :
                        <AddCircleOutline style={categoryButtonStyle} onClick={switchCatSelection}/>}
                </Grid>
                <TextField onChange={setContent}
                           label="Content"
                           multiline={true}
                           sx={itemContentDisplay}
                           defaultValue={currentItemState.content}
                           style={{marginTop: "16px", marginBottom: "16px"}}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ContentStateInteractionButtons onSave={submitContent} onCancel={cancel} onDelete={submitDeletion}
                                            enableDelete={currentItemState.number != -1}/>
        </Grid>
    );
}
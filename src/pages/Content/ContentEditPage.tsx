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
import ContentEditLoadImages from "./ContentEditLoadImages";

import {AxiosResponse} from "axios/index";
import ErrorNotification from "../../components/ErrorNotification";
import ImageGallery from "../../components/ImageGallery";
import {GetContent} from "../../utils/ContentInteraction/GetContent";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";
import {ImageInEditGallery} from "../../components/ImageInEditGallery";

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

export default function ContentEditPage({contentNumber, contentCategory}: ContentUnitRequestData) {
    const [itemContent, setItemContent] = useState(GetDummyContent());
    useEffect(() => {
            //Request content if it's not loaded and given contentNumber is a real post number
            if (itemContent.number == -1 && contentNumber != -1) {
                GetContent(contentNumber, contentCategory).then((conItem) => {
                        const fullLinks: string[] = conItem.GALLERY[0] != 'none' ? conItem.GALLERY.map((link: string) => "http://" + window.location.host + ":8000/" + link) : [];
                        setItemContent({
                            number: conItem.NUMBER,
                            title: conItem.TITLE,
                            categories: conItem.CATEGORIES,
                            creationDate: conItem.CREATION_DATE,
                            content: conItem.CONTENT,
                            gallery: fullLinks
                        });
                    }
                );
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

    const [currentItemState, setItemState] = useState<ContentUnit>(itemContent);

    const pageTitle = currentItemState.number == -1 ? "Create new " + contentCategory : "Edit " + itemContent.title;

    const titleLimit = 128;
    const maxFileSize = 20;

    const loadImage = async (e: any) => {
        let files: FileList = e.target.files as FileList;
        e.target.value = null;
        if (currentItemState.gallery.length + files.length > maxFileSize) {
            setErrorNotification("Too many images! Max: " + maxFileSize);
            return;
        }

        let blobs: string[] = [];
        //FileList has no foreach
        for (let i = 0; i < files.length; i++) {
            blobs.push(URL.createObjectURL(files[i]));
        }
        setGallerySelection(currentItemState.gallery.concat(blobs));
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
            gallery: currentItemState.gallery
        });
    }

    const setContent = (event: any) => {
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: currentItemState.categories,
            creationDate: currentItemState.creationDate,
            content: event.target.value,
            gallery: currentItemState.gallery
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
            gallery: currentItemState.gallery
        });
    }

    const setGallerySelection = (galleryImages: string[]) => {
        setItemState({
            number: currentItemState.number,
            title: currentItemState.title,
            categories: currentItemState.categories,
            creationDate: currentItemState.creationDate,
            content: currentItemState.content,
            gallery: galleryImages
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
            error += "Forbidden symbol [" + symbol + "] found " + count + " times\n";
        });

        if (error != "") {
            setErrorNotification(error);
            return;
        }

        const galleryToBase64 = async (): Promise<string[]> => {
            let links = currentItemState.gallery.reverse();

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
        const galleryImagesBase64: string[] = await galleryToBase64();

        const params = {
            title: currentItemState.title,
            content: currentItemState.content,
            categories: currentItemState.categories,
            number: currentItemState.number,
            category: contentCategory,
            gallery: galleryImagesBase64
        };

        let serverConnection = new ServerConnection();
        await serverConnection.SendPostRequestPromise(currentItemState.number == -1 ? "createContent" : "updateContent", params).then((response: AxiosResponse) => {
            //TODO: open for all categories
            const itemNumber = itemContent.number == -1 ? response.data.content.itemID : itemContent.number;
            window.open("http://" + window.location.host + "/" + itemNumber, "_self");
        });
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
        return <ImageInEditGallery imageLink={currentLink} onClick={() => {
            setGallerySelection(currentItemState.gallery.filter(link => link != currentLink));
        }}/>;
    });

    return (
        <Grid style={{display: "grid", gap: "32px"}}>
            {/*Content grid*/}
            <Grid style={{display: "grid", gap: "16px"}}>
                <Typography variant="h6">{pageTitle}</Typography>
                <ErrorNotification message={errorNotification} onDismiss={() => {
                    setErrorNotification("")
                }}/>
                <ImageGallery images={images}/>
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
                           defaultValue={currentItemState.content}/>
            </Grid>
            {/*Bottom buttons grid*/}
            <ContentStateInteractionButtons onSave={submitContent} onCancel={cancel} onDelete={submitDeletion}
                                            enableDelete={currentItemState.number != -1}/>
        </Grid>
    );
}
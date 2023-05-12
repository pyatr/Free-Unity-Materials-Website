import {ImageInEditFormGallery} from "../../components/ImageGallery/ImageInEditFormGallery";
import React, {Fragment} from "react";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import FileSelection from "./FileSelection";
import {ContentUnitEditCommonProps} from "./ContentUnitEditForm";


export function ContentUnitEditImages({
                                   setContentUnitProperty,
                                   setErrorMessage,
                                   contentUnitState
                               }: ContentUnitEditCommonProps) {
    const maxImageCount = 20;

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

    const setGalleryImageLinks = (newGalleryImageLinks: string[]) => {
        setContentUnitProperty("galleryImageLinks", newGalleryImageLinks);
    }

    const mapImage = (currentLink: string, onClick: Function) =>
        (<ImageInEditFormGallery
            imageLink={currentLink}
            onClick={onClick}
            onDeleteClick={() => setGalleryImageLinks(contentUnitState.galleryImageLinks.filter(link => link != currentLink))}/>);

    return (
        <Fragment>
            <ImageGallery imageLinks={contentUnitState.galleryImageLinks} imageMapper={mapImage}/>
            <FileSelection title={"Add images to gallery"}
                           inputType={"file"}
                           multiple={true}
                           loadImageFunction={uploadImages}/>
        </Fragment>);
}
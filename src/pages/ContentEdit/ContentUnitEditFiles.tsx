import React, {Fragment} from "react";
import EditFileList from "../../components/DownloadLinks/EditFileList";
import FileSelection from "./FileSelection";
import {FileNameBlobPair} from "../../utils/Types/FileNameBlobPair";
import {ContentUnit} from "../../utils/Types/Content/ContentUnit";

type ContentUnitEditFilesProps = {
    setContentUnitProperty: Function,
    setErrorMessage: Function,
    contentUnitState: ContentUnit,
    newFileLinks: Array<FileNameBlobPair>,
    linksToFilesMarkedForDeletion: string[],
    setNewFileLinks: Function,
    setFileDeletionState: Function
}

export default function ContentUnitEditFiles({
                                                 setErrorMessage,
                                                 contentUnitState,
                                                 newFileLinks,
                                                 linksToFilesMarkedForDeletion,
                                                 setNewFileLinks,
                                                 setFileDeletionState
                                             }: ContentUnitEditFilesProps) {

    const maxFileCount = 50;
    //TODO: add max filesize. file.size / 1000 is size in kilobytes

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
        setNewFileLinks(newFileLinks.concat(blobs));
    }

    const resolveFileDeletionState = (fileLink: string) => {
        if (linksToFilesMarkedForDeletion.includes(fileLink)) {
            setFileDeletionState(linksToFilesMarkedForDeletion.filter(link => link != fileLink))
        } else {
            const isNewFile = fileLink.startsWith("blob:");
            if (isNewFile) {
                setNewFileLinks(newFileLinks.filter(newFile => newFile.blobLink != fileLink))
            } else {
                setFileDeletionState(linksToFilesMarkedForDeletion.concat(fileLink));
            }
        }
    }

    return (
        <Fragment>
            <EditFileList links={contentUnitState.fileLinks}
                          newFiles={newFileLinks}
                          onDeletionMarked={resolveFileDeletionState}/>
            <FileSelection title={"Attach files"}
                           inputType={"file"}
                           multiple={true}
                           loadImageFunction={uploadFiles}/>
        </Fragment>);
}
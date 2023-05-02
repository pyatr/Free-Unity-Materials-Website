import {ChangeEventHandler} from "react";

export type FileSelectionInfo = {
    title: string,
    inputType: string,
    multiple: boolean,

    loadImageFunction: ChangeEventHandler
}
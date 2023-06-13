import TextField from "@mui/material/TextField";
import React from "react";
import {ContentUnitEditCommonProps} from "./ContentUnitEditForm";

export function ContentUnitEditTitle({
                                         setContentUnitProperty,
                                         setErrorMessage,
                                         contentUnitState
                                     }: ContentUnitEditCommonProps) {
    const titleCharactersLimit = 128;

    const setTitle = (event: any) => {
        setContentUnitProperty("title", event.target.value);
    }
    return (
        <TextField onChange={setTitle}
                   label={"Title (" + titleCharactersLimit + " characters)"}
                   inputProps={{maxLength: titleCharactersLimit}}
                   defaultValue={contentUnitState.title}
                   style={{marginTop: "16px", marginBottom: "16px"}}/>);
}
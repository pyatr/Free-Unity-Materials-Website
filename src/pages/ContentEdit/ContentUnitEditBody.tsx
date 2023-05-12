import TextField from "@mui/material/TextField";
import React from "react";
import { ContentUnitEditCommonProps } from "./ContentUnitEditForm";

export function ContentUnitEditBody({
                                        setContentUnitProperty,
                                        setErrorMessage,
                                        contentUnitState
                                    }: ContentUnitEditCommonProps) {
    const setBody = (event: any) => {
        setContentUnitProperty("body", event.target.value);
    }
    return (
        <TextField onChange={setBody}
                   label="Content"
                   multiline={true}
                   sx={{
                       width: '100%',
                       height: '100%',
                       wordBreak: 'break-word',
                       display: 'grid'
                   }}
                   defaultValue={contentUnitState.body}
                   style={{marginTop: "16px", marginBottom: "16px"}}/>);
}
import {Button, Grid} from "@mui/material";
import React from "react";
import {StringArrayToString} from "../../utils/StringArrayToString";

export type CategorySelectionProps = {
    contentUnitCategories: string,
    onCategorySelected: Function
}

export default function ContentCategorySelectionMenu({contentUnitCategories, onCategorySelected}: CategorySelectionProps) {
    const selectedButtonStyle = {color: "white", background: "black"};
    const nonSelectedButtonStyle = {color: "black", background: "white"};
    const availableCategories = ["Scripts", "Graphics", "Models", "UI", "Shaders", "Text"];
    const splitCategories = contentUnitCategories.split(", ");
    let categorySelectionButtons = availableCategories.map((currentCategory) =>
        <Button
            style={splitCategories.includes(currentCategory) ? selectedButtonStyle : nonSelectedButtonStyle}
            onClick={() => onCategorySelected(currentCategory)}>
            {currentCategory}
        </Button>);
    return (
        <Grid
            sx={{
                border: '2px solid',
                borderRadius: '4px',
                borderColor: 'black',
                display: 'grid',
                padding: '2px',
                background: "white",
                gap: '2px',
                height: 'fit-content',
                //Otherwise some elements will render over it
                zIndex: '100',
                bottom: '-12px',
                position: 'relative'
            }}>
            {categorySelectionButtons}
        </Grid>);
}

export function SetCategorySelection(newCategory: string, categorySelection: string): string {
    if (categorySelection === "") {
        return newCategory;
    }
    let categoryArray: string[] = categorySelection.split(", ");
    let indexOfNewCategory = categoryArray.indexOf(newCategory);
    let newCategorySelection = "";
    if (indexOfNewCategory != -1) {
        //If given existing category, remove
        categoryArray.splice(indexOfNewCategory, 1);
        newCategorySelection = StringArrayToString(categoryArray);
    } else {
        //If category is not in list, include
        newCategorySelection = categorySelection + ", " + newCategory;
    }
    return newCategorySelection;
}
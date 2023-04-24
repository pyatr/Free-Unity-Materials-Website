import {Button, Grid} from "@mui/material";
import React from "react";
import {StringArrayToString} from "../../utils/StringArrayToString";

const categoryGridStyle = {
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
}

type CategorySelectionProps = {
    currentCategories: string[],
    onCategorySelected: Function
}

const availableCategories = Array("Scripts", "Graphics", "Models", "UI", "Shaders", "Text");

export default function ItemEditCategorySelection({currentCategories, onCategorySelected}: CategorySelectionProps) {
    const selectedButtonStyle = {color: "white", background: "black"};
    const nonSelectedButtonStyle = {color: "black", background: "white"};

    let catButtons = availableCategories.map((cat) => <Button
        style={currentCategories.includes(cat) ? selectedButtonStyle : nonSelectedButtonStyle}
        onClick={() => onCategorySelected(cat)}>{cat}</Button>);
    return (<Grid sx={categoryGridStyle}>{catButtons}</Grid>);
}

export function SetCategorySelection(cat: string, categorySelection: string) {
    if (categorySelection === "") {
        return cat;
    }
    let categoryArray: string[] = categorySelection.split(", ");
    let indexOfCat = categoryArray.indexOf(cat);
    let newCategorySelection = "";
    if (indexOfCat != -1) {
        //If given existing category, remove
        categoryArray.splice(indexOfCat, 1);
        newCategorySelection = StringArrayToString(categoryArray);
    } else {
        //If category is not in list, include
        newCategorySelection = categorySelection + ", " + cat;
    }
    return newCategorySelection;
}
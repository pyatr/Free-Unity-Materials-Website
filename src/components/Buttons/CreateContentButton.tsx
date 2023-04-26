import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import React, {Fragment} from "react";

import {sideButtonStyle} from "../MainContent";

import {GetLastURLPart} from "../../utils/GetLastURLPart";
import {CanUserEditContent} from "../../utils/Login";

export default function CreateContentButton() {
    const lastUrlPart = GetLastURLPart();
    const cleanLastUrlPart = lastUrlPart.length > 0 ? "/" + lastUrlPart : "";
    const permittedCreationLinks = ["", "/articles", "/scripts"];
    const canShowCreateButton = permittedCreationLinks.includes(cleanLastUrlPart);
    return (
        <Fragment>
            {CanUserEditContent() && canShowCreateButton ?
                <Button sx={sideButtonStyle} component={Link} to={cleanLastUrlPart + "/create"}>Add new item</Button> :
                <Fragment/>}
        </Fragment>);
}
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import React, {Fragment} from "react";

import {sideButtonStyle} from "../Layouts/MainContentLayout";

import {CanUserEditContent} from "../../utils/User/Login";
import {GenericStringProp} from "../../utils/Types/GenericProps/GenericStringProp";

export default function CreateContentButton({propValue}: GenericStringProp) {
    return (
        <Fragment>
            {CanUserEditContent() ?
                <Button sx={sideButtonStyle} component={Link} to={propValue}>Add new item</Button> :
                <Fragment/>}
        </Fragment>);
}
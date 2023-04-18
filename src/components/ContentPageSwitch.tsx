import {Typography} from "@mui/material";
import {Fragment} from "react";
import {SitePages} from "../utils/PageData/PageData";

export default function ContentPageSwitch() {
    const textStyle = {
        variant: "h3",
        display: "inline"
    }
    let elementPageData = SitePages.page["AssetsPage"];
    return (
        <Fragment>
            <Typography style={textStyle} onClick={elementPageData.onClickBack}>{"<"}</Typography>
            <Typography
                style={textStyle}>{(elementPageData.getFirstItemNumber() + 1) + "-" + elementPageData.getLastItemNumber()}</Typography>
            <Typography style={textStyle} onClick={elementPageData.onClickForward}>{">"}</Typography>
        </Fragment>
    );
}
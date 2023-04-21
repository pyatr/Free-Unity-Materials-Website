import {Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {IsMobileResolution} from "../utils/MobileUtilities";
import {GetSubURL} from "../utils/GetSubURL";

export default function CategoryMenu() {
    const landFontS = 14;
    const portFontS = 11;
    const isPortrait = IsMobileResolution();
    const fontSize = isPortrait ? portFontS : landFontS;
    const hoverButtonStyle = {
        border: "2px",
        borderStyle: "solid",
        borderRadius: 1,
        bgColor: 'default'
    }
    //Add color: "white" to make highlight for selected category button, not used right now
    const buttonStyle = {
        ':hover': hoverButtonStyle,
        fontSize: fontSize,
        fontWeight: "bold",
        display: 'block',
        border: "2px",
        borderStyle: "solid",
        borderRadius: 1
    };
    const selectedButtonStyle = {
        ':hover': hoverButtonStyle,
        fontSize: fontSize,
        fontWeight: "bold",
        display: 'block',
        border: "2px",
        borderStyle: "solid",
        borderRadius: 1
    };
    //Border around buttons
    const boxStyle = {
        height: 'fit-content',
        alignSelf: 'normal',
        color: 'primary.main',
        border: "2px",
        borderStyle: "solid",
        borderRadius: 1,
        gap: "8px",
        padding: "8px",
        width: "auto"
    };
    const links = [["/", "Assets"], ["/articles", "Articles"], ["/scripts", "Scripts"]];
    const currentURL = "/" + GetSubURL();
    const buttons = links.map((link) => <Button variant="outlined" key={link[0]} component={Link} to={link[0]}
                                                sx={currentURL == link[0] ? selectedButtonStyle : buttonStyle}>{link[1]}</Button>);
    return (<Grid sx={boxStyle} display="grid">{buttons}</Grid>);
}
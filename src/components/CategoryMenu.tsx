import {Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {IsMobileResolution} from "../utils/MobileUtilities";
import {GenericStringProp} from "../utils/Types/GenericProps/GenericStringProp";

export default function CategoryMenu({propValue}: GenericStringProp) {
    const landFontS = 14;
    const portFontS = 11;
    const isPortrait = IsMobileResolution();
    const fontSize = isPortrait ? portFontS : landFontS;
    const hoverButtonStyle = {
        border: "2px",
        borderStyle: "solid",
        borderRadius: 1
    }
    const buttonStyle = {
        ':hover': hoverButtonStyle,
        fontSize: fontSize,
        fontWeight: 'bold',
        display: 'block',
        border: '2px solid',
        borderColor: 'white',
        borderRadius: 1
    };
    const selectedButtonStyle = {
        ':hover': hoverButtonStyle,
        fontSize: fontSize,
        fontWeight: 'bold',
        display: 'block',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 1
    };
    //Border around buttons
    const boxStyle = {
        height: 'fit-content',
        alignSelf: 'normal',
        color: 'primary.main',
        border: '2px solid',
        borderRadius: 1,
        gap: '8px',
        padding: '8px',
        width: 'auto'
    };
    const links = [["/", "Assets", "AssetsPage"], ["/articles", "Articles", "ArticlesPage"], ["/scripts", "Scripts", "ScriptsPage"]];

    const buttons = links.map((link) => <Button variant="outlined"
                                                key={link[0]}
                                                component={Link}
                                                to={link[0]}
                                                sx={propValue == link[2] ? selectedButtonStyle : buttonStyle}>{link[1]}</Button>);
    return (<Grid sx={boxStyle} display="grid">{buttons}</Grid>);
}
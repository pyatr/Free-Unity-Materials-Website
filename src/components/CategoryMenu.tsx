import {Box, Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {IsMobileResolution} from "../utils/MobileUtilities";
import {GetSubURL} from "../utils/GetSubURL";

export default function CategoryMenu() {
    const landW = "14%";
    const portW = "25%";
    const landFontS = 14;
    const portFontS = 11;
    const isPortrait = IsMobileResolution();
    const selectedWidth = isPortrait ? portW : landW;
    const fontSize = isPortrait ? portFontS : landFontS;
    const hoverButtonStyle = {
        border: 2,
        bgColor: 'default'
    }
    const buttonStyle = {
        ':hover': hoverButtonStyle,
        marginTop: "8px",
        marginBottom: "8px",
        fontSize: fontSize,
        border: 2,
        fontWeight: "bold",
        display: 'block',
        padding: "6px"
    };
    const selectedButtonStyle = {
        ':hover': hoverButtonStyle,
        marginTop: "8px",
        marginBottom: "8px",
        fontSize: fontSize,
        fontWeight: "bold",
        border: 2,
        display: 'block',
        padding: "6px"
    };
    const boxStyle = {
        paddingLeft: "8px",
        paddingRight: "8px",
        height: 'fit-content',
        alignSelf: 'normal',
        color: 'primary.main',
        border: 2,
        m: '0.5%',
        borderRadius: 1,
        width: selectedWidth
    };
    const links = [["/", "Assets"], ["/articles", "Articles"], ["/scripts", "Scripts"]];
    const currentURL = "/" + GetSubURL();
    const buttons = links.map((link) => <Button variant="outlined" key={link[0]} component={Link} to={link[0]}
                                                sx={currentURL == link[0] ? selectedButtonStyle : buttonStyle}>{link[1]}</Button>);
    return (
        <Box sx={boxStyle}>
            <Grid container spacing={1.5} justifyContent="stretch">
                <Grid item xs={12} justifySelf="stretch">
                    {buttons}
                </Grid>
            </Grid>
        </Box>
    );
}
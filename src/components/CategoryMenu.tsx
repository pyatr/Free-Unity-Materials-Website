import {Box, Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {IsMobileResolution} from "../utils/MobileUtilities";

export default function CategoryMenu() {
    const landW = "14%";
    const portW = "25%";
    const landFontS = 14;
    const portFontS = 11;
    const isPortrait = IsMobileResolution();
    const selectedWidth = isPortrait ? portW : landW;
    const fontSize = isPortrait ? portFontS : landFontS;
    const buttonStyle = {
        ':hover': {
            border: 2,
            borderColor: 'primary.main',
            bgColor: 'default'
        },
        marginTop: "8px",
        marginBottom: "8px",
        fontSize: fontSize,
        fontWeight: "bold",
        border: 2,
        borderColor: 'primary.main',
        display: 'block',
        padding: "6px"
    };
    const style = {
        paddingLeft: "8px",
        paddingRight: "8px",
        height: 'fit-content',
        alignSelf: "normal",
        border: 2,
        borderColor: 'primary.main',
        m: '0.5%',
        borderRadius: 1,
        width: selectedWidth
    };
    const links = [["/assets", "Assets"], ["/articles", "Articles"], ["/scripts", "Scripts"]];
    const buttons = links.map((link) => <Button variant="outlined" component={Link} to={link[0]}
                                                sx={buttonStyle}>{link[1]}</Button>);
    return (
        <Box sx={style}>
            <Grid container spacing={1.5} justifyContent="stretch">
                <Grid item xs={12} justifySelf="stretch">
                    {buttons}
                </Grid>
            </Grid>
        </Box>
    );
}
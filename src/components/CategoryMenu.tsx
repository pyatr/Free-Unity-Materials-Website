import {Box, Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {IsMobileResolution} from "../utils/MobileUtilities";

export default function CategoryMenu() {
    var landW = "14%";
    var portW = "25%";
    var landFontS = 14;
    var portFontS = 11;
    const isPortrait = IsMobileResolution();
    var selectedWidth = isPortrait ? portW : landW;
    var fontSize = isPortrait ? portFontS : landFontS;
    var buttonStyle = {
        ':hover': {
            border: 2,
            borderColor: 'primary.main',
            bgColor: 'default'
        },
        fontSize: fontSize,
        fontWeight: "bold",
        border: 2,
        borderColor: 'primary.main',
        display: 'block',
        padding: "6px"
    };
    var style = {
        p: 1,
        height: 'fit-content',
        alignSelf: "normal",
        border: 2,
        borderColor: 'primary.main',
        m: '0.5%',
        borderRadius: 1,
        width: selectedWidth
    };
    return (
        <Box sx={style}>
            <Grid container spacing={1.5} justifyContent="stretch">
                <Grid item xs={12} justifySelf="stretch">
                    <Button variant="outlined" component={Link} to="/assets"
                            sx={buttonStyle}>Assets</Button>
                </Grid>
                <Grid item xs={12} justifySelf="stretch">
                    <Button variant="outlined" component={Link} to="/articles"
                            sx={buttonStyle}>Articles</Button>
                </Grid>
                <Grid item xs={12} justifySelf="stretch">
                    <Button variant="outlined" component={Link} to="/scripts"
                            sx={buttonStyle}>Scripts</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
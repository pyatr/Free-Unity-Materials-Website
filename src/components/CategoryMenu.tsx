import {Box, Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";

export default function CategoryMenu() {
    var buttonStyle = {
        ':hover': {
            border: 2,
            borderColor: 'primary.main',
            bgColor: 'default'
        },
        border: 2,
        borderColor: 'primary.main',
        display: 'block',
        padding: "6px"
    };
    var landW = "14%";
    var portW = "25%";
    let height = window.screen.height;
    let width = window.screen.width;
    const isPortrait = height > width;
    var selectedWidth = isPortrait ? portW : landW;
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
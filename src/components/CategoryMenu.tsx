import {Box, Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";

export default function CategoryMenu() {
    return (
        <Box sx={{p: 2, width: '12%', height: 'fit-content', alignSelf: "normal", border: 2, borderColor: 'primary.main', m: '0.5%', borderRadius: 1}}>
            <Grid container spacing={2} justifyContent="stretch">
                <Grid item xs={12} fontSize={20} justifySelf="stretch">
                    <Button variant="outlined" component={Link} to="/assets"
                            sx={{
                                ':hover': {border: 2, borderColor: 'primary.main', bgColor: 'default'},
                                border: 2,
                                borderColor: 'primary.main',
                                display: 'block'
                            }}>Assets</Button>
                </Grid>
                <Grid item xs={12} fontSize={20} justifySelf="stretch">
                    <Button variant="outlined" component={Link} to="/articles"
                            sx={{
                                ':hover': {border: 2, borderColor: 'primary.main', bgColor: 'default'},
                                border: 2,
                                borderColor: 'primary.main',
                                display: 'block'
                            }}>Articles</Button>
                </Grid>
                <Grid item xs={12} fontSize={20} justifySelf="stretch">
                    <Button variant="outlined" component={Link} to="/scripts"
                            sx={{
                                ':hover': {border: 2, borderColor: 'primary.main', bgColor: 'default'},
                                border: 2,
                                borderColor: 'primary.main',
                                display: 'block'
                            }}>Scripts</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
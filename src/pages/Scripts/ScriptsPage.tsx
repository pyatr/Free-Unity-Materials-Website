import {Box, Typography} from "@mui/material";

export default function ScriptsPage() {
    return (
        <Box sx={{
            p: 2,
            //71+12+12+1.5+1.5+1+1 = 100%
            width: '71%',
            height: '100%',
            border: 2,
            borderColor: 'primary.main',
            m: '0.5%',
            borderRadius: 1,
            justifySelf: "stretch",
            alignSelf: "stretch",
        }}>
            <Typography variant="h4">Scripts</Typography>
        </Box>
    );
}
import {Box, Typography} from "@mui/material";
import CategoryMenu from "../../components/CategoryMenu";
import React, { Fragment } from "react";

export default function AssetsPage() {
    return (
        <Fragment>
            <CategoryMenu/>
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
                <Typography variant="h4">Assets</Typography>
            </Box>
        </Fragment>
    );
}
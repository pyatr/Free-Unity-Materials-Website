import {Typography} from "@mui/material";
import React from "react";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";

async function GetAssetsForPage(page: number) {
    let scon = new ServerConnection();
    let params = {
        pageSize: 8,
        page: page
    };
    await scon.sendPostRequest("getPosts", params, OnPagesReceived);
}

function OnPagesReceived(response: AxiosResponse) {
    //Use response.data.code for SQL request code and response.data.requesterror for error details
    if (response.data.result === "success") {
        console.log(response.data.content);

    } else {
        console.log("request failed: " + response.data.code + "\nError: " + response.data.requesterror);
    }
}

export default function AssetsPage() {
    GetAssetsForPage(1);
    return (
        <Typography variant="h4">Assets</Typography>
    );
}
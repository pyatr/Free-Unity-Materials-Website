import React, {useState} from "react";
import {Box, InputAdornment, TextField, Typography} from "@mui/material";
import {Search} from "@mui/icons-material";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";

const searchFieldStyle = {
    height: "fit-content",
    alignSelf: "center"
}

export function SearchField() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchRequestText, setSearchRequestText] = useState(searchParams.get("keyword"));
    const [searchAll, setSearchAll] = useState(false);
    const [forceUpdate, setForceUpdate]=useState(false);

    const navigate = useNavigate();

    const setSearchFromText = () => {
        let search;
        if (searchRequestText) {
            search = {
                keyword: searchRequestText
            }
        } else {
            search = undefined;
        }
        setSearchParams(search, {replace: true});
        if (searchAll) {
            navigate({
                pathname: "search-all",
                search: createSearchParams({
                    keyword: searchRequestText as string
                }).toString()
            });
        }
        setForceUpdate(!forceUpdate);
    }

    const onSearchFieldChanged = (event: any) => {
        setSearchRequestText(event.target.value);
    };

    const handleEnterKeyPressed = (event: any) => {
        if (event.key === "Enter") {
            setSearchFromText();
        }
    }

    return (
        <Box display="grid" gap="1rem" width="40%">
            <TextField
                id="search-field"
                label="Search"
                variant="standard"
                onChange={onSearchFieldChanged}
                onKeyUp={handleEnterKeyPressed}
                defaultValue={searchRequestText}
                sx={searchFieldStyle}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search onClick={setSearchFromText} cursor="pointer"/>
                        </InputAdornment>
                    ),
                }}/>
            <Box display="flex" gap="0.2rem" height="fit-content" alignItems="start">
                <input
                    type="checkbox"
                    width="1rem"
                    height="1rem"
                    checked={searchAll}
                    onChange={event => setSearchAll(event.target.checked)}/>
                <Typography>Search everywhere</Typography>
            </Box>
        </Box>);
}
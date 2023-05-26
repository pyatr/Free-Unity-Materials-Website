import React, {useState} from "react";
import {InputAdornment, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const searchFieldStyle = {
    width: "40%",
    height: "fit-content",
    alignSelf: "center"
}

export function SearchField() {
    const [searchRequestText, setSearchRequestText] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");
    const navigate = useNavigate();

    const goToSearchPage = () => {
        navigate(searchCategory === "all" ? "/search-all" : "/search", {state: {category: searchCategory}});
    }

    const onSearchFieldChanged = (event: any) => {
        setSearchRequestText(event.target.value);
    };

    const handleEnterKeyPressed = (event: any) => {
        if (event.key === "Enter") {
            setSearchRequestText(event.target.value);
            goToSearchPage();
        }
    }

    return (
        <TextField
            id="search-field"
            label="Search"
            variant="standard"
            onChange={onSearchFieldChanged}
            onKeyUp={handleEnterKeyPressed}
            sx={searchFieldStyle}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Search onClick={goToSearchPage} cursor="pointer"/>
                    </InputAdornment>
                ),
            }}
        />);
}
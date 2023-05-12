import Box from "@mui/material/Box";
import {useState} from "react";
import {Button, Grid} from "@mui/material";
import {ArrowLeft, ArrowRight} from "@mui/icons-material";
import {GetDocumentDimensions} from "../../utils/GetDocumentDimensions";

type FullImageViewProps = {
    imageLink: string,
    onBackgroundClick: Function,
    onNextClick: Function,
    onPreviousClick: Function
}

const backgroundStyle = {
    background: "rgba(0,0,0,0.8)",
    position: "absolute",
    zIndex: 20,
    top: "0%",
    left: "0%",
    display: "flex",
    justifyContent: "space-between"
}

const sideButtonStyle = {
    ":hover": {
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    color: "white",
    zIndex: 21,
    width: "10%",
    height: "100%",
    position: "fixed"
}

export function GalleryFullView({
                                    imageLink,
                                    onBackgroundClick,
                                    onNextClick,
                                    onPreviousClick
                                }: FullImageViewProps) {
    const [closingEnabled, setClosingEnabled] = useState(true);
    const documentDimensions = GetDocumentDimensions();
    return (
        <Grid width={documentDimensions.width} height={documentDimensions.height}
              sx={closingEnabled ? [backgroundStyle, {cursor: "pointer"}] : backgroundStyle}
              onClick={() => {
                  if (closingEnabled)
                      onBackgroundClick();
              }}>
            <Button sx={[sideButtonStyle, {left: "0"}]}
                    onMouseEnter={() => setClosingEnabled(false)}
                    onMouseLeave={() => setClosingEnabled(true)}
                    onClick={() => onPreviousClick()}>
                <ArrowLeft style={{width: "6em", height: "6em"}}/>
            </Button>

            {<img style={{
                top: "50%",
                left: "50%",
                position: "fixed",
                transform: "translate(-50%, -50%)",
                zIndex: 22,
                maxHeight: "80%",
                maxWidth: "80%",
            }}
                  onMouseEnter={() => setClosingEnabled(false)}
                  onMouseLeave={() => setClosingEnabled(true)}
                  src={imageLink}/>}

            <Button sx={[sideButtonStyle, {right: "0"}]}
                    onMouseEnter={() => setClosingEnabled(false)}
                    onMouseLeave={() => setClosingEnabled(true)}
                    onClick={() => onNextClick()}>
                <ArrowRight style={{width: "6em", height: "6em"}}/>
            </Button>
        </Grid>);
}
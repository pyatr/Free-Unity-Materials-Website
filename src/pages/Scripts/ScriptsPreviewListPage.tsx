import {PageLoadProps} from "../../utils/PageProperties/PageProperties";
import TextContentPreviewListPage from "../TextContent/TextContentPreviewListPage";

export function ScriptsPreviewListPage({pageProperties, previewContent}: PageLoadProps) {
    return (<TextContentPreviewListPage pageProperties={pageProperties} previewContent={previewContent}/>);
}
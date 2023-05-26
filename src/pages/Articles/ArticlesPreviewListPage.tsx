import {PageLoadProps} from "../../utils/PageProperties/PageProperties";
import TextContentPreviewListPage from "../TextContent/TextContentPreviewListPage";

export function ArticlesPreviewListPage({pageProperties, previewContent}: PageLoadProps) {
    return (<TextContentPreviewListPage pageProperties={pageProperties} previewContent={previewContent}/>);
}
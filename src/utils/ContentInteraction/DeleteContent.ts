import ServerConnection from "../ServerConnection";

export default async function DeleteContent(contentNumber: number, contentCategory: string): Promise<any> {
    const serverConnection = new ServerConnection();
    const attributes = {
        number: contentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("deleteContent", attributes);
    return data;
}
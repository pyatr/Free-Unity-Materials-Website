import FileToBase64 from "../../utils/Files/FileToBase64";

export async function MultipleFilesToBase64(links: string[]): Promise<string[]> {
    let base64Files: string[] = [];

    const imageToBase64 = async () => {
        if (links.length > 0)
            await fetch(links.pop() as string).then((image: Response) =>
                image.blob().then((dataBlob: Blob) =>
                    FileToBase64(dataBlob).then((blob64) =>
                        base64Files = base64Files.concat(blob64)))).then(() => imageToBase64());
    }
    await imageToBase64();

    return base64Files;
}
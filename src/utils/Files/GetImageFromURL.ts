export async function GetImageFromURL(url: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
};
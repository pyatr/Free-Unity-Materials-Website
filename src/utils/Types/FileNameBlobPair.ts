export type FileNameBlobPair = {
    fileName: string,
    blobLink: string
}

export function GetFileNamesFromPairs(pairs: FileNameBlobPair[]): string[] {
    let fileNames: string[] = [];
    pairs.forEach(pair => fileNames.push(pair.fileName));
    return fileNames;
}

export function GetBlobsFromPairs(pairs: FileNameBlobPair[]): string[] {
    let blobs: string[] = [];
    pairs.forEach(pair => blobs.push(pair.blobLink));
    return blobs;
}

export function DoesImageExist(url: string, callback: (doesExist: boolean) => void) {
    if (url === "" || url === null || url === undefined) {
        callback(false);
        return;
    }
    const image = new Image();
    image.src = url;

    if (image.complete) {
        callback(true);
    } else {
        image.onload = () => {
            callback(true);
        };

        image.onerror = () => {
            callback(false);
        };
    }
}
export function GetFirstURLPart(url: string = window.location.pathname): string {
    const urlParts = url.split('/');
    return urlParts.length > 0 ? urlParts[0] : "";
}
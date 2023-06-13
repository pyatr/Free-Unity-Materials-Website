export function GetLastURLPart(url: string = window.location.pathname): string {
    const urlParts = url.split('/');
    return urlParts.length > 0 ? urlParts[urlParts.length - 1] : "";
}
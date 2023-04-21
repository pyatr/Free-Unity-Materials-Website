export function GetSubURL(): string {
    const urlParts = window.location.pathname.split('/');
    return urlParts.length > 0 ? urlParts[urlParts.length - 1] : "";
}
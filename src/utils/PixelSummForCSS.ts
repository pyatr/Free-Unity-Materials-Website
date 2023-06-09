export default function PixelSummForCSS(...pixel: string[]): string {
    let summ = 0;
    pixel.forEach(p => summ += parseFloat(p));
    return summ + "px";
}
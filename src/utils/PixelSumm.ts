export default function PixelSumm(...pixel: string[]): string {
    let summ = 0;
    pixel.forEach(p => summ += parseFloat(p));
    return summ + "px";
}
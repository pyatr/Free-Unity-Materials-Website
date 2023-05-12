export function StringArrayToString(array: string[], separator: string = ", "): string {
    let s = "";
    for (let i = 0; i < array.length; i++) {
        s += array[i];
        if (i < array.length - 1) {
            s += separator;
        }
    }
    return s;
}
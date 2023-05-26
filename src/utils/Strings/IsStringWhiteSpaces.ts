export function IsStringWhiteSpaces(string: string): boolean {

    let stringIsWhiteSpaces = true;
    string.split('').forEach((symbol: string) => {
        if (symbol !== " ") {
            stringIsWhiteSpaces = false;
        }
    });
    return stringIsWhiteSpaces;
}
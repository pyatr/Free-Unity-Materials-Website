export function DoesStringHaveCharacters(string: string): boolean {
    //English only
    let doesStringHaveCharacters = false;
    string.split('').forEach((symbol: string) => {
        if (symbol.match(/[a-z]/i)) {
            doesStringHaveCharacters = true;
        }
    });
    return doesStringHaveCharacters;
}
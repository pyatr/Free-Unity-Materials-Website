export function DoesStringHaveNumbers(string: string): boolean {
    let doesStringHaveNumbers = false;
    string.split('').forEach((symbol: string) => {
        if (!isNaN(Number(symbol))) {
            doesStringHaveNumbers = true;
        }
    });
    return doesStringHaveNumbers;
}
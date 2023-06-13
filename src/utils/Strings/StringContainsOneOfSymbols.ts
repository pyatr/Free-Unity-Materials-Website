export function StringContainsOneOfSymbols(string: string, symbols: string[]): boolean {
    let hasSymbol = false;
    for (const symbol of symbols) {
        if (string.includes(symbol))
            hasSymbol = true;
    }
    return hasSymbol;
}
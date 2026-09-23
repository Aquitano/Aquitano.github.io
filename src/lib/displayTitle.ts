const wordBreak = /(?<=[a-z])(?=[A-Z])|(?<= )/;

/**
 * Splits a title's display lines into words. Uppercase display type hides camelCase boundaries
 * (FRONTIERSTOSPACE), so every second camelCase word is outlined to keep the name readable.
 */
export const displayTitle = (lines: string[]) => {
    let camelWord = 0;
    let previous = '';
    return lines.map((line) =>
        line.split(wordBreak).map((text) => {
            if (/[a-z]$/.test(previous) && /^[A-Z]/.test(text)) camelWord++;
            previous = text;
            return { text, outline: camelWord % 2 === 1 };
        }),
    );
};

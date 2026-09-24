const camelBreak = /(?<=[a-z])(?=[A-Z])/;

// Gap between a glyph's box and its ink in Archivo Expanded ExtraBold, as a share of the font size.
const SIDE_BEARING_EM: [RegExp, number][] = [
    [/^[AVWXY]/i, 0.017],
    [/^[TJZ]/i, 0.024],
    [/^\d/, 0.046],
    [/^[CGOQS]/i, 0.056],
];
const STEM_BEARING_EM = 0.086;

/** Pulls display type left by its first glyph's side bearing, so the ink starts on the same edge as the labels around it. */
export const opticalIndent = (text: string) =>
    `margin-left: -${SIDE_BEARING_EM.find(([first]) => first.test(text.trimStart()))?.[1] ?? STEM_BEARING_EM}em`;

/**
 * Splits a title's display lines into words. Uppercase display type hides camelCase boundaries
 * (FRONTIERSTOSPACE), so every second word of a compound name is outlined to keep it readable.
 * Lines of a compound name join without a space, lines of a spaced title with one.
 */
export const displayTitle = (title: string, wrap = [title]) => {
    const compound = !/\s/.test(title);
    let word = 0;
    let previous = '';
    const lines = wrap.map((line) =>
        (compound ? line.split(camelBreak) : [line]).map((text) => {
            if (compound && /[a-z]$/.test(previous) && /^[A-Z]/.test(text)) word++;
            previous = text;
            return { text, outline: word % 2 === 1 };
        }),
    );
    return { lines, joiner: compound ? '' : ' ' };
};

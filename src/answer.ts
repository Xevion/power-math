// Parse a typed answer into an integer. Number.parseInt alone is too lenient:
// it accepts trailing garbage ("12abc") and silently truncates decimals, so a
// wrong input could read as correct. Require a clean signed integer instead.
export function parseAnswer(raw: string): number | null {
    const trimmed = raw.trim();
    if (!/^[+-]?\d+$/.test(trimmed)) return null;
    return Number.parseInt(trimmed, 10);
}

// Every answer is an integer, so the only characters worth accepting are digits
// and a minus sign in the first position. The cap leaves room for the largest
// product the generators can build without letting the field fill with noise.
export const MAX_ANSWER_LENGTH = 12;

export function sanitizeAnswer(raw: string): string {
    const negative = raw.trimStart().startsWith('-');
    const digits = raw.replace(/\D/g, '');
    return ((negative ? '-' : '') + digits).slice(0, MAX_ANSWER_LENGTH);
}

// Parse a typed answer into an integer. Number.parseInt alone is too lenient:
// it accepts trailing garbage ("12abc") and silently truncates decimals, so a
// wrong input could read as correct. Require a clean signed integer instead.
export function parseAnswer(raw: string): number | null {
    const trimmed = raw.trim();
    if (!/^[+-]?\d+$/.test(trimmed)) return null;
    return Number.parseInt(trimmed, 10);
}

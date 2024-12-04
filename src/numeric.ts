// Keyboard and typed-entry rules shared by the numeric controls (slider, scrub
// field), so they all accept the same keys and reject the same input.

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

// Whether some number in [min, max] starts with the digits of `n`. Typing "4"
// toward a range of 1..5 is fine, but "44" can never get back into it, and "1"
// toward 400..500 is already a dead end.
function digitsCanReach(n: number, min: number, max: number): boolean {
    const reach = Math.max(Math.abs(min), Math.abs(max));
    for (let scale = 1, lo = n; lo <= reach; scale *= 10, lo = n * scale) {
        const hi = lo + scale - 1;
        if (hi >= min && lo <= max) return true;
    }
    return false;
}

// Can `draft` still become a valid entry by typing more? Drives which
// keystrokes are accepted: anything that would strand the value out of range
// is refused up front rather than reported after the fact.
export function allowsPrefix(draft: string, min: number, max: number): boolean {
    if (draft === '') return true;
    if (draft === '-') return min < 0;

    const negative = draft.startsWith('-');
    const digits = negative ? draft.slice(1) : draft;
    if (!/^\d+$/.test(digits)) return false;
    // No leading zeros: "0" is a value, "05" and "-0" are noise
    if (digits.length > 1 && digits.startsWith('0')) return false;
    if (negative && digits === '0') return false;

    const n = Number.parseInt(digits, 10);
    if (!negative) return digitsCanReach(n, min, max);
    return digitsCanReach(n, -max, -min);
}

export type Entry = { value: number } | { error: string };

// Validate a finished entry, naming the bound it broke.
export function checkEntry(draft: string, min: number, max: number): Entry {
    if (!/^-?\d+$/.test(draft)) return { error: `Enter a number from ${min} to ${max}` };
    const value = Number.parseInt(draft, 10);
    if (value < min) return { error: `Minimum is ${min}` };
    if (value > max) return { error: `Maximum is ${max}` };
    return { value };
}

// Explain why a keystroke was refused, for the on-screen hint.
export function rejectionReason(draft: string, min: number, max: number): string {
    const n = Number.parseInt(draft, 10);
    if (draft.startsWith('-') && min >= 0) return `Minimum is ${min}`;
    if (n > max) return `Maximum is ${max}`;
    if (n < min) return `Minimum is ${min}`;
    return `Enter a number from ${min} to ${max}`;
}

interface KeyLike {
    key: string;
    shiftKey?: boolean;
}

interface KeyOptions {
    // Left/Right step the value too. Off in a text field, where they move the caret.
    horizontal?: boolean;
    // Home/End jump to the bounds. Off in a text field, where they move the caret.
    ends?: boolean;
}

// The value a key press should move to, or null if the key means nothing here.
// Arrows step, Shift or PageUp/PageDown take ten steps, Home/End jump to the ends.
export function keyTarget(
    e: KeyLike,
    current: number,
    min: number,
    max: number,
    step: number,
    { horizontal = true, ends = true }: KeyOptions = {},
): number | null {
    const big = step * 10;
    let delta: number;
    switch (e.key) {
        case 'ArrowUp':
            delta = e.shiftKey ? big : step;
            break;
        case 'ArrowDown':
            delta = e.shiftKey ? -big : -step;
            break;
        case 'ArrowRight':
            if (!horizontal) return null;
            delta = e.shiftKey ? big : step;
            break;
        case 'ArrowLeft':
            if (!horizontal) return null;
            delta = e.shiftKey ? -big : -step;
            break;
        case 'PageUp':
            delta = big;
            break;
        case 'PageDown':
            delta = -big;
            break;
        case 'Home':
            return ends ? min : null;
        case 'End':
            return ends ? max : null;
        default:
            return null;
    }
    return clamp(current + delta, min, max);
}

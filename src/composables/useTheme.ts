import { ref } from 'vue';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'power-math-theme';

// Shared across every caller so the toggle and any future consumers stay in sync
const theme = ref<Theme>('dark');

function prefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStored(): Theme | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
}

function apply(value: Theme) {
    document.documentElement.setAttribute('data-theme', value);
}

export function useTheme() {
    function setTheme(value: Theme) {
        theme.value = value;
        localStorage.setItem(STORAGE_KEY, value);
        apply(value);
    }

    function toggleTheme() {
        setTheme(theme.value === 'dark' ? 'light' : 'dark');
    }

    // Resolve the starting theme from a stored choice, falling back to the OS
    // preference. The inline head script applies this before paint; this keeps
    // the ref in sync once the app mounts.
    function initTheme() {
        const initial = readStored() ?? (prefersDark() ? 'dark' : 'light');
        theme.value = initial;
        apply(initial);
    }

    return { theme, setTheme, toggleTheme, initTheme };
}

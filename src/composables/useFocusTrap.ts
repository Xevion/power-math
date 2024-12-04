import { onBeforeUnmount, onMounted, type Ref } from 'vue';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Keep Tab and Shift+Tab inside `container` while it is mounted. Focus moves
// into it on mount and returns to whatever had it before on unmount.
export function useFocusTrap(container: Ref<HTMLElement | null>) {
    let opener: HTMLElement | null = null;

    // Only real tab stops: skips roving-tabindex members and controls inside an
    // inert subtree (e.g. a collapsed card)
    function focusables(root: HTMLElement): HTMLElement[] {
        return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.tabIndex >= 0 && !el.closest('[inert]'),
        );
    }

    function onKeydown(e: KeyboardEvent) {
        const root = container.value;
        // Another trap may be stacked on top; only act while focus is in ours
        if (e.key !== 'Tab' || !root || !root.contains(document.activeElement)) return;

        const items = focusables(root);
        if (items.length === 0) {
            e.preventDefault();
            return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === root)) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    }

    onMounted(() => {
        opener = document.activeElement as HTMLElement | null;
        container.value?.focus({ preventScroll: true });
        document.addEventListener('keydown', onKeydown);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', onKeydown);
        opener?.focus({ preventScroll: true });
    });
}

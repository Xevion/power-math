import { onBeforeUnmount, onMounted } from 'vue';

export interface DragMove {
    // Horizontal travel since the previous move event
    dx: number;
    // Horizontal travel since the press
    total: number;
    // True for a mouse, whose cursor is frozen in place while dragging, so
    // only relative travel is meaningful; touch and pen track the finger directly
    relative: boolean;
}

export interface DragHandlers {
    start(e: PointerEvent): void;
    move(e: PointerEvent, move: DragMove): void;
    // `moved` is false for a press that never travelled, i.e. a plain click
    end(moved: boolean): void;
}

// Horizontal press-and-drag that locks the mouse pointer for the duration: the
// cursor disappears and stays put while the value changes, and dragging is not
// bounded by the edge of the control or the screen. Falls back to ordinary
// pointer capture if the lock is unavailable or refused.
export function useLockedDrag(handlers: DragHandlers, threshold = 3) {
    let target: HTMLElement | null = null;
    let active = false;
    let relative = false;
    let moved = false;
    let lockRequested = false;
    let startX = 0;
    let lastX = 0;
    let total = 0;

    function releaseLock() {
        if (target && document.pointerLockElement === target) document.exitPointerLock();
    }

    function finish() {
        if (!active) return;
        active = false;
        releaseLock();
        handlers.end(moved);
    }

    function onDown(e: PointerEvent) {
        if (e.button !== 0) return;
        target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);
        active = true;
        moved = false;
        lockRequested = false;
        relative = e.pointerType === 'mouse';
        startX = lastX = e.clientX;
        total = 0;
        handlers.start(e);
    }

    function onMove(e: PointerEvent) {
        if (!active) return;
        const dx = relative ? e.movementX : e.clientX - lastX;
        lastX = e.clientX;
        total = relative ? total + dx : e.clientX - startX;

        if (!moved && Math.abs(total) > threshold) {
            moved = true;
            // Lock only once it is a real drag, so a plain click doesn't flicker the cursor
            if (relative && !lockRequested) {
                lockRequested = true;
                try {
                    Promise.resolve(target?.requestPointerLock()).catch(() => {});
                } catch {
                    // Not allowed here; capture alone still works
                }
            }
        }
        handlers.move(e, { dx, total, relative });
    }

    // Escape (or the browser) can drop the lock mid-drag; treat it as a release
    function onLockChange() {
        if (active && lockRequested && document.pointerLockElement !== target) finish();
    }

    onMounted(() => document.addEventListener('pointerlockchange', onLockChange));
    onBeforeUnmount(() => {
        document.removeEventListener('pointerlockchange', onLockChange);
        releaseLock();
    });

    return { onDown, onMove, onUp: finish };
}

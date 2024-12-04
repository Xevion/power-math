<template>
    <div class="ui-scrub">
        <input
            v-if="editing"
            ref="inputEl"
            class="ui-scrub-input"
            type="text"
            inputmode="numeric"
            :class="{ 'is-warn': warn }"
            :value="draft"
            :aria-label="label"
            :aria-invalid="warn"
            autocomplete="off"
            spellcheck="false"
            @input="onInput"
            @keydown="onKeydown"
            @blur="commit"
        />
        <span
            v-else
            class="ui-scrub-value"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointercancel="onUp"
        >
            <span class="ui-scrub-text">{{ modelValue }}</span>
            <span class="ui-scrub-track">
                <span class="ui-scrub-bar" :style="{ width: `${ratio * 100}%` }"></span>
            </span>
        </span>
        <span v-if="editing" class="ui-scrub-hint" :class="{ 'is-warn': warn }" role="status">
            {{ hint }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, ref } from 'vue';
    import { allowsPrefix, checkEntry, clamp, keyTarget, rejectionReason } from '@/numeric';

    const props = withDefaults(
        defineProps<{
            modelValue: number;
            min: number;
            max: number;
            step?: number;
            label?: string;
        }>(),
        { step: 1 },
    );
    const emit = defineEmits<{ 'update:modelValue': [number] }>();

    const editing = ref(false);
    const draft = ref('');
    const warn = ref(false);
    const warning = ref('');
    const inputEl = ref<HTMLInputElement | null>(null);

    let startX = 0;
    let startValue = 0;
    let moved = false;
    let active = false;

    // Fraction of the way through the range, for the bottom progress bar
    const ratio = computed(() => {
        const span = props.max - props.min || 1;
        return Math.min(1, Math.max(0, (props.modelValue - props.min) / span));
    });

    // How far the pointer travels per step: small ranges get a coarse, easy grip;
    // big ranges pack more steps into the same drag (clamped so it stays usable)
    const pxPerStep = computed(() => {
        const steps = (props.max - props.min) / props.step;
        return Math.min(16, Math.max(1.5, 200 / steps));
    });

    const rangeHint = computed(() => `${props.min} to ${props.max}`);
    const hint = computed(() => (warn.value ? warning.value : rangeHint.value));

    function onDown(e: PointerEvent) {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        active = true;
        moved = false;
        startX = e.clientX;
        startValue = props.modelValue;
    }
    function onMove(e: PointerEvent) {
        if (!active) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) moved = true;
        const next = clamp(
            startValue + Math.round(dx / pxPerStep.value) * props.step,
            props.min,
            props.max,
        );
        if (next !== props.modelValue) emit('update:modelValue', next);
    }
    function onUp() {
        active = false;
        // A press that never dragged is a click: fall through to keyboard entry
        if (!moved) startEdit();
    }

    let warnTimer: number | undefined;

    function flagWarning(message: string, sticky = false) {
        warning.value = message;
        warn.value = true;
        window.clearTimeout(warnTimer);
        if (!sticky) warnTimer = window.setTimeout(() => (warn.value = false), 1600);
    }

    function startEdit() {
        draft.value = String(props.modelValue);
        warn.value = false;
        editing.value = true;
        nextTick(() => {
            inputEl.value?.focus();
            inputEl.value?.select();
        });
    }

    // Take only keystrokes that can still end up in range, so a value like "44"
    // in a 0..4 field never forms; the refused key is explained beside the field
    function onInput(e: Event) {
        const el = e.target as HTMLInputElement;
        const raw = el.value;
        const candidate = (raw.startsWith('-') ? '-' : '') + raw.replace(/\D/g, '');

        if (allowsPrefix(candidate, props.min, props.max)) {
            draft.value = candidate;
            if (candidate !== raw) {
                el.value = candidate;
                flagWarning(`Digits only, ${rangeHint.value}`);
            } else {
                warn.value = false;
            }
            return;
        }

        const caret = (el.selectionStart ?? raw.length) - (raw.length - draft.value.length);
        el.value = draft.value;
        el.setSelectionRange(Math.max(0, caret), Math.max(0, caret));
        flagWarning(rejectionReason(candidate, props.min, props.max));
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const entry = checkEntry(draft.value, props.min, props.max);
            if ('error' in entry) flagWarning(entry.error, true);
            else commit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            editing.value = false;
        } else {
            // Up/Down (and PageUp/PageDown) nudge the typed number; Left/Right and
            // Home/End stay with the caret
            const parsed = Number.parseInt(draft.value, 10);
            const current = Number.isNaN(parsed) ? props.modelValue : parsed;
            const next = keyTarget(e, current, props.min, props.max, props.step, {
                horizontal: false,
                ends: false,
            });
            if (next === null) return;
            e.preventDefault();
            draft.value = String(next);
            warn.value = false;
            const el = e.target as HTMLInputElement;
            el.value = draft.value;
            el.select();
        }
    }

    // Enter commits a valid entry; leaving the field with an invalid one drops it
    // rather than guessing what was meant
    function commit() {
        if (!editing.value) return;
        const entry = checkEntry(draft.value, props.min, props.max);
        editing.value = false;
        if ('value' in entry && entry.value !== props.modelValue) {
            emit('update:modelValue', entry.value);
        }
    }
</script>

<template>
    <div class="ui-scrub">
        <input
            v-if="editing"
            ref="inputEl"
            class="ui-scrub-input"
            type="text"
            inputmode="numeric"
            v-model="draft"
            @keyup.enter="commit"
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
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, ref } from 'vue';

    const props = withDefaults(
        defineProps<{ modelValue: number; min: number; max: number; step?: number }>(),
        { step: 1 },
    );
    const emit = defineEmits<{ 'update:modelValue': [number] }>();

    const editing = ref(false);
    const draft = ref('');
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

    function clamp(value: number) {
        return Math.min(props.max, Math.max(props.min, value));
    }

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
        const next = clamp(startValue + Math.round(dx / pxPerStep.value) * props.step);
        if (next !== props.modelValue) emit('update:modelValue', next);
    }
    function onUp() {
        active = false;
        // A press that never dragged is a click: fall through to keyboard entry
        if (!moved) startEdit();
    }

    function startEdit() {
        draft.value = String(props.modelValue);
        editing.value = true;
        nextTick(() => {
            inputEl.value?.focus();
            inputEl.value?.select();
        });
    }
    function commit() {
        if (!editing.value) return;
        editing.value = false;
        const parsed = Number.parseInt(draft.value, 10);
        if (Number.isNaN(parsed)) return;
        const value = clamp(parsed);
        if (value !== props.modelValue) emit('update:modelValue', value);
    }
</script>

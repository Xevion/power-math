<template>
    <div
        ref="trackEl"
        class="ui-slider"
        :class="{ 'is-dragging': dragging }"
        role="slider"
        tabindex="0"
        :aria-label="label"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        :aria-valuetext="display"
        @keydown="onKeydown"
        @pointerdown="drag.onDown"
        @pointermove="drag.onMove"
        @pointerup="drag.onUp"
        @pointercancel="drag.onUp"
    >
        <div class="ui-slider-fill" :style="{ '--fill': `max(0.4rem, ${ratio * 100}%)` }"></div>
        <span class="ui-slider-num" :class="{ 'is-over': onFill }" :style="{ left: `${numLeft}%` }">
            {{ display }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useLockedDrag } from '@/composables/useLockedDrag';
    import { keyTarget } from '@/numeric';

    const props = withDefaults(
        defineProps<{
            modelValue: number;
            min: number;
            max: number;
            step?: number;
            format?: (value: number) => string;
            label?: string;
        }>(),
        { step: 1 },
    );
    const emit = defineEmits<{ 'update:modelValue': [number] }>();

    const trackEl = ref<HTMLElement | null>(null);
    const dragging = ref(false);

    const ratio = computed(() => {
        const r = (props.modelValue - props.min) / (props.max - props.min);
        return Math.min(1, Math.max(0, r));
    });
    const display = computed(() =>
        props.format ? props.format(props.modelValue) : String(props.modelValue),
    );

    // Sit the value in the wider of the two regions: on the track while the fill
    // is in the left half, on the fill once it passes halfway. It centres within
    // that region, so it never lands across the fill's edge.
    const onFill = computed(() => ratio.value >= 0.5);
    const numLeft = computed(() => (onFill.value ? ratio.value / 2 : (1 + ratio.value) / 2) * 100);

    function setFromRatio(r: number) {
        const raw = props.min + Math.min(1, Math.max(0, r)) * (props.max - props.min);
        const stepped = Math.round(raw / props.step) * props.step;
        const clamped = Math.min(props.max, Math.max(props.min, stepped));
        if (clamped !== props.modelValue) emit('update:modelValue', clamped);
    }

    // Position along the track in px. A mouse drag moves this by relative travel
    // (the cursor is locked and clamps at the ends); touch maps straight from x.
    let pos = 0;

    function trackRect() {
        return trackEl.value?.getBoundingClientRect();
    }
    function posFromX(clientX: number) {
        const rect = trackRect();
        if (!rect) return 0;
        return Math.min(rect.width, Math.max(0, clientX - rect.left));
    }

    const drag = useLockedDrag(
        {
            start(e) {
                dragging.value = true;
                pos = posFromX(e.clientX);
                setFromRatio(pos / (trackRect()?.width || 1));
            },
            move(e, { dx, relative }) {
                const width = trackRect()?.width || 1;
                pos = relative ? Math.min(width, Math.max(0, pos + dx)) : posFromX(e.clientX);
                setFromRatio(pos / width);
            },
            end() {
                dragging.value = false;
            },
        },
        0,
    );

    function onKeydown(e: KeyboardEvent) {
        const next = keyTarget(e, props.modelValue, props.min, props.max, props.step);
        if (next === null) return;
        e.preventDefault();
        if (next !== props.modelValue) emit('update:modelValue', next);
    }
</script>

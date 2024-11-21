<template>
    <div
        ref="trackEl"
        class="ui-slider"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
    >
        <div class="ui-slider-fill" :style="{ '--fill': `max(0.4rem, ${ratio * 100}%)` }"></div>
        <span class="ui-slider-num" :class="{ 'is-over': onFill }" :style="{ left: `${numLeft}%` }">
            {{ display }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';

    const props = withDefaults(
        defineProps<{
            modelValue: number;
            min: number;
            max: number;
            step?: number;
            format?: (value: number) => string;
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

    function setFromX(clientX: number) {
        const track = trackEl.value;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const r = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const raw = props.min + r * (props.max - props.min);
        const stepped = Math.round(raw / props.step) * props.step;
        const clamped = Math.min(props.max, Math.max(props.min, stepped));
        if (clamped !== props.modelValue) emit('update:modelValue', clamped);
    }

    function onDown(e: PointerEvent) {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        dragging.value = true;
        setFromX(e.clientX);
    }
    function onMove(e: PointerEvent) {
        if (dragging.value) setFromX(e.clientX);
    }
    function onUp() {
        dragging.value = false;
    }
</script>

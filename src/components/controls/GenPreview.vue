<template>
    <span
        class="gen-preview-eq"
        :class="{ 'is-pending': pending }"
        title="Click to reroll"
        @click="reroll"
        v-katex="latex"
    ></span>
</template>

<script setup lang="ts">
    import { onUnmounted, ref, watch } from 'vue';
    import type { GeneratorState } from '@/types';

    const props = defineProps<{ state: GeneratorState }>();

    const latex = ref(props.state.spec.generate(props.state.values).text);
    const pending = ref(false);
    let timer: number | undefined;

    function roll() {
        latex.value = props.state.spec.generate(props.state.values).text;
        pending.value = false;
    }

    // Fade out, then roll a fresh sample after the delay (and fade back in)
    function scheduleRoll(delay: number) {
        pending.value = true;
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(roll, delay);
    }

    // Clicking the sample rerolls now, with the same fade but snappier
    function reroll() {
        scheduleRoll(120);
    }

    // A change to any tunable (or the difficulty) fades the sample out; once the
    // edits settle for a beat we roll a fresh sample and fade it back in
    const signature = () => JSON.stringify(props.state.values) + '|' + props.state.difficultyId;

    watch(signature, () => scheduleRoll(180));

    onUnmounted(() => {
        if (timer) window.clearTimeout(timer);
    });
</script>

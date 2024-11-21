<template>
    <span class="gen-preview-eq" v-katex="latex"></span>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { GeneratorState } from '@/types';

    const props = defineProps<{ state: GeneratorState }>();

    // Reads every value so the computed re-rolls a fresh sample only when this
    // generator's config actually changes, not on every unrelated sheet render
    const latex = computed(() => {
        void Object.values(props.state.values);
        return props.state.spec.generate(props.state.values).text;
    });
</script>

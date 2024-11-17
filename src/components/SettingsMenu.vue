<template>
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Settings" :style="sheetStyle">
        <div
            class="sheet-grip"
            @pointerdown="onGripDown"
            @pointermove="onGripMove"
            @pointerup="onGripUp"
            @pointercancel="onGripUp"
        >
            <span class="sheet-handle"></span>
        </div>

        <header class="sheet-head">
            <h2 class="sheet-title">Settings</h2>
            <button class="icon-btn" @click="emit('close')" aria-label="Close">
                <X :size="20" />
            </button>
        </header>

        <section class="sheet-body">
            <div
                class="gen-card"
                :class="{ 'is-off': !state.enabled }"
                v-for="state in problems"
                :key="state.spec.id"
            >
                <div class="gen-head">
                    <div class="gen-meta">
                        <span class="gen-name">{{ state.spec.name }}</span>
                        <span class="gen-desc">{{ state.spec.description }}</span>
                    </div>
                    <AppToggle v-model="state.enabled" />
                </div>

                <div class="gen-controls" v-show="state.enabled">
                    <AppSegmented
                        :model-value="state.difficultyId"
                        :options="difficultyOptions(state)"
                        @update:model-value="(id: string) => selectDifficulty(state, id)"
                    />

                    <div class="generator-tune">
                        <o-field label="Frequency" class="tune-field">
                            <o-slider v-model="state.weight" :min="1" :max="5" :step="1" tooltip />
                        </o-field>
                        <template v-for="field in state.spec.fields" :key="field.key">
                            <o-field
                                v-if="field.kind === 'number'"
                                :label="field.label"
                                class="tune-field"
                            >
                                <o-input
                                    number
                                    :min="field.min"
                                    :max="field.max"
                                    :step="field.step ?? 1"
                                    :model-value="readNumber(state, field.key)"
                                    @update:model-value="
                                        (value: unknown) =>
                                            setValue(state, field.key, Number(value))
                                    "
                                />
                            </o-field>
                            <o-field v-else :label="field.label" class="tune-field">
                                <o-switch
                                    :model-value="readBoolean(state, field.key)"
                                    @update:model-value="
                                        (value: unknown) =>
                                            setValue(state, field.key, value === true)
                                    "
                                />
                            </o-field>
                        </template>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { X } from 'lucide-vue-next';
    import AppToggle from '@/components/controls/AppToggle.vue';
    import AppSegmented from '@/components/controls/AppSegmented.vue';
    import { valuesForDifficulty } from '@/types';
    import type { GeneratorState } from '@/types';

    defineProps<{ problems: GeneratorState[] }>();
    const emit = defineEmits<{ close: [] }>();

    function difficultyOptions(state: GeneratorState) {
        return state.spec.difficulties.map((difficulty) => ({
            value: difficulty.id,
            label: difficulty.name,
        }));
    }

    function selectDifficulty(state: GeneratorState, difficultyId: string) {
        state.enabled = true;
        state.difficultyId = difficultyId;
        state.values = valuesForDifficulty(state.spec, difficultyId);
    }

    function readNumber(state: GeneratorState, key: string): number {
        return Number(state.values[key]);
    }

    function readBoolean(state: GeneratorState, key: string): boolean {
        return state.values[key] === true;
    }

    function setValue(state: GeneratorState, key: string, value: number | boolean) {
        state.values[key] = value;
    }

    // Drag-to-dismiss: the grip follows the pointer down; releasing past the
    // threshold slides the sheet the rest of the way out and then closes, while
    // a short drag snaps back up.
    const CLOSE_THRESHOLD = 110;
    const dragOffset = ref(0);
    const dragging = ref(false);
    const closing = ref(false);
    let startY = 0;

    const sheetStyle = computed(() => {
        if (closing.value) return { transform: 'translateY(100%)' };
        if (dragging.value)
            return { transform: `translateY(${dragOffset.value}px)`, transition: 'none' };
        return {};
    });

    function onGripDown(e: PointerEvent) {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        dragging.value = true;
        dragOffset.value = 0;
        startY = e.clientY;
    }
    function onGripMove(e: PointerEvent) {
        if (dragging.value) dragOffset.value = Math.max(0, e.clientY - startY);
    }
    function onGripUp() {
        if (!dragging.value) return;
        dragging.value = false;
        if (dragOffset.value > CLOSE_THRESHOLD) {
            closing.value = true;
            window.setTimeout(() => emit('close'), 280);
        } else {
            dragOffset.value = 0;
        }
    }
</script>

<style scoped lang="scss">
    .gen-controls {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        margin-top: 0.85rem;
    }

    .generator-tune {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 0.75rem 1.25rem;
    }

    .tune-field {
        min-width: 9rem;
    }
</style>

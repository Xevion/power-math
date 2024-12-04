<template>
    <div ref="groupEl" class="ui-segmented" role="radiogroup" @keydown="onKeydown">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="radio"
            class="ui-seg"
            :class="{ 'is-active': option.value === modelValue }"
            :aria-checked="option.value === modelValue"
            :tabindex="option.value === focusable ? 0 : -1"
            @click="emit('update:modelValue', option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, ref } from 'vue';

    const props = defineProps<{
        modelValue: string;
        options: { value: string; label: string }[];
    }>();
    const emit = defineEmits<{ 'update:modelValue': [string] }>();

    const groupEl = ref<HTMLElement | null>(null);

    // One tab stop for the group: the selected option, or the first if none is
    const focusable = computed(() =>
        props.options.some((o) => o.value === props.modelValue)
            ? props.modelValue
            : props.options[0]?.value,
    );

    // Arrows move the selection like a native radio group; Home/End jump to the ends
    function onKeydown(e: KeyboardEvent) {
        const last = props.options.length - 1;
        const index = props.options.findIndex((o) => o.value === props.modelValue);
        let next: number;
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                next = index >= last ? 0 : index + 1;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                next = index <= 0 ? last : index - 1;
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = last;
                break;
            default:
                return;
        }
        e.preventDefault();
        emit('update:modelValue', props.options[next].value);
        nextTick(() => groupEl.value?.querySelectorAll<HTMLElement>('.ui-seg')[next]?.focus());
    }
</script>

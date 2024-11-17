<template>
    <div class="ui-segmented" role="group">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="ui-seg"
            :class="{ 'is-active': option.value === modelValue }"
            @click="emit('update:modelValue', option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
    defineProps<{ modelValue: string; options: { value: string; label: string }[] }>();
    const emit = defineEmits<{ 'update:modelValue': [string] }>();
</script>

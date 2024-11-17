<template>
    <button
        type="button"
        class="ui-toggle"
        role="switch"
        :aria-checked="modelValue"
        :class="{ 'is-on': modelValue }"
        @click="emit('update:modelValue', !modelValue)"
    >
        <span class="ui-toggle-knob"></span>
    </button>
</template>

<script setup lang="ts">
    defineProps<{ modelValue: boolean }>();
    const emit = defineEmits<{ 'update:modelValue': [boolean] }>();
</script>

<template>
    <div
        ref="helpEl"
        class="help"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabindex="-1"
    >
        <header class="help-head">
            <h2 class="sheet-title">Keyboard shortcuts</h2>
            <button class="icon-btn" @click="emit('close')" aria-label="Close">
                <X :size="20" />
            </button>
        </header>

        <section v-for="group in groups" :key="group.title" class="help-group">
            <h3 class="gen-label">{{ group.title }}</h3>
            <dl class="help-rows">
                <div v-for="row in group.rows" :key="row.label" class="help-row">
                    <dt class="help-keys">
                        <template v-for="(key, i) in row.keys" :key="key">
                            <span v-if="i > 0" class="help-join">{{ row.join ?? 'or' }}</span>
                            <kbd>{{ key }}</kbd>
                        </template>
                    </dt>
                    <dd class="help-label">{{ row.label }}</dd>
                </div>
            </dl>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { X } from 'lucide-vue-next';
    import { useFocusTrap } from '@/composables/useFocusTrap';

    const emit = defineEmits<{ close: [] }>();

    const helpEl = ref<HTMLElement | null>(null);
    useFocusTrap(helpEl);

    interface Row {
        keys: string[];
        join?: string;
        label: string;
    }

    const groups: { title: string; rows: Row[] }[] = [
        {
            title: 'Solving',
            rows: [
                { keys: ['Enter'], label: 'Check your answer' },
                { keys: ['Up'], label: 'Skip to a new problem, clearing the box' },
                {
                    keys: ['Right'],
                    label: 'Count it as solved and move on, while the box is empty',
                },
                { keys: ['?'], label: 'Show or hide this list' },
                { keys: ['Esc'], label: 'Close this list or the settings' },
            ],
        },
        {
            title: 'Settings',
            rows: [
                { keys: ['Tab'], label: 'Move to the next control' },
                { keys: ['Shift', 'Tab'], join: '+', label: 'Move to the previous control' },
                { keys: ['Left', 'Right', 'Up', 'Down'], label: 'Adjust a slider or number' },
                { keys: ['Shift', 'Up'], join: '+', label: 'Adjust by ten steps' },
                { keys: ['PgUp', 'PgDn'], label: 'Adjust by ten steps' },
                { keys: ['Home', 'End'], label: 'Jump to the lowest or highest value' },
                { keys: ['Enter'], label: 'Type a number into a number field' },
                { keys: ['Esc'], label: 'Cancel typing' },
            ],
        },
    ];
</script>

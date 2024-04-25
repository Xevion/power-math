import katex from 'katex';
import type { Directive } from 'vue';

// Minimal replacement for vue-katex: render the bound expression into the
// element. vue-katex never shipped for Vue 3, and all we ever used was the
// v-katex directive and a render helper, so a tiny directive covers it.
function render(el: HTMLElement, value: unknown): void {
    el.innerHTML = katex.renderToString(String(value ?? ''), {
        throwOnError: false,
    });
}

export const katexDirective: Directive<HTMLElement, unknown> = {
    mounted(el, binding) {
        render(el, binding.value);
    },
    updated(el, binding) {
        if (binding.value !== binding.oldValue) {
            render(el, binding.value);
        }
    },
};

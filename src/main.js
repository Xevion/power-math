import { createApp } from 'vue';
import Oruga from '@oruga-ui/oruga-next';
import { bulmaConfig } from '@oruga-ui/theme-bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import { katexDirective } from './katex';
import 'katex/dist/katex.min.css';
import 'animate.css';
import './scss/main.scss';

library.add(faCog, faTimes);

const app = createApp(App);
app.component('vue-fontawesome', FontAwesomeIcon);
app.directive('katex', katexDirective);
app.use(Oruga, {
    ...bulmaConfig,
    iconComponent: 'vue-fontawesome',
    iconPack: 'fas',
});
app.mount('#app');

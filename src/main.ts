import { createApp } from 'vue';
import Oruga from '@oruga-ui/oruga-next';
import { bulmaConfig } from '@oruga-ui/theme-bulma';
import App from './App.vue';
import { katexDirective } from './katex';
import 'katex/dist/katex.min.css';
import 'animate.css';
import './scss/main.scss';

const app = createApp(App);
app.directive('katex', katexDirective);
app.use(Oruga, bulmaConfig);
app.mount('#app');

import Vue from 'vue'
import VueKatex from 'vue-katex';
import {ConfigProgrammatic, Input, Field, Button, Icon} from 'buefy';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import App from './App.vue'
import 'katex/dist/katex.min.css';
import './scss/buefy.scss';
import 'animate.css/animate.min.css';

Vue.config.productionTip = false
library.add(faCog);
Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Input);
Vue.use(Field);
Vue.use(Button);
Vue.use(Icon);
ConfigProgrammatic.setOptions({
    defaultIconComponent: 'vue-fontawesome',
    defaultIconPack: 'fas'
})
Vue.use(VueKatex);


new Vue({
    render: h => h(App),
}).$mount('#app')

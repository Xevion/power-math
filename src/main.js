import Vue from 'vue'
import VueKatex from 'vue-katex';
import { Input, Field } from 'buefy';
import App from './App.vue'
import 'katex/dist/katex.min.css';
import 'buefy/dist/buefy.css';
import 'animate.css/animate.min.css';


Vue.config.productionTip = false
Vue.use(Input);
Vue.use(Field);
Vue.use(VueKatex)

new Vue({
    render: h => h(App),
}).$mount('#app')

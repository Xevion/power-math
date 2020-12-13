import Vue from 'vue'
import VueKatex from 'vue-katex';
import App from './App.vue'
import 'katex/dist/katex.min.css';


Vue.config.productionTip = false
Vue.use(VueKatex)

new Vue({
    render: h => h(App),
}).$mount('#app')

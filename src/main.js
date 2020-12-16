import Vue from 'vue'
import VueKatex from 'vue-katex';
import Buefy from 'buefy';
import App from './App.vue'
import 'katex/dist/katex.min.css';
import 'buefy/dist/buefy.css';
import 'animate.css/animate.min.css';


Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(VueKatex)

new Vue({
    render: h => h(App),
}).$mount('#app')

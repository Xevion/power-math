(function(t){function n(n){for(var r,a,s=n[0],u=n[1],c=n[2],d=0,h=[];d<s.length;d++)a=s[d],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&h.push(i[a][0]),i[a]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(t[r]=u[r]);l&&l(n);while(h.length)h.shift()();return o.push.apply(o,c||[]),e()}function e(){for(var t,n=0;n<o.length;n++){for(var e=o[n],r=!0,s=1;s<e.length;s++){var u=e[s];0!==i[u]&&(r=!1)}r&&(o.splice(n--,1),t=a(a.s=e[0]))}return t}var r={},i={app:0},o=[];function a(n){if(r[n])return r[n].exports;var e=r[n]={i:n,l:!1,exports:{}};return t[n].call(e.exports,e,e.exports,a),e.l=!0,e.exports}a.m=t,a.c=r,a.d=function(t,n,e){a.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,n){if(1&n&&(t=a(t)),8&n)return t;if(4&n&&"object"===typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(a.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var r in t)a.d(e,r,function(n){return t[n]}.bind(null,r));return e},a.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(n,"a",n),n},a.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},a.p="/power-math/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=n,s=s.slice();for(var c=0;c<s.length;c++)n(s[c]);var l=u;o.push([0,"chunk-vendors"]),e()})({0:function(t,n,e){t.exports=e("56d7")},"56d7":function(t,n,e){"use strict";e.r(n);e("e260"),e("e6cf"),e("cca6"),e("a79d");var r=e("2b0e"),i=e("bfc7"),o=e("7f82"),a=e("10bd"),s=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"app"}},[e("div",{directives:[{name:"katex",rawName:"v-katex",value:t.expression,expression:"expression"}],staticClass:"animate__animated animate__faster",class:t.currentAnimation,attrs:{id:"expression"}}),e("div",{staticClass:"container"},[e("div",{staticClass:"columns is-centered"},[e("div",{staticClass:"column is-three-fifths"},[e("b-field",{attrs:{id:"input"},nativeOn:{keyup:function(n){return!n.type.indexOf("key")&&t._k(n.keyCode,"enter",13,n.key,"Enter")?null:t.checkAnswer()}}},[e("b-input",{attrs:{"custom-class":t.inputClass},model:{value:t.answer,callback:function(n){t.answer=n},expression:"answer"}})],1)],1)])])])},u=[],c=(e("a9e3"),e("25eb"),e("99af"),{methods:{getRandomInt:function(t,n){return t=Math.ceil(t),n=Math.floor(n),Math.floor(Math.random()*(n-t)+t)}}}),l={methods:{addition:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=c.methods.getRandomInt(5*t,100*t),e=c.methods.getRandomInt(5*t,100*t);return{text:"".concat(n," + ").concat(e),answer:n+e}},subtraction:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=c.methods.getRandomInt(5*t,100*t),e=c.methods.getRandomInt(5*t,100*t);return Math.random()>.5?{text:"".concat(n," - ").concat(e),answer:n-e}:{text:"-".concat(n," + ").concat(e),answer:-n+e}},multiplication:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=c.methods.getRandomInt(3*t,30*t),e=c.methods.getRandomInt(3*t,15*t);return{text:"".concat(n," \\times ").concat(e),answer:n*e}},division:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=c.methods.getRandomInt(3*t,30*t),e=c.methods.getRandomInt(2*t,15*t);return{text:"".concat(n*e," \\div ").concat(e),answer:n}},square_root:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=c.methods.getRandomInt(2*t,20*t);return{text:"\\sqrt{".concat(n*n,"}"),answer:n}},getProblem:function(){var t=[this.addition,this.subtraction,this.multiplication,this.division,this.square_root],n=c.methods.getRandomInt(0,t.length);return t[n]()}}},d={name:"App",data:function(){return{answer:null,currentQuestion:null,correctTimeout:!1,inputClass:!1,allowInputSubmit:!0,currentAnimation:null,chances:3}},computed:{expression:function(){return null!=this.currentQuestion?this.currentQuestion.text:"error"}},created:function(){var t=this;window.addEventListener("keyup",(function(n){38===n.keyCode?t.nextQuestion():39===n.keyCode&&t.checkAnswer(!0)}))},mounted:function(){var t=this;this.$nextTick((function(){t.nextQuestion()}))},methods:{nextQuestion:function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=l.methods.getProblem();null==this.currentQuestion?this.currentQuestion=e:(this.currentAnimation=n?"animate__fadeOutRight":"animate__fadeOutUp",setTimeout((function(){t.currentQuestion=e,t.currentAnimation="animate__fadeInDown",setTimeout((function(){t.currentAnimation=""}),500)}),200))},checkAnswer:function(){var t,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];(this.allowInputSubmit||n)&&(t="number"===typeof this.currentQuestion.answer?this.currentQuestion.answer===Number.parseInt(this.answer):this.currentQuestion.answer===this.answer,t||n?(this.inputClass="correct",setTimeout(this.clearInputClass,500),this.nextQuestion(),this.answer=""):(0===--this.chances&&(this.nextQuestion(!0),this.chances=3),this.inputClass="incorrect",setTimeout(this.clearInputClass,500),this.allowInputSubmit=!1,setTimeout(this.unlockInput,500)))},clearInputClass:function(){this.inputClass=""},unlockInput:function(){this.allowInputSubmit=!0}}},h=d,f=(e("5c0b"),e("2877")),p=Object(f["a"])(h,s,u,!1,null,null,null),m=p.exports;e("be0f"),e("5abe"),e("4b3c");r["a"].config.productionTip=!1,r["a"].use(o["a"]),r["a"].use(a["a"]),r["a"].use(i["a"]),new r["a"]({render:function(t){return t(m)}}).$mount("#app")},"5c0b":function(t,n,e){"use strict";var r=e("9c0c"),i=e.n(r);i.a},"9c0c":function(t,n,e){}});
//# sourceMappingURL=app.dafa2c7a.js.map
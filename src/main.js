// import Vue from 'vue'
// // import App from './App.vue'
// import Demo from './Demo.vue'
import Vue from "vue/dist/vue.js";
// //使用CDN引入Vue
// const Vue = window.Vue;
// window.Vue.config.productionTip = false

new Vue({
  
  data: {
    array:["a","b","c"],
  },
  template: `
    <div>
    {{array}}
    <div><button @click="setD">set d</button></div>
   </div>
   `,
  methods: {
    setD() {
      // this.array[3]="d";
      this.array.push('d');
    }
  }
  // render: h => h(Demo) //等价于conponents+template写法

}).$mount('#frank')
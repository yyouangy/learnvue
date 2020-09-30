<template>
  <div>
    {{n}}创新政策ßß得分ßß
    <button @click="add">+1</button>
  </div>
</template>

<script>
export default {
  name: "Demo",
  data() {
    return {
      n: 0,
    };
  },
  template: `
  <div>
  {{n}}
  <button @click="add">+1</button>
  </div>
  `,
  created() {
    console.log("这玩意出现在内存中，不出现在页面中");
  },
  mounted() {
    console.log("这玩意出现在页面中");
  },
  updated() {
    console.log("更新了");
    console.log(this.n);
  },
  destroyed() {
    console.log("Demo已经消亡了");
  },
  methods: {
    add() {
      this.n += 1;
    },
  },
};
</script>

<style>
</style>
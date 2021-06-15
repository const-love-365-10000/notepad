<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "notepad",
};
</script>
<script>
export default {
  name: "app",

  data() {
    return {};
  },

  methods: {},
};
</script>
<style>
/* CSS */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* background: #fff4ce; */
  background: #fff;
}

@import "/node_modules/@fortawesome/fontawesome-free/css/all.css";
</style>

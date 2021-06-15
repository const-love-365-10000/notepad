<template>
  <div class="rightClickMenu">
    <ul>
      <li class="buttonLi" v-for="(i, index) in buttons" :key="index">
        {{ i.name }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "rightClickMenu",
  props: {
    buttons: {
      type: Array,
    },
    bgColor: {
      type: String,
      default: "#454b50",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.buttonLi {
  color: #fff;
  padding: 0.7em 1em;
  cursor: pointer;
  background-color: #454b50;
}
.buttonLi:hover {
  background-color: #191929;
  color: #fff;
}
</style>
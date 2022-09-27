<template>
  <vue-json-pretty :data="data" :deep="depth" />
</template>

<script lang="ts" setup>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  defineProps({
    data: {
      type: Object,
      default: null,
    },
    depth: {
      type: Number,
      default: 0,
    },
  });
</script>

<style>
  [data-theme='dark'] .vjs-tree__node.is-highlight,
  [data-theme='dark'] .vjs-tree__node:hover {
    background-color: #363b40;
  }
</style>

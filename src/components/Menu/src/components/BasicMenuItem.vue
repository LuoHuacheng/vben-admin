<template>
  <MenuItem :key="item.path">
    <MenuItemContent v-bind="getBindProps" :item="item" />
  </MenuItem>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { itemProps } from '../props';

  import MenuItemContent from './MenuItemContent.vue';
  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItem: Menu.Item, MenuItemContent },
    props: itemProps,
    setup(props) {
      const getBindProps = computed<Recordable>(() => ({ ...props }));
      return {
        getBindProps,
      };
    },
  });
</script>

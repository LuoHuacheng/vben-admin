<template>
  <div class="lg:flex">
    <Avatar :size="72" class="!mx-auto !block" style="color: #0084f4; background-color: #c5e5f5">
      {{ userInfo.userName }}
    </Avatar>
    <div class="md:ml-6 flex flex-1 flex-col justify-center md:mt-0 mt-2">
      <h1 class="md:text-lg text-md">加油, {{ userInfo.userName }}, 离梦想更近一步!</h1>
      <span class="text-secondary">{{ saying }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';

  const saying = ref('');
  onMounted(async () => {
    const res = await fetch('https://v1.jinrishici.com/rensheng/lizhi').then((res) => res.json());
    saying.value = `${res.content} 《${res.origin}》 - ${res.author}`;
  });

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.getUserInfo);
</script>

<template>
  <ConfigProvider :locale="getAntdLocale" :transform-cell-text="transformCellText">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { isArray } from 'lodash-es';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  const { lastBuildTime } = __APP_INFO__;

  // support Multi-language
  const { getAntdLocale } = useLocale();

  function transformCellText({ text }) {
    let textTransformed = text;
    if (isArray(text) && !text.length) {
      textTransformed = ['--'];
    }
    return textTransformed;
  }

  window.__LAST_BUILD_TIME__ = lastBuildTime;

  // Listening to page changes and dynamically changing site titles
  useTitle();

  onMounted(() => {
    document.oncopy = (event) => {
      let content = window?.getSelection()?.toString() || '';
      if (event.clipboardData) {
        event.clipboardData.setData('text/plain', content.trim());
        event.preventDefault();
      }
    };
  });
</script>

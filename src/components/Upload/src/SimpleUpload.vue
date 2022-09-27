<template>
  <div class="clearfix">
    <Upload
      v-model:file-list="fileList"
      list-type="picture-card"
      accept="image/png, image/jpeg"
      :max-count="maxNumber"
      :before-upload="beforeUpload"
      :customRequest="customRequest"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < maxNumber">
        <plus-outlined />
        <p class="text-12px">大小不超过{{ maxSize }}MB</p>
      </div>
    </Upload>
    <Modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </Modal>
  </div>
</template>
<script lang="ts">
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { defineComponent, ref, watch } from 'vue';
  import { Upload, Modal } from 'ant-design-vue';
  import { formatToDate } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  export default defineComponent({
    components: {
      Upload,
      Modal,
      PlusOutlined,
    },
    props: {
      uploadFunc: {
        type: Function,
        required: true,
      },
      maxNumber: {
        type: Number,
        default: 1,
      },
      maxSize: {
        type: Number,
        default: 2,
      },
      existedFiles: {
        type: Array,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const previewVisible = ref(false);
      const previewImage = ref('');
      const previewTitle = ref('');

      const fileList = ref<any[]>([]);

      watch(
        () => props.existedFiles,
        (data) => {
          if (data && data.length) {
            fileList.value.push(...data);
          } else {
            fileList.value = [];
          }
        },
      );

      const handleCancel = () => {
        previewVisible.value = false;
        previewTitle.value = '';
      };
      const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
        previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
      };

      async function customRequest(option: any) {
        const { file } = option;
        const type = file.type.replace('image/', '');
        const now = Date.now();
        const today = formatToDate(now);
        try {
          const res = await props.uploadFunc({
            name: `${today}/img_${now}.${type}`,
            file,
          });
          if (res.success) {
            option.onSuccess(res.url);
            emit('change', res.url);
          } else {
            createMessage.error(res.message).then(() => fileList.value.pop());
          }
        } catch (error) {
          createMessage.error('上传失败, 请重新上传');
          option.onError(error);
          throw error;
        }
      }

      function beforeUpload(file: File) {
        const { maxSize } = props;
        const isBigger = maxSize && file.size / 1024 / 1024 >= maxSize;
        if (isBigger) {
          createMessage.error(`只能上传大小不超过${maxSize}MB的图片`);
        }
        return !isBigger || Upload.LIST_IGNORE;
      }

      return {
        previewVisible,
        previewImage,
        fileList,
        handleCancel,
        customRequest,
        beforeUpload,
        handlePreview,
        previewTitle,
      };
    },
  });
</script>
<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

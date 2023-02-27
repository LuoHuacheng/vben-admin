<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
    width="800px"
    :canFullscreen="false"
    :afterClose="onAfterClose"
    @ok="handleOk"
    okText="确认上传"
  >
    <div :class="prefixCls">
      <div :class="`${prefixCls}-left`">
        <div :class="`${prefixCls}-cropper`">
          <CropperImage
            v-if="src"
            :src="src"
            height="300px"
            :circled="circled"
            :options="cropperOption"
            @cropend="handleCropend"
            @ready="handleReady"
          />
        </div>

        <div :class="`${prefixCls}-toolbar`">
          <Upload :fileList="[]" accept="image/*" :beforeUpload="handleBeforeUpload">
            <Tooltip title="选择图片" placement="bottom">
              <x-button size="small" type="primary" preIcon="ant-design:upload-outlined" />
            </Tooltip>
          </Upload>
          <Space>
            <Tooltip title="重置" placement="bottom">
              <x-button
                type="primary"
                preIcon="ant-design:reload-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('reset')"
              />
            </Tooltip>
            <Tooltip title="逆时针旋转" placement="bottom">
              <x-button
                type="primary"
                preIcon="ant-design:rotate-left-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('rotate', -45)"
              />
            </Tooltip>
            <Tooltip title="顺时针旋转" placement="bottom">
              <x-button
                type="primary"
                preIcon="ant-design:rotate-right-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('rotate', 45)"
              />
            </Tooltip>
            <Tooltip title="水平翻转" placement="bottom">
              <x-button
                type="primary"
                preIcon="vaadin:arrows-long-h"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('scaleX')"
              />
            </Tooltip>
            <Tooltip title="垂直翻转" placement="bottom">
              <x-button
                type="primary"
                preIcon="vaadin:arrows-long-v"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('scaleY')"
              />
            </Tooltip>
            <Tooltip title="放大" placement="bottom">
              <x-button
                type="primary"
                preIcon="ant-design:zoom-in-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('zoom', 0.1)"
              />
            </Tooltip>
            <Tooltip title="缩小" placement="bottom">
              <x-button
                type="primary"
                preIcon="ant-design:zoom-out-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('zoom', -0.1)"
              />
            </Tooltip>
          </Space>
        </div>
      </div>
      <div :class="`${prefixCls}-right`">
        <div :class="[`${prefixCls}-preview`, circled ? 'circled' : '']">
          <img v-if="previewSource" :src="previewSource" alt="预览" />
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import type { CropendResult, Cropper } from './typing';

  import { defineComponent, ref } from 'vue';
  import CropperImage from './Cropper.vue';
  import { Space, Upload, Tooltip } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { dataURLtoBlob } from '/@/utils/file/base64Conver';
  import { isFunction } from '/@/utils/is';
  import { buildNanoId } from '/@/utils/uuid';
  import { formatToDate } from '/@/utils/dateUtil';

  type apiFunParams = { file: Blob; name: string; filename: string };

  const props = {
    title: { type: String, default: '图片上传' },
    local: { type: Boolean, default: false },
    circled: { type: Boolean, default: false },
    uploadApi: {
      type: Function as PropType<(params: apiFunParams) => Promise<any>>,
    },
    cropperOption: {
      type: Object,
      default: () => ({}),
    },
    src: { type: String },
  };

  export default defineComponent({
    name: 'CropperModal',
    components: { BasicModal, Space, CropperImage, Upload, Tooltip },
    props,
    emits: ['uploadSuccess', 'uploadFail', 'register'],
    setup(props, { emit }) {
      let filename = '';
      const src = ref(props.src || '');
      const previewSource = ref('');
      const cropper = ref<Cropper>();
      let scaleX = 1;
      let scaleY = 1;

      const { prefixCls } = useDesign('cropper-am');
      const [register, { closeModal, setModalProps }] = useModalInner();

      // Block upload
      function handleBeforeUpload(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        src.value = '';
        previewSource.value = '';
        reader.onload = function (e) {
          src.value = (e.target?.result as string) ?? '';
          filename = file.name;
        };
        return false;
      }

      function handleCropend({ imgBase64 }: CropendResult) {
        previewSource.value = imgBase64;
      }

      function handleReady(cropperInstance: Cropper) {
        cropper.value = cropperInstance;
      }

      function handlerToolbar(event: string, arg?: number) {
        if (event === 'scaleX') {
          scaleX = arg = scaleX === -1 ? 1 : -1;
        }
        if (event === 'scaleY') {
          scaleY = arg = scaleY === -1 ? 1 : -1;
        }
        cropper?.value?.[event]?.(arg);
      }

      async function handleOk() {
        if (props.local) {
          emit('uploadSuccess', { source: previewSource.value });
        } else {
          const uploadApi = props.uploadApi;
          if (uploadApi && isFunction(uploadApi)) {
            const blob = dataURLtoBlob(previewSource.value);
            try {
              setModalProps({ confirmLoading: true });
              const path = formatToDate(Date.now());
              const name = `${path}/${buildNanoId()}.png`;
              const result = await uploadApi({ name, file: blob, filename });
              emit('uploadSuccess', { source: previewSource.value, data: result });
              closeModal();
            } catch (error) {
              emit('uploadFail', error);
            } finally {
              setModalProps({ confirmLoading: false });
            }
          }
        }
      }

      async function onAfterClose() {
        src.value = '';
        previewSource.value = '';
      }

      return {
        prefixCls,
        src,
        register,
        previewSource,
        handleBeforeUpload,
        handleCropend,
        handleReady,
        handlerToolbar,
        handleOk,
        onAfterClose,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-cropper-am';

  .@{prefix-cls} {
    display: flex;

    &-left,
    &-right {
      height: 340px;
    }

    &-left {
      width: 55%;
    }

    &-right {
      width: 45%;
    }

    &-cropper {
      height: 300px;
      background: #eee;
      background-image: linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        ),
        linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        );
      background-position: 0 0, 12px 12px;
      background-size: 24px 24px;
    }

    &-toolbar {
      display: flex;
      justify-content: spx-between;
      align-items: center;
      margin-top: 10px;
    }

    &-preview {
      margin: 0 auto;
      width: 320px;
      height: 200px;
      text-align: center;
      overflow: hidden;
      border: 1px solid @border-color-base;

      &.circled {
        width: 220px;
        height: 220px;
        border-radius: 50%;
      }

      img {
        display: inline-block;
        height: 100%;
      }
    }

    &-group {
      display: flex;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid @border-color-base;
      justify-content: spx-around;
      align-items: center;
    }
  }
</style>

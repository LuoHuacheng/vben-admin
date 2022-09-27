import { withInstall } from '/@/utils';
import advanceUpload from './src/AdvanceUpload.vue';
import simpleUpload from './src/SimpleUpload.vue';

export const AdvanceUpload = withInstall(advanceUpload);
export const SimpleUpload = withInstall(simpleUpload);

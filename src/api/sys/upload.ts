import OSS from 'ali-oss';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
interface SecretResp {
  AccessKeyId: string;
  AccessKeySecret: string;
  Expiration: string;
  SecurityToken: string;
  bucket: string;
  region: string;
}
export async function getUploadSecret(params: UploadFileParams) {
  const secret = await defHttp.get<SecretResp>({ url: '/tool/upload/get_sts_token' });
  const client = new OSS({
    region: `oss-${secret.region}`,
    accessKeyId: secret.AccessKeyId,
    accessKeySecret: secret.AccessKeySecret,
    stsToken: secret.SecurityToken,
    bucket: secret.bucket,
    secure: true,
  });
  try {
    const res = await client.put(params.name, params.file);
    return import.meta.env.VITE_GLOB_APP_CDN_DOMAIN + res.name;
  } catch (error) {
    console.error(error);
  }
}

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<any>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}

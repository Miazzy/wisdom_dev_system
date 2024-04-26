import { FILE_PREVIEW } from '@/constant/constant';
import { useUserStore } from '/@/store/modules/user';

export const getTokenURL = (url) => {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return `${url}?token=${token}`;
};

export const getPreviewDomain = () => {
  const previewURL = `${FILE_PREVIEW.PREVIEW_DOMAIN}:${FILE_PREVIEW.PREVIEW_PORT}`; // 预览域名
  return previewURL;
};

export const getDownloadURL = (url, type = 'donwload') => {
  const pictureTypes = JSON.parse(FILE_PREVIEW.IMAGE_TYPES);
  const arrays = pictureTypes.filter((item) => url.indexOf(item) > 0);
  if (arrays.length === 0 && type === 'preview') {
    const domain = `${FILE_PREVIEW.FILE_DOMAIN}:${FILE_PREVIEW.FILE_PORT}`;
    return domain + getTokenURL(url);
  } else {
    const domain = `${FILE_PREVIEW.DOWNLOAD_DOMAIN}:${FILE_PREVIEW.DOWNLOAD_PORT}`;
    return domain + getTokenURL(url);
  }
};

export const getPreviewURL = (url, name) => {
  const title = name || '文档预览';
  const previewUrl = `${getDownloadURL(url, 'preview')}&fullfilename=${title}`;
  return previewUrl;
};

export const getFilePreviewURL = (url, name) => {
  const base = btoa(encodeURI(getPreviewURL(url, name)));
  const purl = encodeURIComponent(base);
  return `${getPreviewDomain()}/onlinePreview?url=${purl}`;
};

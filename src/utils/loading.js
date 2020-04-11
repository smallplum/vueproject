import { Loading } from 'element-ui';

let loadingCount = 0;
let loading;

const startLoading = (text = "加载中……") => {
  loading = Loading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.7)'
  });
};

const endLoading = () => {
  loading.close();
};

export const showLoading = (text) => {
  if (loadingCount === 0) {
    startLoading(text);
  }
  loadingCount += 1;
};

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};

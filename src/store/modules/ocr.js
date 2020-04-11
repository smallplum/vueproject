const ocr = {
  state: {
    result: null,
    img_url: '',
  },
  mutations: {

    // 此处函数只接受一个传入值，即value
    setData(state, value) {
      state.result = value;
      state.img_url = value.structure_image_url;
      localStorage.setItem('result', JSON.stringify(value));
      localStorage.setItem('img_url', JSON.stringify(value.images_url[0]));
    },
    setPageImg(state, value) {
      state.img_url = value;
      localStorage.setItem('img_url', JSON.stringify(value));
    },

    // 注销
    removeFile(state) {
      state.result = null;
      localStorage.removeItem('result');
      localStorage.removeItem('img_url');
    }

  },
  actions: {

  }
};

export default ocr;

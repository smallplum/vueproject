const app = {
  state: {
    serachData: [],
    serachDataSelf: null,
    serachTotle: '',
    serachStr: '',
    serachType: '',
    randomA: 0,
    randomB: 0
  },
  mutations: {
    commitSerachData(state, data) {
      // shift() 方法用于把数组的第一个元素从其中删除,并返回第一个元素的值
      const _self = data.shift();
      state.serachDataSelf = _self;
      state.serachStr = _self.scaffold_smiles;
      state.serachTotle = _self.total_number;
      state.randomA = Math.floor(Math.random() * 50);
      state.randomB = Math.floor(Math.random() * 50);
      state.serachData = data;
    },
    commitSerachGetData(state, data) {
      const _self = data.shift();
      state.serachDataSelf = _self;
      state.randomA = Math.floor(Math.random() * 50);
      state.randomB = Math.floor(Math.random() * 50);
      state.serachData = data;
    },

    commitSerachStr(state, data) {
      state.serachStr = data;
    },
    commitSerachType(state, data) {
      state.serachType = data;
    },
  },
  actions: {

  }
};
export default app;

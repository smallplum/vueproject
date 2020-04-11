const path = {
  state: {
    pathData: [],
    currentPath: ''
  },
  mutations: {
    commitSessionAddPath(state, data) {
      let paths = [];
      paths = JSON.parse(sessionStorage.getItem('path') || '[]');
      paths.push(data);

      state.currentPath = data;
      state.pathData = paths;

      sessionStorage.setItem('cur_path', JSON.stringify(data));
      sessionStorage.setItem('path', JSON.stringify(paths));
    },
    commitAddPath(state, data) {
      let paths = [];
      paths = JSON.parse(sessionStorage.getItem('path') || '[]');
      paths.push(data);

      state.currentPath = data;
      state.pathData = paths;

      sessionStorage.setItem('cur_path', JSON.stringify(data));
      sessionStorage.setItem('path', JSON.stringify(paths));
    },

    commitRemovePath(state, data) {
      let paths = [];
      paths = JSON.parse(sessionStorage.getItem('path') || '[]');
      paths.splice(data + 1, paths.length - data + 1);
      
      state.currentPath = paths[data];
      state.pathData = paths;
      sessionStorage.setItem('cur_path', JSON.stringify(data));
      sessionStorage.setItem('path', JSON.stringify(paths));
    },

    commitClearPath(state, data) {
      const paths = [];
      state.currentPath = data;
      state.pathData = paths;
      localStorage.setItem('path', JSON.stringify(paths));
      sessionStorage.setItem('cur_path', JSON.stringify(data));
    },
  },

};

export default path;

const login = {
  state: {
    userAccount: '',
    volunt:'',
    sessionid:''
  },
  mutations: {
    setUser(state, value) {
      let Base64 = require('js-base64').Base64;
      state.userAccount = value.userAccount;
      state.volunt = Base64.encode(value.auth);
      state.sessionid = value.sessionid;
      localStorage.setItem('user', JSON.stringify(state));
     
      
    },
    removeUser(state) {
      state.account = null;
      localStorage.removeItem('user');
    }

  },
  actions: {

  }
};

export default login;

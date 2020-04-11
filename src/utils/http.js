
import axios from 'axios';
// import qs from 'qs';

axios.defaults.withCredentials = true; // 设置跨域

const getHeaders = () => ({
    "Content-Type": "application/json",
});

export default {
    axiospost(url, data) {
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
        axios.defaults.headers['sessionid'] = JSON.parse(localStorage.getItem("user") ||'[]').sessionid;
        return new Promise((resolve, reject) => {
            axios.post(url, data, {
                headers: getHeaders(),
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    axiospostForUpData(url, data) {
        axios.defaults.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
        axios.defaults.headers['sessionid'] = JSON.parse(localStorage.getItem("user") ||'[]').sessionid;
        return new Promise((resolve, reject) => {
            axios.post(url, data).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    axiosget: (url, data) => new Promise((resolve, reject) => {
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
        axios.defaults.headers['sessionid'] = JSON.parse(localStorage.getItem("user") ||'[]').sessionid;
        axios.get(url, {
            params: data,
            headers: getHeaders(),
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        });
    }),
    axiosmock: (url, param, data) => new Promise((resolve, reject) => {
        console.log('%c当前url', 'padding: 3px; background: #009fff; color: #fff; border-radius: 3px;', url)
        console.log('%c当前请求参数', 'padding: 3px; background:#ff0024; color: #fff; border-radius: 3px;', param)
        resolve(data);
        reject(err)
    })
};

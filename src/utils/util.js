export default {
    // 从地址中获取某个字段
    getUrlquery: (name) => {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return '';
    },

    // 获取某个url中全部参数
    getParams(url, token = '#') {
        const vars = {};
        let hash;
        let i;

        url = url || window.location.href;

        // 没有参数的情况
        if (url.indexOf(token) === -1) {
            return vars;
        }

        const hashes = url.slice(url.indexOf(token) + 1).split('&');

        for (i = 0; i < hashes.length; i++) {
            if (!hashes[i] || hashes[i].indexOf('=') === -1) {
                continue;
            }
            hash = hashes[i].split('=');
            if (hash[1]) {
                vars[hash[0]] = (hash[1].indexOf('#') > -1) ? hash[1].slice(0, hash[1].indexOf('#')) : hash[1];
                vars[hash[0]] = decodeURIComponent(vars[hash[0]]);
            }
        }
        return vars;
    },

    transformFileName(preFileName, identifyStr, token = '_') {
        let name = preFileName;
        let flag = name.indexOf(".");
        return `${name.substr(0, flag)}${token}${identifyStr}${name.substr(flag, name.length)}`;
    },
    expandNumberlist(length) {
        let arr = [];
        for (let i = 1; i <= Number(length); i++) {
            arr.push(i);
        }
        return arr;
    },
    removeExiteListlement(originArr, currentArr) {
        let arr = [];
        for (let i = 0; i < originArr.length; i++) {
            if (!currentArr.includes(originArr[i])) {
                arr.push(originArr[i])
            }
        }
        return arr
    }
}
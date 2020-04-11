
/**
 * @desc 本地存储，直传 JSON 即可
 */
const IMPLICITY_KEY = '@';

class Storage {
    constructor(bulk, isSession) {
        this.storage = isSession ? sessionStorage : localStorage;
        this.bulk = bulk;
    }

    set(data) {
        if (this.bulk !== '') {
            this.storage.setItem(this.bulk, JSON.stringify({
                [IMPLICITY_KEY]: data,
            }));
        }
    }

    get() {
        if (this.bulk !== '') {
            const cache = JSON.parse(this.storage.getItem(this.bulk));
            return cache ? cache[IMPLICITY_KEY] : null;
        }
        return null;
    }

    remove() {
        if (this.bulk !== '') {
            this.storage.removeItem(this.bulk);
        }
    }
}

export default Storage;

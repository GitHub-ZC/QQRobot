const moment = require("moment");

class TimeEventManager {
    static hmap = new Map();
    static timer = setInterval(() => {
        this.hmap.forEach(function (value, key, map) {
            // console.log(key, map);
            if (Array.isArray(value)) {
                map.set(key, value.filter(ele => {
                    if (moment().isSameOrAfter(moment(ele.time, 'YYYY-MM-DD HH:mm'))) {
                        ele.group.sendMsg(ele.atText || '服务器异常');
                        return false;
                    }
                    return true;
                }));
            }
        });
    }, 1000 * 20);

    static getTimeEventManager() {
        return TimeEventManager.hmap;
    }

    static setTimeEventToManager(key, value) {
        if (!TimeEventManager.hmap.has(key)) {
            TimeEventManager.hmap.set(key, [value]);
        } else {
            let arr = TimeEventManager.hmap.get(key);
            TimeEventManager.hmap.set(key, [...arr, value]);
        }
    }

    static clearTimeEventManager(key, index) {
        if (index) {
            let arr = TimeEventManager.hmap.get(key) || [];
            if (index - 1 > arr.length) {
                return '';
            }
            arr.splice(index - 1, 1);
            // // 清除定时器
            // if (Array.isArray(timearr) && timearr.length > 0) {
            //     clearTimeout(timearr[0].timer);
            // }
            TimeEventManager.hmap.set(key, arr);
        } else {
            TimeEventManager.hmap.set(key, []);
        }
    }

    static getAllTimeEventInManager(key) {
        return TimeEventManager.hmap.get(key) || [];
    }
}


module.exports = TimeEventManager;
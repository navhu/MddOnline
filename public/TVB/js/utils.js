const Utils = {
    /**
     * 合并对象
     * @param {Object} a
     * @param {Object} b
     * @returns {Object}
     */
    extend: function (a, b) {
        for (var key in b) {
            a[key] = b[key];
        }
        return a;
    },

    /**
     * 将url参数字符串转成对象
     * @param {String} url
     * @returns {Object}
     */
    mapQuery: function (url) {
        var f = url.indexOf('?');
        var array = url.substring(f + 1).split('&');
        var result = {};

        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            f = item.indexOf('=');

            if (f === -1) {
                result[item] = '';
            } else {
                var key = item.substring(0, f);
                var value = item.substring(f + 1);
                result[key] = decodeURIComponent(value);
            }
        }

        return result;
    },

    /**
     * 将对象转成url参数
     * @param obj
     * @returns {string}
     */
    ObjToUrl: function (obj) {
        var arr = [];
        var key;

        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }

        return arr.join('&');
    },

    /**
     * 将时间毫秒数格式化
     * @param {number} time 时间戳
     * @param {string} format 格式
     */
    formatDate: function (time, format) {
        var defaultFormat = format || 'YY-MM-DD hh:mm:ss';
        var date = new Date(time || new Date().getTime());

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        // 开一个10位数的数组用于补0
        var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
            return '0' + index;
        });

        var newTime = defaultFormat.replace(/YY/g, year)
            .replace(/MM/g, preArr[month] || month)
            .replace(/DD/g, preArr[day] || day)
            .replace(/hh/g, preArr[hour] || hour)
            .replace(/mm/g, preArr[min] || min)
            .replace(/ss/g, preArr[sec] || sec);

        return newTime;
    }
};
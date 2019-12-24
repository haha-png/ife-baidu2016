window.addEventListener('load', () => {
    /* 数据格式演示
    var aqiSourceData = {
      "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
      }
    };
    */

    //以下两个函数用于随机生成模拟数据
    function getDateStr(dat) {
        let y = dat.getFullYear();
        let m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = dat.getDate();
        d = d < 10 ? '0' + d : d;

        return y + '-' + m + '-' + d;
    }
    function randomBuildData(seed) {
        let returnData = {};
        let dat = new Date('2019-01-01');
        let datStr = '';

        for (let i = 1; i < 91; i++) {
            datStr = getDateStr(dat);

            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }

        return returnData;
    }

    // 测试数据
    var aqiSourceData = {
        '北京': randomBuildData(500),
        '上海': randomBuildData(300),
        '广州': randomBuildData(400),
        '厦门': randomBuildData(200),
        '阜阳': randomBuildData(300),
        '福州': randomBuildData(250),
        '泉州': randomBuildData(450)
    }

    var $ = document.getElementById.bind(document);

    var time = 'day';
    
    var city = '北京';

    function render() {
        switch (time) {
            case 'day': 
                dayHistogram();
                break;
            case 'week':
                weekHistogram();
                break;
            case 'month':
                monthHistogram();
                break;
            default:
                break;
        }
    }

    function dayHistogram() {
        var target = $('chart');
        var docFragment = document.createDocumentFragment();

        target.innerHTML = '';

        for (var key in aqiSourceData[city]) {
            var chartItem = document.createElement('div');
            chartItem.className = 'chart-day';
            chartItem.style.height = aqiSourceData[city][key] + 'px';
            chartItem.title = key + '\n' + '[AQI] ' + aqiSourceData[city][key];

            docFragment.appendChild(chartItem);
        }

        target.appendChild(docFragment);
    }

    function weekHistogram() {
        var target = $('chart');
        var docFragment = document.createDocumentFragment();
        var month = 1;
        var week = 1;
        var sum = 0;
        var count = 0;
        var returnData = [];

        target.innerHTML = '';

        for (var key in aqiSourceData[city]) {

            var dat = new Date(key);

            sum += aqiSourceData[city][key];
            count++;

            if ((dat.getMonth() + 1) !== month || dat.getDate === 31 || dat.getDate === 28) {
                // returnData.push([(dat.getMonth() + 1), week, sum/count]);
                month++;
                week = 1;
                sum = 0;
                count = 0;
            }

            if (dat.getDay() === 0) {
                returnData.push([(dat.getMonth() + 1), week, sum/count]);
            
                week++;
                sum = 0;
                conut = 0;
            }
        }

        returnData.forEach(element => {
            var chartItem = document.createElement('div');
            chartItem.className = 'chart-week';
            chartItem.style.height = element[2] + 'px';
            chartItem.title = '2019年' + '0' + element[0] + '月第' + element[1] + '周\n' + '[AQI] ' + element[2];

            docFragment.appendChild(chartItem);
        })

        target.appendChild(docFragment);
    }

    function monthHistogram() {
        var target = $('chart');
        var docFragment = document.createDocumentFragment();
        var month = 1;
        var sum = 0;
        var count = 0;
        var returnData = [];

        target.innerHTML = '';

        for (var key in aqiSourceData[city]) {
            var dat = new Date(key);

            sum += aqiSourceData[city][key];
            count++;

            if ((dat.getMonth() + 1) !== month || dat.getDate() === 31 || (dat.getDate() === 28 && dat.getMonth() === 1)) {
                returnData.push([month, sum/count]);

                month++;
                sum = 0;
                count = 0;
            }
        }

        returnData.forEach(element => {
            var chartItem = document.createElement('div');
            chartItem.className = 'chart-month';
            chartItem.style.height = element[1] + 'px';
            chartItem.title = '2019年' + '0' + element[0] + '月' + '\n' + '[AQI] ' + element[2];

            docFragment.appendChild(chartItem);
        })

        target.appendChild(docFragment);
    }

    function selectTime(evt) {
        let target = evt.target;

        if (target.value !== time) {
            switch (target.value) {
                case 'day': 
                    time = 'day';
                    break;
                case 'week':
                    time = 'week';
                    break;
                case 'month':
                    time = 'month';
                    break;
                default:
                    break;
            }

            render();
        }
    }

    function selectCity(evt) {
        var target = evt.target;

        switch (target.value) {
            case 'bj':
                city = '北京';
                break;
            case 'sh':
                city = '上海';
                break;
            case 'gz':
                city = '广州';
                break;
            case 'xm': 
                city = '厦门';
                break;
            case 'fy':
                city = '阜阳';
                break;
            case 'fz':
                city = '福州';
                break;
            case 'qz':
                city = '泉州';
                break;
            default: 
                break;
        }

        render();
    }

    function init() {
        render();

        var time = document.getElementsByName('gra-time');

        for (let i = 0; i < time.length; i++) {
            time[i].addEventListener('click', selectTime);
        }

        $('city-select').addEventListener('change', selectCity);
    }

    init();
})
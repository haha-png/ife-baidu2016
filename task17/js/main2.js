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

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2019-01-01");
    var datStr = ''
    for (var i = 1; i < 91; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
};

//记录当前页面表单的select元素，之后可以为其追加城市选项（option）
let citySelector = document.getElementById('city-select');

/**
 * 渲染图表
 */
function renderChart() {
    let target = document.getElementById('chart');
    let fragment = document.createDocumentFragment();

    target.innerHTML = ''
    
    for (let key in chartData) {

        let div = document.createElement('div');
        div.className = 'chart-' + pageState.nowGraTime;
        div.style.height = chartData[key] + 'px';

        fragment.appendChild(div);
    }

    target.appendChild(fragment);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(evt) {
    let target = evt.target;
    let aqiPrimitive = aqiSourceData[pageState.nowSelectCity];
    // 确定是否选项发生了变化 
    if (target.value === pageState.nowGraTime) {
        return;
    }
    // 设置对应数据
    pageState.nowGraTime = target.value;
    target.parentNode.className = "checked";

    if (target.value === 'day') {
        chartData = aqiPrimitive;
    }
    else if (target.value === 'week') {
        let temp = {};
        let month = 0;
        let week = 1;
        let day = 0;
        let sum = 0;
        let count = 0;

        for (var key in aqiPrimitive) {
            let dat = new Date(key);

            if (dat.getMonth() > month) {
                let index = key.replace(/-\d\d$/, '') + '月第' + week + '周';

                temp[index] = Math.floor(sum / count);
                month++;
                sum = 0;
                count = 0;
                day = 0;
                week = 1;
            }

            sum += aqiPrimitive[key];
            count++;
            day = dat.getDay();

            if (dat.getDay() === 6) {
                let index = key.replace(/-\d\d$/, '') + '月第' + week + '周';

                temp[index] = Math.floor(sum / count);
                sum = 0;
                count = 0;
                day = 0;
                week++;
            }
        }

        let index = key.replace(/-\d\d$/, '') + '月第' + (week + 1) + '周';
        temp[index] = Math.floor(sum / count);
        chartData = temp;
    }
    else if (target.value === 'month') {
        let temp = {};
        let month = 0;
        let sum = 0;
        let count = 0;

        for (let key in aqiPrimitive) {
            let dat = new Date(key);

            if (dat.getMonth() > month) {
                let index = '2019-0' + (dat.getMonth() - 1);

                temp[index] = Math.floor(sum / count);
                sum = 0;
                count = 0;
                month++;
            }

            sum += aqiPrimitive[key];
            count++;
        }

        temp['2019-03'] = Math.floor(sum / count);
        chartData = temp;
    }
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(evt) {
    let target = evt.target;
    let aqiPrimitive = aqiSourceData[pageState.nowSelectCity];
    // 确定是否选项发生了变化 
    if (target.value === pageState.nowSelectCity) {
        return;
    }
    // 设置对应数据
    pageState.nowSelectCity = target.value;

    if (pageState.nowGraTime === 'day') {
        chartData = aqiPrimitive;
    }
    else if (pageState.nowGraTime === 'week') {
        let temp = {};
        let month = 0;
        let week = 1;
        let day = 0;
        let sum = 0;
        let count = 0;

        for (var key in aqiPrimitive) {
            let dat = new Date(key);

            if (dat.getMonth() > month) {
                let index = key.replace(/-\d\d$/, '') + '月第' + week + '周';

                temp[index] = Math.floor(sum / count);
                month++;
                sum = 0;
                count = 0;
                day = 0;
                week = 1;
            }

            sum += aqiPrimitive[key];
            count++;
            day = dat.getDay();

            if (dat.getDay() === 6) {
                let index = key.replace(/-\d\d$/, '') + '月第' + week + '周';

                temp[index] = Math.floor(sum / count);
                sum = 0;
                count = 0;
                day = 0;
                week++;
            }
        }

        let index = key.replace(/-\d\d$/, '') + '月第' + (week + 1) + '周';
        temp[index] = Math.floor(sum / count);
        chartData = temp;
    }
    else if (pageState.nowGraTime === 'month') {
        let temp = {};
        let month = 0;
        let sum = 0;
        let count = 0;

        for (let key in aqiPrimitive) {
            let dat = new Date(key);

            if (dat.getMonth() > month) {
                let index = '2019-0' + (dat.getMonth() - 1);

                temp[index] = Math.floor(sum / count);
                sum = 0;
                count = 0;
                month++;
            }

            sum += aqiPrimitive[key];
            count++;
        }

        temp['2019-03'] = Math.floor(sum / count);
        chartData = temp;
    }
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    let graTime = document.getElementsByClassName('time');

    for (let i = 0; i < graTime.length; i++) {
        graTime[i].addEventListener('focus', graTimeChange);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {

    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    let fragment = document.createDocumentFragment();

    for (let key in aqiSourceData) {
        let option = document.createElement('option');
        option.value = key;
        option.innerHTML = key;

        if(key === '北京') {
            option.selected = 'selected';
        }

        fragment.appendChild(option);
    }

    citySelector.appendChild(fragment);

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelector.addEventListener('change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    let index = pageState.nowSelectCity;
    chartData = aqiSourceData[index];

    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

init();
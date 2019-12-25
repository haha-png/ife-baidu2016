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
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
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
    nowSelectCity: '北京',
    nowGraTime: "day"
}

var colors = ['#6a89cc', '#3c6382', '#38ada9', '#b71540', '#0c2461', '#079992', '#78e08f'];

var $ = document.getElementById.bind(document);

var getEleByName = document.getElementsByName.bind(document);

var eventHandler = (function () {
    if (document.addEventListener) {
        return function (ele, type, handler) {
            ele.addEventListener(type, handler);
        };
    } else {
        return function (ele, type, handler) {
            ele.attachEvent('on' + type, handler);
        };
    }
})();

//将pageState.nowGraTime的值转为对应的中文，如：'day' => '日'
function graTimeTranslate(word) {
    let translated = '';
    switch (word) {
        case 'day':
            translated = '日';
            break;
        case 'week':
            translated = '周';
            break;
        case 'month':
            translated = '月';
            break;
        default:
            break;
    }
    return translated;
}

/**
 * 渲染图表
 */
function renderChart() {
    var target = $('aqi-chart-wrap');
    var fragment = document.createDocumentFragment();

    target.innerHTML = '';

    // 设置标题
    var h2 = document.createElement('h2');
    var heading = pageState.nowSelectCity + '市' + '01-03月' + graTimeTranslate(pageState.nowGraTime) + '平均空气质量报告';
    h2.innerHTML = heading;

    fragment.appendChild(h2);

    //绘制图表
    var data = {};
    var offset = '';

    switch (pageState.nowGraTime) {
        case 'day':
            data = chartData.day;
            offset = "-57px";
            break;
        case 'week':
            data = chartData.week;
            offset = "-39px"
            break;
        case 'month':
            data = chartData.month;
            offset = "38px"
            break;
        default:
            break;
    }

    data = data[pageState.nowSelectCity];

    var container = document.createElement('div');
    var containerWidth = 1184;
    
    container.className = 'chart-container';
    fragment.appendChild(container);

    var time = Object.getOwnPropertyNames(data);
    var divWidth = Math.floor(containerWidth/2/time.length);

    for (let i in data) {
        let div = document.createElement('div');
        let divPrompt = document.createElement('div');

        div.style.width = divWidth + 'px';
        div.style.height = data[i] + 'px';
        div.style.background = colors[Math.floor(Math.random()*7)];
        divPrompt.className = 'prompt';
        divPrompt.innerHTML = i + '<br>[AQI]: ' + data[i];
        divPrompt.style.left = offset;        

        div.appendChild(divPrompt);
        container.appendChild(div);
    }

    fragment.appendChild(container);    
    target.appendChild(fragment);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化 
    let target = event.target;

    if (target.value === pageState.nowGraTime) {
        return;
    }
    // 设置对应数据
    pageState.nowGraTime = target.value;
    
    let graTimeSelector = document.getElementsByTagName('label');
    
    for (let i = 0; i < graTimeSelector.length; i++) {
        graTimeSelector[i].style.background = 'white';
        graTimeSelector[i].style.color = 'black';
    }

    target.parentElement.style.background = '#0c2461';
    target.parentElement.style.color = 'white';
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化 
    let target = event.target;
    // 设置对应数据
    pageState.nowSelectCity = target.value;
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio = getEleByName('gra-time');

    for (let i = 0; i < radio.length; i++) {
        eventHandler(radio[i], 'focus', graTimeChange);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var select = $('city-select');
    var fragment = document.createDocumentFragment();

    for (let key in aqiSourceData) {
        let option = document.createElement('option');

        option.value = key;
        option.innerHTML = key;

        fragment.appendChild(option);
    }

    select.appendChild(fragment);
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    eventHandler(select, 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    chartData.day = aqiSourceData;

    //处理chartData.week的数据
    let dataWeekAll = {};

    for (let city in aqiSourceData) {
        // 记录当前城市的aqi数据，以月份为单位
        let dataCity = {};
        //当前城市aqi数据
        let cityAqi = aqiSourceData[city];
        //记录cityAqi的属性，即aqi数据的时间戳
        let time = Object.getOwnPropertyNames(cityAqi);
        //记录当前月份
        let month = 1;
        //记录当前是这个月的第几周
        let week = 1;
        //sum记录一周内每一天aqi指数的和
        let sum = 0;
        //count记录一周内每一天的aqi相加次数
        let count = 0;

        for (let i of time) {
            let date = new Date(i);
            let nowMonth = date.getMonth() + 1;
            let nowDay = date.getDay() || 7;

            //如果这一天是下个月份，求aqi平均值
            if (nowMonth > month) {
                month++;
                week = 1;
                sum = 0;
                count = 0;
            }

            sum += cityAqi[i];
            count++;

            //如果这一天是这一周的最后一天，求aqi平均值
            if (nowDay === 7 || time.indexOf(i) === time.length - 1) {
                let index = i.replace(/-\d\d$/, '') + '月第' + week + '周';
                dataCity[index] = Math.ceil(sum / count);

                week++
                sum = 0;
                count = 0;
            }
        }

        dataWeekAll[city] = dataCity;
    }

    chartData.week = dataWeekAll;

    //处理chartData.month的数据
    let dataMonthAll = {};

    for (let city in aqiSourceData) {
        // 记录当前城市的aqi数据，以月份为单位
        let dataCity = {};
        //当前城市aqi数据
        let cityAqi = aqiSourceData[city];
        //记录cityAqi的属性，即aqi数据的时间戳
        let time = Object.getOwnPropertyNames(cityAqi);
        //记录当前月份
        let month = 1;
        //sum记录一月内每一天aqi指数的和
        let sum = 0;
        //count记录一月内每一天的aqi相加次数
        let count = 0;

        for (let i = 0; i < time.length; i++) {
            let date = new Date(time[i]);
            let nowMonth = date.getMonth() + 1;

            //如果这一天是下一个月，求aqi平均值
            if (nowMonth > month) {
                let index = time[i-1].replace(/-\d\d$/, '');
                dataCity[index] = Math.ceil(sum / count);

                month++;
                sum = 0;
                count = 0;
            }

            sum += cityAqi[time[i]];
            count++;

            //如果这一天是cityAqi数据的最后一天，执行求aqi平均值操作
            if (time.indexOf(time[i]) === time.length - 1) {
                let index = time[i].replace(/-\d\d$/, '');
                dataCity[index] = Math.ceil(sum / count);
            }
        }

        dataMonthAll[city] = dataCity;
    }

    chartData.month = dataMonthAll;

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
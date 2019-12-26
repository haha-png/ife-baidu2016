var $ = document.getElementById.bind(document);

var textbox = $('in-data');

var lEnqueueBtn = $('lEnqueue');

var rEnqueueBtn = $('rEnqueue');

var lDequeueBtn = $('lDequeue');

var rDequeueBtn = $('rDequeue');

var promptBox = $('prompt');

var queueDisplay = $('queue-display');

// var queue = new (function() {
//     this.value = [];
//     this.lEnqueue = function(data) {
//         this.value.unshift(data);
//         return data;
//     }
//     this.lDequeue = function() {
//         return this.value.shift();
//     }
//     this.rEnqueue = function() {
//         this.value.push(data);
//         return data;
//     }
//     this.rDequeue = function() {
//         return this.value.pop();
//     }
//     this.isEmpty = function() {
//         return this.value.length? false: true;
//     }
// })();

//绑定事件的跨浏览器兼容
var eventHandler = (function() {
    if (document.addEventListener) {
        return function(ele, type, handler) {
            ele.addEventListener(type, handler, false);
        }
    } else {
        return function(ele, type, handler) {
            ele.attachEvent('on' + type, handler);
        }
    }
})();

eventHandler(lEnqueueBtn, 'click', function() {
    if (!textbox.value) {
        promptBox.innerHTML = '请输入一个数字';
        return;
    } 

    if (!Number(textbox.value)) {
        promptBox.innerHTML = '请输入一个数字';
        return;
    }

    promptBox.innerHTML = '从左侧进入队列的数据是： ' + textbox.value;

    var div = document.createElement('div');
    div.className = 'queue-item';
    div.innerHTML = textbox.value;
    

    queueDisplay.insertBefore(div, queueDisplay.firstElementChild);

    eventHandler(div, 'click', function() {
        promptBox.innerHTML = '该元素被删除了';
        queueDisplay.removeChild(div);
    });
});

eventHandler(rEnqueueBtn, 'click', function() {
    if (!textbox.value) {
        promptBox.innerHTML = '请输入一个数字';
        return;
    }

    if (!Number(textbox.value)) {
        promptBox.innerHTML = '请输入一个数字';
        return;
    }

    promptBox.innerHTML = '从右侧进入队列的数据是： ' + textbox.value;

    var div = document.createElement('div');
    div.className = 'queue-item';
    div.innerHTML = textbox.value;

    queueDisplay.appendChild(div);

    eventHandler(div, 'click', function() {
        promptBox.innerHTML = '该元素被删除了';
        queueDisplay.removeChild(div);
    });
});

eventHandler(lDequeueBtn, 'click', function() {
    if (queueDisplay.children.length === 0) {
        promptBox.innerHTML = '这个队列是空的';
        return;
    }

    promptBox.innerHTML = '从左侧出队列的数据是： ' + queueDisplay.firstElementChild.innerHTML;

    queueDisplay.removeChild(queueDisplay.firstElementChild);
});

eventHandler(rDequeueBtn, 'click', function() {
    if (queueDisplay.children.length === 0) {
        promptBox.innerHTML = '这个队列是空的';
        return;
    }

    promptBox.innerHTML = '从右侧出队列的数据是： ' + queueDisplay.lastElementChild.innerHTML;

    queueDisplay.removeChild(queueDisplay.lastElementChild);
});
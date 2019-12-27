var $ = document.getElementById.bind(document);

var textbox = $('in-data');

var lEnqueueBtn = $('lEnqueue');

var rEnqueueBtn = $('rEnqueue');

var lDequeueBtn = $('lDequeue');

var rDequeueBtn = $('rDequeue');

var disorderBtn = $('disorder');

var bubbleBtn = $('bubble');

var selectionBtn = $('selection');

var insertionBtn = $('insertion');

var promptBox = $('prompt');

var queueDisplay = $('queue-display');

//事件绑定函数的跨浏览器兼容
var eventHandler = (function () {
    if (document.addEventListener) {
        return function (ele, type, handler) {
            ele.addEventListener(type, handler, false);
        }
    } else {
        return function (ele, type, handler) {
            ele.attachEvent('on' + type, handler);
        }
    }
})();

var queue = {

    //保存队列数据，是一个数组
    value: [],

    //指定队列数据的渲染位置
    renderTarget: queueDisplay,

    //指定消息提示显示位置
    promptBoxTarget: promptBox,

    lEnqueue: function (data) {
        if (!this.isCorrect(data)) {
            this.promptBoxTarget.innerHTML = '请输入一个10-100的整数';
            return;
        }

        if (this.isFull()) {
            this.promptBoxTarget.innerHTML = '超出队列元素数量上限，最多只能添加60个元素';
            return;
        }

        this.value.unshift(data);
        this.renderStep(true, true);
    },

    lDequeue: function () {
        if (this.isEmpty()) {
            this.promptBoxTarget.innerHTML = '这个队列是空的';
            return;
        }

        this.renderStep(false, true);
        this.value.shift();
    },

    rEnqueue: function (data) {
        if (!this.isCorrect(data)) {
            this.promptBoxTarget.innerHTML = '请输入一个10-100的整数';
            return;
        }

        if (this.isFull()) {
            this.promptBoxTarget.innerHTML = '超出队列元素数量上限，最多只能添加60个元素';
            return;
        }

        this.value.push(data);
        this.renderStep(true, false);
    },

    rDequeue: function () {
        if (this.isEmpty()) {
            this.promptBoxTarget.innerHTML = '这个队列是空的';
            return;
        }

        this.renderStep(false, false);
        this.value.pop();
    },

    isEmpty: function () {
        return this.value.length ? false : true;
    },

    //测试待推入队列的数据是否符合标准，符合则返回true，否则false
    isCorrect: function (data) {
        return /^(100|[1-9][0-9])$/.test(data);
    },

    //队列元素数量限制60个
    isFull: function () {
        return this.value.length === 60;
    },

    //随机生成一个队列，num指定队列元素个数
    //min指定元素最小数，max指定元素最大数，即元素取值范围：[min, max]
    randomGenerateQueue: function (num) {
        while (num > 0) {
            this.value.push(Math.ceil(Math.random() * 90) + 10 + '');
            num--;
        }
        this.renderAll();
    },

    //打乱队列，level指定混乱程度，混乱度越大，队列越无序 ？？？
    //通过随机生成的两个数作为索引，交换这两个索引对应的元素,重复这个过程level次
    disorder: function (level) {
        if (this.isEmpty()) {
            this.randomGenerateQueue();
        } else {
            for (var i = 0; i < level; i++) {
                var index1 = Math.floor(Math.random() * this.value.length);
                var index2 = Math.floor(Math.random() * this.value.length);
                var temp = 0;

                temp = this.value[index1];
                this.value[index1] = this.value[index2];
                this.value[index2] = temp;
            }

            this.renderAll();
        }
    },

    bubbleSort: function () {
        var count = this.value.length;
        var round = 0;
        var intervalID;

        intervalID = setInterval(function () {
            if (count > 0) {
                if (round < count - 1) {
                    if (Number(queue.value[round]) > Number(queue.value[round + 1])) {
                        temp = queue.value[round];
                        queue.value[round] = queue.value[round + 1];
                        queue.value[round + 1] = temp;

                        queue.renderAll();

                        queueDisplay.children[round].style.background = "red";
                    } 

                    round++;
                } else {
                    queue.renderAll();
                    count--;
                    round = 0;
                }
            } else {
                clearInterval(intervalID);
            }
        }, 100);
    },

    /*
        渲染方法，将队列数据value渲染到指定地点renderTarget
        此方法一次只渲染一个队列元素，比如向队列末尾追加一个元素（rEnqueue()方法)，那么也只是向DOM中添加一个元素，不是将queue.value里
        的数据全部重新渲染一遍，区别于renderAll.
        ifPush: true | false,  如果向队列添加元素，则为true，删除为false
        inQueueFront: true | false,  添加或删除操作发生在队列前端，则为ture。队列末尾，则为false
    */
    renderStep: function (ifPush, inQueueFront) {
        if (ifPush) {
            //创建一个div元素，用来表示队列中的项目
            var div = document.createElement('div');
            div.className = 'queue-item';

            //当队列为空时，像队列中添加元素

            if (inQueueFront) {
                // div.innerHTML = this.value[0];
                div.style.height = this.value[0] + 'px';
                this.promptBoxTarget.innerHTML = '从左侧进入队列的数据是： ' + this.value[0];
                this.renderTarget.insertBefore(div, this.renderTarget.firstElementChild);
            } else {
                // div.innerHTML = this.value[this.value.length - 1];
                div.style.height = this.value[this.value.length - 1] + 'px';
                this.promptBoxTarget.innerHTML = '从右侧进入队列的数据是： ' + this.value[this.value.length - 1];
                this.renderTarget.appendChild(div);
            }

            var child = this.renderTarget.children;

            for (var j = 0; j < this.value.length; j++) {
                var childEle = child[j];
                let index = j; 
    
                eventHandler(childEle, 'click', function () {
                    //可以尝试计算被删除的元素排在哪一位
                    queue.value.splice(index, 1);
                    queue.promptBoxTarget.innerHTML = '该元素被删除了';
                    queue.renderTarget.removeChild(event.target);
                });
            }
        } else {

            if (inQueueFront) {
                this.promptBoxTarget.innerHTML = '从左侧出队列的数据是： ' + this.value[0];
                this.renderTarget.removeChild(this.renderTarget.firstElementChild);
            } else {
                this.promptBoxTarget.innerHTML = '从右侧出队列的数据是： ' + this.value[this.value.length - 1];
                this.renderTarget.removeChild(this.renderTarget.lastElementChild);
            }
        }
    },

    renderAll: function () {
        var fragment = document.createDocumentFragment();

        this.renderTarget.innerHTML = '';

        for (var i of this.value) {
            var div = document.createElement('div');

            div.className = 'queue-item';
            div.style.height = i + 'px';

            fragment.appendChild(div);
        }

        this.renderTarget.appendChild(fragment);

        var child = this.renderTarget.children;

        for (var j = 0; j < this.value.length; j++) {
            var childEle = child[j];
            let index = j; 

            eventHandler(childEle, 'click', function () {
                //可以尝试计算被删除的元素排在哪一位
                queue.value.splice(index, 1);
                queue.promptBoxTarget.innerHTML = '该元素被删除了';
                queue.renderTarget.removeChild(event.target);
            });
        }
    }
}

eventHandler(lEnqueueBtn, 'click', function () {
    queue.lEnqueue(textbox.value);
});

eventHandler(rEnqueueBtn, 'click', function () {
    queue.rEnqueue(textbox.value);
});

eventHandler(lDequeueBtn, 'click', function () {
    queue.lDequeue();
});

eventHandler(rDequeueBtn, 'click', function () {
    queue.rDequeue();
});

eventHandler(disorderBtn, 'click', function () {
    queue.disorder(100);
});

eventHandler(bubbleBtn, 'click', function () {
    queue.bubbleSort();
})

queue.randomGenerateQueue(30);

var inputData = [],

    inputBox = $('#input-box'),

    tips = $('#tips'),

    btn = $('button'),

    queryBox = $('#query-input'),

    displayArea = $('#display');

addHandler(btn[0], 'click', append);

addHandler(btn[1], 'click', search);

function append() {
    var input = inputBox.value.trim();
 
    var message = '请输入要保存的内容，格式可以为数字、中文、英文等，可以通过用回车，逗号（全角半角均可），顿号，空格（全角半角、Tab等均可）等符号作为不同内容的间隔';

    tips.innerHTML = '';

    if (!input) {
        tips.innerHTML = message;
        return;
    } 
    
    if (!isCorrect(input)) {
        tips.innerHTML = message;
        return;
    }

    var inputArr = input.split(/[\r\n,，，，、 　\t]+/);

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < inputArr.length; i++) {
        var div = document.createElement('div');

        inputData.push(inputArr[i]);

        div.innerHTML = inputArr[i];
        div.className = 'display-item';
        fragment.appendChild(div);
    }

    displayArea.appendChild(fragment);
}

function search() {
    var input = queryBox.value.trim();

    if (!input) {
        return;
    }

    var regEx = new RegExp(input, 'g');

    for (var i = 0; i < inputData.length; i++) {

        // while(1) {
        //     var r = regEx.exec(inputData[i]);
        //     if(r) {
        //         index.push([r.index, regEx.lastIndex]);
        //     } else {
        //         break;
        //     }
        // }

        $('.display-item')[i].innerHTML = inputData[i].replace(regEx, "<span class='result'>" + input + "</span>");
    }
}

/*
    检查输入是否符合要求，如果符合，返回true。否则，返回false
*/
function isCorrect(data) {
    return /[0-9a-zA-Z\u4E00-\u9FA5\r\n,，，，、 　\t]+/.test(data);
}
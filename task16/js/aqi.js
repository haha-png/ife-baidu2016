window.addEventListener('load', () => {

     // 记录用户数据输入历史记录
     let history = [];

     let $ = document.getElementById.bind(document);

     // 给添加和删除按钮注册事件监听器
     $('add-btn').addEventListener('click', add);
     $('aqi-table').addEventListener('click', remove);

     /*
         add函数，点击“确认添加”按钮后，就会将用户的输入在进行验证后，添加到下面的表格中，新增一行进行显示
     */
     function add() {
          let input = getData();
          render(input);
     }

     /*
          remove函数，点击表格列中的“删除”按钮，就会删掉那一行的数据
     */
     function remove(evt) {
          let event = evt || window.event;
          let target = event.target || event.srcElement;

          if (target instanceof HTMLButtonElement) {
               target.parentElement.parentElement.style = "display: none;";
          }
     }

     /*
         获取用户输入数据的方法
         成功则返回一个数组，例：['北京', 90]
         失败则返回null
         第一位表示城市名，第二位表示aqi指数
     */
     function getData() {

          let city = $('aqi-city-input');
          let aqi = $('aqi-value-input');

          let cityName = city.value;
          let aqiValue = aqi.value;

          // 判断城市名和空气质量指数是否为空，如果为空，则显示提示消息，并返回null
          if (!cityName || !aqiValue) {

               if (!cityName) {
                    visible($('hide-city'));
               }

               if (!aqiValue) {
                    visible($('hide-value'));
               }

               return null;
          }

          hide($('hide-city'));
          hide($('hide-value'));

          cityName = cityName.trim();
          aqiValue = aqiValue.trim();

          // 保存验证后的数据
          let verified = dataVeri(cityName, aqiValue);

          if (!verified) {
               return null;
          }

          //验证是否重复提交
          if (history.some((ele) => ele[0] === verified[0] && ele[1] === verified[1])) {
               visible($('hide-repeat'));
               return null;
          } else {
               history.push(verified);
               return verified;
          }
     }

     /*
          表单验证：用户输入的城市名必须为中英文字符，空气质量指数必须为整数（0-1000）
     */
     function dataVeri(city, aqi) {
          if (!(/^[\u4E00-\u9FA5]+$|^[a-zA-Z ]+$/.test(city))) {
               visible($('hide-city'));
               return null;
          }

          if (!(/^\d$|^[1-9]\d$|^[1-9]\d\d$|^1000$/.test(aqi))) {
               visible($('hide-value'));
               return null;
          }

          return [city, aqi];
     }

     /*
           用户输入不合规格时，显示提示
           将ele元素的css属性设置为可见/不可见
      */
     function visible(ele) {
          ele.style = "visibility: visible;color: red;";
     }

     function hide(ele) {
          ele.style = "visibility: hidden;";
     }


     /*
          渲染
     */
     function render(data) {
          if (data) {
               let tr = document.createElement('tr');

               tr.innerHTML = `<td>${data[0]}</td><td>${data[1]}</td><td><button>删除</button></td>`;
               $('aqi-table').appendChild(tr);
          }
     }
})
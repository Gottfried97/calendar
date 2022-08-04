const today = new Date;
let year = today.getFullYear();
let month = today.getMonth();

const head = document.querySelector('.head');
const body = document.querySelector('.body');
const totoday = document.querySelector('.totoday');
const nongli = document.querySelector('.nongli');
const ipt = document.querySelectorAll('input');

getCalendar(year, month);

// 年份 月份 跳转按钮绑定事件
const btn = head.querySelectorAll('button');
let head_year_value = year;
let head_month_value = month;
for (let i = 0; i < 4; i++) {
    btn[i].addEventListener('click', () => {
        switch (i) {
            case 0:
                head_year_value--;
                break;
            case 1:
                head_month_value--;
                if (head_month_value <= 0) {
                    head_month_value = 11;
                    head_year_value--;
                }
                break;
            case 2:
                head_month_value++;
                if (head_month_value > 11) {
                    head_month_value = 0;
                    head_year_value++;
                }
                break;
            case 3:
                head_year_value++;
        }
        getCalendar(head_year_value, head_month_value);
    })
}

// “回到今天” 按钮绑定事件
totoday.addEventListener('click', () => {
    head_year_value = year;
    head_month_value = month;
    getCalendar(year, month)
});

function getCalendar(year, month) {
    const day = new Date(year, month, 1);
    let dayNum = [31, febNum(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let olNum = Math.ceil((dayNum[month] + day.getDay()) / 7); //计算本月周数
    const head_year = head.querySelector('.head-year');
    const head_month = document.querySelector('.head-month');
    head_year.innerHTML = year + '年';
    head_month.innerHTML = (month + 1) + '月';

    body.innerHTML = '';
    const shift = ['白', '夜', '/', '白', '夜', '/', '休', '休'];
    let classOne = shiftSchedule(day); // 一班
    let classTwo = (classOne + 6) > 7 ? (classOne - 2) : (classOne + 6); // 二班
    let classThree = (classOne + 4) > 7 ? (classOne - 4) : (classOne + 4); // 三班
    let classFour = (classOne + 2) > 7 ? (classOne - 6) : (classOne + 2); // 四班
    let dateNum = 1;
    let ol = [];
    let li = [];

    // 动态创建日历部分
    for (let i = 0; i < olNum; i++) {
        ol[i] = document.createElement('ol');
        body.appendChild(ol[i]);
        for (let j = 0; j < 7; j++) {
            li[j] = document.createElement('li');
            ol[i].appendChild(li[j]);
            if (!(i == 0 && j < day.getDay() || i == olNum - 1 && dateNum > dayNum[day.getMonth()])) {
                let lunar = calendar.solar2lunar(year, month + 1, dateNum);
                let lunarDay = lunar.IDayCn;
                if (lunarDay == '初一') { // 农历初一显示农历月份
                    lunarDay = lunar.IMonthCn;
                }
                if (lunar.festival != null) { // 如果是节日则显示节日名称
                    lunarDay = lunar.festival;
                }
                if (lunar.lunarFestival != null) { // 如果是农历节日则显示农历节日名称
                    lunarDay = lunar.lunarFestival;
                }
                if ((day.getFullYear() < 2021) || (day.getFullYear() == 2021 && day.getMonth() < 4)) {
                    li[j].innerHTML = `<div><span>${dateNum}<i>${lunarDay}</i></span></div>`;
                } else {
                    li[j].innerHTML = `<div><span>${dateNum}<i>${lunarDay}</i></span><i>${shift[classOne]}</i><i>${shift[classTwo]}</i><i>${shift[classThree]}</i><i>${shift[classFour]}</i></div>`;
                    classOne++;
                    classTwo++;
                    classThree++;
                    classFour++;
                    if (classOne == 8) {
                        classOne = 0;
                    }
                    if (classTwo == 8) {
                        classTwo = 0;
                    }
                    if (classThree == 8) {
                        classThree = 0;
                    }
                    if (classFour == 8) {
                        classFour = 0;
                    }
                }
                dateNum++;
            }
        }
    }

    const divs = document.querySelectorAll('.body ol li div');
    // “回到今天” 按钮显示与隐藏
    if ((day.getMonth() == today.getMonth()) && (day.getFullYear() == today.getFullYear())) {
        divs[today.getDate() - 1].classList.add('today');
        divs[today.getDate() - 1].classList.add('active');
        totoday.style.display = 'none';
        let lunar = calendar.solar2lunar(year, month + 1, today.getDate());
        nongli.innerHTML = `<span>${lunar.IMonthCn}${lunar.IDayCn}</span><br>${lunar.gzYear}年 ${lunar.gzMonth}月 ${lunar.gzDay}日`; //初始化底部农历
    } else {
        divs[0].classList.add('active');
        totoday.style.display = 'block';
        let lunar = calendar.solar2lunar(year, month + 1, 1);
        nongli.innerHTML = `<span>${lunar.IMonthCn}${lunar.IDayCn}</span><br>${lunar.gzYear}年 ${lunar.gzMonth}月 ${lunar.gzDay}日`; //初始化底部农历
    }

    for (let i = 0; i < divs.length; i++) {
        divs[i].addEventListener('click', () => {
            for (let j = 0; j < divs.length; j++) {
                divs[j].classList.remove('active');
            }
            divs[i].classList.add('active');
            // let lunar = calendar.solar2lunar(year, month + 1, divs[i].childNodes[0].data);
            let lunar = calendar.solar2lunar(year, month + 1, i + 1);
            nongli.innerHTML = `<span>${lunar.IMonthCn}${lunar.IDayCn}</span><br>${lunar.gzYear}年 ${lunar.gzMonth}月 ${lunar.gzDay}日`;
        })
    }
    iptLoadEvent(day);
    iptClickEvent(day);
}

function iptClickEvent(day) {
    if ((day.getFullYear() < 2021) || (day.getFullYear() == 2021 && day.getMonth() < 4)) return;
    const ele_i = body.querySelectorAll('i');
    let arr_i = [
        [],
        [],
        [],
        []
    ];
    for (let i = 0; i < ele_i.length; i++) {
        switch (i % 5) {
            case 1:
                arr_i[0].push(ele_i[i]);
                break;
            case 2:
                arr_i[1].push(ele_i[i]);
                break;
            case 3:
                arr_i[2].push(ele_i[i]);
                break;
            case 4:
                arr_i[3].push(ele_i[i]);
        }
    }

    for (let i = 0; i < 4; i++) {
        ipt[i].addEventListener('click', e => {
            if (e.target.checked) {
                for (let j = 0; j < arr_i[i].length; j++) {
                    arr_i[i][j].style.display = 'block'
                }
            } else {
                for (let j = 0; j < arr_i[i].length; j++) {
                    arr_i[i][j].style.display = 'none'
                }
            };
        });
    };
}

function iptLoadEvent(day) {
    if ((day.getFullYear() < 2021) || (day.getFullYear() == 2021 && day.getMonth() < 4)) return;
    const ele_i = body.querySelectorAll('i');
    let arr_i = [
        [],
        [],
        [],
        []
    ];
    for (let i = 0; i < ele_i.length; i++) {
        switch (i % 5) {
            case 1:
                arr_i[0].push(ele_i[i]);
                break;
            case 2:
                arr_i[1].push(ele_i[i]);
                break;
            case 3:
                arr_i[2].push(ele_i[i]);
                break;
            case 4:
                arr_i[3].push(ele_i[i]);
        }
    }

    for (let i = 0; i < 4; i++) {
        if (ipt[i].checked) {
            for (let j = 0; j < arr_i[i].length; j++) {
                arr_i[i][j].style.display = 'block'
            }
        } else {
            for (let j = 0; j < arr_i[i].length; j++) {
                arr_i[i][j].style.display = 'none'
            }
        };
    };
}

// 返回某日距 2021年5月1日 的天数 对8求余的结果
function shiftSchedule(day) {
    let dayNum = [31, febNum(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let whatday = 0;
    if (day.getFullYear() == 2021) {
        for (let i = 4; i < day.getMonth(); i++) {
            whatday += dayNum[i];
        }
        return whatday % 8;
    } else {
        whatday = 5;
        for (let i = 2022; i < day.getFullYear(); i++) {
            whatday += (day.getFullYear() / 400 == 0) || (day.getFullYear() / 100 != 0 && day.getFullYear() / 4 == 0) ? 366 : 365;
        }
        for (let i = 0; i < day.getMonth(); i++) {
            whatday += dayNum[i];
        }
        return whatday % 8;
    }
}

// 判断2月有几天
function febNum(year) {
    return (year / 400 == 0) || (year / 100 != 0 && year / 4 == 0) ? 29 : 28;
}
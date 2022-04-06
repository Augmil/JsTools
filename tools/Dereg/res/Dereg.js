/**
 * @describe 该文件 写的比较仓促，旨在完成功能，代码混乱，我自己都不想再看第二遍。
 * @date 2022年04月06日
 */

let inputReg = document.querySelector('#reg_con');
let inputStr = document.querySelector('#input_str');

let mg = document.querySelector('#g');
let mi = document.querySelector('#i');
let mm = document.querySelector('#m');
let ms = document.querySelector('#s');
let mu = document.querySelector('#u');
let sr = document.querySelector('#select_results');

let osr = document.querySelector('#only_show_res');

function getValue() {
    return {
        reg: inputReg.value,
        str: inputStr.value,
        mg: mg.checked,
        mi: mi.checked,
        mm: mm.checked,
        ms: ms.checked,
        mu: mu.checked,
        osr: osr.checked,
        sr: sr.value,
    }
}

function setContentMain() {
    let v = getValue();
    let mg = v.mg ? 'g' : '';
    let mi = v.mi ? 'i' : '';
    let mm = v.mm ? 'm' : '';
    let ms = v.ms ? 's' : '';
    let mu = v.mu ? 'u' : '';
    let reg = eval(`/${v.reg}/${mg}${mi}${mm}${ms}${mu}`);
    let str = v.str;
    let r = [];
    str.replace(reg, (...$) => {
        r.push($);
    });
    // 标记匹配
    document.querySelector('#number').innerHTML = r.length;
    if (v.osr) {
        let h = str.match(reg);
        if (v.mg) {
            for (let i = 0; i < h.length; i++) {
                h[i] = `${i+1}. <span>${h[i]}</span><br/>`;
            }
            document.querySelector('#show_result').innerHTML = h.join('');
        } else {
            console.log(h[0]);
            document.querySelector('#show_result').innerHTML = `1. <span>${h[0]}</span><br/>`;
        }
    } else {
        document.querySelector('#show_result').innerHTML = str.replace(reg, '<span>$&</span>');
    }
    // 解析结果
    document.querySelector('#select_results').max = r.length;
    let t = parseInt((v.sr - 1) % sr.max);
    let rt = r[t];
    let h = `<div class="PR p${(t+1)%12}"><strong>$& , p0 : </strong><span>${rt[0]}</span></div>`;
    for (let i = 1; i < rt.length - 2; i++) {
        let v = rt[i] || '';
        // 如果有错检查一下下面这条语句
        let n = v ? rt[0].replace(eval(`/${v}/g`), `<span>${v}</span>`) : '';
        h += `<div class="PR p${i>11?i%11:i}"><strong>$${i} , p${i} : </strong>${n}</div>`;
    }
    h += `<div class="PR "><strong>$${rt.length-2} , p${rt.length-2} : </strong>${rt[rt.length-2]}</div>
          <div class="PR "><strong>$${rt.length-1} , p${rt.length-1} : </strong>${rt[rt.length-1]}</div>`;
    document.querySelector('#parse_result').innerHTML = h;
}

function setContent() {
    let rb = document.querySelector('#reg_before');
    try {
        rb.innerHTML = '/';
        rb.removeAttribute('style');
        setContentMain();
    } catch (err) {
        rb.innerHTML = '⚠';
        rb.setAttribute('style', `font-weight: bold; color: red; transform: scale(1.5); background: none;`);
        return err;
    }
}
// 防抖函数
function debounce(fn, delay = 250) {
    let timer = null;
    return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null;
        }, delay);
    }
}
inputReg.oninput = debounce((e) => { setContent(); });
inputStr.oninput = debounce((e) => { setContent() });
mg.addEventListener('change', setContent);
mi.addEventListener('change', setContent);
mm.addEventListener('change', setContent);
ms.addEventListener('change', setContent);
mu.addEventListener('change', setContent);
osr.addEventListener('change', setContent);
sr.addEventListener('input', setContent);


/**
 * 功能按钮
 */
let str =
    `正则表达式（英语：Regular Expression，在代码中常简写为regex、regexp或RE）使用单个字符串来描述、匹配一系列符合某个句法规则的字符串搜索模式。
简单体验一下正则的魅力，点击上面的匹配按钮会匹配这段文字中相应的内容。例如
试着匹配一些数字：789456123，英文字母：qwertyuiopasdfghjklzxcvbnm，或者是一些汉字。
当然也可以匹配任意字符，包括空白字符例如：换行符“\n”，空格“ ”等
在正则的元字符中字母大小写通常表示相反内容，因此如/[\\s\\S]/g可以匹配所有字符，更简短的/[^]/g也有相同作用。
按下尝试一下按钮，将“切换匹配项”切换至至74，感受一下原子组的魅力：1eooo2eooo2ttoooo3eooo2tttttttttt
\\\\
`

// 全部清空
function init() {
    inputReg.value = inputStr.value = '';
    mg.checked = mi.checked = mm.checked = ms.checked = mu.checked = osr.checked = 0;
    sr.value = 1;
    setContent();
}
// 尝试一下
function test() {
    init();
    inputReg.value = '(1e)o+(2eo+(2t+)o+(3e)o+)\\3|[a-z]|\\d|\\\\';
    inputStr.value = str;
    mg.checked = mi.checked = 1;
    sr.value = 1;
    setContent();
}
// 匹配数字
function matchNumbers() {
    init();
    inputReg.value = '\\d+';
    inputStr.value = str;
    mg.checked = mi.checked = 1;
    setContent();
}

// 匹配字母
function matchLetters() {
    init();
    inputReg.value = '[a-z]+';
    inputStr.value = str;
    mg.checked = mi.checked = 1;
    setContent();
}
// 匹配中文
function matchChinese() {
    init();
    inputReg.value = '\\p{sc=Han}+';
    inputStr.value = str;
    mg.checked = mu.checked = 1;
    setContent();
}
// 任意字符
function matchAll() {
    init();
    inputReg.value = '[^]';
    inputStr.value = str;
    mg.checked = 1;
    setContent();
}
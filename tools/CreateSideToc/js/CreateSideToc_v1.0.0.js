/**
 * @function createSideToc
 * @description 根据提供内容中的h1~h6标签生成目录
 * @param {Element} source - 内容来源，包括内容的HTML元素
 * @param {Element} target - 用来放置生成目录的HTML元素
 * @param {Object} [install={ range : [1, 6]}] - 包含函数的基本配置内容
 * @version 1.0.0 
 * @author Augmil <1841349495@qq.com>
 * @date 2022年04月12日
 * @example 
 * createSideToc(source, target, { range: [1, 6], })
 */


function createSideToc(source, target, install) {
    if (typeof install != 'object') install = {};
    let { range = [1, 6], } = install;

    tagRange = ''; // --> 'H1H2H3H4H5H6'
    for (let h = range[0]; h < range[1] + 1; h++) {
        tagRange += 'H' + h;
    }

    // 获取所有标题 
    let headers = [];
    let getHeaders = parent => {
        let children = parent.children;
        for (let c = 0; c < children.length; c++) {
            let e = children[c];
            if (tagRange.includes(e.tagName)) {
                headers.push(e); // e.offsetTop
            } else if (e.children.length > 0) {
                getHeaders(e);
            }
        }
    }
    getHeaders(source);

    // 生成目录
    let token = [];
    let headerIndex = 0;
    let cacheLi = {}; // { H1: '', H2: '', H3: '', H4: '', H5: '', H6: '', };
    let setToken = (parent, tag) => {
        for (headerIndex; headerIndex < headers.length; headerIndex++) {
            let header = headers[headerIndex];
            // 计算标题级别
            let diff = headers[headerIndex].tagName.match(/\d$/)[0] - tag.match(/\d$/)[0];
            if (diff === 0) { // 弟级元素
                let item = {};
                item.header = header;
                let li = item.li = cacheLi[tag] = document.createElement('li');
                let a = item.a = document.createElement('a');
                item.text = a.innerText = header.innerText;
                li.appendChild(a);
                let ul = item.ul = document.createElement('ul');
                li.appendChild(ul);

                header.id = item.id = header.id || encodeURI(item.text) || encodeURI('header_' + headerIndex);
                a.href = '#' + item.id;
                token.push(item);
                parent.appendChild(li);
            } else if (diff === 1) { // 子级元素
                setToken(cacheLi[tag].getElementsByTagName('ul')[0], headers[headerIndex].tagName);
            } else { // 上级元素
                // 返回上层函数 再次判断该标题
                headerIndex--;
                return
            }
        }
    }
    let parent = document.createElement('ul');
    target.appendChild(parent);
    setToken(parent, 'H' + range[0]);
}
/**
 * @function createSideToc
 * @description 根据提供内容中的h1~h6标签生成目录
 * @param {Element} source - 内容来源，包括内容的HTML元素
 * @param {Element} target - 用来放置生成目录的HTML元素
 * @param {Object} [install={}] - 包含函数的基本配置内容
 * let {
 *      // 基础配置属性
 *      range = [1, 6], // 需要生成目录的标题范围
 *      autoTocNumber = true, // 是否自动给目录标题编号
 *      autoHeaderNumber = true, // 是否自动给内容标题编号
 *      allowFold = true, // 是否允许折叠
 *      viewFollow = true, // 目录视图跟随内容视图变化
 *      // 特殊配置属性 --> 特定条件下生效
 *      defaultFold = true, // 是否默认全部折叠
 *      liEmptyClassName = 'toc_item_empty'
 *      liFoldClassName = 'toc_item_fold'
 *      liUnfoldClassName = 'toc_item_unfold'
 *      liCurrentReadClassName = 'toc_current_read'
 *  } = install;
 * 
 * @version 1.1.0 
 * 1. 添加给标题自动编号功能
 * 2. 添加折叠下级目录功能
 * 3. 添加目录跟随内容视图变化功能
 * @author Augmil <1841349495@qq.com>
 * @date 2022年04月13日
 * @example 
 * createSideToc(source, target, {
 *     range: [1, 6],
 * })
 */

function createSideToc(source, target, install) {
    // 获取配置内容
    if (typeof install != 'object') install = {};
    let {
        range = [1, 6], // 需要生成目录的标题范围
            autoTocNumber = true, // 是否自动给目录标题编号
            autoHeaderNumber = true, // 是否自动给内容标题编号
            allowFold = true, // 是否允许折叠
            defaultFold = false, // 是否默认折叠
            viewFollow = true, // 目录视图跟随内容视图变化
    } = install;

    // 设置目录的标题范围
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

                header.id = item.id = header.id || encodeURI('header_' + headerIndex + '_' + item.text);
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

    // 给目录或标题编号
    if (autoTocNumber || autoHeaderNumber) {
        let setNumber = (parent, prefix) => {
            let lis = parent.children;
            for (let i = 0; i < lis.length; i++) {
                let li = lis[i];
                let a = li.querySelector('a');
                let ul = li.querySelector('ul');
                let number = prefix ? prefix + '.' + (i + 1) : i + 1;
                // 给标题编号
                if (autoHeaderNumber) {
                    document.getElementById(a.href.match(/#[^]+$/)[0].replace('#', ''))
                        .innerText = number + ' ' + a.innerText;
                }
                // 给目录编号
                if (autoTocNumber) {
                    a.innerText = number + ' ' + a.innerText;
                }
                setNumber(ul, number);
            }
        }
        setNumber(parent, '');
    }

    // 允许折叠
    if (allowFold) {
        // 获取配置内容
        let {
            liEmptyClassName = 'toc_item_empty', // 无下级标题时 li 元素的 class name
                liFoldClassName = 'toc_item_fold', // 折叠时该项 li 元素的 class name
                liUnfoldClassName = 'toc_item_unfold', // 不折叠时该项 li 元素的 class name
        } = install;

        for (let i = 0; i < token.length; i++) {
            let item = token[i];
            let a = item.a;
            let li = item.li;
            let ul = item.ul;
            // 判断有无下级元素
            if (ul.children.length > 0) {
                // 是否默认折叠
                if (defaultFold) {
                    li.classList.add(liFoldClassName);
                } else {
                    li.classList.add(liUnfoldClassName);
                }
                // 添加点击事件
                a.addEventListener('click', e => {
                    // 计算伪元素范围
                    let before = window.getComputedStyle(a, ":before");
                    let rangeLeft = parseInt(window.getComputedStyle(a).marginLeft);
                    let rangeRight;
                    let boxSize = before.boxSize;
                    if (boxSize === 'border-box') {
                        let width = parseInt(before.width);
                        rangeRight = width;
                    } else {
                        let width = parseInt(before.width);
                        let ml = parseInt(before.marginLeft);
                        let mr = parseInt(before.marginRight);
                        let pl = parseInt(before.marginLeft);
                        let pr = parseInt(before.marginRight);
                        let bl = parseInt(before.borderLeft);
                        let br = parseInt(before.borderRight);
                        rangeRight = ml + mr + pl + pr + bl + br + width + rangeLeft;
                    }
                    // 是否点击伪元素范围内
                    if (rangeLeft < e.offsetX && e.offsetX < rangeRight) {
                        e.preventDefault();
                        // 是否已折叠
                        if (li.classList.contains(liFoldClassName)) {
                            li.classList.remove(liFoldClassName);
                            li.classList.add(liUnfoldClassName);
                        } else {
                            li.classList.add(liFoldClassName);
                            li.classList.remove(liUnfoldClassName);
                        }
                    } else {
                        li.classList.remove(liFoldClassName);
                    }
                });
            } else {
                li.classList.add(liEmptyClassName);
            }
        }
    }
    // 视图跟随
    if (viewFollow) {
        // 获取配置内容
        let { liCurrentReadClassName = 'toc_current_read' } = install;
        // 定义跟随监听函数
        let followScroll = () => {
            let item, headerTop, i = 0;
            // 找到正在阅读的标题
            do {
                item = token[i];
                headerTop = item.header.getBoundingClientRect().top;
                // 标题内容很长时的错误
                if (headerTop > window.innerHeight / 2) {
                    i--;
                    item = token[i];
                    break
                }
                i++;
            } while (headerTop < window.innerHeight / 4);

            // 删除上次阅读的样式
            let lastRead = document.getElementsByClassName(liCurrentReadClassName)[0];
            if (lastRead) {
                lastRead.classList.remove(liCurrentReadClassName);
            }

            // 修改正在阅读的目录样式
            item.li.classList.add(liCurrentReadClassName);
            item.li.scrollIntoView({ block: "center" })
        }

        // 查找可滚动元素
        // source -> ... -> body -> window
        function getScrollParent(node) {
            if (node == null) {
                return null;
            }

            if (node.scrollHeight > node.clientHeight) {
                return node;
            } else {
                return getScrollParent(node.parentNode);
            }
        }
        let scrollElement = getScrollParent(token[0].header);
        // 节流函数
        var timer = null;
        scrollElement.addEventListener('scroll', e => {
            if (timer) return;
            timer = setTimeout(() => {
                followScroll(e);
                timer = null;
            }, 300);
        }, true);

    }
}
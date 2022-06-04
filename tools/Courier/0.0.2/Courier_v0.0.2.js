// 信使
var courier = {}
courier.news = {}

// 订阅
courier.subscribe = function(newsname, demand, subscription) {
    // 参数类型正确
    if (typeof newsname === 'string' && typeof demand === 'function') {
        // 首次订阅该消息
        if (!this.news[newsname]) {
            console.log('首次订阅该消息');
            this.news[newsname] = {};
            // 添加一个不可枚举的可变length属性
            Object.defineProperty(this.news[newsname], "length", {
                value: 10,
                writable: true,
                enumerable: false,
                configurable: true
            })
        }
        // 生成本次订阅名
        let name = subscription || demand.name || `customer-${(this.news[newsname].length+= 1)}`;
        // 没有重名订阅
        if (!this.news[newsname][name]) {
            this.news[newsname][name] = { name, demand }
        } else {
            console.warn(`名称为${name}customer已存在。如需修改请调用updateSubscribe方法`);
        }

    } else {
        console.error('传入的newsname或demand变量类型错误');
    }
}


// 发布
courier.publish = function(newsname, news) {
    // 判断消息是否被订阅
    if (this.news[newsname]) {
        console.log(this.news[newsname]);
        for (const key in this.news[newsname]) {
            console.log(key);
            this.news[newsname][key].demand(news);
        }
    } else {
        console.warn(`名称为${newsname}的消息还未被订阅`);
    }
}
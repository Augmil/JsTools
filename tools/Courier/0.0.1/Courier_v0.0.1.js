// 编写订阅与发布
const courier = {}
courier.mailbox = {}

// 订阅
courier.subscribe = function(name, callback) {
    if (courier.mailbox[name]) {
        courier.mailbox[name].inboxs.push(callback)
    } else {
        courier.mailbox[name] = {
            name,
            inboxs: [callback]
        }
    }
}

// 发布
courier.publish = function(name, data) {
    if (courier.mailbox[name]) {
        for (let i = 0; i < courier.mailbox[name].inboxs.length; i++) {
            courier.mailbox[name].inboxs[i](data)
        }
    } else {
        console.log('该消息还未被订阅');
    }
}
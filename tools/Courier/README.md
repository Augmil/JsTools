# 一个简单的消息订阅与发布

## 订阅

**语法**
`courier.subscribe(msgname, callback)`

**参数**
- msgname 消息的名称 string类型 ，请确保其唯一性
- callback 处理数据的回调函数，消息发布时将消息传入该回调函数

**示例**
```javascript
// 订阅 msg
courier.subscribe('msg', (data) => {
    console.log('数据传输成功', data);
})
```

## 发布

**语法**
`courier.publish(msgname, data)`

**参数**
- msgname 消息的名称 string类型 ，请确保其唯一性
- data 传递给消息接收方的数据

**示例**
```javascript
// 发布 msg
courier.publish('msg', {
    a: 0,
    b: 1,
    c: 2
})
```



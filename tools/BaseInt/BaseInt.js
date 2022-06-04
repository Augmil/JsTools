/**
 * @class
 * @name BaseInt
 * @param {string} string - 数值的字符串形式
 * @param {number} [base] - 需要定义的进制，2~36
 * @description 与Number、BigInt类似，定义一个数值类型，可以实现不同进制的转换和计算。
 * @version 0.0.1
 * @author Augmil
 * @date 2022年06月01日
 */
class BaseInt {
    constructor(string, base) {
        this.string = string;
        this.base = parseInt(base) || this.reckonBase();
        this.value = this.toDEC();
    }
}

// 打表定义字符
BaseInt.prototype.baseTable = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
];

// 估测进制
BaseInt.prototype.reckonBase = function() {
    string = this.string;
    // 默认10进制
    if (!string) { return 10 };
    // 推测进制
    let arr = string.split('');
    let max = 1;
    arr.forEach(e => {
        let num = this.baseTable.indexOf(e);
        num > max ? max = num : null;
    });
    maxSym = this.baseTable[max];
    let base = 2;
    switch (true) {
        case ['0', '1'].some(e => e === maxSym):
            base = 2;
            break;
        case ['2', '3', '4', '5', '6', '7'].some(e => e === maxSym):
            base = 8;
            break;
        case ['8', '9'].some(e => e === maxSym):
            base = 10;
            break;
        case ['a', 'b', ].some(e => e === maxSym):
            base = 12;
            break;
        case ['c', 'd', 'e', 'f'].some(e => e === maxSym):
            base = 16;
            break;
        case ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'].some(e => e === maxSym):
            base = 24;
            break;
        case ['o', 'p', 'q', 'r', 's', 't'].some(e => e === maxSym):
            base = 30;
            break;
        default:
            base = 36;
            break;
    }
    return base
}

// 转为10进制
BaseInt.prototype.toDEC = function(string) {
    let str = string || this.string;
    let arr = str.split('').reverse();
    let dec = BigInt(0);
    arr.map((v, i) => {
        let power = BigInt(1);
        for (let j = 0; j < i; j++) {
            power *= BigInt(this.base)
        }
        dec += BigInt(this.baseTable.indexOf(v)) * power;
    });
    // 更新属性
    !string ? this.string = dec.toString() : null;
    return dec;
}

// 获得2~36之间任意进制形式的值
BaseInt.prototype.getString = function getString(base) {
    return this.value.toString(base);
};

// 重写toString()方法
BaseInt.prototype.toString = function toString() {
    return BigInt(this.value.toString());
};
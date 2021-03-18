// emitter 为事件 someEvent 注册事件监听器，然后触发了 someEvent 事件。
// var events = require('events');
// var emitter = new events.EventEmitter();
// emitter.on('someEvent', function (arg1, arg2) {
//     console.log('listener1', arg1, arg2);
// });
// emitter.emit('someEvent', 'arg1 参数', 'arg2 参数'); 


// 实现简单的EventEmiter，包含事件绑定，事件触发以及移除
class EventEmiter {
    constructor() {
        this.events = {}
    }
    emit(event, ...args) {
        // 将所有参数转换成数组接受的形式
        this.events[event].forEach(fn => {
            fn.apply(this, args)  // apply 接受参数为数组
        })
    }
    on(event, fn) {
        if (this.events[event]) {
            this.events[event].push(fn)
        } else {
            this.events[event] = [fn] // 创建单个事件的数组
        }
    }

    remove(event) {
        delete this.events[event]
    }
}

const eventHub = new EventEmiter()

eventHub.on('test', (...data) => {
    console.log('test ---', data)
})
eventHub.on('test', (...data) => {
    console.log('test ===', data)
})

eventHub.on('test2', data => {
    console.log(data)
})

eventHub.emit('test', 1, 2)
setTimeout(() => {
    eventHub.emit('test2', 33, 44)
}, 1000)


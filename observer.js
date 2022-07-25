class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(data){
        // console.log(typeof data);
        // console.log(!data || !typeof data === 'object')
        //数据劫持：把对象的属性都改成get和set方法
        if(!data || !typeof data === 'object'){
            // 不需要劫持
            return;
        }
        if(typeof data === 'string'){
            return;
        }
        // Object.keys()可以获取对象的所有key
        Object.keys(data).forEach(key=>{
            // 劫持
            this.defineRective(data, key, data[key]);
            // 如果data[key]也是对象，需要进一步递归劫持，给内部进一步加get和set
            this.observe(data[key]);
        });
    }
    // 定义响应式
    defineRective(obj, key, value){
        let that = this;
        let dep = new Dep(); // 每个变化的数据，会对应一个数组，存放所有更新的操作 TODO:啥意思:；理解：应该是指同一个变量在页面中的不同位置都可能有出现，在给这个变量增加get和set方法时，就定义一个订阅，当页面中的任何一个使用到这个变量时，即会调用get方法，那么就给它增加一个watcher，并加入订阅数组，然后这个变量发生变化即调用set方法时，就通知数组中的每一个，从而让页面上每个使用到这个变量的值都变化
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            // 增加get和set后在控制台查看vm.$data可以看到变量message和对应的get，set方法
            get(){
                Dep.target && dep.addSub(Dep.target);
                // 可以在这里加代码，使得在调用get前做一些事情
                return value;
            },
            set(newValue){
                // 新赋的值也可能是对象，需要劫持
                // 此外这里的this不是本实例，比如vm.message = 1，this，是vm.message
                that.observe(newValue);
                value = newValue;
                dep.notify();// 通知所有人数据已经更新
            }
        })
    }
}

// 发布订阅
class Dep{
    constructor(){
        // 订阅的数组
        this.subs = []
    }
    // 添加订阅
    addSub(watcher){
        this.subs.push(watcher);
    }
    // 通知，调用watcher的update来用新的值更新旧值
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}

module.exports = Observer;

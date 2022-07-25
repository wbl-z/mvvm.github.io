// const Observer = require('./observer');
// const Watcher = require('./watcher');
// const Compile = require('./compile');
class MVVM{
    constructor(options){
        // 挂载
        this.$el = options.el;
        this.$data = options.data;

        if(this.$el){
            // 数据劫持：把对象的属性都改成get和set方法
            new Observer(this.$data);
            // 将data中的内容放到vm里面，便于取用数据，可以直接vm.message，而不需要$data
            this.proxyData(this.$data);
            // 编译
            new Compile(this.$el,this);
        }
    }
    proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this, key, {
                get(){
                    return data[key];
                },
                set(newValue){
                    data[key] = newValue;
                }
            })
        })
    }
}

module.exports = MVVM;
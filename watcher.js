class Watcher{// 观察者是给需要变化的元素增加观察者，当数据变化后执行对应的方法
    constructor(vm, expr, callback){
        this.vm = vm;
        this.expr = expr;
        this.callback = callback;
        // 获取旧值
        this.value = this.get();
    }
    getVal(vm,expr){// 获取实例中值
        expr = expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next];
        },vm.$data);
    }
    get(){
        Dep.target = this;
        let value = this.getVal(this.vm, this.expr);
        Dep.target = null;
        return value;
    }
    update(){
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if(newValue != oldValue){
            this.callback(newValue);
        }
    }
}
module.exports = Watcher;
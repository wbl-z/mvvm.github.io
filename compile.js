class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el);// 可能是字符串，也可能是DOM，因此需要判断
        this.vm = vm;
        if(this.el){
            // 如果元素能够获取到，才开始编译
            // 1.把要操作的DOM移动到内存
            let fragment = this.node2fragment(this.el);
            // 2.编译=>提取想要的元素节点v-model和文本节点{{}}
            this.compile(fragment);
            // 3.将编译好的放回页面
            this.el.appendChild(fragment);
        }
    }

    /* 辅助方法 */
    isElementNode(node){
        // 是否为元素节点
        return node.nodeType === 1;
    }
    // 是不是v-
    isDirective(name){
        return name.includes('v-');
    }
    /* 核心方法 */
    compileElement(node){
        // 获取元素的属性
        let attributes = node.attributes;
        Array.from(attributes).forEach(attribute=>{
            // console.log(attribute.name,attribute.value);
            // 判断是不是包含v-
            if(this.isDirective(attribute.name)){
                // 将绑定的v-model数据放到输入框/文本中
                let expr = attribute.value;
                let type = attribute.name.slice(2);// 取除去v-后的内容
                CompileUtil[type](node, this.vm, expr);// 目的就是将vm实例中的expr的值放到node中
            }
        })
    }
    compileText(node){
        // {{}}
        let text = node.textContent;// 取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g;
        if(reg.test(text)){
            // 获取去掉大括号后的内容
            let value = text.trim().slice(2,-2);
            CompileUtil['text'](node,this.vm,value);
        }
    }
    compile(fragment){
        // childNodes只是得到第一层的，需要递归遍历
        let childNodes = fragment.childNodes;
        // 将文档集合转成数组
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                // 编译元素
                this.compileElement(node);
                // 是元素节点，递归
                this.compile(node);
            }else{
                // 文本节点
                this.compileText(node);
            }
        })
    }
    node2fragment(el){
        // 将el中的内容全部放到内存中
        let fragment = document.createDocumentFragment();
        // 每次取出el中的第一个元素。放到内存中创建的空间中
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;// 返回存储在内存中的节点
    }   
}

// 编译工具对象
CompileUtil = {
    getVal(vm,expr){// 获取实例中值
        expr = expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next];
        },vm.$data);
    },
    setVal(vm,expr,value){
        expr = expr.split('.');//TODO:下面的index都没加，什么原理？？
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex === expr.length-1){
                return prev[next] = value;
            }
            return prev[next];
        },vm.$data);
    },
    text(node,vm,expr){// 文本处理
        let updateFunc = this.updater['textUpdater'];
        // 注意不能直接将实例中的vm[expr]的值取出来赋值给node，比如message.a这样vm['message.a']就是获取不到的
        new Watcher(vm, expr,(newValue)=>{
            updateFunc(node,newValue);
        })
        updateFunc(node,this.getVal(vm,expr));
    },
    model(node,vm,expr){// 输入框处理
        let updateFunc = this.updater['modelUpdater'];
        // 注意不能直接将实例中的vm[expr]的值取出来赋值给node，比如message.a这样vm['message.a']就是获取不到的
        // 加上监控，数据变化了就调用新的值
        new Watcher(vm, expr,(newValue)=>{
            updateFunc(node,newValue);
        })
        // 给输入框监听输入事件，让输入框的改变影响这个变量
        node.addEventListener('input',(e)=>{
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue);
        })
        updateFunc(node,this.getVal(vm,expr));
    },
    updater:{
        // 文本更新
        textUpdater(node, value){
            node.textContent = value;
        },
        // 输入框更新
        modelUpdater(node, value){
            node.value = value;
        }
    }
}

module.exports = Compile;
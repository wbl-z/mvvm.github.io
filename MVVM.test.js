const Observer = require('./observer');
const Watcher = require('./watcher');
const Compile = require('./compile');
const MVVM = require('./MVVM');

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve('D:\\Desktop\\MVVM\\MVVM.html'), 'utf8');
jest.dontMock('fs');

let options={}
describe('unit test', function () {
    beforeEach(() => {
        // document.documentElement.innerHTML = html.toString();
        options={
            el:"#app",
            data:{
                message: 'NJU'
            }
        }
    });
    afterEach(jest.resetModules);
    test('数据劫持测试' , ()=>{
        let observer=new Observer(options.data)
        console.log(options.data);
        // expect(options.data).toMatchObject( { message: [Getter/Setter] })
    });
    
    test('将data的属性添加到vm(proxyData)测试' , ()=>{
        let vm = new MVVM(options);
        expect(vm.hasOwnProperty('message')).toBe(true);
    });

    test('双向绑定测试' , ()=>{
        let vm = new MVVM(options);
        vm.$data.message = 'nju';
        expect(vm.$data.message).toBe('nju');
    });
});



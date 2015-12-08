/**
 * Created by wd14931 on 2015/11/28.
 * 1：实现事件驱动
 * 2：实现一个数据驱动
 *
 * 最后结合起来
 */

function Dirver(){

    var that = this;

    /*if(obj && typeof obj === 'object'
        && Object.prototype.toString(obj).substring(1, 7) === 'object'){
        that.obj = obj;
    }
*/
    // 事件类型的队列
    var typeList = [];
    var self = arguments.callee,
        prop = self.prototype;

    that.set= function(arg){
        typeList.push(arg);
    };

    that.get = function(){
        return typeList;
    };

    /*
     * on: 绑定事件，支持字符串，或者多个事件可以按空格分开
     * */

    prop.on= function(type, fn){

        var that = this;

        var _aType = [],
            _fn = null;

        if(type && typeof type === 'string'){
            _aType = type.split(' ');
        }else{
            console.error('event name does not exist!', 'on');
        }

        if(fn && typeof fn === 'function'){
            _fn = fn;
        }else{
            console.error('callback function does not exist!', 'on');
        }

        // 绑定事件
        var _bind = function(type, fn){
            var _that = this;

            for(var i = 0; type[i]; i++){
                var t = type[i];

                // 事件建立引用
                var _obj = {};

                _obj.type = t;
                _obj.fn = fn;

                // 存储到事件列表
                _that.set(_obj);
            }
        };

        return _bind.call(that, _aType, _fn);
    };

    /*
     * trigger: 触发事件，支持字符串，或者多个事件可以按空格分开
     * 第二个以后的都会默认为参数
     *
     * */

    prop.trigger= function(type, arg){

        var that = this,
            _aType = [],
            _arg = [];

        if(type && typeof type === 'string'){
            _aType = type.split(' ');
        }else{
            console.error('event name is not correct!', 'trigger');
        }

        if(arguments.length > 1){

            for(var j= 1; arguments[j]; j++){
                _arg[j-1] = arguments[j];
            }

        }

        // 触发
        var _trigger = function(type, arg){
            var _that = this,
                _list = _that.get();

            for(var i = 0; type[i]; i++){
                var t = type[i];

                for(var m = 0; _list[m]; m++){
                    var _t = _list[m]['type'];

                    if(_t === t){
                        _list[m]['fn'].apply(_that, arg);
                    }
                }
            }

        };

        return _trigger.call(that, _aType, _arg.length > 0?  _arg : []);
    };

    /*
    * 根据type，移除某一事件
    * */
    prop.remove= function(type){
        var that = this;

        var _aType = [];

        if(type && typeof type === 'string'){
            _aType = type.split(' ');
        }

        return function(type){
            var _that = this,
                _list = _that.get();

            if(!type.length){
                return;
            }

            for(var i = 0; type[i]; i++){
                var t = type[i];

                for(var m = 0; _list[m]; m++){
                    var _t = _list[m]['type'];

                    if(_t === t){
                        _list.splice(m,1);
                    }
                }
            }
        }.call(that, _aType);
    };

    /*
     * 移除所有的事件
     * */
    prop.removeAll= function(){
        var that = this;

        return function(){
            var _that = this,
                _list = _that.get();

            _list.splice(0,_list.length);

        }.call(that);
    };
}

var fire1 = new Dirver();
var fire2 = new Dirver();

fire1.on('fire f', function(ss, ddd){alert(ss+ddd)});
fire1.on('fire f1', function(ss, ddd){alert(ss+ddd+2)});
fire2.on('fire', function(ss){alert(ss)});
fire1.trigger('fire', 12, 13);

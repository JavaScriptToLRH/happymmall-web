'use strict';
//模板渲染引擎Hogan
var Hogan = require('hogan');
var conf = {
    serverHost : ''
}
var _mm = {
    //网络请求
    request : function(param){
        var _this = this; //存入mm对象
        $.ajax({
            type      : param.method || 'get',  //从param中取方法，如果没有默认get方法
            url       : param.url    || '',     // 默认空
            dataType  : param.type   || 'json', // 数据类型
            data      : param.data   || '',     // 请求时需要的数据
            success   : function(res){
                //请求成功
                if(0 === res.status){
                    //判断param.success是不是function，如果是，回调param.success，将数据进行传输
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                //没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                }
                //请求错误
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg);                    
                }
            },
            error     : function(err){
                typeof param.error === 'function' && param.error(err.statusText);                                    
            },
        });
    },
    //获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    //获取url参数
    getUrlParam : function(name){
        //happymmall.com/product/list?keyword=xxx&page=1
        // 提取keyword步骤：1.截取?后参数；2.按&分开每一组keyword与value
        // 定义正则表达式
        var reg    = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        //window.location 对象用于获得当前页面的地址 (URL)，并把浏览器重定向到新的页面。
        //window.location.search 从问号（?）开始的  URL（查询部分）
        //substr()方法可在字符串中抽取从 start 下标开始的指定数目的字符。
        //match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
        return result ? decodeURIComponent(result[2]) : null;
        //decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
    },
    //渲染HTML模板
    renderHtml : function(htmlTemplate,data){  // 传入模板和数据
        var template = Hogan.compile(htmlTemplate),
            result   = template.render(data);
        return result;
    },
    //成功提示
    successTips : function(msg){
        alert(msg || '操作成功!');
    },
    //错误提示
    errorTips : function(msg){
        alert(msg || '哪里不对了~~');
    },
    //字段的验证,支持非空，手机，邮箱的判断
    validata : function(value, type){
        var value = $.trim(value);
        //非空验证
        if('require' === type){
            return !!value;
        }
        //手机验证
        if('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        //邮箱验证
        if('email' === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    //统一登录处理
    doLogin : function(){
        //encodeURIComponent() 函数可把字符串作为 URI 组件进行编码
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = './index.html'
    }
};

module.exports = _mm;
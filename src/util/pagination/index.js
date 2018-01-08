'use strict'

require('./index.css');
var _mm                = require('util/mm.js');
var templatePagination = require('./index.string');

var Pagination = function(){
    var _this = this;
    this.defaultOption = {//默认属性
        container    : null,  //容器
        pageNum      : 1,    //当前页数
        pageRange    : 3,    //页面范围
        onSelectPage : null  //回调
    };
    // 事件处理
    $(document).on('click', '.pg-item', function(){
        var $this = $(this);
        //对于active和disabled按钮点击不做处理
        if($this.hasClass('active') || $this.hasClass('disabled')){
            return;
        }
        typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage($this.data('value')) : null;
    });
};
// 渲染分页组件   使用 ‘Pagination.prototype+方法’ 格式，原型继承，new出来的对象也可以使用
Pagination.prototype.render = function(userOption){
    // 合并选项
    // jQuery.extend() 函数用于将一个或多个对象的内容合并到目标对象。
    // extend({},item1,item2)用这个方法，可以将所得的结果全部合并在{}中，并返回，而且还不会破坏原有的项的结构，
    //                          但是如果item1和item2中有重复内容，item2会替换掉item1中的内容
    this.option = $.extend({}, this.defaultOption, userOption);

    // 判断容器是否为合法的jquery对象:最后生成的东西需要放在container中，所以需要进行错误判断，如果container中没有东西，则需要进行处理
    // instanceof 优先级比 ! 低
    if(!(this.option.container instanceof jQuery)){
        return;
    }
    // 判断是否只有一页：如果内容能在一页上进行展示，则不加载分页内容
    if(this.option.pages <= 1){
        return;
    }
    //渲染分页内容
    this.option.container.html(this.getPaginationHtml());
};
// 获取分页的html
Pagination.prototype.getPaginationHtml = function(){
    //  |上一页| 1 2 3 4 >5< 6 |下一页| 5/6
    var html      = '',
        pageArray = [],
        option    = this.option,

        //判断页码的范围，例如，|上一页| 1 2 3 4 >5< 6 |下一页| 5/6  如果pageRange为3，即：范围为 2 3 4 5 6
        start     = option.pageNum - option.pageRange > 0
            ? option.pageNum - option.pageRange : 1,
        end       = option.pageNum + option.pageRange < option.pages
            ? option.pageNum + option.pageRange : option.pages;
    // 上一页按钮的数据
    pageArray.push({
        name     : '上一页',
        value    : this.option.prePage,
        disabled : !this.option.hasPreviousPage //判断前面是否有页码，如果有，则为false
    });
    // 数字按钮的处理，例如：|上一页| 1 2 3 4 >5< 6 |下一页| 5/6 pageRange为3  即显示为：2 3 4 5 6
    for(var i = start; i <= end; i++){
        pageArray.push({
            name     : i,
            value    : i,
            active   : (i === option.pageNum) //表示是否为当前选中页
        })
    };
    // 下一页按钮的数据
    pageArray.push({
        name     : '下一页',
        value    : this.option.nextPage,
        disabled : !this.option.hasNextPage
    });
    html = _mm.renderHtml(templatePagination, {
        pageArray : pageArray,
        pageNum   : option.pageNum,
        pages     : option.pages
    });
    return html;
};

module.exports = Pagination;
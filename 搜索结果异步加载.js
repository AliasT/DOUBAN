/*  
 *  搜索结果展示页
 */

$(function() {
    var getParams = function () {
        var requirements = ['key', 'cateId', 'priceType', 'sort', 'order'];
        var arr          = params.split(',');
        var result       = {};

        for (var i = 0, n = requirements.length; i < n; i++) {
            result[requirements[i]] = arr[i];
        }

        return result;
    }

    var queryParams = null;

    function ItemLoader ($ele, $observer) {
        var self       = this;
        self.$ele      = $ele;
        self.$observer = $observer.appendTo(self.$ele);
        self.page      = 1;
        self.timeout   = null;

        $(window).scroll(function () {
            self.scroll();
        })
    }

    ItemLoader.prototype.init = function () {
        this.getItems(this.page);
    }

    ItemLoader.prototype.buildItemHtml = function (v, tag) {
        var temp   = '';
        var corner = '';

        // 可能出现的活动角标
        if(v.markUrl) {
            corner = '<img class="tag_img" src="' + v.markUrl + '" />';
        } else {
            temp = tag;
        }

        return '<li>'+
            '<a href="/product-'+ v.id + '.html">' +
                '<div class="pic">' +  corner + '<img src="' + v.pic +'"></div>'+
                '<div class="info">' +
                    '<p class="name">' + v.title + '</p>'+
                    '<p class="price">' +
                        '<span class="now">￥' + v.proPrice + '</span>' +
                        ' <del class="old">￥' + v.price + '</del>' +
                    '</p>'+
                    '<p class="sale">'+ v.salesCount +'人已经购买<i class="iconfont">&#xe61a;</i></p>'+
                '</div>' + temp + 
            '</a></li>';
    }

    ItemLoader.prototype.buildHtml = function (list) {
        var html = '';
        var self = this;

        $.each(list, function(i,v) {
            var _tag = '';
            if(v.activityGroup == 1) {
                _tag = '<div class="tag">限时折扣</div>';
            }
            html += self.buildItemHtml(v, _tag);
        });

        return html;
    }


    ItemLoader.prototype.getCurrentPage = function () {
        var winHeight = $(window).height();     // 窗口高度
        var offsetTop = this.$observer.offset().top;

        if ($(window).scrollTop() + winHeight <= offsetTop - 105) return false;

        return this.page++;
    }

    ItemLoader.prototype.scroll = function () {
        var self = this;
        if (this.timeout) { clearTimeout(self.timeout); }
        this.timeout = setTimeout (function () {
            if (!self.getCurrentPage()) return ;
            self.getItems(self.page);
        }, 200);
    }

    ItemLoader.prototype.ajaxCallback = function (data) {
        var self = this;
        $(self.buildHtml(data.data)).insertBefore(self.$observer);
    }

    ItemLoader.prototype.getItems = function (page) {
        var self = this;

        if (!queryParams) {
            queryParams = getParams();
        }

        ajaxData($.extend(queryParams, { page: page }), self.ajaxCallback.bind(self), '/itemSearch/search');
    }

    var itemLoader = new ItemLoader($('#search_list'), $('<i>'));
    itemLoader.init();


    // (function() {
    //     // 搜索框清空
    //     $('.bd_search').find('form i').tap(function() {
    //         $(this).siblings('input').val('');
    //     });

    //     // 列表样式
    //     var $parent = $('nav ul');
    //     var index= "abc".indexOf($parent.data('index'));
    //     $parent.find('a').eq(index).addClass('active');
    // })();

    // getHotProduct();

    // var Total = 100;
    // var $list = $('#search_list');

    // function getHotProduct () {
    //     require(['scrollview'], function(scrollview){
    //         scrollview($list, buildItems);
    //     });

    //     function buildItems (page) {
    //         var arr = params.split(',');
    //         if(page >= Total) {
    //             $list.data('isend', 1);
    //             return;
    //         }
    //         // 分页数， 关键字，类目id
    //         ajaxData({ page: page, key: arr[0], cateId: arr[1], 
    //             priceType: arr[2], sort: arr[3], order: arr[4] }, handleData, '/itemSearch/search');
    //     }
    // }


    // function handleData (data) {
    //     // 1: data = [], pageNum = 0
    //     // 2: data = [], pageNum > 0
    //     // 3: page: 1

    //     var html = '';
    //     var list = data.data;
    //     if(!list.length) {
    //         if (!data.pageNum) $('.partbd').html('<div class="hint-info">没有找到相关商品</div>');
    //         return;
    //     } else if (data.params.page == '1') {
    //         Total = data.pageNum;
    //     } else if (data.params.page == '' + Total) {
    //         $('.loading').hide();
    //     }
        
    // }


    // function concatData (v, tag) {
        
    // }
});

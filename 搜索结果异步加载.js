require([], function () {
    console.log(history.state);
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

    function ItemLoader ($ele, $observer, unitHeight, pageSize) {
        var self        = this;
        self.$ele       = $ele;
        self.$observer  = $observer.appendTo(self.$ele.parent());    // 位置指示器
        self.page       = 1;
        self.timeout    = null;
        self.total      = 1;
        self.state      = history.state  // 历史状态记录
        self.unitHeight = unitHeight;
        self.pageSize   = pageSize;

        $(window).scroll(function () {
            self.scroll();
        })
    }

    ItemLoader.prototype.init = function () {
        this.getItems(this.page);
    }

    ItemLoader.prototype.getCurrentPosition = function () {
        return Math.ceil(1 + parseFloat(($(window).scrollTop() - this.$ele.offset().top) / (this.unitHeight * this.pageSize), 10));
    }

    // 移除加载图
    ItemLoader.prototype.removeObserver = function () {
        this.$observer.remove();
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

        return '<li>' +
            '<a href="/product-' + v.id + '.html">' +
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
        var self      = this;
        var winHeight = $(window).height();     // 窗口高度
        var offsetTop = this.$observer.offset().top;

        // cookie('scroll-top', $(window).scrollTop());
        history.replaceState({ 
            'scroll-top': $(window).scrollTop(),
            'last-page': self.getCurrentPosition()
        }, 'scroll-top and last in viewed page');

        if ($(window).scrollTop() + winHeight <= offsetTop - 105) {
            return false;
        }
        // cookie('last-page', this.page++);
        
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

    ItemLoader.prototype.offScroll = function () {
        var self = this;
        $(window).off('scroll', self.scroll);
    }

    ItemLoader.prototype.ajaxCallback = function (data) {
        var self = this;

        if (data.params.page === '1') {              // 如果是发送过来的第一页数据,那么记录下分页总数
            self.total = data.pageNum;
        }

        if (data.params.page == '' + self.total) {   // 当前是最后一页,取消滚动事件
            self.offScroll();
            self.removeObserver();
        }

        self.$ele.append(self.buildHtml(data.data) + '<i></i>');

        // 读取历史状态
        if (self.state) {
            var lastPage = parseInt(history.state['last-page'], 10);
            if (self.page <= lastPage) {
                self.getItems(self.page++);
                // 滚动到历史记录点
                if (self.page == lastPage) {
                    self.state = null;  // 清空当前历史状态记录
                    $(window).scrollTop(parseInt(history.state['scroll-top']), 10); // 如何只触发这个事件一次?
                }
            }

        }
    }

    ItemLoader.prototype.getItems = function (page) {
        if (page > this.total) return ;
        var self = this;

        if (!queryParams) {
            queryParams = getParams();
        }

        ajaxData($.extend(queryParams, { page: page }), self.ajaxCallback.bind(self), '/itemSearch/search');
    }

    var itemLoader = new ItemLoader($('#search_list'), $('<div class="loading" id="data_loading"></div>'), 119, 20);
    itemLoader.init();
});

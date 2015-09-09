    var windowHeight = $(window).height();
    // 容器垂直偏移
    var offsetY = $('.items_box').offset().top;
    // 每个商品列表元素高度
    var liHeight = $('.items_list').find('li').first().height();
    var temp = 0;

    function getData() {
        var scrollY = $(window).scrollTop();
        var offset = scrollY + windowHeight - offsetY;
        var count = Math.ceil(offset / liHeight);
        if(count <= temp) { return; }
        $.get('/data', { count: count }, function(data) {
            console.log(data);
        });
        temp = count;
    }

    $(window).on('load', getData).on('scroll', getData);

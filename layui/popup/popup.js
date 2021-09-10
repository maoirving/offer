$(function () {
    //引入css
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = 'layui/popup/popup.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
})

function popup(box_id) {
    // 让mask 和popup 显示出来
    $(box_id).find(".mask_box").fadeIn('fast');
    $(box_id).find(".popup").fadeIn('fast');
    //滚回顶部，增加用户体验
    if ($(box_id).find(".popup_content").scrollTop() != 0) {
        $(box_id).find(".popup_content").animate({scrollTop: 0}, 500);
        $(box_id).find(".popup_content .item_textarea").animate({scrollTop: 0}, 500);
    }
}

function popupLoad(box_id) {
    // 1. 点击 closeBtn 就隐藏 mask 和 popup
    $(box_id).find(".closeBtn").on("click", function () {
        $(box_id).find(".mask_box").fadeOut('fast');
        $(box_id).find(".popup").fadeOut('fast');
    });
    // 2. 开始拖拽
    // 获取元素
    var popup = $(box_id).find('.popup')[0];
    // (1) 当我们鼠标按下， 就获得鼠标在盒子内的坐标
    $(box_id).find(".title_move").on("mousedown", function (e) {
        var x = e.pageX - popup.offsetLeft;
        var y = e.pageY - popup.offsetTop;
        // (2) 鼠标移动的时候，把鼠标在页面中的坐标，减去 鼠标在盒子内的坐标就是模态框的left和top值
        document.addEventListener('mousemove', move)

        function move(e) {
            popup.style.left = e.pageX - x + 'px';
            popup.style.top = e.pageY - y + 'px';
        }

        // (3) 鼠标弹起，就让鼠标移动事件移除
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', move);
        });
    })
    //3. 取消按钮
    $(box_id).find(".cancel_btn").on("click", function () {
        $(box_id).find(".closeBtn").click();
    });
}



$(function () {
    var news_app = new Vue({
        el: '#news_app',
        data: {
            news: ""
        },
        methods: {
            //获取url地址中的参数
            getQueryVariable: function (variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
                return (false);
            },
        },
        mounted: function () {
            var that = this;
            $.ajax({
                url: "../php/news_complete.php",
                data: {
                    news_id: this.getQueryVariable("news_id")
                },
                success: function (result) {
                    that.news = result.news[0];
                },
                dataType: "json"
            });
        }
    });
    var app = new Vue({
        el: '#app',
        data: {
            news: []
        },
        methods: {
            skip: function (id) {
                window.location = "news_content.html?news_id=" + id;
            },
        },
        mounted: function () {
            var that = this;
            $.ajax({
                url: "../php/news_simple.php",
                data: {
                    limit: 4
                },
                success: function (result) {
                    that.news = result.news;
                },
                dataType: "json"
            });
        }
    });
});
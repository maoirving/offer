$(function () {
    var news_app = new Vue({
        el: '#news_app',
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
                data: {},
                success: function (result) {
                    that.news = result.news;
                },
                dataType: "json"
            });
        }
    });
}); 

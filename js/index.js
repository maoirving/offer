$(function () {
    $(".swiper-container").carousel({
        width: 593,
        height: 367,
        speed: 3000,
        needPrevAndNextBtnGroup: true,
        needPagination: true
    });
    $("#searchJob").on("click", function () {
        var keyword = $.trim($("#keyword").val());
        if (keyword) {
            window.location = "search_list.html?keyword=" + keyword;
        } else {
            layer.msg('您还未输入搜索词！', {icon: 0, time: 1500});
        }
    });
    $("#keyword").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#searchJob").click();
        }
    });
    //引用弹出框效果
    layui.use(['laydate', 'element', 'laypage', 'layer'], function () {
        $ = layui.jquery;//jquery
    });
    var app = new Vue({
        el: '#app',
        data: {
            new_jobs: []
        },
        methods: {
            skip: function (id) {
                window.location = "detail.html?job_id=" + id;
            }
        },
        mounted: function () {
            var that = this;
            $.ajax({
                url: "../php/job_data.php",
                data: {},
                success: function (result) {
                    that.new_jobs = result.job;
                },
                dataType: "json"
            });
        }
    });
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
                data: {
                    limit: 7
                },
                success: function (result) {
                    that.news = result.news;
                },
                dataType: "json"
            });
        }
    });
    Vue.filter('format', function (value) {
        var city = value.toString().substr(0, 2);
        return city;
    });
    var job_app = new Vue({
        el: '#job_app',
        data: {
            campus_job: [],
            society_job: []
        },
        methods: {
            skip: function (id) {
                window.location = "detail.html?job_id=" + id;
            }
        },
        mounted: function () {
            var that = this;
            $.ajax({
                url: "../php/school_society.php",
                data: {
                    job_type: "校园招聘"
                },
                success: function (result) {
                    that.campus_job = result.job;
                },
                dataType: "json"
            });
            $.ajax({
                url: "../php/school_society.php",
                data: {
                    job_type: "社会招聘"
                },
                success: function (result) {
                    that.society_job = result.job;
                },
                dataType: "json"
            });
        }
    })
});
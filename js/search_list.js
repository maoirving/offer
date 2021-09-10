$(function () {
    $("#search_nav ul li a").on("click", function () {
        $(this).addClass("current_nav").siblings().removeClass("current_nav");
    });
    var lis = $(".page_num ul li:not(:first-child,:last-child)");
    $(lis).on("click", function () {
        $(this).addClass("current").siblings().removeClass("current");
    });
    Vue.filter('formatCity', function (value) {
        var city = value.toString().substr(0, 2);
        return city;
    });
    //引用弹出框效果
    layui.use(['laydate', 'element', 'laypage', 'layer'], function () {
        $ = layui.jquery;//jquery
    });
    var selected_option = "";
    var selected_index;
    var condition_app = new Vue({
        el: '#condition_app',
        data: {
            currentIndex: '-1', // 选项卡当前的索引
            dropdown_select: [{
                select: '工作经验',
                select_more: ['不限', '在校/应届', '1年以内', '1~3年', '3~5年', '5~10年'],
            }, {
                select: '学历要求',
                select_more: ['不限', '大专', '本科', '硕士', '博士'],
            }, {
                select: '招聘类型',
                select_more: ['不限', '校园招聘', '社会招聘'],
            }, {
                select: '融资阶段',
                select_more: ['不限', '未融资', '天使轮', 'A轮', 'B轮', 'C轮', 'D轮及以上', '已上市', '不需要融资'],
            }, {
                select: '公司规模',
                select_more: ['不限', '0-20人', '20-90人', '100-499人', '500-999人', '1000-9999人', '10000人以上'],
            }, {
                select: '发布时间',
                select_more: ['不限', '一天以内', '三天以内', '七天以内', '十五天以内', '一个月以内'],
            }],
            isShow: false,
        },
        methods: {
            show: function (index) {
                this.currentIndex = index;
            },
            noshow: function () {
                this.currentIndex = '-1';
            },
            selected: function (index, i) {
                this.dropdown_select[index].select = this.dropdown_select[index].select_more[i];
                this.currentIndex = '-1';
                if (this.dropdown_select[index].select_more[i] == "不限") {
                    selected_option = "";
                } else {
                    selected_option = this.dropdown_select[index].select_more[i];
                }
                selected_index = index;
                // console.log(selected_option);
                // console.log(index);
                switch (index) {
                    case 0:
                        job_app.require = selected_option;
                        break;
                    case 1:
                        job_app.education = selected_option;
                        break;
                    case 2:
                        job_app.job_type = selected_option;
                        break;
                    case 3:
                        job_app.company_finance = selected_option;
                        break;
                    case 4:
                        job_app.company_headcount = selected_option;
                        break;
                    case 5:
                        job_app.pub_time = selected_option;
                        break;
                }
            },
        }
    });
    $("#uploadResume").on("click", function () {
        if (getCookie("username")) {
            popupLoad("#upResume_popup");
            var box_id = "#upResume_popup";
            popup(box_id);
            $("#upResume_popup .ok_btn")[0].onclick = function () {
                var that = this;
                layer.confirm('确认上传简历？', {icon: 3, title: '提示信息'}, function () {
                    var formData = new FormData(document.querySelector("#upResume_form"));
                    $.ajax({
                        url: "../php/upResume_file.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('上传成功！', {icon: 1, time: 1500}, function () {
                                    $("#upResume_popup .closeBtn").click();
                                });
                            } else {
                                layer.msg('上传失败，请重试！', {icon: 2, time: 1500});
                            }
                        }
                    });
                });
            };
        } else {
            layer.msg('您还未登录，请先登录！', {icon: 0, time: 1500}, function () {
                window.location = "sign.html";
            });
        }
    });
    $("#lookResume").on("click", function () {
        if (getCookie("username")) {
            window.location = "user.html?menu=my_resume";
        } else {
            layer.msg('您还未登录，请先登录！', {icon: 0, time: 1500}, function () {
                window.location = "sign.html";
            });
        }
    });
    var job_app = new Vue({
        el: '#job_app',
        data: {
            job: {},
            require: "",
            education: "",
            job_type: "",
            company_finance: "",
            company_headcount: "",
            pub_time: ""
        },
        methods: {
            skip: function (id) {
                window.location = "detail.html?job_id=" + id;
            },
            getType: function () {
                var job_type;
                var type_url = getQueryVariable("job_type");
                if (type_url == "school") {
                    job_type = "校园招聘";
                    $("#school").parent().addClass("current_nav");
                    $(".dropdown_wrap:eq(2)").hide();
                } else if (type_url == "society") {
                    job_type = "社会招聘";
                    $("#society").parent().addClass("current_nav");
                    $(".dropdown_wrap:eq(2)").hide();
                } else {
                    job_type = "";
                    $("#all").parent().addClass("current_nav");
                }
                return job_type;
            },
            isShow: function (item) {
                var require_f, education_f, job_type_f, company_finance_f, company_headcount_f, pub_time_f;
                require_f = education_f = job_type_f = company_finance_f = company_headcount_f = pub_time_f = 1;
                if (this.require) {
                    if (item.require == this.require) {
                        require_f = 1;
                    } else {
                        require_f = 0;
                    }
                } else {
                    require_f = 1;
                }
                if (this.education) {
                    if (item.education == this.education) {
                        education_f = 1;
                    } else {
                        education_f = 0;
                    }
                } else {
                    education_f = 1;
                }
                if (this.job_type) {
                    if (item.job_type == this.job_type) {
                        job_type_f = 1;
                    } else {
                        job_type_f = 0;
                    }
                } else {
                    job_type_f = 1;
                }
                if (this.company_finance) {
                    if (item.company_finance == this.company_finance) {
                        company_finance_f = 1;
                    } else {
                        company_finance_f = 0;
                    }
                } else {
                    company_finance_f = 1;
                }
                if (this.company_headcount) {
                    if (item.company_headcount == this.company_headcount) {
                        company_headcount_f = 1;
                    } else {
                        company_headcount_f = 0;
                    }
                } else {
                    company_headcount_f = 1;
                }
                if (this.pub_time) {
                    if (item.used == this.pub_time) {
                        pub_time_f = 1;
                    } else {
                        pub_time_f = 0;
                    }
                } else {
                    pub_time_f = 1;
                }
                if (require_f && education_f && job_type_f && company_finance_f && company_headcount_f && pub_time_f) {
                    return true;
                } else {
                    return false;
                }
            },
            loadInfo: function (search_content) {
                var that = this;
                $.ajax({
                    url: "../php/data.php",
                    data: {
                        job_type: that.getType(),
                        search_content: search_content
                    },
                    success: function (result) {
                        if (result == "0") {
                            $(".main .job_notFound").show();
                            $(".main .job_list").hide();
                        } else {
                            $(".main .job_notFound").hide();
                            $(".main .job_list").show();
                            that.job = result.job;
                            var job = result.job;
                            for (var i = 0; i < job.length; i++) {
                                let startTime = new Date(job[i].pub_time); // 开始时间
                                let endTime = new Date(); // 结束时间
                                let usedTime = endTime - startTime; // 相差的毫秒数
                                let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
                                if (days <= 1) {
                                    that.job[i].used = "一天以内";
                                } else if (days <= 3) {
                                    that.job[i].used = "三天以内";
                                } else if (days <= 7) {
                                    that.job[i].used = "七天以内";
                                } else if (days <= 15) {
                                    that.job[i].used = "十五天以内";
                                } else if (days <= 31) {
                                    that.job[i].used = "一个月以内";
                                }
                            }
                        }
                    },
                    dataType: "json"
                });
            }
        },
        mounted: function () {
            if (getQueryVariable("keyword")) {
                $("#search_content").val(getQueryVariable("keyword"));
                this.loadInfo(getQueryVariable("keyword"));
            } else {
                this.loadInfo("");
            }
        }
    });
    $("#searchJob").on("click", function () {
        var search_content = $.trim($("#search_content").val());
        if (getQueryVariable("keyword")) {
            replaceParamVal("keyword", search_content);
        } else {
            if (getQueryVariable("job_type")) {
                window.location = "search_list.html?job_type=" + getQueryVariable("job_type") + "&keyword=" + search_content;
            } else {
                window.location = "search_list.html?keyword=" + search_content;
            }
            // job_app.loadInfo(search_content);
        }
        // 判断是否输入搜索词
        // if (search_content) {
        //     if (getQueryVariable("keyword")) {
        //         replaceParamVal("keyword", search_content);
        //     } else {
        //         window.location = "search_list.html?keyword=" + search_content;
        //         // job_app.loadInfo(search_content);
        //     }
        // } else {
        //     layer.msg('您还未输入搜索词！', {icon: 0, time: 1500});
        // }
    });
    $("#search_content").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#searchJob").click();
        }
    });
    // 创建已申请职位Vue
    var apply_app = new Vue({
        el: '#apply_app',
        data: {
            job: []
        },
        methods: {
            skip: function (id, isRead) {
                if (isRead == -1) {
                    layer.msg('无法查看，因为该职位已关闭！', {icon: 0, time: 1500});
                } else {
                    window.location = "detail.html?job_id=" + id;
                }
            },
            lookMore: function () {
                if (getCookie("username")) {
                    window.location = "user.html?menu=my_applied";
                } else {
                    layer.msg('您暂未登录，请先登录！', {icon: 0, time: 2000}, function () {
                        window.location = "sign.html";
                    });
                }
            }
        },
        mounted: function () {
            if (getCookie("username")) {
                var that = this;
                $.ajax({
                    url: "../php/applied_simple.php",
                    data: {},
                    success: function (result) {
                        that.job = result.applied_job;
                    },
                    dataType: "json"
                });
            } else {
                $("#apply_app .no_signed").show();
            }
        }
    });
});

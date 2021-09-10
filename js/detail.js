$(function () {
    Vue.filter('city', function (value) {
        // var city = value + "";
        var city = String(value);
        var index = city.lastIndexOf('·');
        city = city.substr(0, index);
        return city;
    });
    //引入弹框
    layui.use(['laydate', 'element', 'laypage', 'layer'], function () {
        $ = layui.jquery;//jquery
    });
    var app = new Vue({
        el: '#app',
        data: {
            job: ""
        },
        methods: {
            loveJob: function (name, require, salary, area, education, company_id) {
                if (getCookie("username")) {
                    layer.confirm('确认收藏该职位？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/love_add.php",
                            type: "post",
                            data: {
                                job_id: getQueryVariable("job_id"),
                                job_name: name,
                                experience: require,
                                salary: salary,
                                work_place: area,
                                education: education,
                                company_id: company_id,
                                love_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('收藏成功！', {icon: 1, time: 1500});
                                } else if (result == "exist") {
                                    layer.msg('已收藏，请勿重复收藏！', {icon: 0, time: 1500});
                                } else {
                                    layer.msg('收藏失败！', {icon: 2, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                } else {
                    layer.msg('您暂未登录，请先登录！', {icon: 0, time: 1500}, function () {
                        window.location = "sign.html";
                    });
                }
            },
            applyJob: function (name, require, salary, area, education, company_id) {
                if (getCookie("resume_isPassed")) {
                    if (getCookie("resume_isPassed") == "0") {
                        layer.msg('简历暂未审核，不能申请职位！', {icon: 0, time: 2500});
                    } else if (getCookie("resume_isPassed") == "-1") {
                        layer.msg('简历未通过审核，不能申请职位！', {icon: 0, time: 2500});
                    } else if (getCookie("resume_isPassed") == "1") {
                        popupLoad("#sendResume_popup");
                        var box_id = "#sendResume_popup";
                        popup(box_id);
                        $("#sendResume_popup .choose_btn").on("click", function () {
                            $(this).addClass("current_choose").siblings().removeClass("current_choose");
                        });
                        $("#sendResume_popup .ok_btn")[0].onclick = function () {
                            var type = $("#sendResume_popup .choose_div .current_choose").text();
                            var resume_type = "online";
                            if (type == "附件简历") {
                                resume_type = "file";
                            }
                            layer.confirm('确认申请并投递' + type, {icon: 3, title: '提示信息'}, function () {
                                $.ajax({
                                    url: "../php/applied_add.php",
                                    type: "post",
                                    data: {
                                        job_id: getQueryVariable("job_id"),
                                        job_name: name,
                                        experience: require,
                                        salary: salary,
                                        work_place: area,
                                        education: education,
                                        company_id: company_id,
                                        resume_type: resume_type,
                                        applied_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                                    },
                                    success: function (result) {
                                        if (result == "ok") {
                                            layer.msg('申请成功！', {icon: 1, time: 1500}, function () {
                                                $("#sendResume_popup .closeBtn").click();
                                            });
                                        } else if (result == "exist") {
                                            layer.msg('已申请，请勿重复申请！', {icon: 0, time: 1500}, function () {
                                                $("#sendResume_popup .closeBtn").click();
                                            });
                                        } else {
                                            layer.msg('申请失败！', {icon: 2, time: 1500});
                                        }
                                    },
                                    dataType: "text"
                                });
                            });
                        }
                    }
                } else {
                    layer.msg('您暂未登录，请先登录！', {icon: 0, time: 1500}, function () {
                        window.location = "sign.html";
                    });
                }
            }
        },
        mounted: function () {
            var that = this;
            $.ajax({
                url: "../php/common/job_information.php",
                data: {
                    job_id: getQueryVariable("job_id")
                },
                success: function (result) {
                    that.job = result.job[0];
                },
                dataType: "json"
            });
        }
    })
});
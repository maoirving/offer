$(function () {
    function updateInfo() {
        if (getCookie("admin_username")) {
            // 退出登录，清除cookie
            $("#admin_exit").on("click", function () {
                document.cookie = "admin_username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "admin_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            });
            //判断早中晚
            var now = new Date().getHours();
            if (now < 5) {
                $("#now").text("凌晨了，早点休息哦！");
            } else if (now < 11) {
                $("#now").text("早上好！");
            } else if (now < 13) {
                $("#now").text("中午好！");
            } else if (now < 17) {
                $("#now").text("下午好！");
            } else if (now < 19) {
                $("#now").text("傍晚好！");
            } else if (now <= 23) {
                $("#now").text("晚上好！");
            }
            //用户头像获取
            $.ajax({
                url: "../php/admin/get_adminInfo.php",
                data: {},
                success: function (result) {
                    var userInfo = result.user[0];
                    if (!userInfo.user_imgUrl) {
                        $(".li_img").hide();
                    } else {
                        $(".user_img").prop("src", userInfo.user_imgUrl);
                        $(".li_img").show();
                    }
                    if (userInfo.admin_name) {
                        $("#user_name").text(userInfo.admin_name);
                    }
                },
                dataType: "json"
            });
        }
    }

    updateInfo();
    //引入弹框
    layui.use(['laydate', 'element', 'laypage', 'layer'], function () {
        $ = layui.jquery;//jquery
    });
    //编辑新闻 模态框
    var news_popup = new Vue({
        el: "#news_popup",
        data: {
            news: [],
            news_id: ''
        },
        methods: {
            loadInfo: function (news_id) {
                this.news_id = news_id;
                var that = this;
                $.ajax({
                    url: "../php/admin/news_information.php",
                    data: {
                        news_id: news_id,
                    },
                    success: function (result) {
                        that.news = result.news[0];
                        var news_content = result.news[0].news_content;
                        news_content = news_content.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        that.news.news_content = news_content;
                    },
                    dataType: "json"
                });
            },
            updateNews: function () {
                var that = this;
                var news_content = $("#news_content").val();
                news_content = "<p>" + news_content.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                $.ajax({
                    url: "../php/admin/change_news.php",
                    type: "post",
                    data: {
                        news_id: that.news_id,
                        news_title: $("#news_title").val(),
                        news_type: $("#re_news_type").text(),
                        news_author: $("#news_author").val(),
                        news_brief: $("#news_brief").val(),
                        news_content: news_content,
                    },
                    success: function (result) {
                        if (result == "ok") {
                            layer.msg('修改成功！', {icon: 1, time: 1500});
                            $("#news_popup").find(".closeBtn").click();
                            news_manage_app.loadInfo($.trim(news_manage_app.keyword));
                        } else if (result == "exist") {
                            layer.msg('未作任何修改！', {icon: 0, time: 1500});
                        } else {
                            console.log(result)
                            layer.msg('修改失败，请重试！', {icon: 2, time: 1500});
                        }
                    },
                    dataType: "text"
                });
            }

        }
    });
    //创建新闻资讯管理Vue
    var news_manage_app = new Vue({
        el: '#news_manage_app',
        data: {
            news: [],
            keyword: '',
            choose_one: '全部',
            choose: ['全部', '求职必读', '行业知识', '干货文章'],
            judgeShow: 0
        },
        methods: {
            searchNews: function () {
                var keyword = $.trim(this.keyword);
                this.loadInfo(keyword);
                // 判断是否输入搜索词
                // if (keyword != '') {
                //     this.loadInfo(keyword);
                // } else {
                //     layer.msg('您还未输入搜索词！', {icon: 0, time: 1500});
                // }
            },
            changeChoose: function (index) {
                if (this.choose[index] == "全部") {
                    this.judgeShow = 0;
                } else if (this.choose[index] == "求职必读") {
                    this.judgeShow = 1;
                } else if (this.choose[index] == "行业知识") {
                    this.judgeShow = 2;
                } else if (this.choose[index] == "干货文章") {
                    this.judgeShow = 3;
                }
            },
            isShow: function (job_type) {
                if (this.judgeShow == 0) {
                    return true;
                } else if (this.judgeShow == 1) {
                    if (job_type == "求职必读") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 2) {
                    if (job_type == "行业知识") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 3) {
                    if (job_type == "干货文章") {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            editNews: function (news_id) {
                var that = this;
                news_popup.loadInfo(news_id);
                var box_id = "#news_popup";
                popup(box_id);
            },
            deleteNews: function (news_id) {
                var that = this;
                layer.confirm('确认删除？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/delete_news.php",
                        data: {
                            news_id: news_id,
                            num: 'one'
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('删除成功！', {icon: 1, time: 1500});
                                that.loadInfo($.trim(that.keyword));
                                $("input[type=checkbox]").prop("checked", false);
                            } else {
                                layer.msg('删除失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            loadInfo: function (keyword) {
                var that = this;
                $.ajax({
                    url: "../php/admin/manage_news.php",
                    data: {
                        keyword: keyword
                    },
                    success: function (result) {
                        if (result != '0') {
                            $(".manage_news .news_notFound").hide();
                            $(".manage_news .news_table").show();
                            that.news = result.news;
                        } else {
                            $(".manage_news .news_notFound").show();
                            $(".manage_news .news_table").hide();
                        }
                    },
                    dataType: "json"
                });
            },
            btnAll: function () {
                $("#checkAll0").click();
                this.checkAll();
            },
            checkAll: function () {
                $(".manage_news .checkOne").prop("checked", $("#checkAll0").prop("checked"));
                if ($("#checkAll0").prop("checked") == true) {
                    $("#btnAll0").text("反选");
                } else {
                    $("#btnAll0").text("全选");
                }
            },
            checkNews: function () {
                if ($(".manage_news .checkOne:checked").length == $(".manage_news .checkOne").length) {
                    $("#checkAll0").prop("checked", true);
                    $("#btnAll0").text("反选");
                } else {
                    $("#checkAll0").prop("checked", false);
                    $("#btnAll0").text("全选");
                }
            },
            deleteMany: function () {
                if ($(".manage_news .checkOne:checked").length == 0) {
                    layer.msg('请先选择要删除的新闻！', {icon: 0, time: 2000});
                } else {
                    var that = this;
                    var news_id = [];
                    let checked_box = $(".manage_news .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        news_id.push($(checked_box[i]).attr("news_id"));
                    }
                    layer.confirm('确认删除已选中的新闻？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/admin/delete_news.php",
                            data: {
                                news_id: "(" + news_id.join(',') + ")",
                                num: 'many'
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('批量删除成功！', {icon: 1, time: 1500});
                                    that.loadInfo($.trim(that.keyword));
                                    $("input[type=checkbox]").prop("checked", false);
                                } else {
                                    layer.msg('删除失败，请重试！', {icon: 1, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                }
            }
        },
        mounted: function () {
            this.loadInfo('');
            popupLoad("#news_popup");
        }
    });
    // 创建新闻发布vue
    var news_app = new Vue({
        el: "#news_app",
        data: {
            news_title: "",
            news_author: "",
            news_image: "",
            news_brief: "",
            news_content: "",
        },
        methods: {
            change_newsImg: function () {
                $("#up_newsImg").click();
                var up_img = document.querySelector('#up_newsImg');
                var img = document.querySelector('#news_Img');
                if (up_img) {
                    up_img.addEventListener('change', function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
                        reader.addEventListener("load", function () {
                            img.src = reader.result;
                            $("#newsImg_before").hide();
                            $("#newsImg_after").show();
                        }, false);
                        // 调用reader.readAsDataURL()方法，把图片转成base64
                        reader.readAsDataURL(file);
                    }, false);
                }
            },
            save_newsImg: function () {
                var that = this;
                if (getCookie("admin_username")) {
                    layer.confirm('确认上传新闻封面？', {icon: 3, title: '提示信息'}, function () {
                        var formData = new FormData(document.querySelector("#news_form"));
                        $.ajax({
                            url: "../php/admin/save_newsImg.php",
                            type: "post",
                            contentType: false,
                            processData: false,
                            data: formData,
                            success: function (result) {
                                layer.msg('上传成功！', {icon: 1, time: 1500});
                                that.news_image = result;
                                $("#newsImg_before").show();
                                $("#newsImg_after").hide();
                            }
                        });
                    });
                } else {
                    layer.msg('您还未登录，请先登录！', {icon: 0, time: 1500}, function () {
                        window.location = "admin_sign.html";
                    });
                }
            },
            pubNews: function () {
                if (getCookie("admin_username")) {
                    if (this.news_title && this.news_author && this.news_image && this.news_brief && this.news_content) {
                        var that = this;
                        var news_content = "<p>" + this.news_content.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                        $.ajax({
                            url: "../php/admin/save_news.php",
                            type: "post",
                            data: {
                                news_title: that.news_title,
                                news_type: $("#news_type").text(),
                                news_author: that.news_author,
                                news_image: that.news_image,
                                news_brief: that.news_brief,
                                news_content: news_content,
                                news_pubtime: new Date().Format("yyyy-MM-dd HH:mm:ss")
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('发布新闻成功！', {icon: 1, time: 1500}, function () {
                                        window.location = "admin.html";
                                    });
                                } else {
                                    layer.msg('发布失败，请重试！', {icon: 2, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    } else {
                        layer.msg('请先将新闻信息填写完整！', {icon: 0, time: 1500});
                    }
                } else {
                    layer.msg('您还未登录，请先登录！', {icon: 0, time: 1500}, function () {
                        window.location = "admin_sign.html";
                    });
                }
            }
        }
    });
    //编辑职位 模态框
    var job_popup = new Vue({
        el: "#job_popup",
        data: {
            job: []
        },
        methods: {
            loadInfo: function (job_id) {
                var that = this;
                $.ajax({
                    url: "../php/common/job_information.php",
                    data: {
                        job_id: job_id,
                    },
                    success: function (result) {
                        that.job = result.job[0];
                        var job_description = result.job[0].job_description;
                        job_description = job_description.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        var job_skill = result.job[0].job_skill;
                        job_skill = job_skill.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        that.job.job_description = job_description;
                        that.job.job_skill = job_skill;
                    },
                    dataType: "json"
                });
            }
        }
    })
    //职位管理Vue
    var job_app = new Vue({
        el: '#job_app',
        data: {
            job: [],
            keyword: '',
            choose_one: '全部',
            choose: ['全部', '校园招聘', '社会招聘'],
            judgeShow: 0
        },
        methods: {
            searchJob: function () {
                var keyword = $.trim(this.keyword);
                this.loadInfo(keyword);
                // 判断是否输入搜索词
                // if (keyword != '') {
                //     this.loadInfo(keyword);
                // } else {
                //     layer.msg('您还未输入搜索词！', {icon: 0, time: 1500});
                // }
            },
            changeChoose: function (index) {
                if (this.choose[index] == "全部") {
                    this.judgeShow = 0;
                } else if (this.choose[index] == "校园招聘") {
                    this.judgeShow = 1;
                } else if (this.choose[index] == "社会招聘") {
                    this.judgeShow = 2;
                }
            },
            isShow: function (job_type) {
                if (this.judgeShow == 0) {
                    return true;
                } else if (this.judgeShow == 1) {
                    if (job_type == "校园招聘") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 2) {
                    if (job_type == "社会招聘") {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            deleteJob: function (job_id) {
                var that = this;
                layer.confirm('确认删除？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/common/delete_job.php",
                        data: {
                            job_id: job_id,
                            num: 'one'
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('删除成功！', {icon: 1, time: 1500});
                                that.loadInfo($.trim(that.keyword));
                                $("input[type=checkbox]").prop("checked", false);
                            } else {
                                layer.msg('删除失败，请重试！', {icon: 1, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            editJob: function (job_id) {
                var that = this;
                job_popup.loadInfo(job_id);
                var box_id = "#job_popup";
                popup(box_id);
                $(box_id).find(".ok_btn")[0].onclick = function () {
                    var job_description = $("#re_job_description").val();
                    job_description = "<p>" + job_description.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    var job_skill = $("#re_job_skill").val();
                    job_skill = "<p>" + job_skill.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    $.ajax({
                        url: "../php/common/change_job.php",
                        type: "post",
                        data: {
                            job_id: job_id,
                            job_name: $("#re_job_name").val(),
                            job_type: $("#re_job_type").text(),
                            wanted_num: $("#re_wanted_num").val(),
                            job_description: job_description,
                            work_place: $("#re_work_place").val(),
                            salary: $("#re_salary").val(),
                            job_skill: job_skill,
                            experience: $("#re_experience").text(),
                            education: $("#re_education").text(),
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('修改成功！', {icon: 1, time: 1500});
                                $(box_id).find(".closeBtn").click();
                                that.loadInfo($.trim(that.keyword));
                            } else if (result == "exist") {
                                layer.msg('未作任何修改！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('修改失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                }
            },
            loadInfo: function (keyword) {
                var that = this;
                $.ajax({
                    url: "../php/admin/admin_manageJob.php",
                    data: {
                        keyword: keyword
                    },
                    success: function (result) {
                        if (result != '0') {
                            $(".manage_job .job_notFound").hide();
                            $(".manage_job .job_table").show();
                            that.job = result.job;
                        } else {
                            $(".manage_job .job_notFound").show();
                            $(".manage_job .job_table").hide();
                        }
                    },
                    dataType: "json"
                });
            },
            btnAll: function () {
                $("#checkAll").click();
                this.checkAll();
            },
            checkAll: function () {
                $(".manage_job .checkOne").prop("checked", $("#checkAll").prop("checked"));
                if ($("#checkAll").prop("checked") == true) {
                    $("#btnAll").text("反选");
                } else {
                    $("#btnAll").text("全选");
                }
            },
            checkJob: function () {
                if ($(".manage_job .checkOne:checked").length == $(".manage_job .checkOne").length) {
                    $("#checkAll").prop("checked", true);
                    $("#btnAll").text("反选");
                } else {
                    $("#checkAll").prop("checked", false);
                    $("#btnAll").text("全选");
                }
            },
            deleteMany: function () {
                if ($(".manage_job .checkOne:checked").length == 0) {
                    layer.msg('请先选择要删除的职位！', {icon: 0, time: 2000});
                } else {
                    var that = this;
                    var job_id = [];
                    let checked_box = $(".manage_job .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        job_id.push($(checked_box[i]).attr("job_id"));
                    }
                    layer.confirm('确认删除已选中的职位？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/common/delete_job.php",
                            data: {
                                job_id: "(" + job_id.join(',') + ")",
                                num: 'many'
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('批量删除成功！', {icon: 1, time: 1500});
                                    that.loadInfo($.trim(that.keyword));
                                    $("input[type=checkbox]").prop("checked", false);
                                } else {
                                    layer.msg('删除失败，请重试！', {icon: 1, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                }
            }
        },
        mounted: function () {
            this.loadInfo('');
            popupLoad("#job_popup");
        }
    });
    //创建公司详情模态框
    var company_popup = new Vue({
        el: "#company_popup",
        data: {
            company: {},
            company_id: ''
        },
        methods: {
            loadInfo: function (company_id) {
                this.company_id = company_id;
                var that = this;
                $.ajax({
                    url: "../php/admin/company_popup.php",
                    data: {
                        company_id: company_id,
                    },
                    success: function (result) {
                        that.company = result.company[0];
                    },
                    dataType: "json"
                });
            },
            passNo: function () {
                var that = this;
                layer.confirm('确认标记为“未通过审核”？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/isPassed.php",
                        type: "post",
                        data: {
                            company_id: that.company_id,
                            isPassed: -1,
                            num: "one"
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('已标记为“未通过审核”！', {icon: 1, time: 1500}, function () {
                                    $("#company_popup .closeBtn").click();
                                    company_app.loadInfo($.trim(company_app.keyword));
                                });
                            } else if (result == "exist") {
                                layer.msg('已标记，请勿重复操作！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('标记失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            passOK: function () {
                var that = this;
                layer.confirm('确认通过审核？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/isPassed.php",
                        type: "post",
                        data: {
                            company_id: that.company_id,
                            isPassed: 1,
                            num: "one"
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('审核通过！', {icon: 1, time: 1500}, function () {
                                    $("#company_popup .closeBtn").click();
                                    company_app.loadInfo($.trim(company_app.keyword));

                                });
                            } else if (result == "exist") {
                                layer.msg('已通过审核，请勿重复操作！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('通过审核失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            }
        }
    })
    // 创建管理公司Vue
    var company_app = new Vue({
        el: '#company_app',
        data: {
            company: {},
            keyword: '',
            choose_one: '全部',
            choose: ['全部', '未审核', '通过审核', '未通过'],
            judgeShow: 0
        },
        methods: {
            searchCompany: function () {
                var keyword = $.trim(this.keyword);
                this.loadInfo(keyword);
                // 判断是否输入搜索词
                // if (keyword != '') {
                //     this.loadInfo(keyword);
                // } else {
                //     layer.msg('您还未输入搜索词！', {icon: 0, time: 1500});
                // }
            },
            changeChoose: function (index) {
                if (this.choose[index] == "全部") {
                    this.judgeShow = 0;
                } else if (this.choose[index] == "未审核") {
                    this.judgeShow = 1;
                } else if (this.choose[index] == "通过审核") {
                    this.judgeShow = 2;
                } else if (this.choose[index] == "未通过") {
                    this.judgeShow = 3;
                }
            },
            isShow: function (isPassed) {
                if (this.judgeShow == 0) {
                    return true;
                } else if (this.judgeShow == 1) {
                    if (isPassed == 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 2) {
                    if (isPassed == 1) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 3) {
                    if (isPassed == -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            handle: function (isPassed) {
                if (isPassed == 0) {
                    return true;
                } else {
                    return false;
                }
            },
            handleYes: function (isPassed) {
                if (isPassed == 1) {
                    return true;
                } else {
                    return false;
                }
            },
            handleNo: function (isPassed) {
                if (isPassed == -1) {
                    return true;
                } else {
                    return false;
                }
            },
            checkIt: function (company_id) {
                var that = this;
                company_popup.loadInfo(company_id);
                var box_id = "#company_popup";
                popup(box_id);
            },
            deleteCompany: function (company_id) {
                var that = this;
                layer.confirm('确认删除？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/delete_company.php",
                        data: {
                            company_id: company_id,
                            num: 'one'
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('删除成功！', {icon: 1, time: 1500});
                                that.loadInfo($.trim(that.keyword));
                                $("input[type=checkbox]").prop("checked", false);
                            } else {
                                layer.msg('删除失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            loadInfo: function (keyword) {
                var that = this;
                $.ajax({
                    url: "../php/admin/admin_manageCompany.php",
                    data: {
                        keyword: keyword
                    },
                    success: function (result) {
                        if (result != '0') {
                            $(".manage_company .company_notFound").hide();
                            $(".manage_company .company_table").show();
                            that.company = result.company;
                        } else {
                            $(".manage_company .company_notFound").show();
                            $(".manage_company .company_table").hide();
                        }
                    },
                    dataType: "json"
                });
            },
            btnAll: function () {
                $("#checkAll2").click();
                this.checkAll();
            },
            checkAll: function () {
                $(".manage_company .checkOne").prop("checked", $("#checkAll2").prop("checked"));
                if ($("#checkAll2").prop("checked") == true) {
                    $("#btnAll2").text("反选");
                } else {
                    $("#btnAll2").text("全选");
                }
            },
            checkCompany: function () {
                if ($(".manage_company .checkOne:checked").length == $(".manage_company .checkOne").length) {
                    $("#checkAll2").prop("checked", true);
                    $("#btnAll2").text("反选");
                } else {
                    $("#checkAll2").prop("checked", false);
                    $("#btnAll2").text("全选");
                }
            },
            checkMany: function () {
                if ($(".manage_company .checkOne:checked").length == 0) {
                    layer.msg('请先选择要审核的公司！', {icon: 0, time: 2000});
                } else {
                    var box_id = "#check_popup";
                    popup(box_id);
                    var that = this;
                    var company_id = [];
                    let checked_box = $(".manage_company .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        company_id.push($(checked_box[i]).attr("company_id"));
                    }
                    $("#passOKMany")[0].onclick = function () {
                        layer.confirm('确认审核已选中的公司？', {icon: 3, title: '提示信息'}, function () {
                            $.ajax({
                                url: "../php/admin/isPassed.php",
                                type: "post",
                                data: {
                                    company_id: "(" + company_id.join(',') + ")",
                                    isPassed: 1,
                                    num: 'many'
                                },
                                success: function (result) {
                                    if (result == "ok") {
                                        layer.msg('批量通过审核成功！', {icon: 1, time: 1500}, function () {
                                            $("#check_popup .closeBtn").click();
                                        });
                                        that.loadInfo($.trim(that.keyword));
                                        $("input[type=checkbox]").prop("checked", false);
                                    } else if (result == "exist") {
                                        layer.msg('选择公司均审核通过，请勿重复操作！', {icon: 0, time: 2500});

                                    } else {
                                        console.log(result)
                                        layer.msg('批量通过失败，请重试！', {icon: 2, time: 1500});
                                    }
                                },
                                dataType: "text"
                            });
                        });
                    }
                    $("#passNoMany")[0].onclick = function () {
                        layer.confirm('确认批量标记“未通过审核”？', {icon: 3, title: '提示信息'}, function () {
                            $.ajax({
                                url: "../php/admin/isPassed.php",
                                type: "post",
                                data: {
                                    company_id: "(" + company_id.join(',') + ")",
                                    isPassed: -1,
                                    num: 'many'
                                },
                                success: function (result) {
                                    if (result == "ok") {
                                        layer.msg('批量标记“未通过审核”成功！', {icon: 1, time: 1500}, function () {
                                            $("#check_popup .closeBtn").click();
                                        });
                                        that.loadInfo($.trim(that.keyword));
                                        $("input[type=checkbox]").prop("checked", false);
                                    } else if (result == "exist") {
                                        layer.msg('选择公司均已标记，请勿重复操作！', {icon: 0, time: 2500});

                                    } else {
                                        console.log(result)
                                        layer.msg('批量标记失败，请重试！', {icon: 2, time: 1500});
                                    }
                                },
                                dataType: "text"
                            });
                        });
                    }
                }
            },
            deleteMany: function () {
                if ($(".manage_company .checkOne:checked").length == 0) {
                    layer.msg('请先选择要删除的公司！', {icon: 0, time: 2000});
                } else {
                    var that = this;
                    var company_id = [];
                    let checked_box = $(".manage_company .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        company_id.push($(checked_box[i]).attr("company_id"));
                    }
                    layer.confirm('确认删除已选中的公司？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/admin/delete_company.php",
                            data: {
                                company_id: "(" + company_id.join(',') + ")",
                                num: 'many'
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('批量删除成功！', {icon: 1, time: 1500});
                                    that.loadInfo($.trim(that.keyword));
                                    $("input[type=checkbox]").prop("checked", false);
                                } else {
                                    layer.msg('删除失败，请重试！', {icon: 2, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                }
            }
        },
        mounted: function () {
            this.loadInfo('');
            popupLoad("#company_popup");
            popupLoad("#check_popup");
        }
    });
    //创建简历模态框Vue
    var resume_popup = new Vue({
        el: '#resume_popup',
        data: {
            resume: {},
            age: "",
            work_type: "",
            certificate: []
        },
        methods: {
            loadInfo: function (username) {
                var that = this;
                $.ajax({
                    url: "../php/common/resume_data.php",
                    data: {
                        username: username
                    },
                    success: function (result) {
                        that.resume = result.resume[0];
                        var birthday = result.resume[0].worker_birthday;
                        var year = new Date().getFullYear();
                        that.age = year - birthday.substr(0, 4);
                        that.work_type = result.resume[0].work_type.substr(0, 2);
                        that.certificate = result.resume[0].certificate.split(';');
                    },
                    dataType: "json"
                });
            },
            passNo: function (resume_id) {
                layer.confirm('确认标记为“未通过审核”？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/resume_isPassed.php",
                        type: "post",
                        data: {
                            resume_id: resume_id,
                            isPassed: -1,
                            num: "one"
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('已标记为“未通过审核”！', {icon: 1, time: 1500}, function () {
                                    $("#resume_popup .closeBtn").click();
                                    users_app.loadInfo($.trim(users_app.keyword));
                                });
                            } else if (result == "exist") {
                                layer.msg('已标记，请勿重复操作！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('标记失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            passOK: function (resume_id) {
                layer.confirm('确认通过审核？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/resume_isPassed.php",
                        type: "post",
                        data: {
                            resume_id: resume_id,
                            isPassed: 1,
                            num: "one"
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('审核通过！', {icon: 1, time: 1500}, function () {
                                    $("#resume_popup .closeBtn").click();
                                    users_app.loadInfo($.trim(users_app.keyword));

                                });
                            } else if (result == "exist") {
                                layer.msg('已通过审核，请勿重复操作！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('通过审核失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            }
        }
    });
    //创建管理用户Vue
    var users_app = new Vue({
        el: '#users_app',
        data: {
            user: {},
            keyword: '',
            choose_one: '全部',
            choose: ['全部', '个人用户', '企业用户'],
            judgeShow: 0
        },
        methods: {
            searchUser: function () {
                var keyword = $.trim(this.keyword);
                this.loadInfo(keyword);
                // 判断是否输入搜索词
                // if (keyword != '') {
                //     this.loadInfo(keyword);
                // } else {
                //     layer.msg('您还未输入搜索词！', {icon: 0, time: 1500});
                // }
            },
            changeChoose: function (index) {
                if (this.choose[index] == "全部") {
                    this.judgeShow = 0;
                } else if (this.choose[index] == "个人用户") {
                    this.judgeShow = 1;
                } else if (this.choose[index] == "企业用户") {
                    this.judgeShow = 2;
                }
            },
            isShow: function (user_type) {
                if (this.judgeShow == 0) {
                    return true;
                } else if (this.judgeShow == 1) {
                    if (user_type == '个人用户') {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 2) {
                    if (user_type == '企业用户') {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            checkResume: function (username) {
                resume_popup.loadInfo(username);
                var box_id = "#resume_popup";
                popup(box_id);
            },
            resetPassword: function (user_id) {
                var that = this;
                layer.confirm('初始密码为“123456”，确认重置？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/resetPassword.php",
                        data: {
                            user_id: user_id,
                            num: 'one'
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('重置成功！', {icon: 1, time: 1500});
                                that.loadInfo($.trim(that.keyword));
                                $("input[type=checkbox]").prop("checked", false);
                            } else {
                                console.log(result);
                                layer.msg('重置失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            deleteUser: function (user_id) {
                var that = this;
                layer.confirm('确认删除？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/deleteUser.php",
                        data: {
                            user_id: user_id,
                            num: 'one'
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('删除成功！', {icon: 1, time: 1500});
                                that.loadInfo($.trim(that.keyword));
                                $("input[type=checkbox]").prop("checked", false);
                            } else {
                                console.log(result);
                                layer.msg('删除失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            loadInfo: function (keyword) {
                var that = this;
                $.ajax({
                    url: "../php/admin/manage_user.php",
                    data: {
                        keyword: keyword
                    },
                    success: function (result) {
                        if (result != '0') {
                            that.user = "";
                            $(".manage_user .user_notFound").hide();
                            $(".manage_user .user_table").show();
                            that.user = result.user;
                        } else {
                            $(".manage_user .user_notFound").show();
                            $(".manage_user .user_table").hide();
                        }
                    },
                    dataType: "json"
                });
            },
            btnAll: function () {
                $("#checkAll3").click();
                this.checkAll();
            },
            checkAll: function () {
                $(".manage_user .checkOne").prop("checked", $("#checkAll3").prop("checked"));
                if ($("#checkAll3").prop("checked") == true) {
                    $("#btnAll3").text("反选");
                } else {
                    $("#btnAll3").text("全选");
                }
            },
            checkUser: function () {
                if ($(".manage_user .checkOne:checked").length == $(".manage_user .checkOne").length) {
                    $("#checkAll3").prop("checked", true);
                    $("#btnAll3").text("反选");
                } else {
                    $("#checkAll3").prop("checked", false);
                    $("#btnAll3").text("全选");
                }
            },
            resetMany: function () {
                if ($(".manage_user .checkOne:checked").length == 0) {
                    layer.msg('请先选择要重置密码的用户！', {icon: 0, time: 2000});
                } else {
                    var that = this;
                    var user_id = [];
                    let checked_box = $(".manage_user .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        user_id.push($(checked_box[i]).attr("user_id"));
                    }
                    layer.confirm('初始密码为“123456”，确认批量重置？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/admin/resetPassword.php",
                            data: {
                                user_id: "(" + user_id.join(',') + ")",
                                num: 'many'
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('批量重置成功！', {icon: 1, time: 1500});
                                    that.loadInfo($.trim(that.keyword));
                                    $("input[type=checkbox]").prop("checked", false);
                                } else if (result == "exist") {
                                    layer.msg('选择账号已批量重置，请勿重复操作！', {icon: 0, time: 1500});
                                } else {
                                    console.log(result);
                                    layer.msg('批量重置失败，请重试！', {icon: 2, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                }
            },
            deleteMany: function () {
                if ($(".manage_user .checkOne:checked").length == 0) {
                    layer.msg('请先选择要删除的用户！', {icon: 0, time: 2000});
                } else {
                    var that = this;
                    var user_id = [];
                    let checked_box = $(".manage_user .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        user_id.push($(checked_box[i]).attr("user_id"));
                    }
                    layer.confirm('确认删除已选中的用户？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/admin/deleteUser.php",
                            data: {
                                user_id: "(" + user_id.join(',') + ")",
                                num: 'many'
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('批量删除成功！', {icon: 1, time: 1500});
                                    that.loadInfo($.trim(that.keyword));
                                    $("input[type=checkbox]").prop("checked", false);
                                } else {
                                    layer.msg('删除失败，请重试！', {icon: 1, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                }
            }
        },
        mounted: function () {
            this.loadInfo('');
            popupLoad("#resume_popup");
        }
    });

    // 创建用户个人信息Vue
    var user_app = new Vue({
        el: '#user_app',
        data: {
            user: "",
            isMan: false,
            isWoman: false,
            isShow: true,
            isChange: false,
        },
        methods: {
            change: function () {
                this.isShow = false;
                this.isChange = true;
            },
            show: function () {
                this.isShow = true;
                this.isChange = false;
            },
            changeImg: function () {
                $("#up_img").click();
                var up_img = document.querySelector('#up_img');
                var img = document.querySelector('#img');
                if (up_img) {
                    up_img.addEventListener('change', function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
                        reader.addEventListener("load", function () {
                            img.src = reader.result;
                            $("#img_before").hide();
                            $("#img_after").show();
                        }, false);
                        // 调用reader.readAsDataURL()方法，把图片转成base64
                        reader.readAsDataURL(file);
                    }, false);
                }
            },
            saveImg: function () {
                var that = this;
                layer.confirm('确认更换？', {icon: 3, title: '提示信息'}, function () {
                    var formData = new FormData(document.querySelector("#form"));
                    $.ajax({
                        url: "../php/admin/save_adminImg.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('更换成功！', {icon: 1, time: 1500});
                                updateInfo();
                            } else {
                                console.log(result);
                                layer.msg('更换失败，注意图片格式！', {icon: 2, time: 1500});
                            }
                            $("#img_before").show();
                            $("#img_after").hide();
                        }
                    });
                });
            },
            save: function () {
                var that = this;
                layer.confirm('确认修改？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/admin/change_admin.php",
                        type: "post",
                        data: {
                            admin_name: $("#admin_name").val(),
                            admin_type: $("#admin_type").val(),
                            admin_sex: $(".current_sex").text(),
                            admin_birthday: $("#admin_birthday").val(),
                            admin_phone: $("#admin_phone").val(),
                            admin_email: $("#admin_email").val()
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('修改成功！', {icon: 1, time: 1500});
                                that.show();
                                that.loadInfo();
                            } else if (result == "exist") {
                                layer.msg('未作任何修改！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('修改失败！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            loadInfo: function () {
                $("#sex span").bind("selectstart", function () {
                    return false;
                });
                $("#sex span").on("click", function () {
                    $(this).addClass("current_sex").siblings("span").removeClass("current_sex");
                });
                var that = this;
                $.ajax({
                    url: "../php/admin/admin_data.php",
                    data: {},
                    success: function (result) {
                        that.user = result.admin[0];
                        var sex = result.admin[0].admin_sex;
                        if (sex == '男') {
                            that.isMan = true;
                        }
                        if (sex == '女') {
                            that.isWoman = true;
                        }
                    },
                    dataType: "json"
                });
            }
        },
        mounted: function () {
            this.loadInfo();
        }
    });
    //修改密码模块
    //显示隐藏密码
    var eyes = $(".eyes");
    var flag = 1;
    var password = $("#new_password");
    $(eyes).bind("selectstart", function () {
        return false;
    });
    $(eyes).on('click', function () {
        if (flag % 2 == 1) {
            $(this).text('');
            $(password).attr("type", "text");
        } else {
            $(this).text('');
            $(password).attr("type", "password");
        }
        flag++;
    });
    var isTrue = 0;
    var isLegal = 0;
    //旧密码正确性判断
    $("#old_password").on("blur", function () {
        var old_password = $("#old_password").val();
        if (old_password.length > 0) {
            $.ajax({
                url: "../php/checkPassword.php",
                type: "post",
                data: {
                    user_type: "admin",
                    password: old_password
                },
                dataType: "text",
                success: function (result) {
                    if (result == "ok") {
                        $("#password_result").text("密码正确").css("color", "#0aa7a7");
                        isTrue = 1;
                    } else {
                        $("#password_result").text("密码错误，请重试").css("color", "#ff5c41");
                        isTrue = 0;
                    }
                }
            })
        } else {
            $("#password_result").text("请先输入旧密码").css("color", "#ff5c41");
        }
    });
    $("#new_password").on("blur", function () {
        var password = $("#new_password").val();
        if (isTrue == 1) {
            if (password.length < 6) {
                $("#new_password_result").text("请设置您的新密码,至少六位").css("color", "#ff5c41");
            } else {
                //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字
                var pPattern = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
                //判断密码是否合法
                if (pPattern.test(password)) {
                    $("#new_password_result").text("密码安全性高").css("color", "#0aa7a7");
                    isLegal = 1;
                } else {
                    $("#new_password_result").text("密码安全性低，至少包含1个大写字母、小写字母和数字").css("color", "#ff5c41");
                    isLegal = 0;
                }
            }
        } else {
            $("#new_password_result").text("");
        }
    });
    $("#new_password_checked").on("blur", function () {
        var password_checked = $("#new_password_checked").val();
        if (isTrue && isLegal) {
            if (password_checked !== "") {
                if (password_checked !== $("#new_password").val()) {
                    $("#new_password_checked_result").text("两次密码不一致").css("color", "#ff5c41");
                } else {
                    $("#new_password_checked_result").text("两次密码一致").css("color", "#0aa7a7");
                }
            } else {
                $("#new_password_checked_result").text("请再次输入您的新密码").css("color", "#ff5c41");
            }
        } else {
            $("#new_password_checked_result").text("");
        }
    });
    //保存密码修改
    $("#savePassword").on("click", function () {
        var old_password = $("#old_password").val();
        var new_password = $("#new_password").val();
        var new_password_checked = $("#new_password_checked").val();
        if (old_password == "") {
            $("#password_result").text("请先输入旧密码").css("color", "#ff5c41");
            $("#old_password").focus();
        } else if (isTrue != 1) {
            $("#password_result").text("密码错误，请重试").css("color", "#ff5c41");
            $("#old_password").focus();
        } else if (new_password.length < 6) {
            $("#new_password_result").text("请设置您的新密码,至少六位").css("color", "#ff5c41");
            $("#new_password").focus();
        } else if (isLegal != 1) {
            $("#new_password_result").text("密码安全性低，至少包含1个大写字母、小写字母和数字").css("color", "#ff5c41");
            $("#new_password").focus();
        } else if (new_password_checked == "") {
            $("#new_password_checked_result").text("请再次输入您的新密码").css("color", "#ff5c41");
            $("#new_password_checked").focus();
        } else if (new_password_checked !== new_password) {
            $("#new_password_checked_result").text("两次密码不一致").css("color", "#ff5c41");
            $("#new_password_checked").focus();
        } else {
            layer.confirm('确认修改？', {icon: 3, title: '提示信息'}, function () {
                $.ajax({
                    url: "../php/update_password.php",
                    type: "post",
                    data: {
                        user_type: "admin",
                        new_password: new_password
                    },
                    success: function (result) {
                        if (result == "ok") {
                            layer.msg('修改成功！', {icon: 1, time: 1500});
                        } else if (result == "exist") {
                            layer.msg('未作任何修改！', {icon: 0, time: 1500});
                        } else {
                            console.log(result);
                            layer.msg('修改失败，请重试！', {icon: 2, time: 1500});
                        }
                    },
                    dataType: "text"
                });
            });
        }
    });
    //菜单栏切换
    var pages = $(".page");
    $("#click_ul li").on("click", function () {
        var index = $(this).index();
        $(this).addClass("current_li").siblings('li').removeClass("current_li");
        $(pages[index]).siblings(".page").hide();
        $(pages[index]).show();
        $("#title").text($(this).text());
    });
    $(".menu_to").on("click", function () {
        var index = $(this).index();
        $("#click_ul li").eq(index).click();
    });
    //自制菜单栏
    $(".selected").bind("selectstart", function () {
        return false;
    });
    $(".select_inner").on("click", function (e) {
        e.stopPropagation();
        $(this).siblings(".select_dropdown").toggle();
        $(".select_dropdown ul li").click(function () {
            $(this).parent().parent().siblings(".select_inner").children(".selected").text($(this).text());
        });
        $(document).one("click", function () {
            $(".select_dropdown").hide();
        });
    });
})
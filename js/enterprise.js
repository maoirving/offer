$(function () {
    function updateInfo() {
        if (getCookie("recruiter_username")) {
            // 退出登录，清除cookie
            $("#recruiter_exit").on("click", function () {
                document.cookie = "recruiter_username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "recruiter_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "company_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "company_isPassed=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
                url: "../php/enterprise/get_recruiterInfo.php",
                data: {},
                success: function (result) {
                    var userInfo = result.user[0];
                    if (!userInfo.user_imgUrl) {
                        $(".li_img").hide();
                    } else {
                        $(".user_img").prop("src", userInfo.user_imgUrl);
                        $(".li_img").show();
                    }
                    if (userInfo.recruiter_name) {
                        $("#user_name").text(userInfo.recruiter_name);
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
                    url: "../php/enterprise/job_manage.php",
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
    //将新发布的职位存入数据库
    if (getCookie("company_id")) {
        $("#company_id").val(getCookie("company_id"));
    }
    $("#pub").click(function () {
        if (getCookie("company_id")) {
            if (getCookie("company_isPassed") == "1") {
                layer.confirm('确认发布新职位？', {icon: 3, title: '提示信息'}, function () {
                    var unit = $("#unit");
                    var salary = "";
                    if (unit.text().substr(0, 1) == "千") {
                        salary = $("#min_salary").val() + "-" + $("#max_salary").val() + "K";
                    } else {
                        salary = $("#min_salary").val() + "-" + $("#max_salary").val() + "元/天";
                    }
                    var work_place = $("#city").val() + "·" + $("#district").val() + "·" + $("#detail_address").val();
                    var job_description = $("#job_description").val();
                    job_description = "<p>" + job_description.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    var job_skill = $("#job_skill").val();
                    job_skill = "<p>" + job_skill.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    $.ajax({
                        url: "../php/enterprise/save_job.php",
                        type: "post",
                        data: {
                            job_name: $("#job_name").val(),
                            job_type: $("#job_type").text(),
                            wanted_num: $("#wanted_num").val(),
                            salary: salary,
                            work_place: work_place,
                            experience: $("#experience").text(),
                            education: $("#education").text(),
                            job_description: job_description,
                            job_skill: job_skill,
                            company_id: $("#company_id").val(),
                            pub_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('发布成功！', {icon: 1, time: 1500}, function () {
                                    window.location = "enterprise.html";
                                });
                            } else {
                                layer.msg('发布失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            } else if (getCookie("company_isPassed") == "-1") {
                layer.msg('公司信息审核未通过，不能发布职位！', {icon: 0, time: 2500});
            } else if (getCookie("company_isPassed") == "0") {
                layer.msg('公司信息暂未被审核，不能发布职位！', {icon: 0, time: 2500});
            }
        } else {
            layer.msg('请先完善公司信息！', {icon: 0, time: 2500});
        }
    });
    //创建简历模态框Vue
    var resume_app = new Vue({
        el: '#resume_app',
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
            }
        }
    });
    //创建邀请面试模态框vue
    var invited_popup = new Vue({
        el: "#invited_popup",
        data: {
            interview: {}
        },
        methods: {
            loadInfo: function (applied_id) {
                this.interview = "";
                var that = this;
                $.ajax({
                    url: "../php/enterprise/get_interview.php",
                    data: {
                        applied_id: applied_id
                    },
                    success: function (result) {
                        that.interview = result.interview[0];
                    },
                    dataType: "json"
                });
            },
        }
    })
    //创建申请列表Vue
    var applied_app = new Vue({
        el: '#applied_app',
        data: {
            applied: [],
            keyword: '',
            choose_one: '不限',
            choose: ['不限', '大专', '本科', '硕士', '博士'],
            judgeShow: 0
        },
        methods: {
            loadInfo: function () {
                var that = this;
                $.ajax({
                    url: "../php/enterprise/get_applied.php",
                    data: {
                        keyword: $.trim(that.keyword)
                    },
                    success: function (result) {
                        if (result != '0') {
                            $(".manage_applied .applied_notFound").hide();
                            $(".manage_applied .applied_table").show();
                            that.applied = result.applied;
                        } else {
                            $(".manage_applied .applied_notFound").show();
                            $(".manage_applied .applied_table").hide();
                        }
                    },
                    dataType: "json"
                });
            },
            searchApplied: function () {
                this.loadInfo();
            },
            changeChoose: function (index) {
                if (this.choose[index] == "不限") {
                    this.judgeShow = 0;
                } else if (this.choose[index] == "大专") {
                    this.judgeShow = 1;
                } else if (this.choose[index] == "本科") {
                    this.judgeShow = 2;
                } else if (this.choose[index] == "硕士") {
                    this.judgeShow = 3;
                } else if (this.choose[index] == "博士") {
                    this.judgeShow = 4;
                }
            },
            isShow: function (education) {
                if (this.judgeShow == 0) {
                    return true;
                } else if (this.judgeShow == 1) {
                    if (education == "大专") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 2) {
                    if (education == "本科") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 3) {
                    if (education == "硕士") {
                        return true;
                    } else {
                        return false;
                    }
                } else if (this.judgeShow == 4) {
                    if (education == "博士") {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            btnAll: function () {
                $("#checkAll1").click();
                this.checkAll();
            },
            checkAll: function () {
                $(".manage_applied .checkOne").prop("checked", $("#checkAll1").prop("checked"));
                if ($("#checkAll1").prop("checked") == true) {
                    $("#btnAll1").text("反选");
                } else {
                    $("#btnAll1").text("全选");
                }
            },
            checkApplied: function () {
                if ($(".manage_applied .checkOne:checked").length == $(".manage_applied .checkOne").length) {
                    $("#checkAll1").prop("checked", true);
                    $("#btnAll1").text("反选");
                } else {
                    $("#checkAll1").prop("checked", false);
                    $("#btnAll1").text("全选");
                }
            },
            deleteMany: function () {
                if ($(".manage_applied .checkOne:checked").length == 0) {
                    layer.msg('请先选择要标记的申请！', {icon: 0, time: 2000});
                } else {
                    var that = this;
                    var applied_id = [];
                    let checked_box = $(".manage_applied .checkOne:checked");
                    for (let i = 0; i < checked_box.length; i++) {
                        applied_id.push($(checked_box[i]).attr("applied_id"));
                    }
                    layer.confirm('确认批量标记不合适？', {icon: 3, title: '提示信息'}, function () {
                        $.ajax({
                            url: "../php/enterprise/setIsHandle.php",
                            type: "post",
                            data: {
                                applied_id: "(" + applied_id.join(',') + ")",
                                num: 'many'
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('批量标记不合适成功！', {icon: 1, time: 1500}, function () {
                                        that.loadInfo();
                                    });
                                } else if (result == "exist") {
                                    layer.msg('选中申请均已标记，请勿重复标记！', {icon: 0, time: 1500});
                                } else {
                                    layer.msg('批量标记失败，请重试！', {icon: 2, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    });
                }
            },
            handle: function (isHandle) {
                if (isHandle == 0) {
                    return true;
                } else {
                    return false;
                }
            },
            handleInvited: function (isHandle) {
                if (isHandle == 1) {
                    return true;
                } else {
                    return false;
                }
            },
            handleAppropriate: function (isHandle) {
                if (isHandle == 2) {
                    return true;
                } else {
                    return false;
                }
            },
            readResume: function (username, applied_id, resume_type, resume_fileUrl) {
                if (resume_type == 'online') {
                    resume_app.loadInfo(username);
                    var box_id = "#resume_popup";
                    popup(box_id);
                    $("#isRead")[0].onclick = function () {
                        $.ajax({
                            url: "../php/enterprise/updateIsRead.php",
                            type: "post",
                            data: {
                                applied_id: applied_id,
                                read_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                            },
                            success: function (result) {
                                if (result == "ok") {
                                    layer.msg('您已查看！', {icon: 1, time: 1500});
                                }
                            },
                            dataType: "text"
                        });
                    }
                } else if (resume_type == 'file') {
                    var left = (window.screen.availWidth - 10 - 800) / 2;
                    window.open(resume_fileUrl, '_blank', 'width=800,height=800, left=' + left);
                    $.ajax({
                        url: "../php/enterprise/updateIsRead.php",
                        type: "post",
                        data: {
                            applied_id: applied_id,
                            read_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('您已查看！', {icon: 1, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                }
            },
            invite: function (applied_id, username, job_id, job_name) {
                var that = this;
                var box_id = "#invited_popup";
                popup(box_id);
                invited_popup.loadInfo(applied_id);
                //确认按钮
                $(box_id).find(".ok_btn")[0].onclick = function () {
                    $.ajax({
                        url: "../php/enterprise/send_message.php",
                        type: "post",
                        data: {
                            applied_id: applied_id,
                            username: username,
                            job_id: job_id,
                            job_name: job_name,
                            interview_content: $("#interview_content").val(),
                            message_time: new Date().Format("yyyy-MM-dd HH:mm:ss"),
                            interview_date: $("#interview_date").val(),
                            interview_time: $("#interview_time").val(),
                            interview_address: $("#interview_address").val(),
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('已发送面试邀请！', {icon: 1, time: 1500}, function () {
                                    $(box_id).find(".closeBtn").click();
                                    that.loadInfo();
                                });
                            } else if (result == "change_ok") {
                                layer.msg('已修改面试邀请！', {icon: 1, time: 1500}, function () {
                                    $(box_id).find(".closeBtn").click();
                                    that.loadInfo();
                                });
                            } else if (result == "exist") {
                                layer.msg('未作任何修改！', {icon: 0, time: 1500}, function () {
                                });
                            } else {
                                layer.msg('发送失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                }
            },
            sorry: function (applied_id) {
                var that = this;
                layer.confirm('确认标记为不合适？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/enterprise/setIsHandle.php",
                        type: "post",
                        data: {
                            applied_id: applied_id,
                            num: 'one'
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('已标记为不合适！', {icon: 1, time: 1500}, function () {
                                    that.loadInfo();
                                });
                            } else if (result == "exist") {
                                layer.msg('已标记，请勿重复标记！', {icon: 0, time: 1500});
                            } else {
                                console.log(result)
                                layer.msg('标记失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            }
        },
        mounted: function () {
            this.loadInfo();
            popupLoad("#invited_popup");
            popupLoad("#resume_popup");
        }
    });
    // 创建公司信息Vue
    var company_app = new Vue({
        el: '#company_app',
        data: {
            message_show: true,
            change_show: false,
            company: {},
            capital: "",
        },
        methods: {
            showChange: function () {
                var that = this;
                $('html, body').animate({scrollTop: 0}, 500, function () {
                    that.message_show = false;
                    that.change_show = true;
                });
            },
            showMessage: function () {
                var that = this;
                $('html, body').animate({scrollTop: 0}, 500, function () {
                    that.message_show = true;
                    that.change_show = false;
                });
            },
            changeImg: function () {
                $("#up_companyImg").click();
                var up_img = document.querySelector('#up_companyImg');
                var img = document.querySelector('#company_img');
                if (up_img) {
                    up_img.addEventListener('change', function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
                        reader.addEventListener("load", function () {
                            img.src = reader.result;
                            $("#companyImg_before").hide();
                            $("#companyImg_after").show();
                        }, false);
                        // 调用reader.readAsDataURL()方法，把图片转成base64
                        reader.readAsDataURL(file);
                    }, false);
                }
            },
            saveImg: function () {
                var that = this;
                layer.confirm('确认更换？', {icon: 3, title: '提示信息'}, function () {
                    var formData = new FormData(document.querySelector("#companyImg_form"));
                    $.ajax({
                        url: "../php/enterprise/save_companyImg.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            console.log(result);
                            if (result == "ok") {
                                layer.msg('更换成功！', {icon: 1, time: 1500});
                                updateInfo();
                            } else {
                                layer.msg('更换失败，注意图片格式！', {icon: 2, time: 1500});
                            }
                            $("#companyImg_before").show();
                            $("#companyImg_after").hide();
                        }
                    });
                });
            },
            change_businessImg: function () {
                $("#up_businessImg").click();
                var up_img = document.querySelector('#up_businessImg');
                var img = document.querySelector('#business_img');
                if (up_img) {
                    up_img.addEventListener('change', function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
                        reader.addEventListener("load", function () {
                            img.src = reader.result;
                            $("#businessImg_before").hide();
                            $("#businessImg_after").show();
                        }, false);
                        // 调用reader.readAsDataURL()方法，把图片转成base64
                        reader.readAsDataURL(file);
                    }, false);
                }
            },
            save_businessImg: function () {
                var that = this;
                layer.confirm('确认上传营业执照？', {icon: 3, title: '提示信息'}, function () {
                    var formData = new FormData(document.querySelector("#businessImg_form"));
                    $.ajax({
                        url: "../php/enterprise/save_businessImg.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            console.log(result);
                            if (result == "ok") {
                                layer.msg('上传成功！', {icon: 1, time: 1500});
                                that.loadInfo();
                            } else {
                                layer.msg('上传失败，注意图片格式！', {icon: 2, time: 1500});
                            }
                            $("#businessImg_before").show();
                            $("#businessImg_after").hide();
                        }
                    });
                });
            },
            save: function () {
                var that = this;
                layer.confirm('确认修改？', {icon: 3, title: '提示信息'}, function () {
                    var introduction = $("#introduction").val();
                    introduction = "<p>" + introduction.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    $.ajax({
                        url: "../php/enterprise/change_company.php",
                        type: "post",
                        data: {
                            company_name: $("#company_name").val(),
                            company_type: $("#company_type").text(),
                            finance: $("#finance").text(),
                            headcount: $("#headcount").text(),
                            company_address: $("#company_address").val(),
                            introduction: introduction,
                            representative: $("#representative").val(),
                            registered_capital: $("#registered_capital").val() + $("#money_unit").text(),
                            registered_date: $("#registered_date").val(),
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('修改成功！', {icon: 1, time: 1500});
                                updateInfo();
                                that.showMessage();
                                that.loadInfo();
                            } else if (result == "exist") {
                                layer.msg('未作任何修改！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('修改失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });

            },
            loadInfo: function () {
                var that = this;
                $.ajax({
                    url: "../php/enterprise/company_data.php",
                    data: {},
                    success: function (result) {
                        that.company = result.company[0];
                        var capital = that.company.registered_capital;
                        var index = capital.lastIndexOf('万');
                        that.capital = capital.substring(0, index);
                        var introduction = result.company[0].introduction;
                        that.company.introduction_p = introduction;
                        introduction = introduction.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        that.company.introduction = introduction;
                    },
                    dataType: "json"
                });
            }
        },
        mounted: function () {
            this.loadInfo();
        }
    });
    // 创建查看面试详情vue
    var interview_popup = new Vue({
        el: "#interview_popup",
        data: {
            interview: {}
        },
        methods: {
            loadInfo: function (applied_id) {
                this.interview = "";
                var that = this;
                $.ajax({
                    url: "../php/enterprise/get_interview.php",
                    data: {
                        applied_id: applied_id
                    },
                    success: function (result) {
                        that.interview = result.interview[0];
                    },
                    dataType: "json"
                });
            },
        }
    })
    // 创建消息通知Vue
    var message_app = new Vue({
        el: '#message_app',
        data: {
            message: []
        },
        methods: {
            loadInfo: function (isAgreed) {
                this.message = "";
                var that = this;
                $.ajax({
                    url: "../php/enterprise/recruiter_message.php",
                    data: {
                        isAgreed: isAgreed
                    },
                    success: function (result) {
                        that.message = result.message;
                    },
                    dataType: "json"
                });
            },
            isShow: function (isAgreed) {
                if (isAgreed == '1') {
                    return true;
                } else {
                    return false;
                }
            },
            readDetail: function (applied_id) {
                var that = this;
                var box_id = "#interview_popup";
                popup(box_id);
                interview_popup.loadInfo(applied_id);
            },
            getIsAgreed: function () {
                var index = $("#message_app ul li[class=message_current]").index();
                var isAgreed = '';
                if (index == 0) {
                    isAgreed = 1;
                }
                if (index == 1) {
                    isAgreed = -1;
                }
                return isAgreed;
            },
            deleteMessage: function (message_id) {
                var that = this;
                var isAgreed = this.getIsAgreed();
                console.log(message_id);
                layer.confirm('确认删除？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/enterprise/delete_myMessage.php",
                        data: {
                            message_id: message_id
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('删除成功！', {icon: 1, time: 1500}, function () {
                                    that.loadInfo(isAgreed);
                                });
                            } else {
                                layer.msg('删除失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            }
        },
        mounted: function () {
            this.loadInfo(1);
            popupLoad("#interview_popup");
            $(".message_hd ul li").on('click', function () {
                $(this).addClass("message_current").siblings("li").removeClass("message_current");
            });
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
                        url: "../php/enterprise/save_recruiterImg.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('更换成功！', {icon: 1, time: 1500});
                                updateInfo();
                            } else {
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
                        url: "../php/enterprise/change_recruiter.php",
                        type: "post",
                        data: {
                            recruiter_name: $("#recruiter_name").val(),
                            recruiter_type: $("#recruiter_type").val(),
                            recruiter_sex: $(".current_sex").text(),
                            recruiter_birthday: $("#recruiter_birthday").val(),
                            recruiter_phone: $("#recruiter_phone").val(),
                            recruiter_email: $("#recruiter_email").val()
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
                    url: "../php/enterprise/recruiter_data.php",
                    data: {},
                    success: function (result) {
                        that.user = result.recruiter[0];
                        var sex = result.recruiter[0].recruiter_sex;
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
                    user_type: "recruiter",
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
                        user_type: "recruiter",
                        new_password: new_password
                    },
                    success: function (result) {
                        if (result == "ok") {
                            layer.msg('修改成功！', {icon: 1, time: 1500});
                        } else if (result == "exist") {
                            layer.msg('未作任何修改！', {icon: 0, time: 1500});
                        } else {
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
        $("#click_ul li").eq(index - 1).click();
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
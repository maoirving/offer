$(function () {

    //引用弹出框效果
    layui.use(['laydate', 'element', 'laypage', 'layer'], function () {
        $ = layui.jquery;//jquery
    });
    //默认最后一个选项卡
    // $(".option_body ul li:eq(2)").click();
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
                        url: "../php/save_img.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            if (result == "ok") {
                                // alert("更换成功");
                                layer.msg('更换成功！', {icon: 1, time: 1500});
                                updateUser();
                                resume_app.loadInfo();
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
                        url: "../php/change_worker.php",
                        type: "post",
                        data: {
                            worker_name: $("#worker_name").val(),
                            worker_sex: $(".current_sex").text(),
                            worker_birthday: $("#worker_birthday").val(),
                            worker_phone: $("#worker_phone").val(),
                            worker_email: $("#worker_email").val(),
                            worker_address: $("#worker_address").val(),
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('修改成功！', {icon: 1, time: 1500});
                                that.show();
                                that.loadInfo();
                                resume_app.loadInfo();
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
                $(".sex span").bind("selectstart", function () {
                    return false;
                });
                $(".sex span").on("click", function () {
                    $(this).addClass("current_sex").siblings("span").removeClass("current_sex");
                });
                var that = this;
                $.ajax({
                    url: "../php/worker_data.php",
                    data: {},
                    success: function (result) {
                        that.user = result.worker[0];
                        var sex = result.worker[0].worker_sex;
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
                    user_type: "worker",
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
                        user_type: "worker",
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

    // 创建已申请职位Vue
    var applied_app = new Vue({
        el: '#applied_app',
        data: {
            applied_job: [],
            isHandle: ""
        },
        methods: {
            skip: function (isRead, id) {
                if (isRead != -1) {
                    window.location = "detail.html?job_id=" + id;
                } else {
                    layer.msg('无法查看，因为该职位已关闭！', {icon: 0, time: 1500});
                }
            },
            cancelApplied: function (id) {
                var that = this;
                layer.confirm('确认撤销申请？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/delete_applied.php",
                        data: {
                            applied_id: id
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('撤销成功！', {icon: 1, time: 1500}, function () {
                                    that.loadInfo(that.isHandle);
                                });
                                $.ajax({
                                    url: "../php/applied_complete.php",
                                    data: {},
                                    success: function (result) {
                                        that.applied_job = result.applied_job;
                                    },
                                    dataType: "json"
                                });
                            } else {
                                layer.msg('撤销失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            loadInfo: function (isHandle) {
                this.isHandle = isHandle;
                this.applied_job = "";
                this.allShow = true;
                var that = this;
                $.ajax({
                    url: "../php/applied_complete.php",
                    data: {
                        isHandle: isHandle
                    },
                    success: function (result) {
                        that.applied_job = result.applied_job;
                    },
                    dataType: "json"
                });
            }
        },
        mounted: function () {
            $("#apply_job ul li").on('click', function () {
                $(this).addClass("apply_current").siblings("li").removeClass("apply_current");
            });
            this.loadInfo('');
        }
    });
    // 创建我的简历Vue
    var resume_app = new Vue({
        el: '#resume_app',
        data: {
            resume: {},
            age: "",
            work_type: "",
            certificate: [''],
            education_number: 1,
            min_money: "",
            max_money: "",
            begin_year: "",
            end_year: "",
            project_begin: "",
            project_end: "",
            work_begin: "",
            work_end: "",
            edit_school_experience: "",
            edit_project_description: "",
            edit_work_content: "",
            item_number: 1,
            work_number: 1,
            certificate_number: 1
        },
        methods: {
            edit: function () {
                $("#edit").hide();
                $("#resume_show").hide();
                $("#resume_edit").show();
            },
            readFile: function (resume_fileUrl) {
                var left = (window.screen.availWidth - 10 - 800) / 2;
                window.open(resume_fileUrl, '_blank', 'width=800,height=800, left=' + left);
            },
            uploadResume: function () {
                var that = this;
                if (getCookie("username")) {
                    popupLoad("#upResume_popup");
                    var box_id = "#upResume_popup";
                    popup(box_id);
                    $("#upResume_popup .ok_btn")[0].onclick = function () {
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
                                            that.loadInfo();
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
            },
            cancel: function () {
                $("#edit").show();
                $("#resume_show").show();
                $("#resume_edit").hide();
            },
            finish: function () {
                var that = this;
                layer.confirm('确认修改？', {icon: 3, title: '提示信息'}, function () {
                    var desirable_salary = $("#min_money").val() + '-' + $("#max_money").val() + 'k';
                    var school_period = $("#begin_year").val() + ' - ' + $("#end_year").val();
                    var project_period = $("#project_begin").val() + ' ~ ' + $("#project_end").val();
                    var work_period = $("#work_begin").val() + ' ~ ' + $("#work_end").val();
                    var school_experience = $("#school_experience").val();
                    school_experience = "<p>" + school_experience.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    var project_description = $("#project_declare").val();
                    project_description = "<p>" + project_description.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    var work_content = $("#work_declare").val();
                    work_content = "<p>" + work_content.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") + "</p>";
                    var certificate = [];
                    var items = document.querySelectorAll(".certificate_item");
                    for (let i = 0; i < items.length; i++) {
                        certificate.push(items[i].value);
                    }
                    certificate = certificate.join(';');
                    $.ajax({
                        url: "../php/change_resume.php",
                        type: "post",
                        data: {
                            desirable_job: $("#desirable_job").val(),
                            desirable_city: $("#desirable_city").val(),
                            desirable_salary: desirable_salary,
                            school: $("#my_school").val(),
                            school_period: school_period,
                            specialized_subject: $("#specialized_subject").val(),
                            education: $("#my_education").text(),
                            school_experience: school_experience,
                            project_name: $("#project_name").val(),
                            project_period: project_period,
                            project_description: project_description,
                            work_type: $("#work_type").text(),
                            work_period: work_period,
                            work_company: $("#work_company").val(),
                            work_content: work_content,
                            certificate: certificate
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('修改成功！', {icon: 1, time: 1500});
                                $("#edit").show();
                                $("#resume_show").show();
                                $("#resume_edit").hide();
                                that.loadInfo();
                            } else if (result == "exist") {
                                layer.msg('未作任何修改！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('修改失败，请重试！', {icon: 2, time: 1500});
                            }
                        }
                    });
                });
            },
            change_schoolImg: function () {
                $("#up_schoolImg").click();
                var up_img = document.querySelector('#up_schoolImg');
                var img = document.querySelector('#school_img');
                if (up_img) {
                    up_img.addEventListener('change', function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
                        reader.addEventListener("load", function () {
                            img.src = reader.result;
                            $("#schoolImg_before").hide();
                            $("#schoolImg_after").show();
                        }, false);
                        // 调用reader.readAsDataURL()方法，把图片转成base64
                        reader.readAsDataURL(file);
                    }, false);
                }
            },
            save_schoolImg: function () {
                var that = this;
                layer.confirm('确认上传录取通知书？', {icon: 3, title: '提示信息'}, function () {
                    var formData = new FormData(document.querySelector("#education_form"));
                    $.ajax({
                        url: "../php/save_schoolImg.php",
                        type: "post",
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            console.log(result);
                            if (result == "ok") {
                                layer.msg('上传成功！', {icon: 1, time: 1500});
                            } else {
                                layer.msg('上传失败，注意图片格式！', {icon: 2, time: 1500});
                            }
                            $("#schoolImg_before").show();
                            $("#schoolImg_after").hide();
                        }
                    });
                });
            },
            addEducation: function () {
                this.education_number = parseInt($("#education_form ul:last-of-type .number_li h4").text()) + 1;
                var ul = "<ul>\n" +
                    "                            <li class=\"number_li\">\n" +
                    "                                <h4>" + this.education_number + "</h4>\n" +
                    "                                <label for=\"\">毕业学校：</label><input type=\"text\" placeholder=\"请输入毕业学校\" id=\"school\"></li>\n" +
                    "                            <li class=\"clearfix\">\n" +
                    "                                <label for=\"\">我的学历：</label>\n" +
                    "                                <div class=\"select_wrap\">\n" +
                    "                                    <div class=\"select_inner\">\n" +
                    "                                        <span class=\"selected\" id=\"my_education\">本科</span>\n" +
                    "                                        <span class=\"icomoon\"></span>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"select_dropdown\">\n" +
                    "                                        <ul>\n" +
                    "                                            <li>初中及以下</li>\n" +
                    "                                            <li>中专/中技</li>\n" +
                    "                                            <li>高中</li>\n" +
                    "                                            <li>大专</li>\n" +
                    "                                            <li>本科</li>\n" +
                    "                                            <li>硕士</li>\n" +
                    "                                            <li>博士</li>\n" +
                    "                                        </ul>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                            </li>\n" +
                    "                            <li>\n" +
                    "                                <label for=\"\">我的专业：</label><input type=\"text\" placeholder=\"请输入专业\" id=\"specialized_subject\">\n" +
                    "                            </li>\n" +
                    "                            <li class=\"small\">\n" +
                    "                                <label for=\"\">时间段：</label>\n" +
                    "                                <input type=\"number\" placeholder=\"起始年份\" id=\"begin_year\">\n" +
                    "                                <span>---</span>\n" +
                    "                                <input type=\"number\" placeholder=\"毕业年份\" id=\"end_year\">\n" +
                    "                                <span>&nbsp;年</span>\n" +
                    "                            </li>\n" +
                    "                            <li>\n" +
                    "                                <label for=\"\">在校经历：</label>\n" +
                    "                                <textarea name=\"\" id=\"school_experience\" placeholder=\"请编写在校经历...\"></textarea>\n" +
                    "                            </li>\n" +
                    "                        </ul>";
                $("#education_form").append(ul);
                $("#education_form>ul").slideDown(700);
            },
            addItem: function () {
                this.item_number = parseInt($("#item_form ul:last-of-type .number_li h4").text()) + 1;
                var ul = "<ul>\n" +
                    "                            <li class=\"number_li\">\n" +
                    "                                <h4>" + this.item_number + "</h4>\n" +
                    "                                <label for=\"\">项目名称：</label>\n" +
                    "                                <input type=\"text\" placeholder=\"请输入项目名称\" id=\"project_name\">\n" +
                    "                            </li>\n" +
                    "                            <li class=\"big\">\n" +
                    "                                <label for=\"\">项目时间：</label>\n" +
                    "                                <input type=\"date\" placeholder=\"开始时间\" id=\"project_begin\">\n" +
                    "                                <span>---</span>\n" +
                    "                                <input type=\"date\" placeholder=\"结束时间\" id=\"project_end\">\n" +
                    "                            </li>\n" +
                    "                            <li>\n" +
                    "                                <label for=\"\">项目描述：</label>\n" +
                    "                                <textarea name=\"\" id=\"project_declare\" placeholder=\"请编写项目描述，在项目中担任什么角色，项目技术等...\"></textarea>\n" +
                    "                            </li>\n" +
                    "                        </ul>"
                $("#item_form").append(ul);
                $("#item_form>ul").slideDown(700);

            },
            addWork: function () {
                this.work_number = parseInt($("#work_form ul:last-of-type .number_li h4").text()) + 1;
                var ul = "<ul>\n" +
                    "                            <li class=\"clearfix number_li\">\n" +
                    "                                <h4>" + this.work_number + "</h4>\n" +
                    "                                <label for=\"\">经历类型：</label>\n" +
                    "                                <div class=\"select_wrap\">\n" +
                    "                                    <div class=\"select_inner\">\n" +
                    "                                        <span class=\"selected\" id=\"work_type\">实习经历</span>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"select_dropdown\">\n" +
                    "                                        <ul>\n" +
                    "                                            <li>实习经历</li>\n" +
                    "                                            <li>工作经历</li>\n" +
                    "                                        </ul>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                            </li>\n" +
                    "                            <li>\n" +
                    "                                <label for=\"\">公司名称：</label>\n" +
                    "                                <input type=\"text\" placeholder=\"请输入公司名称\" id=\"work_company\">\n" +
                    "                            </li>\n" +
                    "                            <li class=\"big\">\n" +
                    "                                <label for=\"\">在职时间：</label>\n" +
                    "                                <input type=\"date\" placeholder=\"入职时间\" id=\"work_begin\">\n" +
                    "                                <span>---</span>\n" +
                    "                                <input type=\"date\" placeholder=\"结束时间\" id=\"work_end\">\n" +
                    "                            </li>\n" +
                    "                            <li>\n" +
                    "                                <label for=\"\">工作内容：</label>\n" +
                    "                                <textarea name=\"\" id=\"work_declare\"\n" +
                    "                                          placeholder=\"请编写项目描述，在项目中担任什么角色，项目技术等...\"></textarea>\n" +
                    "                            </li>\n" +
                    "                        </ul>"
                $("#work_form").append(ul);
                $("#work_form>ul").slideDown(700);

            },
            addCertificate: function () {
                this.certificate_number = parseInt($("#certificate_form ul li:nth-last-child(3) h4").text()) + 1;
                var li = "<li class=\"number_li\">\n" +
                    "                                <h4>" + this.certificate_number + "</h4>\n" +
                    "                                <label for=\"\">资格证书：</label>\n" +
                    "                                <input type=\"text\" placeholder=\"请输入资格证书\" class=\"certificate_item\">" +
                    "</li>";
                $("#certificate_form ul li:nth-last-child(3)").after(li);
                $("#certificate_form ul li").eq(this.certificate_number - 1).hide();
                $("#certificate_form ul li").slideDown(500);
            },
            loadInfo: function () {
                var that = this;
                $.ajax({
                    url: "../php/common/resume_data.php",
                    data: {
                        username: ""
                    },
                    success: function (result) {
                        that.resume = result.resume[0];
                        var birthday = result.resume[0].worker_birthday;
                        if (birthday) {
                            var year = new Date().getFullYear();
                            that.age = year - birthday.substr(0, 4);
                        }
                        if (result.resume[0].work_type) {
                            that.work_type = result.resume[0].work_type.substr(0, 2);
                        }
                        if (result.resume[0].certificate) {
                            that.certificate = result.resume[0].certificate.split(';');
                        }
                        if (result.resume[0].desirable_salary) {
                            var desirable_salary = result.resume[0].desirable_salary;
                            var length = desirable_salary.length;
                            var index = desirable_salary.indexOf('-');
                            that.min_money = desirable_salary.substring(0, index);
                            that.max_money = desirable_salary.substring(index + 1, length - 1);
                        }
                        if (result.resume[0].school_period) {
                            var school_period = result.resume[0].school_period;
                            var index2 = school_period.indexOf('-');
                            that.begin_year = school_period.substring(0, index2 - 1);
                            that.end_year = school_period.substring(index2 + 2, school_period.length);
                        }
                        if (result.resume[0].school_experience) {
                            var edit_school_experience = result.resume[0].school_experience;
                            that.edit_school_experience = edit_school_experience.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        }
                        if (result.resume[0].project_period) {
                            var project_period = result.resume[0].project_period;
                            var index3 = project_period.indexOf('~');
                            that.project_begin = project_period.substring(0, index3 - 1);
                            that.project_end = project_period.substring(index3 + 2, project_period.length);
                        }
                        if (result.resume[0].project_description) {
                            var edit_project_description = result.resume[0].project_description;
                            that.edit_project_description = edit_project_description.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        }
                        if (result.resume[0].work_period) {
                            var work_period = result.resume[0].work_period;
                            var index4 = work_period.indexOf('~');
                            that.work_begin = work_period.substring(0, index4 - 1);
                            that.work_end = work_period.substring(index4 + 2, work_period.length);
                        }
                        if (result.resume[0].project_description) {
                            var edit_work_content = result.resume[0].project_description;
                            that.edit_work_content = edit_work_content.replace(/<p>/g, "").replace(/<br\/>/g, "\n").replace(/<\/p>/g, "").replace(/&nbsp;/g, " ");
                        }
                    },
                    dataType: "json"
                });
            },
        },
        mounted: function () {
            this.loadInfo();
        }
    });
    //继续添加和删除该条逻辑
    $(".add_more").on('click', function () {
        if ($(this).parent().siblings("ul").length >= 1) {
            $(this).parent().parent().next().fadeIn();
        }
    });
    $(".sub").on("click", function () {
        if ($(this).parent().prev().children("ul").length == 2) {
            $(this).parent().fadeOut();
        }
        $(this).parent().prev().children("ul:last-child").slideUp(700, function () {
            $(this).remove();
        });
    });
    $(".add_more_li").on('click', function () {
        if ($(this).parent().siblings("ul").children("li").length >= 3) {
            $(this).parent().siblings("ul").find("div").fadeIn();
        }
    });
    $(".sub_li").on("click", function () {
        if ($(this).parent().parent().siblings("li").length == 3) {
            $(this).parent().fadeOut();
        }
        $(this).parent().parent().siblings("li:nth-last-child(3)").slideUp(500, function () {
            $(this).remove();
        });
    });
    //创建阅读消息详情Vue 
    var message_popup = new Vue({
        el: "#message_popup",
        data: {
            interview: {},
            interview_id: '',
            message_id: '',
            recruiter_id: '',
            job_name: '',
            username: '',
            applied_id: '',
            isAgreed: ''
        },
        methods: {
            loadInfo: function (item, isAgreed) {
                this.interview_id = item.interview_id;
                this.message_id = item.message_id;
                this.recruiter_id = item.recruiter_id;
                this.username = item.username;
                this.job_name = item.job_name;
                this.applied_id = item.applied_id;
                this.isAgreed = isAgreed;
                var that = this;
                $.ajax({
                    url: "../php/interview_data.php",
                    data: {
                        interview_id: item.interview_id
                    },
                    success: function (result) {
                        that.interview = result.interview[0];
                    },
                    dataType: "json"
                });
            },
            refuse: function () {
                var that = this;
                layer.confirm('确认拒绝邀请？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/isAgreed.php",
                        type: "post",
                        data: {
                            message_id: that.message_id,
                            isAgreed: -1,
                            recruiter_id: that.recruiter_id,
                            username: that.username,
                            job_name: that.job_name,
                            applied_id: that.applied_id,
                            interview_id: that.interview_id,
                            message_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('已拒绝邀请！', {icon: 1, time: 1500}, function () {
                                    $("#message_popup .closeBtn").click();
                                    message_app.loadInfo(that.isAgreed);
                                });
                            } else if (result == "exist") {
                                layer.msg('已拒绝，请勿重复操作！', {icon: 0, time: 1500});
                            } else {
                                layer.msg('拒绝失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            agree: function () {
                var that = this;
                layer.confirm('确认同意面试？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/isAgreed.php",
                        type: "post",
                        data: {
                            message_id: that.message_id,
                            isAgreed: 1,
                            recruiter_id: that.recruiter_id,
                            username: that.username,
                            job_name: that.job_name,
                            applied_id: that.applied_id,
                            interview_id: that.interview_id,
                            message_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('已同意面试！', {icon: 1, time: 1500}, function () {
                                    $("#message_popup .closeBtn").click();
                                    message_app.loadInfo(that.isAgreed);
                                });
                            } else if (result == "exist") {
                                layer.msg('已同意，请勿重复操作！', {icon: 0, time: 1500});
                            } else {
                                console.log(result);
                                layer.msg('同意面试失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            }
        }
    });
    //创建消息通知Vue
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
                    url: "../php/message_data.php",
                    data: {
                        isAgreed: isAgreed
                    },
                    success: function (result) {
                        that.message = result.message;
                    },
                    dataType: "json"
                });
            },
            handle: function (isAgreed) {
                if (isAgreed == '0') {
                    return true;
                } else {
                    return false;
                }
            },
            handleYes: function (isAgreed) {
                if (isAgreed == '1') {
                    return true;
                } else {
                    return false;
                }
            },
            handleNo: function (isAgreed) {
                if (isAgreed == '-1') {
                    return true;
                } else {
                    return false;
                }
            },
            getIsAgreed: function () {
                var index = $("#message_app ul li[class=message_current]").index();
                var isAgreed = '';
                if (index == 0) {
                    isAgreed = '';
                }
                if (index == 1) {
                    isAgreed = 1;
                }
                if (index == 2) {
                    isAgreed = -1;
                }
                return isAgreed;
            },
            readDetail: function (item) {
                var box_id = "#message_popup";
                popup(box_id);
                var isAgreed = this.getIsAgreed();
                message_popup.loadInfo(item, isAgreed);
            },
            deleteMessage: function (message_id) {
                var that = this;
                var isAgreed = this.getIsAgreed();
                layer.confirm('确认删除？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/delete_message.php",
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
            this.loadInfo('');
            popupLoad("#message_popup");
            $(".message_hd ul li").on('click', function () {
                $(this).addClass("message_current").siblings("li").removeClass("message_current");
            });
        }
    });
    // 创建我的收藏Vue
    var love_app = new Vue({
        el: '#love_app',
        data: {
            love_job: [],
        },
        methods: {
            skip: function (isDeleted, id) {
                if (isDeleted != -1) {
                    window.location = "detail.html?job_id=" + id;
                } else {
                    layer.msg('无法查看，因为该职位已关闭！', {icon: 0, time: 1500});
                }
            },
            cancelLove: function (id) {
                var that = this;
                layer.confirm('确认取消收藏？', {icon: 3, title: '提示信息'}, function () {
                    $.ajax({
                        url: "../php/delete_love.php",
                        data: {
                            love_id: id
                        },
                        success: function (result) {
                            if (result == "ok") {
                                layer.msg('取消收藏成功！', {icon: 1, time: 1500});
                                that.loadInfo();
                            } else {
                                layer.msg('取消收藏失败，请重试！', {icon: 2, time: 1500});
                            }
                        },
                        dataType: "text"
                    });
                });
            },
            loadInfo: function () {
                this.love_job = "";
                var that = this;
                $.ajax({
                    url: "../php/love_job.php",
                    data: {},
                    success: function (result) {
                        that.love_job = result.love_job;
                    },
                    dataType: "json"
                });
            }
        },
        mounted: function () {
            this.loadInfo();
        }
    });
    var lis = $(".option_body ul li");
    var contents = $(".content");
    $(lis).on('click', function () {
        var index = $(this).index();
        $(this).siblings('li').removeClass("current");
        $(this).addClass("current");
        $(contents[index]).siblings(".content").hide();
        $(contents[index]).show();
    });
    //默认选项卡
    var menu = getQueryVariable("menu");
    if (menu == "my_applied") {
        $(".option_body ul li:eq(2)").click();
    }
    if (menu == "my_resume") {
        $(".option_body ul li:eq(3)").click();
    }
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

});

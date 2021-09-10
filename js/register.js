$(function () {
    //引入弹框
    layui.use(['laydate', 'element', 'laypage', 'layer'], function () {
        $ = layui.jquery;//jquery
    });
    //文本框获得焦点变色
    var inps = $(".inp");
    $(inps).on('focus', function () {
        $(this).parents("li").css("border", "1px solid #0aa7a7");
        $(this).parents("li").css("box-shadow", "2px 2px 10px rgb(10, 167, 167,0.1)");
    });
    $(inps).on('blur', function () {
        $(this).parents("li").css("border", "1px solid #ccc");
        $(this).parents("li").css("box-shadow", "none");
    });
    $(".choose span").on('click', function () {
        $(this).addClass("current").siblings().removeClass("current");
    });
    //显示隐藏密码
    var eyes = $(".eyes");
    var flag = 1;
    var password = $("#password");
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
    // 用户名唯一性与合法性校验 ajax
    $("#username").on("blur", function () {
        var usernameValue = $("#username").val().trim();
        if (usernameValue !== "") {
            var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
            if (!uPattern.test(usernameValue)) {
                $("#username_result").text("用户名不合法，至少四位，由字母、数字或下划线组成").css("color", "#ff5c41");
                isTrue = 0;
            } else {
                $.ajax({
                    url: "../php/checkUsername.php",
                    data: {
                        username: usernameValue
                    },
                    dataType: "text",
                    success: function (result) {
                        if (result == "ok") {
                            $("#username_result").text("用户名可用").css("color", "#0aa7a7");
                            isTrue = 1;
                        } else {
                            $("#username_result").text("用户名已存在").css("color", "#ff5c41");
                            isTrue = 0;
                        }
                    }
                });
            }
        } else {
            $("#username_result").text("");
        }
    });
    // 密码合法性校验
    $("#password").on("blur", function () {
        var password = $("#password").val();
        if (isTrue) {
            if (password.length < 6) {
                $("#password_result").text("请设置您的登录密码，至少六位").css("color", "#ff5c41");
                isLegal = 0;
            } else {
                //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字
                var pPattern = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
                //判断密码是否合法
                if (pPattern.test(password)) {
                    $("#password_result").text("密码安全性高").css("color", "#0aa7a7");
                    isLegal = 1;
                } else {
                    $("#password_result").text("密码安全性低，至少包含1个大写字母、小写字母和数字").css("color", "#ff5c41");
                    isLegal = 0;
                }
            }
        } else {
            $("#password_result").text("");
        }
    });
    // 确认密码
    $("#password_checked").on("blur", function () {
        var password_checked = $("#password_checked").val();
        if (isTrue && isLegal) {
            if (password_checked !== $("#password").val()) {
                $("#password_checked_result").text("两次密码输入不一致").css("color", "#ff5c41");
            } else {
                $("#password_checked_result").text("两次密码输入一致").css("color", "#0aa7a7");
            }
        } else {
            $("#password_checked_result").text("");
        }
    });

    $(".btn").on("click", function () {
        // 身份选择
        var identity = "worker";
        if ($("#recruiter").hasClass("current")) {
            identity = "recruiter";
        }
        var checked = $("#checkbox").prop("checked");
        var username = $("#username").val().trim();
        var password = $("#password").val();
        var password_checked = $("#password_checked").val();
        if (username == "") {
            $("#username_result").text("请设置您的用户名").css("color", "#ff5c41");
            $("#username").focus();
        } else if (isTrue != 1) {
            $("#username_result").text("用户名不合法，至少四位，由字母、数字或下划线组成").css("color", "#ff5c41");
            $("#username").focus();
        } else if (password.length < 6) {
            $("#password_result").text("请设置您的登录密码，至少六位").css("color", "#ff5c41");
            $("#password").focus();
        } else if (isLegal != 1) {
            $("#password_result").text("密码安全性低，至少包含1个大写字母、小写字母和数字").css("color", "#ff5c41");
            $("#password").focus();
        } else if (password_checked == "") {
            $("#password_checked_result").text("请再次输入密码").css("color", "#ff5c41");
            $("#password_checked").focus();
        } else if (password !== password_checked) {
            $("#password_checked_result").text("两次密码输入不一致").css("color", "#ff5c41");
            $("#password_checked").focus();
        } else if (!checked) {
            layer.msg('请先勾选 我已阅读并同意用户协议及隐私政策', {icon: 0, time: 1500});
        } else {
            $.ajax({
                url: "../php/register.php",
                type: "post",
                data: {
                    username: username,
                    identity: identity,
                    password: password,
                    register_time: new Date().Format("yyyy-MM-dd HH:mm:ss")
                },
                dataType: "text",
                success: function (result) {
                    if (result == "ok") {
                        layer.msg('注册成功，请登录！', {icon: 1, time: 1500}, function () {
                            if (identity == "recruiter") {
                                document.forms[0].action = "enterprise_sign.html?username=" + username;
                            } else {
                                document.forms[0].action += "?username=" + username;
                            }
                            document.forms[0].submit();
                        });

                    } else {
                        layer.msg('注册失败！', {icon: 2, time: 1500});
                    }
                }
            })
        }
    })
});
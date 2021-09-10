$(function () {
    var inps = $(".inp");
    $(inps).on('focus', function () {
        $(this).parents("li").css("border", "1px solid #0aa7a7");
        $(this).parents("li").css("box-shadow", "2px 2px 10px rgb(10, 167, 167,0.1)");
    });
    $(inps).on('blur', function () {
        $(this).parents("li").css("border", "1px solid #ccc");
        $(this).parents("li").css("box-shadow", "none");
    });
    var change_ma = $(".change_ma");
    var ma_img = $(".ma_img");

    // 验证码模块
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var num = getRandom(1, 14);
    $(ma_img).attr("src", "upload/ma" + num + ".jpg");
    var ma_num = ['N93N', '4HY9', 'PPST', 'YCDN', 'IDF4', 'BPQ8', 'MFW7', '6D8H', 'IGKX', '6T7B', '3T5S', '7MET', 'JSDG', 'DS9A', 'PMAJ'];
    $(change_ma).on('click', function () {
        if (num == 15) {
            num = 0;
        }
        $(ma_img).attr("src", "upload/ma" + ++num + ".jpg");

    });
    //注册成功后跳转自动填充账号
    if (getQueryVariable("username")) {
        $("#username").val(getQueryVariable("username"));
    }
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
    //回车键事件，增强用户体验
    $("#username").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#password").focus();
        }
    });
    $("#password").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#identifying").focus();
        }
    });
    $('#identifying').keydown(function (e) {
        if (e.keyCode == 13) {
            $(".btn").click();
        }
    });
    //点击登录按钮验证，ajax
    $(".btn").on("click", function () {
        var username = $("#username").val().trim();
        var password = $("#password").val();
        if (username == "" && password == "") {
            $(".username_result").text("用户名不能为空，请输入您的账号");
            $(".password_result").text("密码不能为空，请输入您的密码");
            $("#username").focus();
            handleTips();
        } else if (username == "") {
            $(".username_result").text("用户名不能为空，请输入您的账号");
            $("#username").focus();
            handleTips();
        } else if (password == "") {
            $(".password_result").text("密码不能为空，请输入您的密码");
            $("#password").focus();
            handleTips();
        } else {
            var identifying = $("#identifying").val().trim();
            if (identifying.length < 4) {
                $(".identifying_result").text("请输入四位验证码");
                handleMa();
            } else if (identifying == ma_num[num]) {
                $.ajax({
                    url: "../php/sign.php",
                    type: "post",
                    data: {
                        username: username,
                        password: password,
                        user_type: "worker"
                    },
                    dataType: "text",
                    success: function (result) {
                        console.log(result)
                        if (result == "ok") {
                            document.forms[0].submit();
                            // var form = document.querySelector("#form");
                            // form.submit();
                        } else {
                            $(".password_result").text("用户名或密码错误");
                            $("#password").focus();
                            handleTips();
                        }
                    }
                })
            } else {
                $(".identifying_result").text("验证码错误");
                handleMa();
            }
        }
    });

    // 账号密码有误时提示语处理函数
    function handleTips() {
        $("#username").on("input", function () {
            if ($("#username").val().trim().length > 0) {
                $(".username_result").text("");
            } else {
                $(".username_result").text("用户名不能为空，请输入您的账号");
            }
        });
        $("#password").on("input", function () {
            if ($("#password").val().length > 0) {
                $(".password_result").text("");
            } else {
                $(".password_result").text("密码不能为空，请输入您的密码");
            }
        })
    }

    // 验证码处理函数
    function handleMa() {
        $("#identifying").focus();
        $("#identifying").on("input", function () {
            var identifying = $("#identifying").val().trim();
            if (identifying.length < 4) {
                $(".identifying_result").text("请输入四位验证码");
            } else {
                $(".identifying_result").text("");
            }
        })
    }
});
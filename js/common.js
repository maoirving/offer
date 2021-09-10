function updateUser() {
    if (getCookie("username")) {
        $(".signed").parent().show();
        $(".unsigned").parent().hide();
        // 退出登录，清除cookie
        $("#exit").on("click", function () {
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "resume_isPassed=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        });
        //用户头像获取
        $.ajax({
            url: "../php/get_userImg.php",
            data: {},
            success: function (result) {
                if (result == "null") {
                    $(".img_li").hide();
                } else {
                    $("#user_img").prop("src", result);
                    $(".img_li").show();
                }
            },
            dataType: "text"
        });
    } else {
        $(".signed").parent().hide();
        $(".unsigned").parent().show();
    }
}

$(function () {
    updateUser();
    $("#uploadResume_a").on("click", function () {
        alert("这里还没写");
    })
    // $(".signed").parent().show();//暂时
});

//获取cookie值函数
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// 日期时间格式过滤
Vue.filter('format', function (value, arg) {
    function dateFormat(date, format) {
        if (typeof date === "string") {
            var mts = date.match(/(\/Date\((\d+)\)\/)/);
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2]);
            }
        }
        date = new Date(date);
        if (!date || date.toUTCString() == "Invalid Date") {
            return "";
        }
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }

    return dateFormat(value, arg);
});
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
//过滤日期 -月-日
Vue.filter('formatCN', function (value, arg) {
    var CN_date = new Date(value);
    var month = CN_date.getMonth() + 1;
    var day = CN_date.getDate();
    if (arg == "MD") {
        return month + '月' + day + '日';
    }
    if (arg == "YMD") {
        var year = CN_date.getFullYear();
        return year + '年' + month + '月' + day + '日';
    }
    if (arg == "MDhm") {
        var hour = CN_date.getHours();
        hour = hour < 10 ? '0' + hour : hour;
        var minutes = CN_date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return month + '月' + day + '日 ' + hour + ":" + minutes;
    }
});
//过滤工作地址 xx市·xx区
Vue.filter('city', function (value) {
    var city = value.toString();
    var index1 = 0;
    var index2;
    for (var i = 0; i < city.length; i++) {
        if (city.charAt(i) == "·") {
            index1 = i;
            break;
        }
    }
    if (index1 != 0) {
        for (var j = index1 + 1; j < city.length; j++) {
            if (city.charAt(j) == "·") {
                index2 = j;
                break;
            }
        }
    }
    city = city.substr(0, index2);
    return city;
});
//获取url地址中的参数
var getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // if (pair[0] == variable) {
        //     return pair[1];
        // }
        if (pair[0] == variable) {
            return decodeURI(pair[1]);
        } //解决中文乱码
    }
    return (false);
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值
function replaceParamVal(paramName, replaceWith) {
    var oUrl = this.location.href.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
    this.location = nUrl;
    window.location.href = nUrl
}

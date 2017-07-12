/*自定义验证判断*/
$.validator.addMethod("email", function (value, element) {
    return this.optional(element) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
}, "邮箱格式错误");

$.validator.addMethod("phone", function (value, element) {
    return this.optional(element) || /^^(((0\d{2,3}-?)?\d{7,8})|(1\d{10}))$/.test(value);
}, "手机号或座机号格式错误");

$.validator.addMethod("phoneOremail", function (value, element) {
    return this.optional(element) || /^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
}, "账号格式错误");
$.validator.addMethod("passwordStr", function (value, element) {
    var num = 0;
    function matchAZ(val) {
        return val.match(/[A-Z]+/);
    }

    function matchaz(val) {
        return val.match(/[a-z]+/);
    }

    function matchnum(val) {
        return val.match(/[0-9]+/);
    }

    function matchSign(val) {
        return val.match(/[~!@#$%^&*(),./?<>;:'"]+/);
    }
    matchAZ(value) && num++;
    matchaz(value) && num++;
    matchnum(value) && num++;
    matchSign(value) && num++;
    return this.optional(element) || num > 2;
})
$.validator.addMethod('nospace', function (value, element) {
    return this.optional(element) || /^[^\s]*$/.test(value);
})
$.validator.addMethod('checkName', function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9_]{3,16}$/.test(value);
})
$.validator.addMethod('checkOName', function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/.test(value);
});
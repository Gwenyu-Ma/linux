Vue.filter('dateFormat', function (seconds) {
    if (!seconds) {
        return '';
    }
    var date = new Date(seconds * 1000);
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
});
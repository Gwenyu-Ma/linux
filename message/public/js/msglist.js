var msglist = new Vue({
    el: "#msglist",
    data: {
        request: {
            eid: "",
            type: "",
            title: "",
            pageIndex: -1,
            pageSize: 100
        },
        busy: false,
        keys: [],
        rows: [],
        rowCount: 0,
        total: 0,
        errorShow: false,
        errorMsg: ""
    },
    methods: {
        init: function () {
            // this.request = {
            //     eid: "",
            //     type: "",
            //     title: "",
            //     pageIndex: "",
            //     pageSize: ""
            // };
            this.busy = false;
            this.keys = [];
            this.rows = [];
            this.rowCount = 0;
            this.total = 0;
            this.errorShow = false;
            this.errorMsg = "";
        },
        add: function () {
            addMsg.addShow = !addMsg.addShow;
        },
        loadMore: function () {
            this.busy = true;
            this.request.pageIndex++;
            this.search();
            this.busy = false;
        },
        search: function (cleanRows) {
            cleanRows && this.init();
            var $this = this;
            $.post("../api/getMsgList.php", this.request, function (result) {
                    for (var index in result.result.rows) {
                        result.result.rows[index]["id"] = index;
                        $this.rows.push(result.result.rows[index]);
                    }
            });
        },
        remove: function () {
            var $this = this;
            $.post("../api/rmMsg.php", {ids: this.keys}, function (result) {
                msglist.search();
                $this.errorMsg = result;
                $this.errorShow = true;
                console.log(result);
            });
        },
        allChk: function () {
            if (this.keys.length == this.rows.length) {
                this.keys = [];
                return;
            }
            this.keys = [];
            for (var index in this.rows) {
                this.keys.push(this.rows[index].id);
            }
        }
    },
    computed: {
        all: function () {
            return this.keys.length == this.rows.length;
        }
    }
});
msglist.search();
var addMsg = new Vue({
    el: "#addMsg",
    data: {
        addShow: false,
        post: {
            type: "",
            title: "",
            context: "",
            isRepeat: false,
            times: 1,
            titleInc: false
        }
    },
    methods: {
        addMsg: function () {
            $.post("../api/addMsg.php", {
                type: this.post.type,
                title: this.post.title,
                context: this.post.context,
                isRepeat: this.post.isRepeat,
                times: this.post.times,
                titleInc: this.post.titleInc
            }, function (result) {
                msglist.search();
                console.log(result);
            });
        }
    }
});
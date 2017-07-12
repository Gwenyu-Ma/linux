var sublist = new Vue({
    el: "#sublist",
    data: {
        request: {
            eid: "",
            type: "",
            scriber: "",
            pageIndex: -1,
            pageSize: 100
        },
        busy: false,
        keys: [],
        rows: [],
        rowCount: 0,
        total: 0
    },
    methods: {
        init: function () {
            // this.request = {
            //     eid: "",
            //     type: "",
            //     scriber: "",
            //     pageIndex: 0,
            //     pageSize: 100
            // };
            this.busy = false;
            this.keys = [];
            this.rows = [];
            this.rowCount = 0;
            this.total = 0;
        },
        add: function () {
            addSub.addShow = !addSub.addShow;
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
            $.post("../api/getSubList.php", this.request, function (result) {
                for (var index in result.result.rows) {
                    result.result.rows[index]["id"] = index;
                    $this.rows.push(result.result.rows[index]);
                }
            });
        },
        remove: function () {
            $.post("../api/rmSub.php", {ids: this.keys}, function (result) {
                sublist.search();
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
// sublist.search();
var addSub = new Vue({
    el: "#addSub",
    data: {
        addShow: false,
        post: {
            type: "",
            subscriber: "",
        }
    },
    methods: {
        addSub: function () {
            $.post("../api/addSub.php", {type: this.post.type, subscriber: this.post.subscriber}, function (result) {
                sublist.search();

                console.log(result);
            });
        }
    }
});
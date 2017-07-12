var subobjlist = new Vue({
    el: "#subobjlist",
    data: {
        request: {
            eid: "",
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
            addObj.addShow = !addObj.addShow;
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
            $.post("../api/getSubObjList.php", this.request, function (result) {
                //console.log(result);
                $this.rows = [];
                for (var index in result.result.rows) {
                    result.result.rows[index]["id"] = index;
                    $this.rows.push(result.result.rows[index]);
                }
            });
        },
        remove: function () {
            console.log(this.keys);
            $.post("../api/rmSubObj.php", {ids: this.keys}, function (result) {
                subobjlist.search();
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
// subobjlist.search();
var addObj = new Vue({
    el: "#addObj",
    data: {
        addShow: false,
        post: {
            subscriber: ""
        }
    },
    methods: {
        addObj: function () {
            $.post("../api/addObj.php", {subscriber: this.post.subscriber}, function (result) {
                subobjlist.search();
                console.log(result);
            });
        }
    }

});
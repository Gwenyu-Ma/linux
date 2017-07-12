! function($) {

    $.extend($.fn.bootstrapTable.defaults, {
        protection_sort: false
    });


    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _onSort = BootstrapTable.prototype.onSort;

    BootstrapTable.prototype.onSort = function(event) {
        var $this = $(event.currentTarget).parent(),
            $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.options.sortName = $this.data('field');
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder);

        // Assign the correct sortable arrow


        this.getCaretHtml();
        if (this.options.protection_sort) {
            this.initProtectionSort();
            this.initProtectionBody();
        } else {
            if (this.options.sidePagination === 'server') {
                this.initServer();
                return;
            }

            this.initSort();
            this.initBody();
        }

    };
    BootstrapTable.prototype.initProtectionSort = function() {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.$header.fields);
        $.each(this.data, function(idx, ele) {
            //console.log('ele', ele);
            ele._access.sort(function(a, b) {
                if (that.header.sortNames[index]) {
                    name = that.header.sortNames[index];
                }
                var aa = a[name],
                    bb = b[name],
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

                if (value !== undefined) {
                    return order * value;
                }

                // Fix #161: undefined or null string sort bug.
                if (aa === undefined || aa === null) {
                    aa = '';
                }
                if (bb === undefined || bb === null) {
                    bb = '';
                }

                // IF both values are numeric, do a numeric comparison
                if ($.isNumeric(aa) && $.isNumeric(bb)) {
                    // Convert numerical values form string to float.
                    aa = parseFloat(aa);
                    bb = parseFloat(bb);
                    if (aa < bb) {
                        return order * -1;
                    }
                    return order;
                }

                if (aa === bb) {
                    return 0;
                }

                // If value is not a string, convert to string
                if (typeof aa !== 'string') {
                    aa = aa.toString();
                }

                if (aa.localeCompare(bb) < 0) {
                    return order * -1;
                }

                return order;
            });
        });
    };

    BootstrapTable.prototype.initProtectionBody = function() {
        var that = this,
            html = [],
            data = this.getData();

        this.$body.find('tr.detail-view').each(function() {
            var $pre_tr = $(this).prev(),
                idx = $pre_tr.data('index'),
                row = that.options.data[idx];

            that.trigger('expand-row', idx, row, $(this).find('td'));
        });
    };

}(jQuery);
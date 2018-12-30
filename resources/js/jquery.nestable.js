/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
/* edited by Ali ghalambaz  aghalambaz[at]gmail[dot]com  http://www.yanagroup.ir */
var ajaxAddress = '../example/ajaxResponse.php';
var jquery_nestable = {};
jquery_nestable.dragged_item_id = null;
jquery_nestable.dragged_item_elem = null;
jquery_nestable.dragged_item_parent_id = null;
jquery_nestable.dragged_item_parent_elem = null;
jquery_nestable.dragged_item_prev_elem_id = null;
jquery_nestable.dragged_item_next_elem_id = null;
jquery_nestable.orders = new Array();
jquery_nestable.isItemChanged = false;
jquery_nestable.isOrderChanged = false;
(function ($, window, document, undefined) {
    var hasTouch = 'ontouchstart' in window;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function () {
        var el = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var eStart = hasTouch ? 'touchstart' : 'mousedown',
        eMove = hasTouch ? 'touchmove' : 'mousemove',
        eEnd = hasTouch ? 'touchend' : 'mouseup';
    eCancel = hasTouch ? 'touchcancel' : 'mouseup';

    var defaults = {
        listNodeName: 'ol',
        itemNodeName: 'li',
        rootClass: 'dd',
        listClass: 'dd-list',
        itemClass: 'dd-item',
        dragClass: 'dd-dragel',
        handleClass: 'dd-handle',
        collapsedClass: 'dd-collapsed',
        placeClass: 'dd-placeholder',
        noDragClass: 'dd-nodrag',
        emptyClass: 'dd-empty',
        expandBtnHTML: '<button data-action="expand" type="button"> <i class="icon icon-plus-sign"></i> </button>',
        collapseBtnHTML: '<button data-action="collapse" type="button"> <i class="icon icon-minus-sign"></i> </button>',
        editBtnHTML: '<button name="edit" data-action="edit" type="button" onclick="modaledit(); edit_nestable_click(this)"> <i class="icon icon-edit"></i> </button>',
        deleteBtnHTML: '<button name="del" data-action="delete" type="button" onclick=" delete_nestable(this)"> <i class="icon icon-trash"></i> </button>',
        group: 0,
        maxDepth: 10,
        threshold: 20
    };
    // <button name="edit" data-action="edit" type="button" onclick="modaledit(); edit_nestable_click(this)"> <i class="icon icon-edit"></i> </button>',
    // <a href="#modaledit" data-action="edit" data-toggle="modal" > edit_nestable_click(this)

    function Plugin(element, options) {
        this.w = $(window);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function () {

            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function (k, el) {

                $(el).prepend($(list.options.editBtnHTML));
                $(el).prepend($(list.options.deleteBtnHTML));
                // alert(list.options.editBtnHTML);
                // $(el).prepend($(this.options.editBtnHTML));
                //$(el).prepend($(this.options.deleteBtnHTML));

                list.setParent($(el));

            });
            // $.each(this.el.find(list.options.itemNodeName), function(k, en) {
            //  en.prepend(editBtnHTML);
            // en.prepend(deleteBtnHTML);
            //     en.prepend($(this.options.editBtnHTML));
            //     en.prepend($(this.options.deleteBtnHTML));

            // });

            // $.each($('#main-dd-list').children('li'),function(a,b){
            //     b.prepend(editBtnHTML);
            //     b.prepend(deleteBtnHTML);
            //     // alert(a);
            //     // alert(b);
            // });

            list.el.on('click', 'button', function (e) {
                if (list.dragEl || (!hasTouch && e.button !== 0)) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }


            });

            var onStartEvent = function (e) {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }
                if (!handle.length || list.dragEl || (!hasTouch && e.button !== 0) || (hasTouch && e.touches.length !== 1)) {
                    return;
                }
                e.preventDefault();

                list.dragStart(hasTouch ? e.touches[0] : e);
            };

            var onMoveEvent = function (e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(hasTouch ? e.touches[0] : e);
                }
            };

            var onEndEvent = function (e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(hasTouch ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener(eStart, onStartEvent, false);
                window.addEventListener(eMove, onMoveEvent, false);
                window.addEventListener(eEnd, onEndEvent, false);
                window.addEventListener(eCancel, onEndEvent, false);
            } else {
                list.el.on(eStart, onStartEvent);
                list.w.on(eMove, onMoveEvent);
                list.w.on(eEnd, onEndEvent);
            }

        },

        serialize: function () {
            var data,
                depth = 0,
                list = this;
            step = function (level, depth) {
                var array = [ ],
                    items = level.children(list.options.itemNodeName);
                items.each(function () {
                    var li = $(this),
                        item = $.extend({}, li.data()),
                        sub = li.children(list.options.listNodeName);
                    if (sub.length) {
                        item.children = step(sub, depth + 1);
                    }
                    array.push(item);
                });
                return array;
            };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function () {
            return this.serialize();
        },

        reset: function () {
            this.mouse = {
                offsetX: 0,
                offsetY: 0,
                startX: 0,
                startY: 0,
                lastX: 0,
                lastY: 0,
                nowX: 0,
                nowY: 0,
                distX: 0,
                distY: 0,
                dirAx: 0,
                dirX: 0,
                dirY: 0,
                lastDirX: 0,
                lastDirY: 0,
                distAxX: 0,
                distAxY: 0
            };
            this.moving = false;
            this.dragEl = null;
            this.dragRootEl = null;
            this.dragDepth = 0;
            this.hasNewRoot = false;
            this.pointEl = null;
        },

        expandItem: function (li) {

            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
        },

        collapseItem: function (li) {

            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }
        },

        expandAll: function () {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.expandItem($(this));
            });
        },

        collapseAll: function () {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.collapseItem($(this));
            });
        },

        setParent: function (li) {

            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
            }

            li.children('[data-action="expand"]').hide();
        },

        unsetParent: function (li) {

            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();

            li.prepend($(this.options.editBtnHTML));
            li.prepend($(this.options.deleteBtnHTML));

        },

        dragStart: function (e) {
            var mouse = this.mouse,
                target = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);
            //Changes ---------------------------------------------------------------
            jquery_nestable.dragged_item_id = dragItem.attr('data-id');
            jquery_nestable.dragged_item_elem = dragItem;
            jquery_nestable.dragged_item_prev_elem_id = dragItem.prev().attr('data-id');
            jquery_nestable.dragged_item_next_elem_id = dragItem.next().attr('data-id');
            jquery_nestable.dragged_item_parent_id = dragItem.parent().parent().attr('data-id');
            //Changes ---------------------------------------------------------------


            this.placeEl.css('height', dragItem.height());
            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;
            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            // fix for zepto.js
            //dragItem.after(this.placeEl).detach().appendTo(this.dragEl);
            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left': e.pageX - mouse.offsetX,
                'top': e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function (e) {
            // fix for zepto.js
            //this.placeEl.replaceWith(this.dragEl.children(this.options.itemNodeName + ':first').detach());
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);
            this.dragEl.remove();
            //Changes ---------------------------------------------------------------
            if ((jquery_nestable.dragged_item_prev_elem_id != el.prev().attr('data-id')) || (jquery_nestable.dragged_item_next_elem_id != el.next().attr('data-id'))) {
                jquery_nestable.dragged_item_prev_elem_id = el.prev().attr('data-id');
                jquery_nestable.dragged_item_next_elem_id = el.next().attr('data-id');
                if (jquery_nestable.dragged_item_parent_id != el.parent().parent().attr('data-id')) {
                    jquery_nestable.dragged_item_id = el.attr('data-id');
                    jquery_nestable.isItemChanged = true;
                }
                jquery_nestable.dragged_item_parent_id = el.parent().parent().attr('data-id');
                jquery_nestable.dragged_item_parent_elem = el.parent().parent();
                jquery_nestable.isOrderChanged = true;
                jquery_nestable.orders = new Array();

                var items = $(jquery_nestable.dragged_item_parent_elem).children('ol').children();
                $(items).each(function (index, value) {
                    jquery_nestable.orders[jquery_nestable.orders.length] = $(value).attr('data-id');
                });
            }
            //Changes ---------------------------------------------------------------
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();
        },

        dragMove: function (e) {
            var list, parent, prev, next, depth,
                opt = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left': e.pageX - mouse.offsetX,
                'top': e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX = e.pageX;
            mouse.nowY = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);

                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());

                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function (params) {
        var lists = this,
            retval = this;

        lists.each(function () {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery || window.Zepto, window, document);


function save_nestable(tkn) {
    var result_set = document.getElementById("result_set");
    if (jquery_nestable.isItemChanged || jquery_nestable.isOrderChanged) {
        $.ajax({
            type: "POST",
            url: ajaxAddress,
            data: {
                'action': 'update',
                'order': jquery_nestable.orders,
                'parent': jquery_nestable.dragged_item_parent_id,
                'dragged': jquery_nestable.dragged_item_id,
                'isItemChanged': jquery_nestable.isItemChanged,
                'isOrderChanged': jquery_nestable.isOrderChanged,
                'token': tkn
            }
        })
            .done(function (data) {
                setMessage(data);
                jquery_nestable.dragged_item_parent_id = null;
                jquery_nestable.dragged_item_id = null;
                jquery_nestable.isItemChanged = false;
                jquery_nestable.isOrderChanged = false;
            });
    }
} //ok

function add_nestable_item(name, lable, id) {
    // var editBtnHTMLa   = '<button name="edit" data-action="edit" type="button" onclick="edit_nestable(this)"> <i class="icon icon-edit"></i> </button>';
    //  var deleteBtnHTMLa = '<button name="del" data-action="delete" type="button" onclick="delete_nestable(this)"> <i class="icon icon-trash"></i> </button>';

    var editBtnHTMLa = '<button name="edit" data-action="edit" type="button" onclick="modaledit(); edit_nestable_click(this)"> <i class="icon icon-edit"></i> </button>';
    var deleteBtnHTMLa = '<button name="del" data-action="delete" type="button" onclick="delete_nestable(this)"> <i class="icon icon-trash"></i> </button>';

    $("#main-dd-list").append("<li class=\"dd-item\" data-id=\"" + id + "\" data-name=\"" + name + "\" data-lable=\"" + lable + "\"> " + deleteBtnHTMLa + editBtnHTMLa + "<div class=\"dd-handle\"> " + lable + " </div>");
    // alert($('li[data-id='+id+']').attr('data-id'));

} //ok
function add_nestable(name, lable) {
    $.ajax({
        type: "POST",
        url: ajaxAddress,
        data: {
            'action': "add",
            'name': name,
            'lable': lable
        }
    })
        .done(function (data) {
            if (data != "false") {
                setMessage("add successfully with id : " + data);
                add_nestable_item(name, lable, data);
            }
            else {
                setMessage("add failed or repeated name");
            }
        });
}//ok
function setMessage(msg) {
    var result_set = document.getElementById("result_set");
    // result_set.innerHTML = msg;
    showMessageInfo(msg);
}//ok
function edit_nestable_click(tag) {
    document.getElementById('edit_hid_id').value = $(tag).parent().attr('data-id');
    document.getElementById('edit_txt_name').value = $(tag).parent().attr('data-name');
    document.getElementById('edit_txt_lable').value = $(tag).parent().attr('data-lable');
} //ok
function edit_nestable_save(id, name, lable) {
    $.ajax({
        type: "POST",
        url: ajaxAddress,
        data: {
            'action': "edit",
            'id': id,
            'name': name,
            'lable': lable
        }
    })
        .done(function (data) {
            if (data == "true") {
                var tag = $("li[data-id='" + id + "']");
                tag.attr('data-name', JSON.stringify(name).slice(1, -1));
                tag.attr('data-lable', JSON.stringify(lable).slice(1, -1));
                tag.children('div').html(JSON.stringify(lable).slice(1, -1));
                setMessage('Edit Successfully!');
            }
            else {
                setMessage('Edit Failed!');
            }
        });

}//ok
function delete_nestable(tag) {
    var r = confirm("Are You Sure?");
    if (r == true) {
        var id_val = $(tag).parent().attr('data-id');
        var list = new Array();
        list[list.length] = id_val;
        $(tag).parent().find('li').each(function (i) {
            list[list.length] = $(this).attr('data-id');
        });
        $.ajax({
            type: "POST",
            url: ajaxAddress,
            data: {
                'action': "delete",
                'id': list
            }
        })
            .done(function (data) {
                if (data == 'true') {
                    if (!$(tag).parent().siblings("li").length)
                        $(tag).parent().parent().parent().children("button[data-action='collapse']").hide();
                    $(tag).parent().remove();

                    setMessage('Delete Successfully!');

                }
                else {
                    setMessage('Delete Failed :' + data);
                }

            });
    }
    else {

    }

}//ok


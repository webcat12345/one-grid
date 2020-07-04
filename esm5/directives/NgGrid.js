/**
 * @fileoverview added by tsickle
 * Generated from: directives/NgGrid.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __values } from "tslib";
import { Directive, ElementRef, Renderer2, EventEmitter, ComponentFactoryResolver, KeyValueDiffers, Output } from '@angular/core';
import * as NgGridHelper from '../helpers/NgGridHelpers';
import { NgGridPlaceholder } from '../components/NgGridPlaceholder';
import { fromEvent } from 'rxjs';
var NgGrid = /** @class */ (function () {
    // Constructor
    function NgGrid(_differs, _ngEl, _renderer, componentFactoryResolver) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this.componentFactoryResolver = componentFactoryResolver;
        // Event Emitters
        this.onDragStart = new EventEmitter();
        this.onDrag = new EventEmitter();
        this.onDragStop = new EventEmitter();
        this.onResizeStart = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onResizeStop = new EventEmitter();
        this.onItemChange = new EventEmitter();
        // Public variables
        this.colWidth = 250;
        this.rowHeight = 250;
        this.minCols = 1;
        this.minRows = 1;
        this.marginTop = 10;
        this.marginRight = 10;
        this.marginBottom = 10;
        this.marginLeft = 10;
        this.screenMargin = 0;
        this.isDragging = false;
        this.isResizing = false;
        this.autoStyle = true;
        this.resizeEnable = true;
        this.dragEnable = true;
        this.cascade = 'up';
        this.minWidth = 100;
        this.minHeight = 100;
        this.resizeDirections = NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS;
        // Private variables
        this._items = new Map();
        this._draggingItem = null;
        this._resizingItem = null;
        this._resizeDirection = null;
        this._itemsInGrid = new Set();
        this._maxCols = 0;
        this._maxRows = 0;
        this._visibleCols = 0;
        this._visibleRows = 0;
        this._setWidth = 250;
        this._setHeight = 250;
        this._posOffset = null;
        this._adding = false;
        this._placeholderRef = null;
        this._fixToGrid = false;
        this._autoResize = false;
        this._destroyed = false;
        this._maintainRatio = false;
        this._preferNew = false;
        this._zoomOnDrag = false;
        this._limitToScreen = false;
        this._centerToScreen = false;
        this._curMaxRow = 0;
        this._curMaxCol = 0;
        this._dragReady = false;
        this._resizeReady = false;
        this._elementBasedDynamicRowHeight = false;
        this._itemFixDirection = 'cascade';
        this._collisionFixDirection = 'cascade';
        this._allowOverlap = false;
        this._lastZValue = 1;
        this._subscriptions = [];
        this._enabledListener = false;
        this._config = NgGrid.CONST_DEFAULT_CONFIG;
        this._defineListeners();
    }
    Object.defineProperty(NgGrid.prototype, "config", {
        // [ng-grid] attribute handler
        set: 
        // [ng-grid] attribute handler
        /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v == null || typeof v !== 'object') {
                return;
            }
            this.setConfig(v);
            if (this._differ == null && v != null) {
                this._differ = this._differs.find(this._config).create();
            }
            this._differ.diff(this._config);
        },
        enumerable: true,
        configurable: true
    });
    // Public methods
    // Public methods
    /**
     * @return {?}
     */
    NgGrid.prototype.ngOnInit = 
    // Public methods
    /**
     * @return {?}
     */
    function () {
        this._renderer.addClass(this._ngEl.nativeElement, 'grid');
        if (this.autoStyle)
            this._renderer.setStyle(this._ngEl.nativeElement, 'position', 'relative');
        this.setConfig(this._config);
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._destroyed = true;
        this._disableListeners();
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.generateItemUid = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var uid = NgGridHelper.generateUuid();
        if (this._items.has(uid)) {
            return this.generateItemUid();
        }
        return uid;
    };
    /**
     * @param {?} config
     * @return {?}
     */
    NgGrid.prototype.setConfig = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        var _this = this;
        this._config = config;
        /** @type {?} */
        var maxColRowChanged = false;
        for (var x in config) {
            /** @type {?} */
            var val = config[x];
            /** @type {?} */
            var intVal = !val ? 0 : parseInt(val);
            switch (x) {
                case 'margins':
                    this.setMargins(val);
                    break;
                case 'col_width':
                    this.colWidth = Math.max(intVal, 1);
                    break;
                case 'row_height':
                    this.rowHeight = Math.max(intVal, 1);
                    break;
                case 'auto_style':
                    this.autoStyle = val ? true : false;
                    break;
                case 'auto_resize':
                    this._autoResize = val ? true : false;
                    break;
                case 'draggable':
                    this.dragEnable = val ? true : false;
                    break;
                case 'resizable':
                    this.resizeEnable = val ? true : false;
                    break;
                case 'max_rows':
                    maxColRowChanged = maxColRowChanged || this._maxRows != intVal;
                    this._maxRows = intVal < 0 ? 0 : intVal;
                    break;
                case 'max_cols':
                    maxColRowChanged = maxColRowChanged || this._maxCols != intVal;
                    this._maxCols = intVal < 0 ? 0 : intVal;
                    break;
                case 'visible_rows':
                    this._visibleRows = Math.max(intVal, 0);
                    break;
                case 'visible_cols':
                    this._visibleCols = Math.max(intVal, 0);
                    break;
                case 'min_rows':
                    this.minRows = Math.max(intVal, 1);
                    break;
                case 'min_cols':
                    this.minCols = Math.max(intVal, 1);
                    break;
                case 'min_height':
                    this.minHeight = Math.max(intVal, 1);
                    break;
                case 'min_width':
                    this.minWidth = Math.max(intVal, 1);
                    break;
                case 'zoom_on_drag':
                    this._zoomOnDrag = val ? true : false;
                    break;
                case 'cascade':
                    if (this.cascade != val) {
                        this.cascade = val;
                        this._cascadeGrid();
                    }
                    break;
                case 'fix_to_grid':
                    this._fixToGrid = val ? true : false;
                    break;
                case 'maintain_ratio':
                    this._maintainRatio = val ? true : false;
                    break;
                case 'prefer_new':
                    this._preferNew = val ? true : false;
                    break;
                case 'limit_to_screen':
                    this._limitToScreen = !this._autoResize && !!val;
                    if (this._limitToScreen) {
                        this._maxCols = this._getContainerColumns();
                    }
                    break;
                case 'center_to_screen':
                    this._centerToScreen = val ? true : false;
                    break;
                case 'resize_directions':
                    this.resizeDirections = val || ['bottomright', 'bottomleft', 'topright', 'topleft', 'right', 'left', 'bottom', 'top'];
                    break;
                case 'element_based_row_height':
                    this._elementBasedDynamicRowHeight = !!val;
                    break;
                case 'fix_item_position_direction':
                    this._itemFixDirection = val;
                    break;
                case 'fix_collision_position_direction':
                    this._collisionFixDirection = val;
                    break;
                case 'allow_overlap':
                    this._allowOverlap = !!val;
                    break;
            }
        }
        if (this._allowOverlap && this.cascade !== 'off' && this.cascade !== '') {
            console.warn('Unable to overlap items when a cascade direction is set.');
            this._allowOverlap = false;
        }
        if (this.dragEnable || this.resizeEnable) {
            this._enableListeners();
        }
        else {
            this._disableListeners();
        }
        if (this._itemFixDirection === 'cascade') {
            this._itemFixDirection = this._getFixDirectionFromCascade();
        }
        if (this._collisionFixDirection === 'cascade') {
            this._collisionFixDirection = this._getFixDirectionFromCascade();
        }
        if (this._limitToScreen) {
            /** @type {?} */
            var newMaxCols = this._getContainerColumns();
            if (this._maxCols != newMaxCols) {
                this._maxCols = newMaxCols;
                maxColRowChanged = true;
            }
        }
        if (this._limitToScreen && this._centerToScreen) {
            this.screenMargin = this._getScreenMargin();
        }
        else {
            this.screenMargin = 0;
        }
        if (this._maintainRatio) {
            if (this.colWidth && this.rowHeight) {
                this._aspectRatio = this.colWidth / this.rowHeight;
            }
            else {
                this._maintainRatio = false;
            }
        }
        if (maxColRowChanged) {
            if (this._maxCols > 0 && this._maxRows > 0) { //    Can't have both, prioritise on cascade
                switch (this.cascade) {
                    case 'left':
                    case 'right':
                        this._maxCols = 0;
                        break;
                    case 'up':
                    case 'down':
                    default:
                        this._maxRows = 0;
                        break;
                }
            }
            this._updatePositionsAfterMaxChange();
        }
        this._calculateColWidth();
        this._calculateRowHeight();
        /** @type {?} */
        var maxWidth = this._maxCols * this.colWidth;
        /** @type {?} */
        var maxHeight = this._maxRows * this.rowHeight;
        if (maxWidth > 0 && this.minWidth > maxWidth)
            this.minWidth = 0.75 * this.colWidth;
        if (maxHeight > 0 && this.minHeight > maxHeight)
            this.minHeight = 0.75 * this.rowHeight;
        if (this.minWidth > this.colWidth)
            this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
        if (this.minHeight > this.rowHeight)
            this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));
        if (this._maxCols > 0 && this.minCols > this._maxCols)
            this.minCols = 1;
        if (this._maxRows > 0 && this.minRows > this._maxRows)
            this.minRows = 1;
        this._updateRatio();
        this._items.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            _this._removeFromGrid(item);
            item.setCascadeMode(_this.cascade);
        }));
        this._items.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            item.recalculateSelf();
            _this._addToGrid(item);
        }));
        this._cascadeGrid();
        this._updateSize();
    };
    /**
     * @param {?} itemId
     * @return {?}
     */
    NgGrid.prototype.getItemPosition = /**
     * @param {?} itemId
     * @return {?}
     */
    function (itemId) {
        return this._items.has(itemId) ? this._items.get(itemId).getGridPosition() : null;
    };
    /**
     * @param {?} itemId
     * @return {?}
     */
    NgGrid.prototype.getItemSize = /**
     * @param {?} itemId
     * @return {?}
     */
    function (itemId) {
        return this._items.has(itemId) ? this._items.get(itemId).getSize() : null;
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this._differ != null) {
            /** @type {?} */
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    };
    /**
     * @param {?} margins
     * @return {?}
     */
    NgGrid.prototype.setMargins = /**
     * @param {?} margins
     * @return {?}
     */
    function (margins) {
        this.marginTop = Math.max(parseInt(margins[0]), 0);
        this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.marginRight;
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.enableDrag = /**
     * @return {?}
     */
    function () {
        this.dragEnable = true;
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.disableDrag = /**
     * @return {?}
     */
    function () {
        this.dragEnable = false;
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.enableResize = /**
     * @return {?}
     */
    function () {
        this.resizeEnable = true;
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.disableResize = /**
     * @return {?}
     */
    function () {
        this.resizeEnable = false;
    };
    /**
     * @param {?} ngItem
     * @return {?}
     */
    NgGrid.prototype.addItem = /**
     * @param {?} ngItem
     * @return {?}
     */
    function (ngItem) {
        var _this = this;
        ngItem.setCascadeMode(this.cascade);
        if (!this._preferNew) {
            /** @type {?} */
            var newPos = this._fixGridPosition(ngItem.getGridPosition(), ngItem.getSize());
            ngItem.setGridPosition(newPos);
        }
        if (ngItem.uid === null || this._items.has(ngItem.uid)) {
            ngItem.uid = this.generateItemUid();
        }
        this._items.set(ngItem.uid, ngItem);
        this._addToGrid(ngItem);
        this._updateSize();
        this.triggerCascade().then((/**
         * @return {?}
         */
        function () {
            ngItem.recalculateSelf();
            ngItem.onCascadeEvent();
            _this._emitOnItemChange();
        }));
    };
    /**
     * @param {?} ngItem
     * @return {?}
     */
    NgGrid.prototype.removeItem = /**
     * @param {?} ngItem
     * @return {?}
     */
    function (ngItem) {
        var _this = this;
        this._removeFromGrid(ngItem);
        this._items.delete(ngItem.uid);
        if (this._destroyed)
            return;
        this.triggerCascade().then((/**
         * @return {?}
         */
        function () {
            _this._updateSize();
            _this._items.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return item.recalculateSelf(); }));
            _this._emitOnItemChange();
        }));
    };
    /**
     * @param {?} ngItem
     * @return {?}
     */
    NgGrid.prototype.updateItem = /**
     * @param {?} ngItem
     * @return {?}
     */
    function (ngItem) {
        var _this = this;
        this._removeFromGrid(ngItem);
        this._addToGrid(ngItem);
        this.triggerCascade().then((/**
         * @return {?}
         */
        function () {
            _this._updateSize();
            ngItem.onCascadeEvent();
        }));
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.triggerCascade = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._cascadePromise) {
            this._cascadePromise = new Promise((/**
             * @param {?} resolve
             * @return {?}
             */
            function (resolve) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this._cascadePromise = null;
                    _this._cascadeGrid(null, null);
                    resolve();
                }), 0);
            }));
        }
        return this._cascadePromise;
    };
    /**
     * @return {?}
     */
    NgGrid.prototype.triggerResize = /**
     * @return {?}
     */
    function () {
        this.resizeEventHandler(null);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype.resizeEventHandler = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        // this._calculateColWidth();
        // this._calculateRowHeight();
        //
        // this._updateRatio();
        if (this._limitToScreen) {
            /** @type {?} */
            var newMaxColumns = this._getContainerColumns();
            if (this._maxCols !== newMaxColumns) {
                this._maxCols = newMaxColumns;
                // this._updatePositionsAfterMaxChange();
                // this._cascadeGrid();
            }
            if (this._centerToScreen) {
                this.screenMargin = this._getScreenMargin();
                this._items.forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) {
                    item.recalculateSelf();
                }));
            }
        }
        else if (this._autoResize) {
            this._items.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                item.recalculateSelf();
            }));
        }
        // this._updateSize();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype.mouseDownEventHandler = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        /** @type {?} */
        var mousePos = this._getMousePosition(e);
        /** @type {?} */
        var item = this._getItemFromPosition(mousePos);
        if (item == null)
            return;
        /** @type {?} */
        var resizeDirection = item.canResize(e);
        if (this.resizeEnable && resizeDirection) {
            this._resizeReady = true;
            this._resizingItem = item;
            this._resizeDirection = resizeDirection;
            e.preventDefault();
        }
        else if (this.dragEnable && item.canDrag(e)) {
            this._dragReady = true;
            this._draggingItem = item;
            /** @type {?} */
            var itemPos = item.getPosition();
            this._posOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) };
            e.preventDefault();
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype.mouseUpEventHandler = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (this.isDragging) {
            this._dragStop(e);
        }
        else if (this.isResizing) {
            this._resizeStop(e);
        }
        else if (this._dragReady || this._resizeReady) {
            this._cleanDrag();
            this._cleanResize();
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype.mouseMoveEventHandler = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (this._resizeReady) {
            this._resizeStart(e);
            e.preventDefault();
            return;
        }
        else if (this._dragReady) {
            this._dragStart(e);
            e.preventDefault();
            return;
        }
        if (this.isDragging) {
            this._drag(e);
        }
        else if (this.isResizing) {
            this._resize(e);
        }
        else {
            /** @type {?} */
            var mousePos = this._getMousePosition(e);
            /** @type {?} */
            var item = this._getItemFromPosition(mousePos);
            if (item) {
                item.onMouseMove(e);
            }
        }
    };
    //    Private methods
    //    Private methods
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._getFixDirectionFromCascade = 
    //    Private methods
    /**
     * @private
     * @return {?}
     */
    function () {
        switch (this.cascade) {
            case 'up':
            case 'down':
            default:
                return 'vertical';
            case 'left':
            case 'right':
                return 'horizontal';
        }
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._updatePositionsAfterMaxChange = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this._items.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            /** @type {?} */
            var pos = item.getGridPosition();
            /** @type {?} */
            var dims = item.getSize();
            if (!_this._hasGridCollision(pos, dims) && _this._isWithinBounds(pos, dims) && dims.x <= _this._maxCols && dims.y <= _this._maxRows) {
                return;
            }
            _this._removeFromGrid(item);
            if (_this._maxCols > 0 && dims.x > _this._maxCols) {
                dims.x = _this._maxCols;
                item.setSize(dims);
            }
            else if (_this._maxRows > 0 && dims.y > _this._maxRows) {
                dims.y = _this._maxRows;
                item.setSize(dims);
            }
            if (_this._hasGridCollision(pos, dims) || !_this._isWithinBounds(pos, dims, true)) {
                /** @type {?} */
                var newPosition = _this._fixGridPosition(pos, dims);
                item.setGridPosition(newPosition);
            }
            _this._addToGrid(item);
        }));
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._calculateColWidth = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._autoResize) {
            if (this._maxCols > 0 || this._visibleCols > 0) {
                /** @type {?} */
                var maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
                /** @type {?} */
                var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
                /** @type {?} */
                var colWidth = Math.floor(maxWidth / maxCols);
                colWidth -= (this.marginLeft + this.marginRight);
                if (colWidth > 0)
                    this.colWidth = colWidth;
            }
        }
        if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
            this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
        }
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._calculateRowHeight = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._autoResize) {
            if (this._maxRows > 0 || this._visibleRows > 0) {
                /** @type {?} */
                var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
                /** @type {?} */
                var maxHeight = void 0;
                if (this._elementBasedDynamicRowHeight) {
                    maxHeight = this._ngEl.nativeElement.getBoundingClientRect().height;
                }
                else {
                    maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
                }
                /** @type {?} */
                var rowHeight = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
                rowHeight -= (this.marginTop + this.marginBottom);
                if (rowHeight > 0)
                    this.rowHeight = rowHeight;
            }
        }
        if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
            this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
        }
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._updateRatio = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this._autoResize || !this._maintainRatio)
            return;
        if (this._maxCols > 0 && this._visibleRows <= 0) {
            this.rowHeight = this.colWidth / this._aspectRatio;
        }
        else if (this._maxRows > 0 && this._visibleCols <= 0) {
            this.colWidth = this._aspectRatio * this.rowHeight;
        }
        else if (this._maxCols == 0 && this._maxRows == 0) {
            if (this._visibleCols > 0) {
                this.rowHeight = this.colWidth / this._aspectRatio;
            }
            else if (this._visibleRows > 0) {
                this.colWidth = this._aspectRatio * this.rowHeight;
            }
        }
    };
    /**
     * @private
     * @param {?} changes
     * @return {?}
     */
    NgGrid.prototype._applyChanges = /**
     * @private
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        changes.forEachAddedItem((/**
         * @param {?} record
         * @return {?}
         */
        function (record) { _this._config[record.key] = record.currentValue; }));
        changes.forEachChangedItem((/**
         * @param {?} record
         * @return {?}
         */
        function (record) { _this._config[record.key] = record.currentValue; }));
        changes.forEachRemovedItem((/**
         * @param {?} record
         * @return {?}
         */
        function (record) { delete _this._config[record.key]; }));
        this.setConfig(this._config);
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._resizeStart = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this.resizeEnable || !this._resizingItem)
            return;
        //    Setup
        this._resizingItem.startMoving();
        this._removeFromGrid(this._resizingItem);
        this._createPlaceholder(this._resizingItem);
        if (this._allowOverlap) {
            this._resizingItem.zIndex = this._lastZValue++;
        }
        //    Status Flags
        this.isResizing = true;
        this._resizeReady = false;
        //    Events
        this.onResizeStart.emit(this._resizingItem);
        this._resizingItem.onResizeStartEvent();
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._dragStart = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this.dragEnable || !this._draggingItem)
            return;
        //    Start dragging
        this._draggingItem.startMoving();
        this._removeFromGrid(this._draggingItem);
        this._createPlaceholder(this._draggingItem);
        if (this._allowOverlap) {
            this._draggingItem.zIndex = this._lastZValue++;
        }
        //    Status Flags
        this.isDragging = true;
        this._dragReady = false;
        //    Events
        this.onDragStart.emit(this._draggingItem);
        this._draggingItem.onDragStartEvent();
        //    Zoom
        if (this._zoomOnDrag) {
            this._zoomOut();
        }
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._zoomOut = /**
     * @private
     * @return {?}
     */
    function () {
        this._renderer.setStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._resetZoom = /**
     * @private
     * @return {?}
     */
    function () {
        this._renderer.setStyle(this._ngEl.nativeElement, 'transform', '');
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._drag = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this.isDragging)
            return;
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        }
        else if (((/** @type {?} */ (document))).selection) {
            ((/** @type {?} */ (document))).selection.empty();
        }
        /** @type {?} */
        var mousePos = this._getMousePosition(e);
        /** @type {?} */
        var newL = (mousePos.left - this._posOffset.left);
        /** @type {?} */
        var newT = (mousePos.top - this._posOffset.top);
        /** @type {?} */
        var itemPos = this._draggingItem.getGridPosition();
        /** @type {?} */
        var gridPos = this._calculateGridPosition(newL, newT);
        /** @type {?} */
        var dims = this._draggingItem.getSize();
        gridPos = this._fixPosToBoundsX(gridPos, dims);
        if (!this._isWithinBoundsY(gridPos, dims)) {
            gridPos = this._fixPosToBoundsY(gridPos, dims);
        }
        if (gridPos.col != itemPos.col || gridPos.row != itemPos.row) {
            this._draggingItem.setGridPosition(gridPos, this._fixToGrid);
            this._placeholderRef.instance.setGridPosition(gridPos);
            if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                this._fixGridCollisions(gridPos, dims);
                this._cascadeGrid(gridPos, dims);
            }
        }
        if (!this._fixToGrid) {
            this._draggingItem.setPosition(newL, newT);
        }
        this.onDrag.emit(this._draggingItem);
        this._draggingItem.onDragEvent();
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._resize = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this.isResizing) {
            return;
        }
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        }
        else if (((/** @type {?} */ (document))).selection) {
            ((/** @type {?} */ (document))).selection.empty();
        }
        /** @type {?} */
        var mousePos = this._getMousePosition(e);
        /** @type {?} */
        var itemPos = this._resizingItem.getPosition();
        /** @type {?} */
        var itemDims = this._resizingItem.getDimensions();
        /** @type {?} */
        var endCorner = {
            left: itemPos.left + itemDims.width,
            top: itemPos.top + itemDims.height,
        };
        /** @type {?} */
        var resizeTop = this._resizeDirection.includes('top');
        /** @type {?} */
        var resizeBottom = this._resizeDirection.includes('bottom');
        /** @type {?} */
        var resizeLeft = this._resizeDirection.includes('left');
        /** @type {?} */
        var resizeRight = this._resizeDirection.includes('right');
        // Calculate new width and height based upon resize direction
        /** @type {?} */
        var newW = resizeRight
            ? (mousePos.left - itemPos.left + 1)
            : resizeLeft
                ? (endCorner.left - mousePos.left + 1)
                : itemDims.width;
        /** @type {?} */
        var newH = resizeBottom
            ? (mousePos.top - itemPos.top + 1)
            : resizeTop
                ? (endCorner.top - mousePos.top + 1)
                : itemDims.height;
        if (newW < this.minWidth)
            newW = this.minWidth;
        if (newH < this.minHeight)
            newH = this.minHeight;
        if (newW < this._resizingItem.minWidth)
            newW = this._resizingItem.minWidth;
        if (newH < this._resizingItem.minHeight)
            newH = this._resizingItem.minHeight;
        /** @type {?} */
        var newX = itemPos.left;
        /** @type {?} */
        var newY = itemPos.top;
        if (resizeLeft)
            newX = endCorner.left - newW;
        if (resizeTop)
            newY = endCorner.top - newH;
        /** @type {?} */
        var calcSize = this._calculateGridSize(newW, newH);
        /** @type {?} */
        var itemSize = this._resizingItem.getSize();
        /** @type {?} */
        var iGridPos = this._resizingItem.getGridPosition();
        /** @type {?} */
        var bottomRightCorner = {
            col: iGridPos.col + itemSize.x,
            row: iGridPos.row + itemSize.y,
        };
        /** @type {?} */
        var targetPos = Object.assign({}, iGridPos);
        if (this._resizeDirection.includes('top'))
            targetPos.row = bottomRightCorner.row - calcSize.y;
        if (this._resizeDirection.includes('left'))
            targetPos.col = bottomRightCorner.col - calcSize.x;
        if (!this._isWithinBoundsX(targetPos, calcSize))
            calcSize = this._fixSizeToBoundsX(targetPos, calcSize);
        if (!this._isWithinBoundsY(targetPos, calcSize))
            calcSize = this._fixSizeToBoundsY(targetPos, calcSize);
        calcSize = this._resizingItem.fixResize(calcSize);
        if (calcSize.x != itemSize.x || calcSize.y != itemSize.y) {
            this._resizingItem.setGridPosition(targetPos, this._fixToGrid);
            this._placeholderRef.instance.setGridPosition(targetPos);
            this._resizingItem.setSize(calcSize, this._fixToGrid);
            this._placeholderRef.instance.setSize(calcSize);
            if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                this._fixGridCollisions(targetPos, calcSize);
                this._cascadeGrid(targetPos, calcSize);
            }
        }
        if (!this._fixToGrid) {
            this._resizingItem.setDimensions(newW, newH);
            this._resizingItem.setPosition(newX, newY);
        }
        this.onResize.emit(this._resizingItem);
        this._resizingItem.onResizeEvent();
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._dragStop = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this.isDragging)
            return;
        this.isDragging = false;
        /** @type {?} */
        var itemPos = this._draggingItem.getGridPosition();
        this._draggingItem.setGridPosition(itemPos);
        this._addToGrid(this._draggingItem);
        this._cascadeGrid();
        this._updateSize();
        this._draggingItem.stopMoving();
        this._draggingItem.onDragStopEvent();
        this.onDragStop.emit(this._draggingItem);
        this._cleanDrag();
        this._placeholderRef.destroy();
        this._emitOnItemChange();
        if (this._zoomOnDrag) {
            this._resetZoom();
        }
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._resizeStop = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this.isResizing)
            return;
        this.isResizing = false;
        /** @type {?} */
        var itemDims = this._resizingItem.getSize();
        this._resizingItem.setSize(itemDims);
        /** @type {?} */
        var itemPos = this._resizingItem.getGridPosition();
        this._resizingItem.setGridPosition(itemPos);
        this._addToGrid(this._resizingItem);
        this._cascadeGrid();
        this._updateSize();
        this._resizingItem.stopMoving();
        this._resizingItem.onResizeStopEvent();
        this.onResizeStop.emit(this._resizingItem);
        this._cleanResize();
        this._placeholderRef.destroy();
        this._emitOnItemChange();
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._cleanDrag = /**
     * @private
     * @return {?}
     */
    function () {
        this._draggingItem = null;
        this._posOffset = null;
        this.isDragging = false;
        this._dragReady = false;
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._cleanResize = /**
     * @private
     * @return {?}
     */
    function () {
        this._resizingItem = null;
        this._resizeDirection = null;
        this.isResizing = false;
        this._resizeReady = false;
    };
    /**
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    NgGrid.prototype._calculateGridSize = /**
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    function (width, height) {
        width += this.marginLeft + this.marginRight;
        height += this.marginTop + this.marginBottom;
        /** @type {?} */
        var sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
        /** @type {?} */
        var sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));
        if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizex = this._maxCols;
        if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizey = this._maxRows;
        return { 'x': sizex, 'y': sizey };
    };
    /**
     * @private
     * @param {?} left
     * @param {?} top
     * @return {?}
     */
    NgGrid.prototype._calculateGridPosition = /**
     * @private
     * @param {?} left
     * @param {?} top
     * @return {?}
     */
    function (left, top) {
        /** @type {?} */
        var col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
        /** @type {?} */
        var row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);
        if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 }))
            col = this._maxCols;
        if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 }))
            row = this._maxRows;
        return { 'col': col, 'row': row };
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._hasGridCollision = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        return false;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._getCollisions = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        var _this = this;
        if (this._allowOverlap)
            return [];
        /** @type {?} */
        var returns = [];
        if (!pos.col) {
            pos.col = 1;
        }
        if (!pos.row) {
            pos.row = 1;
        }
        /** @type {?} */
        var leftCol = pos.col;
        /** @type {?} */
        var rightCol = pos.col + dims.x;
        /** @type {?} */
        var topRow = pos.row;
        /** @type {?} */
        var bottomRow = pos.row + dims.y;
        this._itemsInGrid.forEach((/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) {
            /** @type {?} */
            var item = _this._items.get(itemId);
            if (!item) {
                _this._itemsInGrid.delete(itemId);
                return;
            }
            /** @type {?} */
            var itemLeftCol = item.col;
            /** @type {?} */
            var itemRightCol = item.col + item.sizex;
            /** @type {?} */
            var itemTopRow = item.row;
            /** @type {?} */
            var itemBottomRow = item.row + item.sizey;
            /** @type {?} */
            var withinColumns = leftCol < itemRightCol && itemLeftCol < rightCol;
            /** @type {?} */
            var withinRows = topRow < itemBottomRow && itemTopRow < bottomRow;
            if (withinColumns && withinRows) {
                returns.push(item);
            }
        }));
        return returns;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixGridCollisions = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        var e_1, _a;
        /** @type {?} */
        var collisions = this._getCollisions(pos, dims);
        if (collisions.length === 0) {
            return;
        }
        try {
            for (var collisions_1 = __values(collisions), collisions_1_1 = collisions_1.next(); !collisions_1_1.done; collisions_1_1 = collisions_1.next()) {
                var collision = collisions_1_1.value;
                this._removeFromGrid(collision);
                /** @type {?} */
                var itemDims = collision.getSize();
                /** @type {?} */
                var itemPos = collision.getGridPosition();
                /** @type {?} */
                var newItemPos = { col: itemPos.col, row: itemPos.row };
                if (this._collisionFixDirection === 'vertical') {
                    newItemPos.row = pos.row + dims.y;
                    if (!this._isWithinBoundsY(newItemPos, itemDims)) {
                        newItemPos.col = pos.col + dims.x;
                        newItemPos.row = 1;
                    }
                }
                else if (this._collisionFixDirection === 'horizontal') {
                    newItemPos.col = pos.col + dims.x;
                    if (!this._isWithinBoundsX(newItemPos, itemDims)) {
                        newItemPos.col = 1;
                        newItemPos.row = pos.row + dims.y;
                    }
                }
                collision.setGridPosition(newItemPos);
                this._fixGridCollisions(newItemPos, itemDims);
                this._addToGrid(collision);
                collision.onCascadeEvent();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (collisions_1_1 && !collisions_1_1.done && (_a = collisions_1.return)) _a.call(collisions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._fixGridCollisions(pos, dims);
    };
    /**
     * @private
     * @param {?=} pos
     * @param {?=} dims
     * @return {?}
     */
    NgGrid.prototype._cascadeGrid = /**
     * @private
     * @param {?=} pos
     * @param {?=} dims
     * @return {?}
     */
    function (pos, dims) {
        var e_2, _a, e_3, _b;
        var _this = this;
        if (this._destroyed)
            return;
        if (this._allowOverlap)
            return;
        if (!pos !== !dims)
            throw new Error('Cannot cascade with only position and not dimensions');
        if (this.isDragging && this._draggingItem && !pos && !dims) {
            pos = this._draggingItem.getGridPosition();
            dims = this._draggingItem.getSize();
        }
        else if (this.isResizing && this._resizingItem && !pos && !dims) {
            pos = this._resizingItem.getGridPosition();
            dims = this._resizingItem.getSize();
        }
        /** @type {?} */
        var itemsInGrid = Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) { return _this._items.get(itemId); }));
        switch (this.cascade) {
            case 'up':
            case 'down':
                itemsInGrid = itemsInGrid.sort(NgGridHelper.sortItemsByPositionVertical);
                /** @type {?} */
                var lowestRowPerColumn = new Map();
                try {
                    for (var itemsInGrid_1 = __values(itemsInGrid), itemsInGrid_1_1 = itemsInGrid_1.next(); !itemsInGrid_1_1.done; itemsInGrid_1_1 = itemsInGrid_1.next()) {
                        var item = itemsInGrid_1_1.value;
                        if (item.isFixed)
                            continue;
                        /** @type {?} */
                        var itemDims = item.getSize();
                        /** @type {?} */
                        var itemPos = item.getGridPosition();
                        /** @type {?} */
                        var lowestRowForItem = lowestRowPerColumn.get(itemPos.col) || 1;
                        for (var i = 1; i < itemDims.x; i++) {
                            /** @type {?} */
                            var lowestRowForColumn = lowestRowPerColumn.get(itemPos.col + i) || 1;
                            lowestRowForItem = Math.max(lowestRowForColumn, lowestRowForItem);
                        }
                        /** @type {?} */
                        var leftCol = itemPos.col;
                        /** @type {?} */
                        var rightCol = itemPos.col + itemDims.x;
                        if (pos && dims) {
                            /** @type {?} */
                            var withinColumns = rightCol > pos.col && leftCol < (pos.col + dims.x);
                            if (withinColumns) { // If our element is in one of the item's columns
                                // If our element is in one of the item's columns
                                /** @type {?} */
                                var roomAboveItem = itemDims.y <= (pos.row - lowestRowForItem);
                                if (!roomAboveItem) { // Item can't fit above our element
                                    lowestRowForItem = Math.max(lowestRowForItem, pos.row + dims.y); // Set the lowest row to be below it
                                }
                            }
                        }
                        /** @type {?} */
                        var newPos = { col: itemPos.col, row: lowestRowForItem };
                        //    What if it's not within bounds Y?
                        if (lowestRowForItem != itemPos.row && this._isWithinBoundsY(newPos, itemDims)) { // If the item is not already on this row move it up
                            this._removeFromGrid(item);
                            item.setGridPosition(newPos);
                            item.onCascadeEvent();
                            this._addToGrid(item);
                        }
                        for (var i = 0; i < itemDims.x; i++) {
                            lowestRowPerColumn.set(itemPos.col + i, lowestRowForItem + itemDims.y); // Update the lowest row to be below the item
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (itemsInGrid_1_1 && !itemsInGrid_1_1.done && (_a = itemsInGrid_1.return)) _a.call(itemsInGrid_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                break;
            case 'left':
            case 'right':
                itemsInGrid = itemsInGrid.sort(NgGridHelper.sortItemsByPositionHorizontal);
                /** @type {?} */
                var lowestColumnPerRow = new Map();
                try {
                    for (var itemsInGrid_2 = __values(itemsInGrid), itemsInGrid_2_1 = itemsInGrid_2.next(); !itemsInGrid_2_1.done; itemsInGrid_2_1 = itemsInGrid_2.next()) {
                        var item = itemsInGrid_2_1.value;
                        /** @type {?} */
                        var itemDims = item.getSize();
                        /** @type {?} */
                        var itemPos = item.getGridPosition();
                        /** @type {?} */
                        var lowestColumnForItem = lowestColumnPerRow.get(itemPos.row) || 1;
                        for (var i = 1; i < itemDims.y; i++) {
                            /** @type {?} */
                            var lowestOffsetColumn = lowestColumnPerRow.get(itemPos.row + i) || 1;
                            lowestColumnForItem = Math.max(lowestOffsetColumn, lowestColumnForItem);
                        }
                        /** @type {?} */
                        var topRow = itemPos.row;
                        /** @type {?} */
                        var bottomRow = itemPos.row + itemDims.y;
                        if (pos && dims) {
                            /** @type {?} */
                            var withinRows = bottomRow > pos.col && topRow < (pos.col + dims.x);
                            if (withinRows) { // If our element is in one of the item's rows
                                // If our element is in one of the item's rows
                                /** @type {?} */
                                var roomNextToItem = itemDims.x <= (pos.col - lowestColumnForItem);
                                if (!roomNextToItem) { // Item can't fit next to our element
                                    lowestColumnForItem = Math.max(lowestColumnForItem, pos.col + dims.x); // Set the lowest col to be the other side of it
                                }
                            }
                        }
                        /** @type {?} */
                        var newPos = { col: lowestColumnForItem, row: itemPos.row };
                        if (lowestColumnForItem != itemPos.col && this._isWithinBoundsX(newPos, itemDims)) { // If the item is not already on this col move it up
                            this._removeFromGrid(item);
                            item.setGridPosition(newPos);
                            item.onCascadeEvent();
                            this._addToGrid(item);
                        }
                        for (var i = 0; i < itemDims.y; i++) {
                            lowestColumnPerRow.set(itemPos.row + i, lowestColumnForItem + itemDims.x); // Update the lowest col to be below the item
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (itemsInGrid_2_1 && !itemsInGrid_2_1.done && (_b = itemsInGrid_2.return)) _b.call(itemsInGrid_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                break;
            default:
                break;
        }
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixGridPosition = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        var e_4, _a, e_5, _b;
        if (!this._hasGridCollision(pos, dims))
            return pos;
        /** @type {?} */
        var maxRow = this._maxRows === 0 ? this._getMaxRow() : this._maxRows;
        /** @type {?} */
        var maxCol = this._maxCols === 0 ? this._getMaxCol() : this._maxCols;
        /** @type {?} */
        var newPos = {
            col: pos.col,
            row: pos.row,
        };
        if (this._itemFixDirection === 'vertical') {
            fixLoop: for (; newPos.col <= maxRow;) {
                /** @type {?} */
                var itemsInPath = this._getItemsInVerticalPath(newPos, dims, newPos.row);
                /** @type {?} */
                var nextRow = newPos.row;
                try {
                    for (var itemsInPath_1 = (e_4 = void 0, __values(itemsInPath)), itemsInPath_1_1 = itemsInPath_1.next(); !itemsInPath_1_1.done; itemsInPath_1_1 = itemsInPath_1.next()) {
                        var item = itemsInPath_1_1.value;
                        if (item.row - nextRow >= dims.y) {
                            newPos.row = nextRow;
                            break fixLoop;
                        }
                        nextRow = item.row + item.sizey;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (itemsInPath_1_1 && !itemsInPath_1_1.done && (_a = itemsInPath_1.return)) _a.call(itemsInPath_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                if (maxRow - nextRow >= dims.y) {
                    newPos.row = nextRow;
                    break fixLoop;
                }
                newPos.col = Math.max(newPos.col + 1, Math.min.apply(Math, itemsInPath.map((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) { return item.col + dims.x; }))));
                newPos.row = 1;
            }
        }
        else if (this._itemFixDirection === 'horizontal') {
            fixLoop: for (; newPos.row <= maxRow;) {
                /** @type {?} */
                var itemsInPath = this._getItemsInHorizontalPath(newPos, dims, newPos.col);
                /** @type {?} */
                var nextCol = newPos.col;
                try {
                    for (var itemsInPath_2 = (e_5 = void 0, __values(itemsInPath)), itemsInPath_2_1 = itemsInPath_2.next(); !itemsInPath_2_1.done; itemsInPath_2_1 = itemsInPath_2.next()) {
                        var item = itemsInPath_2_1.value;
                        if (item.col - nextCol >= dims.x) {
                            newPos.col = nextCol;
                            break fixLoop;
                        }
                        nextCol = item.col + item.sizex;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (itemsInPath_2_1 && !itemsInPath_2_1.done && (_b = itemsInPath_2.return)) _b.call(itemsInPath_2);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                if (maxCol - nextCol >= dims.x) {
                    newPos.col = nextCol;
                    break fixLoop;
                }
                newPos.row = Math.max(newPos.row + 1, Math.min.apply(Math, itemsInPath.map((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) { return item.row + dims.y; }))));
                newPos.col = 1;
            }
        }
        return newPos;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} startColumn
     * @return {?}
     */
    NgGrid.prototype._getItemsInHorizontalPath = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} startColumn
     * @return {?}
     */
    function (pos, dims, startColumn) {
        var _this = this;
        if (startColumn === void 0) { startColumn = 0; }
        /** @type {?} */
        var itemsInPath = [];
        /** @type {?} */
        var topRow = pos.row + dims.y - 1;
        this._itemsInGrid.forEach((/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) {
            /** @type {?} */
            var item = _this._items.get(itemId);
            if (item.col + item.sizex - 1 < startColumn) {
                return;
            } // Item falls after start column
            if (item.row > topRow) {
                return;
            } // Item falls above path
            if (item.row + item.sizey - 1 < pos.row) {
                return;
            } // Item falls below path
            itemsInPath.push(item);
        }));
        return itemsInPath;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} startRow
     * @return {?}
     */
    NgGrid.prototype._getItemsInVerticalPath = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} startRow
     * @return {?}
     */
    function (pos, dims, startRow) {
        var _this = this;
        if (startRow === void 0) { startRow = 0; }
        /** @type {?} */
        var itemsInPath = [];
        /** @type {?} */
        var rightCol = pos.col + dims.x - 1;
        this._itemsInGrid.forEach((/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) {
            /** @type {?} */
            var item = _this._items.get(itemId);
            if (item.row + item.sizey - 1 < startRow) {
                return;
            } // Item falls above start row
            if (item.col > rightCol) {
                return;
            } // Item falls after path
            if (item.col + item.sizex - 1 < pos.col) {
                return;
            } // Item falls before path
            itemsInPath.push(item);
        }));
        return itemsInPath;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    NgGrid.prototype._isWithinBoundsX = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    function (pos, dims, allowExcessiveItems) {
        if (allowExcessiveItems === void 0) { allowExcessiveItems = false; }
        return this._maxCols == 0 || (allowExcessiveItems && pos.col == 1) || (pos.col + dims.x - 1) <= this._maxCols;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixPosToBoundsX = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        if (!this._isWithinBoundsX(pos, dims)) {
            pos.col = Math.max(this._maxCols - (dims.x - 1), 1);
            pos.row++;
        }
        return pos;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixSizeToBoundsX = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        if (!this._isWithinBoundsX(pos, dims)) {
            dims.x = Math.max(this._maxCols - (pos.col - 1), 1);
            dims.y++;
        }
        return dims;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    NgGrid.prototype._isWithinBoundsY = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    function (pos, dims, allowExcessiveItems) {
        if (allowExcessiveItems === void 0) { allowExcessiveItems = false; }
        return this._maxRows == 0 || (allowExcessiveItems && pos.row == 1) || (pos.row + dims.y - 1) <= this._maxRows;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixPosToBoundsY = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        if (!this._isWithinBoundsY(pos, dims)) {
            pos.row = Math.max(this._maxRows - (dims.y - 1), 1);
            pos.col++;
        }
        return pos;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixSizeToBoundsY = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        if (!this._isWithinBoundsY(pos, dims)) {
            dims.y = Math.max(this._maxRows - (pos.row - 1), 1);
            dims.x++;
        }
        return dims;
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    NgGrid.prototype._isWithinBounds = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    function (pos, dims, allowExcessiveItems) {
        if (allowExcessiveItems === void 0) { allowExcessiveItems = false; }
        return this._isWithinBoundsX(pos, dims, allowExcessiveItems) && this._isWithinBoundsY(pos, dims, allowExcessiveItems);
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixPosToBounds = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        return this._fixPosToBoundsX(this._fixPosToBoundsY(pos, dims), dims);
    };
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    NgGrid.prototype._fixSizeToBounds = /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    function (pos, dims) {
        return this._fixSizeToBoundsX(pos, this._fixSizeToBoundsY(pos, dims));
    };
    /**
     * @private
     * @param {?} item
     * @return {?}
     */
    NgGrid.prototype._addToGrid = /**
     * @private
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var pos = item.getGridPosition();
        /** @type {?} */
        var dims = item.getSize();
        if (this._hasGridCollision(pos, dims)) {
            this._fixGridCollisions(pos, dims);
            pos = item.getGridPosition();
        }
        if (this._allowOverlap) {
            item.zIndex = this._lastZValue++;
        }
        this._itemsInGrid.add(item.uid);
    };
    /**
     * @private
     * @param {?} item
     * @return {?}
     */
    NgGrid.prototype._removeFromGrid = /**
     * @private
     * @param {?} item
     * @return {?}
     */
    function (item) {
        this._itemsInGrid.delete(item.uid);
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._updateSize = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._destroyed)
            return;
        /** @type {?} */
        var maxCol = this._getMaxCol();
        /** @type {?} */
        var maxRow = this._getMaxRow();
        if (maxCol != this._curMaxCol || maxRow != this._curMaxRow) {
            this._curMaxCol = maxCol;
            this._curMaxRow = maxRow;
        }
        this._renderer.setStyle(this._ngEl.nativeElement, 'width', '100%'); //(maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
        if (!this._elementBasedDynamicRowHeight) {
            this._renderer.setStyle(this._ngEl.nativeElement, 'height', (maxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + 'px');
        }
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._getMaxRow = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var itemsRows = Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) {
            /** @type {?} */
            var item = _this._items.get(itemId);
            if (!item)
                return 0;
            return item.row + item.sizey - 1;
        }));
        return Math.max.apply(null, itemsRows);
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._getMaxCol = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var itemsCols = Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) {
            /** @type {?} */
            var item = _this._items.get(itemId);
            if (!item)
                return 0;
            return item.col + item.sizex - 1;
        }));
        return Math.max.apply(null, itemsCols);
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._getMousePosition = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if ((((/** @type {?} */ (window))).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        /** @type {?} */
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        /** @type {?} */
        var left = e.clientX - refPos.left;
        /** @type {?} */
        var top = e.clientY - refPos.top;
        if (this.cascade == 'down')
            top = refPos.top + refPos.height - e.clientY;
        if (this.cascade == 'right')
            left = refPos.left + refPos.width - e.clientX;
        if (this.isDragging && this._zoomOnDrag) {
            left *= 2;
            top *= 2;
        }
        return {
            left: left,
            top: top
        };
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    NgGrid.prototype._getAbsoluteMousePosition = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if ((((/** @type {?} */ (window))).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        return {
            left: e.clientX,
            top: e.clientY
        };
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._getContainerColumns = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        /** @type {?} */
        var itemWidth = this.colWidth + this.marginLeft + this.marginRight;
        return Math.floor(maxWidth / itemWidth);
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._getContainerRows = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
        return Math.floor(maxHeight / (this.rowHeight + this.marginTop + this.marginBottom));
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._getScreenMargin = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        /** @type {?} */
        var itemWidth = this.colWidth + this.marginLeft + this.marginRight;
        return Math.floor((maxWidth - (this._maxCols * itemWidth)) / 2);
        ;
    };
    /**
     * @private
     * @param {?} position
     * @return {?}
     */
    NgGrid.prototype._getItemFromPosition = /**
     * @private
     * @param {?} position
     * @return {?}
     */
    function (position) {
        var _this = this;
        return Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) { return _this._items.get(itemId); })).find((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (!item)
                return false;
            /** @type {?} */
            var size = item.getDimensions();
            /** @type {?} */
            var pos = item.getPosition();
            return position.left >= pos.left && position.left < (pos.left + size.width) &&
                position.top >= pos.top && position.top < (pos.top + size.height);
        }));
    };
    /**
     * @private
     * @param {?} item
     * @return {?}
     */
    NgGrid.prototype._createPlaceholder = /**
     * @private
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var pos = item.getGridPosition();
        /** @type {?} */
        var dims = item.getSize();
        /** @type {?} */
        var factory = this.componentFactoryResolver.resolveComponentFactory(NgGridPlaceholder);
        /** @type {?} */
        var componentRef = item.containerRef.createComponent(factory);
        this._placeholderRef = componentRef;
        /** @type {?} */
        var placeholder = componentRef.instance;
        placeholder.registerGrid(this);
        placeholder.setCascadeMode(this.cascade);
        placeholder.setGridPosition({ col: pos.col, row: pos.row });
        placeholder.setSize({ x: dims.x, y: dims.y });
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._emitOnItemChange = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var itemOutput = Array.from(this._itemsInGrid)
            .map((/**
         * @param {?} itemId
         * @return {?}
         */
        function (itemId) { return _this._items.get(itemId); }))
            .filter((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return !!item; }))
            .map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item.getEventOutput(); }));
        this.onItemChange.emit(itemOutput);
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._defineListeners = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var element = this._ngEl.nativeElement;
        this._documentMousemove$ = fromEvent(document, 'mousemove');
        this._documentMouseup$ = fromEvent(document, 'mouseup');
        this._mousedown$ = fromEvent(element, 'mousedown');
        this._mousemove$ = fromEvent(element, 'mousemove');
        this._mouseup$ = fromEvent(element, 'mouseup');
        this._touchstart$ = fromEvent(element, 'touchstart');
        this._touchmove$ = fromEvent(element, 'touchmove');
        this._touchend$ = fromEvent(element, 'touchend');
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._enableListeners = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._enabledListener) {
            return;
        }
        this._enableMouseListeners();
        if (this._isTouchDevice()) {
            this._enableTouchListeners();
        }
        this._enabledListener = true;
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._disableListeners = /**
     * @private
     * @return {?}
     */
    function () {
        this._subscriptions.forEach((/**
         * @param {?} subs
         * @return {?}
         */
        function (subs) { return subs.unsubscribe(); }));
        this._enabledListener = false;
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._isTouchDevice = /**
     * @private
     * @return {?}
     */
    function () {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    ;
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._enableTouchListeners = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var touchstartSubs = this._touchstart$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseDownEventHandler(e); }));
        /** @type {?} */
        var touchmoveSubs = this._touchmove$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseMoveEventHandler(e); }));
        /** @type {?} */
        var touchendSubs = this._touchend$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseUpEventHandler(e); }));
        this._subscriptions.push(touchstartSubs, touchmoveSubs, touchendSubs);
    };
    /**
     * @private
     * @return {?}
     */
    NgGrid.prototype._enableMouseListeners = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var documentMousemoveSubs = this._documentMousemove$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseMoveEventHandler(e); }));
        /** @type {?} */
        var documentMouseupSubs = this._documentMouseup$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseUpEventHandler(e); }));
        /** @type {?} */
        var mousedownSubs = this._mousedown$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseDownEventHandler(e); }));
        /** @type {?} */
        var mousemoveSubs = this._mousemove$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseMoveEventHandler(e); }));
        /** @type {?} */
        var mouseupSubs = this._mouseup$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.mouseUpEventHandler(e); }));
        this._subscriptions.push(documentMousemoveSubs, documentMouseupSubs, mousedownSubs, mousemoveSubs, mouseupSubs);
    };
    NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS = [
        'bottomright',
        'bottomleft',
        'topright',
        'topleft',
        'right',
        'left',
        'bottom',
        'top',
    ];
    // Default config
    NgGrid.CONST_DEFAULT_CONFIG = {
        margins: [10],
        draggable: true,
        resizable: true,
        max_cols: 0,
        max_rows: 0,
        visible_cols: 0,
        visible_rows: 0,
        col_width: 250,
        row_height: 250,
        cascade: 'up',
        min_width: 100,
        min_height: 100,
        fix_to_grid: false,
        auto_style: true,
        auto_resize: false,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false,
        limit_to_screen: false,
        center_to_screen: false,
        resize_directions: NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS,
        element_based_row_height: false,
        fix_item_position_direction: 'cascade',
        fix_collision_position_direction: 'cascade',
        allow_overlap: false,
    };
    NgGrid.decorators = [
        { type: Directive, args: [{
                    selector: '[ngGrid]',
                    inputs: ['config: ngGrid'],
                    host: {
                        '(window:resize)': 'resizeEventHandler($event)',
                    }
                },] }
    ];
    /** @nocollapse */
    NgGrid.ctorParameters = function () { return [
        { type: KeyValueDiffers },
        { type: ElementRef },
        { type: Renderer2 },
        { type: ComponentFactoryResolver }
    ]; };
    NgGrid.propDecorators = {
        onDragStart: [{ type: Output }],
        onDrag: [{ type: Output }],
        onDragStop: [{ type: Output }],
        onResizeStart: [{ type: Output }],
        onResize: [{ type: Output }],
        onResizeStop: [{ type: Output }],
        onItemChange: [{ type: Output }]
    };
    return NgGrid;
}());
export { NgGrid };
if (false) {
    /** @type {?} */
    NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS;
    /**
     * @type {?}
     * @private
     */
    NgGrid.CONST_DEFAULT_CONFIG;
    /** @type {?} */
    NgGrid.prototype.onDragStart;
    /** @type {?} */
    NgGrid.prototype.onDrag;
    /** @type {?} */
    NgGrid.prototype.onDragStop;
    /** @type {?} */
    NgGrid.prototype.onResizeStart;
    /** @type {?} */
    NgGrid.prototype.onResize;
    /** @type {?} */
    NgGrid.prototype.onResizeStop;
    /** @type {?} */
    NgGrid.prototype.onItemChange;
    /** @type {?} */
    NgGrid.prototype.colWidth;
    /** @type {?} */
    NgGrid.prototype.rowHeight;
    /** @type {?} */
    NgGrid.prototype.minCols;
    /** @type {?} */
    NgGrid.prototype.minRows;
    /** @type {?} */
    NgGrid.prototype.marginTop;
    /** @type {?} */
    NgGrid.prototype.marginRight;
    /** @type {?} */
    NgGrid.prototype.marginBottom;
    /** @type {?} */
    NgGrid.prototype.marginLeft;
    /** @type {?} */
    NgGrid.prototype.screenMargin;
    /** @type {?} */
    NgGrid.prototype.isDragging;
    /** @type {?} */
    NgGrid.prototype.isResizing;
    /** @type {?} */
    NgGrid.prototype.autoStyle;
    /** @type {?} */
    NgGrid.prototype.resizeEnable;
    /** @type {?} */
    NgGrid.prototype.dragEnable;
    /** @type {?} */
    NgGrid.prototype.cascade;
    /** @type {?} */
    NgGrid.prototype.minWidth;
    /** @type {?} */
    NgGrid.prototype.minHeight;
    /** @type {?} */
    NgGrid.prototype.resizeDirections;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._items;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._draggingItem;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._resizingItem;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._resizeDirection;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._itemsInGrid;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._containerWidth;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._containerHeight;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._maxCols;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._maxRows;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._visibleCols;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._visibleRows;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._setWidth;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._setHeight;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._posOffset;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._adding;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._placeholderRef;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._fixToGrid;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._autoResize;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._differ;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._destroyed;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._maintainRatio;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._aspectRatio;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._preferNew;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._zoomOnDrag;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._limitToScreen;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._centerToScreen;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._curMaxRow;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._curMaxCol;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._dragReady;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._resizeReady;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._elementBasedDynamicRowHeight;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._itemFixDirection;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._collisionFixDirection;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._allowOverlap;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._cascadePromise;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._lastZValue;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._documentMousemove$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._documentMouseup$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._mousedown$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._mousemove$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._mouseup$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._touchstart$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._touchmove$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._touchend$;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._subscriptions;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._enabledListener;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._config;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._differs;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._ngEl;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    NgGrid.prototype.componentFactoryResolver;
    /* Skipping unhandled member: ;*/
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmdHcmlkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZ3JpZC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvTmdHcmlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBYSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsd0JBQXdCLEVBQStELGVBQWUsRUFBZ0QsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3hQLE9BQU8sS0FBSyxZQUFZLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUE0QixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0Q7SUFnSkksY0FBYztJQUNkLGdCQUNZLFFBQXlCLEVBQ3pCLEtBQWlCLEVBQ2pCLFNBQW9CLEVBQ3BCLHdCQUFrRDtRQUhsRCxhQUFRLEdBQVIsUUFBUSxDQUFpQjtRQUN6QixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjs7UUFqSTdDLGdCQUFXLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7UUFDdkUsV0FBTSxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO1FBQ2xFLGVBQVUsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUN0RSxrQkFBYSxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO1FBQ3pFLGFBQVEsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUNwRSxpQkFBWSxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO1FBQ3hFLGlCQUFZLEdBQXlDLElBQUksWUFBWSxFQUEwQixDQUFDOztRQUcxRyxhQUFRLEdBQVcsR0FBRyxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxHQUFHLENBQUM7UUFDeEIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixZQUFPLEdB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NEJBQW9DOzs7OztJQUNwQyxnQ0FBd0M7Ozs7O0lBQ3hDLDhCQUE2Qjs7Ozs7SUFDN0IsNEJBQW9DOzs7OztJQUNwQyw2QkFBcUM7Ozs7O0lBQ3JDLGdDQUF3Qzs7Ozs7SUFDeEMsaUNBQXlDOzs7OztJQUN6Qyw0QkFBK0I7Ozs7O0lBQy9CLDRCQUErQjs7Ozs7SUFDL0IsNEJBQW9DOzs7OztJQUNwQyw4QkFBc0M7Ozs7O0lBQ3RDLCtDQUF1RDs7Ozs7SUFDdkQsbUNBQTREOzs7OztJQUM1RCx3Q0FBaUU7Ozs7O0lBQ2pFLCtCQUF1Qzs7Ozs7SUFDdkMsaUNBQXVDOzs7OztJQUN2Qyw2QkFBZ0M7Ozs7O0lBR2hDLHFDQUFvRDs7Ozs7SUFDcEQsbUNBQWtEOzs7OztJQUNsRCw2QkFBNEM7Ozs7O0lBQzVDLDZCQUE0Qzs7Ozs7SUFDNUMsMkJBQTBDOzs7OztJQUMxQyw4QkFBNkM7Ozs7O0lBQzdDLDZCQUE0Qzs7Ozs7SUFDNUMsNEJBQTJDOzs7OztJQUMzQyxnQ0FBNEM7Ozs7O0lBRTVDLGtDQUEwQzs7Ozs7SUE4QjFDLHlCQUE4Qzs7Ozs7SUFtQjFDLDBCQUFpQzs7Ozs7SUFDakMsdUJBQXlCOzs7OztJQUN6QiwyQkFBNEI7Ozs7O0lBQzVCLDBDQUEwRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIEV2ZW50RW1pdHRlciwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBIb3N0LCBWaWV3RW5jYXBzdWxhdGlvbiwgVHlwZSwgQ29tcG9uZW50UmVmLCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJzLCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjaywgVmlld0NvbnRhaW5lclJlZiwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0dyaWRDb25maWcsIE5nR3JpZEl0ZW1FdmVudCwgTmdHcmlkSXRlbVBvc2l0aW9uLCBOZ0dyaWRJdGVtU2l6ZSwgTmdHcmlkUmF3UG9zaXRpb24sIE5nR3JpZEl0ZW1EaW1lbnNpb25zLCBOZ0NvbmZpZ0ZpeERpcmVjdGlvbiB9IGZyb20gJy4uL2ludGVyZmFjZXMvSU5nR3JpZCc7XG5pbXBvcnQgeyBOZ0dyaWRJdGVtIH0gZnJvbSAnLi9OZ0dyaWRJdGVtJztcbmltcG9ydCAqIGFzIE5nR3JpZEhlbHBlciBmcm9tICcuLi9oZWxwZXJzL05nR3JpZEhlbHBlcnMnO1xuaW1wb3J0IHsgTmdHcmlkUGxhY2Vob2xkZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL05nR3JpZFBsYWNlaG9sZGVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW25nR3JpZF0nLFxuICAgIGlucHV0czogWydjb25maWc6IG5nR3JpZCddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJyh3aW5kb3c6cmVzaXplKSc6ICdyZXNpemVFdmVudEhhbmRsZXIoJGV2ZW50KScsXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBOZ0dyaWQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gICAgcHVibGljIHN0YXRpYyBDT05TVF9ERUZBVUxUX1JFU0laRV9ESVJFQ1RJT05TOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2JvdHRvbXJpZ2h0JyxcbiAgICAgICAgJ2JvdHRvbWxlZnQnLFxuICAgICAgICAndG9wcmlnaHQnLFxuICAgICAgICAndG9wbGVmdCcsXG4gICAgICAgICdyaWdodCcsXG4gICAgICAgICdsZWZ0JyxcbiAgICAgICAgJ2JvdHRvbScsXG4gICAgICAgICd0b3AnLFxuICAgIF07XG5cbiAgICAvLyBFdmVudCBFbWl0dGVyc1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcbiAgICBAT3V0cHV0KCkgcHVibGljIG9uRHJhZzogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcbiAgICBAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25JdGVtQ2hhbmdlOiBFdmVudEVtaXR0ZXI8QXJyYXk8TmdHcmlkSXRlbUV2ZW50Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PE5nR3JpZEl0ZW1FdmVudD4+KCk7XG5cbiAgICAvLyBQdWJsaWMgdmFyaWFibGVzXG4gICAgcHVibGljIGNvbFdpZHRoOiBudW1iZXIgPSAyNTA7XG4gICAgcHVibGljIHJvd0hlaWdodDogbnVtYmVyID0gMjUwO1xuICAgIHB1YmxpYyBtaW5Db2xzOiBudW1iZXIgPSAxO1xuICAgIHB1YmxpYyBtaW5Sb3dzOiBudW1iZXIgPSAxO1xuICAgIHB1YmxpYyBtYXJnaW5Ub3A6IG51bWJlciA9IDEwO1xuICAgIHB1YmxpYyBtYXJnaW5SaWdodDogbnVtYmVyID0gMTA7XG4gICAgcHVibGljIG1hcmdpbkJvdHRvbTogbnVtYmVyID0gMTA7XG4gICAgcHVibGljIG1hcmdpbkxlZnQ6IG51bWJlciA9IDEwO1xuICAgIHB1YmxpYyBzY3JlZW5NYXJnaW46IG51bWJlciA9IDA7XG4gICAgcHVibGljIGlzRHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNSZXNpemluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBhdXRvU3R5bGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyByZXNpemVFbmFibGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBkcmFnRW5hYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgY2FzY2FkZTogc3RyaW5nID0gJ3VwJztcbiAgICBwdWJsaWMgbWluV2lkdGg6IG51bWJlciA9IDEwMDtcbiAgICBwdWJsaWMgbWluSGVpZ2h0OiBudW1iZXIgPSAxMDA7XG4gICAgcHVibGljIHJlc2l6ZURpcmVjdGlvbnM6IHN0cmluZ1tdID0gTmdHcmlkLkNPTlNUX0RFRkFVTFRfUkVTSVpFX0RJUkVDVElPTlM7XG5cbiAgICAvLyBQcml2YXRlIHZhcmlhYmxlc1xuICAgIHByaXZhdGUgX2l0ZW1zOiBNYXA8c3RyaW5nLCBOZ0dyaWRJdGVtPiA9IG5ldyBNYXA8c3RyaW5nLCBOZ0dyaWRJdGVtPigpO1xuICAgIHByaXZhdGUgX2RyYWdnaW5nSXRlbTogTmdHcmlkSXRlbSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfcmVzaXppbmdJdGVtOiBOZ0dyaWRJdGVtID0gbnVsbDtcbiAgICBwcml2YXRlIF9yZXNpemVEaXJlY3Rpb246IHN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfaXRlbXNJbkdyaWQ6IFNldDxzdHJpbmc+ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgcHJpdmF0ZSBfY29udGFpbmVyV2lkdGg6IG51bWJlcjtcbiAgICBwcml2YXRlIF9jb250YWluZXJIZWlnaHQ6IG51bWJlcjtcbiAgICBwcml2YXRlIF9tYXhDb2xzOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX21heFJvd3M6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfdmlzaWJsZUNvbHM6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfdmlzaWJsZVJvd3M6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfc2V0V2lkdGg6IG51bWJlciA9IDI1MDtcbiAgICBwcml2YXRlIF9zZXRIZWlnaHQ6IG51bWJlciA9IDI1MDtcbiAgICBwcml2YXRlIF9wb3NPZmZzZXQ6IE5nR3JpZFJhd1Bvc2l0aW9uID0gbnVsbDtcbiAgICBwcml2YXRlIF9hZGRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9wbGFjZWhvbGRlclJlZjogQ29tcG9uZW50UmVmPE5nR3JpZFBsYWNlaG9sZGVyPiA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZml4VG9HcmlkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfYXV0b1Jlc2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2RpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuICAgIHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX21haW50YWluUmF0aW86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9hc3BlY3RSYXRpbzogbnVtYmVyO1xuICAgIHByaXZhdGUgX3ByZWZlck5ldzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3pvb21PbkRyYWc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9saW1pdFRvU2NyZWVuOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfY2VudGVyVG9TY3JlZW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9jdXJNYXhSb3c6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfY3VyTWF4Q29sOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX2RyYWdSZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3Jlc2l6ZVJlYWR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfZWxlbWVudEJhc2VkRHluYW1pY1Jvd0hlaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2l0ZW1GaXhEaXJlY3Rpb246IE5nQ29uZmlnRml4RGlyZWN0aW9uID0gJ2Nhc2NhZGUnO1xuICAgIHByaXZhdGUgX2NvbGxpc2lvbkZpeERpcmVjdGlvbjogTmdDb25maWdGaXhEaXJlY3Rpb24gPSAnY2FzY2FkZSc7XG4gICAgcHJpdmF0ZSBfYWxsb3dPdmVybGFwOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfY2FzY2FkZVByb21pc2U6IFByb21pc2U8dm9pZD47XG4gICAgcHJpdmF0ZSBfbGFzdFpWYWx1ZTogbnVtYmVyID0gMTtcblxuICAgIC8vIEV2ZW50c1xuICAgIHByaXZhdGUgX2RvY3VtZW50TW91c2Vtb3ZlJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgICBwcml2YXRlIF9kb2N1bWVudE1vdXNldXAkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICAgIHByaXZhdGUgX21vdXNlZG93biQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gICAgcHJpdmF0ZSBfbW91c2Vtb3ZlJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgICBwcml2YXRlIF9tb3VzZXVwJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgICBwcml2YXRlIF90b3VjaHN0YXJ0JDogT2JzZXJ2YWJsZTxUb3VjaEV2ZW50PjtcbiAgICBwcml2YXRlIF90b3VjaG1vdmUkOiBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+O1xuICAgIHByaXZhdGUgX3RvdWNoZW5kJDogT2JzZXJ2YWJsZTxUb3VjaEV2ZW50PjtcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSBfZW5hYmxlZExpc3RlbmVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvLyBEZWZhdWx0IGNvbmZpZ1xuICAgIHByaXZhdGUgc3RhdGljIENPTlNUX0RFRkFVTFRfQ09ORklHOiBOZ0dyaWRDb25maWcgPSB7XG4gICAgICAgIG1hcmdpbnM6IFsxMF0sXG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBtYXhfY29sczogMCxcbiAgICAgICAgbWF4X3Jvd3M6IDAsXG4gICAgICAgIHZpc2libGVfY29sczogMCxcbiAgICAgICAgdmlzaWJsZV9yb3dzOiAwLFxuICAgICAgICBjb2xfd2lkdGg6IDI1MCxcbiAgICAgICAgcm93X2hlaWdodDogMjUwLFxuICAgICAgICBjYXNjYWRlOiAndXAnLFxuICAgICAgICBtaW5fd2lkdGg6IDEwMCxcbiAgICAgICAgbWluX2hlaWdodDogMTAwLFxuICAgICAgICBmaXhfdG9fZ3JpZDogZmFsc2UsXG4gICAgICAgIGF1dG9fc3R5bGU6IHRydWUsXG4gICAgICAgIGF1dG9fcmVzaXplOiBmYWxzZSxcbiAgICAgICAgbWFpbnRhaW5fcmF0aW86IGZhbHNlLFxuICAgICAgICBwcmVmZXJfbmV3OiBmYWxzZSxcbiAgICAgICAgem9vbV9vbl9kcmFnOiBmYWxzZSxcbiAgICAgICAgbGltaXRfdG9fc2NyZWVuOiBmYWxzZSxcbiAgICAgICAgY2VudGVyX3RvX3NjcmVlbjogZmFsc2UsXG4gICAgICAgIHJlc2l6ZV9kaXJlY3Rpb25zOiBOZ0dyaWQuQ09OU1RfREVGQVVMVF9SRVNJWkVfRElSRUNUSU9OUyxcbiAgICAgICAgZWxlbWVudF9iYXNlZF9yb3dfaGVpZ2h0OiBmYWxzZSxcbiAgICAgICAgZml4X2l0ZW1fcG9zaXRpb25fZGlyZWN0aW9uOiAnY2FzY2FkZScsXG4gICAgICAgIGZpeF9jb2xsaXNpb25fcG9zaXRpb25fZGlyZWN0aW9uOiAnY2FzY2FkZScsXG4gICAgICAgIGFsbG93X292ZXJsYXA6IGZhbHNlLFxuICAgIH07XG4gICAgcHJpdmF0ZSBfY29uZmlnID0gTmdHcmlkLkNPTlNUX0RFRkFVTFRfQ09ORklHO1xuXG4gICAgLy8gW25nLWdyaWRdIGF0dHJpYnV0ZSBoYW5kbGVyXG4gICAgc2V0IGNvbmZpZyh2OiBOZ0dyaWRDb25maWcpIHtcbiAgICAgICAgaWYgKHYgPT0gbnVsbCB8fCB0eXBlb2YgdiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q29uZmlnKHYpO1xuXG4gICAgICAgIGlmICh0aGlzLl9kaWZmZXIgPT0gbnVsbCAmJiB2ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh0aGlzLl9jb25maWcpLmNyZWF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5fY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIF9kaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG4gICAgICAgIHByaXZhdGUgX25nRWw6IEVsZW1lbnRSZWYsXG4gICAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgKSB7XG4gICAgICAgIHRoaXMuX2RlZmluZUxpc3RlbmVycygpO1xuICAgIH1cblxuICAgIC8vIFB1YmxpYyBtZXRob2RzXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdncmlkJyk7XG4gICAgICAgIGlmICh0aGlzLmF1dG9TdHlsZSkgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgICAgdGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVJdGVtVWlkKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHVpZDogc3RyaW5nID0gTmdHcmlkSGVscGVyLmdlbmVyYXRlVXVpZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9pdGVtcy5oYXModWlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVJdGVtVWlkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdWlkO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBOZ0dyaWRDb25maWcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIHZhciBtYXhDb2xSb3dDaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIHggaW4gY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gY29uZmlnW3hdO1xuICAgICAgICAgICAgdmFyIGludFZhbCA9ICF2YWwgPyAwIDogcGFyc2VJbnQodmFsKTtcblxuICAgICAgICAgICAgc3dpdGNoICh4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWFyZ2lucyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TWFyZ2lucyh2YWwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjb2xfd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbFdpZHRoID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncm93X2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93SGVpZ2h0ID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYXV0b19zdHlsZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b1N0eWxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhdXRvX3Jlc2l6ZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9SZXNpemUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RyYWdnYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0VuYWJsZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncmVzaXphYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemVFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21heF9yb3dzJzpcbiAgICAgICAgICAgICAgICAgICAgbWF4Q29sUm93Q2hhbmdlZCA9IG1heENvbFJvd0NoYW5nZWQgfHwgdGhpcy5fbWF4Um93cyAhPSBpbnRWYWw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21heFJvd3MgPSBpbnRWYWwgPCAwID8gMCA6IGludFZhbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWF4X2NvbHMnOlxuICAgICAgICAgICAgICAgICAgICBtYXhDb2xSb3dDaGFuZ2VkID0gbWF4Q29sUm93Q2hhbmdlZCB8fCB0aGlzLl9tYXhDb2xzICE9IGludFZhbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4Q29scyA9IGludFZhbCA8IDAgPyAwIDogaW50VmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd2aXNpYmxlX3Jvd3MnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aXNpYmxlUm93cyA9IE1hdGgubWF4KGludFZhbCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Zpc2libGVfY29scyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Zpc2libGVDb2xzID0gTWF0aC5tYXgoaW50VmFsLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWluX3Jvd3MnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pblJvd3MgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtaW5fY29scyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluQ29scyA9IE1hdGgubWF4KGludFZhbCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbl9oZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkhlaWdodCA9IE1hdGgubWF4KGludFZhbCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbl93aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluV2lkdGggPSBNYXRoLm1heChpbnRWYWwsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd6b29tX29uX2RyYWcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl96b29tT25EcmFnID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjYXNjYWRlJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FzY2FkZSAhPSB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FzY2FkZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc2NhZGVHcmlkKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZml4X3RvX2dyaWQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maXhUb0dyaWQgPSB2YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21haW50YWluX3JhdGlvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFpbnRhaW5SYXRpbyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncHJlZmVyX25ldyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZWZlck5ldyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGltaXRfdG9fc2NyZWVuJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGltaXRUb1NjcmVlbiA9ICF0aGlzLl9hdXRvUmVzaXplICYmICEhdmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGltaXRUb1NjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21heENvbHMgPSB0aGlzLl9nZXRDb250YWluZXJDb2x1bW5zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2VudGVyX3RvX3NjcmVlbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NlbnRlclRvU2NyZWVuID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyZXNpemVfZGlyZWN0aW9ucyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplRGlyZWN0aW9ucyA9IHZhbCB8fCBbJ2JvdHRvbXJpZ2h0JywgJ2JvdHRvbWxlZnQnLCAndG9wcmlnaHQnLCAndG9wbGVmdCcsICdyaWdodCcsICdsZWZ0JywgJ2JvdHRvbScsICd0b3AnXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZWxlbWVudF9iYXNlZF9yb3dfaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudEJhc2VkRHluYW1pY1Jvd0hlaWdodCA9ICEhdmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdmaXhfaXRlbV9wb3NpdGlvbl9kaXJlY3Rpb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pdGVtRml4RGlyZWN0aW9uID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdmaXhfY29sbGlzaW9uX3Bvc2l0aW9uX2RpcmVjdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbkZpeERpcmVjdGlvbiA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWxsb3dfb3ZlcmxhcCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FsbG93T3ZlcmxhcCA9ICEhdmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9hbGxvd092ZXJsYXAgJiYgdGhpcy5jYXNjYWRlICE9PSAnb2ZmJyAmJiB0aGlzLmNhc2NhZGUgIT09ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuYWJsZSB0byBvdmVybGFwIGl0ZW1zIHdoZW4gYSBjYXNjYWRlIGRpcmVjdGlvbiBpcyBzZXQuJyk7XG4gICAgICAgICAgICB0aGlzLl9hbGxvd092ZXJsYXAgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRyYWdFbmFibGUgfHwgdGhpcy5yZXNpemVFbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZUxpc3RlbmVycygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZUxpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1GaXhEaXJlY3Rpb24gPT09ICdjYXNjYWRlJykge1xuICAgICAgICAgICAgdGhpcy5faXRlbUZpeERpcmVjdGlvbiA9IHRoaXMuX2dldEZpeERpcmVjdGlvbkZyb21DYXNjYWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fY29sbGlzaW9uRml4RGlyZWN0aW9uID09PSAnY2FzY2FkZScpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbkZpeERpcmVjdGlvbiA9IHRoaXMuX2dldEZpeERpcmVjdGlvbkZyb21DYXNjYWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbGltaXRUb1NjcmVlbikge1xuICAgICAgICAgICAgY29uc3QgbmV3TWF4Q29scyA9IHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX21heENvbHMgIT0gbmV3TWF4Q29scykge1xuICAgICAgICAgICAgICAgIHRoaXMuX21heENvbHMgPSBuZXdNYXhDb2xzO1xuICAgICAgICAgICAgICAgIG1heENvbFJvd0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2xpbWl0VG9TY3JlZW4gJiYgdGhpcy5fY2VudGVyVG9TY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2NyZWVuTWFyZ2luID0gdGhpcy5fZ2V0U2NyZWVuTWFyZ2luKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjcmVlbk1hcmdpbiA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbWFpbnRhaW5SYXRpbykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29sV2lkdGggJiYgdGhpcy5yb3dIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IHRoaXMuY29sV2lkdGggLyB0aGlzLnJvd0hlaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFpbnRhaW5SYXRpbyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1heENvbFJvd0NoYW5nZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl9tYXhSb3dzID4gMCkgeyAgICAvLyAgICBDYW4ndCBoYXZlIGJvdGgsIHByaW9yaXRpc2Ugb24gY2FzY2FkZVxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXhDb2xzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4Um93cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uc0FmdGVyTWF4Q2hhbmdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVDb2xXaWR0aCgpO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVSb3dIZWlnaHQoKTtcblxuICAgICAgICB2YXIgbWF4V2lkdGggPSB0aGlzLl9tYXhDb2xzICogdGhpcy5jb2xXaWR0aDtcbiAgICAgICAgdmFyIG1heEhlaWdodCA9IHRoaXMuX21heFJvd3MgKiB0aGlzLnJvd0hlaWdodDtcblxuICAgICAgICBpZiAobWF4V2lkdGggPiAwICYmIHRoaXMubWluV2lkdGggPiBtYXhXaWR0aCkgdGhpcy5taW5XaWR0aCA9IDAuNzUgKiB0aGlzLmNvbFdpZHRoO1xuICAgICAgICBpZiAobWF4SGVpZ2h0ID4gMCAmJiB0aGlzLm1pbkhlaWdodCA+IG1heEhlaWdodCkgdGhpcy5taW5IZWlnaHQgPSAwLjc1ICogdGhpcy5yb3dIZWlnaHQ7XG5cbiAgICAgICAgaWYgKHRoaXMubWluV2lkdGggPiB0aGlzLmNvbFdpZHRoKSB0aGlzLm1pbkNvbHMgPSBNYXRoLm1heCh0aGlzLm1pbkNvbHMsIE1hdGguY2VpbCh0aGlzLm1pbldpZHRoIC8gdGhpcy5jb2xXaWR0aCkpO1xuICAgICAgICBpZiAodGhpcy5taW5IZWlnaHQgPiB0aGlzLnJvd0hlaWdodCkgdGhpcy5taW5Sb3dzID0gTWF0aC5tYXgodGhpcy5taW5Sb3dzLCBNYXRoLmNlaWwodGhpcy5taW5IZWlnaHQgLyB0aGlzLnJvd0hlaWdodCkpO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLm1pbkNvbHMgPiB0aGlzLl9tYXhDb2xzKSB0aGlzLm1pbkNvbHMgPSAxO1xuICAgICAgICBpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5taW5Sb3dzID4gdGhpcy5fbWF4Um93cykgdGhpcy5taW5Sb3dzID0gMTtcblxuICAgICAgICB0aGlzLl91cGRhdGVSYXRpbygpO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1zLmZvckVhY2goKGl0ZW06IE5nR3JpZEl0ZW0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xuICAgICAgICAgICAgaXRlbS5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xuICAgICAgICAgICAgdGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jYXNjYWRlR3JpZCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEl0ZW1Qb3NpdGlvbihpdGVtSWQ6IHN0cmluZyk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5oYXMoaXRlbUlkKSA/IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpLmdldEdyaWRQb3NpdGlvbigpIDogbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SXRlbVNpemUoaXRlbUlkOiBzdHJpbmcpOiBOZ0dyaWRJdGVtU2l6ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5oYXMoaXRlbUlkKSA/IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpLmdldFNpemUoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIG5nRG9DaGVjaygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX2RpZmZlciAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlcyA9IHRoaXMuX2RpZmZlci5kaWZmKHRoaXMuX2NvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmIChjaGFuZ2VzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUNoYW5nZXMoY2hhbmdlcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TWFyZ2lucyhtYXJnaW5zOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XG4gICAgICAgIHRoaXMubWFyZ2luVG9wID0gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1swXSksIDApO1xuICAgICAgICB0aGlzLm1hcmdpblJpZ2h0ID0gbWFyZ2lucy5sZW5ndGggPj0gMiA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMV0pLCAwKSA6IHRoaXMubWFyZ2luVG9wO1xuICAgICAgICB0aGlzLm1hcmdpbkJvdHRvbSA9IG1hcmdpbnMubGVuZ3RoID49IDMgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzJdKSwgMCkgOiB0aGlzLm1hcmdpblRvcDtcbiAgICAgICAgdGhpcy5tYXJnaW5MZWZ0ID0gbWFyZ2lucy5sZW5ndGggPj0gNCA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbM10pLCAwKSA6IHRoaXMubWFyZ2luUmlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGVuYWJsZURyYWcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhZ0VuYWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGRpc2FibGVEcmFnKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRyYWdFbmFibGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5hYmxlUmVzaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc2l6ZUVuYWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGRpc2FibGVSZXNpemUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplRW5hYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XG4gICAgICAgIG5nSXRlbS5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xuXG4gICAgICAgIGlmICghdGhpcy5fcHJlZmVyTmV3KSB7XG4gICAgICAgICAgICB2YXIgbmV3UG9zID0gdGhpcy5fZml4R3JpZFBvc2l0aW9uKG5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKSwgbmdJdGVtLmdldFNpemUoKSk7XG4gICAgICAgICAgICBuZ0l0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmdJdGVtLnVpZCA9PT0gbnVsbCB8fCB0aGlzLl9pdGVtcy5oYXMobmdJdGVtLnVpZCkpIHtcbiAgICAgICAgICAgIG5nSXRlbS51aWQgPSB0aGlzLmdlbmVyYXRlSXRlbVVpZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faXRlbXMuc2V0KG5nSXRlbS51aWQsIG5nSXRlbSk7XG4gICAgICAgIHRoaXMuX2FkZFRvR3JpZChuZ0l0ZW0pO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcblxuICAgICAgICB0aGlzLnRyaWdnZXJDYXNjYWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBuZ0l0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XG4gICAgICAgICAgICBuZ0l0ZW0ub25DYXNjYWRlRXZlbnQoKTtcblxuICAgICAgICAgICAgdGhpcy5fZW1pdE9uSXRlbUNoYW5nZSgpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW1vdmVGcm9tR3JpZChuZ0l0ZW0pO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1zLmRlbGV0ZShuZ0l0ZW0udWlkKTtcblxuICAgICAgICBpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyQ2FzY2FkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU2l6ZSgpO1xuICAgICAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5yZWNhbGN1bGF0ZVNlbGYoKSk7XG4gICAgICAgICAgICB0aGlzLl9lbWl0T25JdGVtQ2hhbmdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW1vdmVGcm9tR3JpZChuZ0l0ZW0pO1xuICAgICAgICB0aGlzLl9hZGRUb0dyaWQobmdJdGVtKTtcblxuICAgICAgICB0aGlzLnRyaWdnZXJDYXNjYWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG4gICAgICAgICAgICBuZ0l0ZW0ub25DYXNjYWRlRXZlbnQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaWdnZXJDYXNjYWRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIXRoaXMuX2Nhc2NhZGVQcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXNjYWRlUHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc2NhZGVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzY2FkZUdyaWQobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc2NhZGVQcm9taXNlO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmlnZ2VyUmVzaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc2l6ZUV2ZW50SGFuZGxlcihudWxsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzaXplRXZlbnRIYW5kbGVyKGU6IGFueSk6IHZvaWQge1xuICAgICAgICAvLyB0aGlzLl9jYWxjdWxhdGVDb2xXaWR0aCgpO1xuICAgICAgICAvLyB0aGlzLl9jYWxjdWxhdGVSb3dIZWlnaHQoKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gdGhpcy5fdXBkYXRlUmF0aW8oKTtcblxuICAgICAgICBpZiAodGhpcy5fbGltaXRUb1NjcmVlbikge1xuICAgICAgICAgICAgY29uc3QgbmV3TWF4Q29sdW1ucyA9IHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhDb2xzICE9PSBuZXdNYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4Q29scyA9IG5ld01heENvbHVtbnM7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fdXBkYXRlUG9zaXRpb25zQWZ0ZXJNYXhDaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9jYXNjYWRlR3JpZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2VudGVyVG9TY3JlZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbk1hcmdpbiA9IHRoaXMuX2dldFNjcmVlbk1hcmdpbigpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCgoaXRlbTogTmdHcmlkSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1zLmZvckVhY2goKGl0ZW06IE5nR3JpZEl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLl91cGRhdGVTaXplKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG1vdXNlRG93bkV2ZW50SGFuZGxlcihlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IHZvaWQge1xuICAgICAgICB2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xuXG4gICAgICAgIGlmIChpdGVtID09IG51bGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZXNpemVEaXJlY3Rpb246IHN0cmluZyA9IGl0ZW0uY2FuUmVzaXplKGUpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZUVuYWJsZSAmJiByZXNpemVEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZVJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICB0aGlzLl9yZXNpemVEaXJlY3Rpb24gPSByZXNpemVEaXJlY3Rpb247XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYWdFbmFibGUgJiYgaXRlbS5jYW5EcmFnKGUpKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtID0gaXRlbTtcblxuICAgICAgICAgICAgY29uc3QgaXRlbVBvcyA9IGl0ZW0uZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuX3Bvc09mZnNldCA9IHsgJ2xlZnQnOiAobW91c2VQb3MubGVmdCAtIGl0ZW1Qb3MubGVmdCksICd0b3AnOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3ApIH1cblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG1vdXNlVXBFdmVudEhhbmRsZXIoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhZ1N0b3AoZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemVTdG9wKGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2RyYWdSZWFkeSB8fCB0aGlzLl9yZXNpemVSZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5EcmFnKCk7XG4gICAgICAgICAgICB0aGlzLl9jbGVhblJlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG1vdXNlTW92ZUV2ZW50SGFuZGxlcihlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fcmVzaXplUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZVN0YXJ0KGUpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2RyYWdSZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0KGUpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy5fZHJhZyhlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZShlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGl0ZW0ub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAgICBQcml2YXRlIG1ldGhvZHNcbiAgICBwcml2YXRlIF9nZXRGaXhEaXJlY3Rpb25Gcm9tQ2FzY2FkZSgpOiBOZ0NvbmZpZ0ZpeERpcmVjdGlvbiB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XG4gICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgX3VwZGF0ZVBvc2l0aW9uc0FmdGVyTWF4Q2hhbmdlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiB7XG4gICAgICAgICAgICB2YXIgcG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgICAgIHZhciBkaW1zID0gaXRlbS5nZXRTaXplKCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpICYmIHRoaXMuX2lzV2l0aGluQm91bmRzKHBvcywgZGltcykgJiYgZGltcy54IDw9IHRoaXMuX21heENvbHMgJiYgZGltcy55IDw9IHRoaXMuX21heFJvd3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgZGltcy54ID4gdGhpcy5fbWF4Q29scykge1xuICAgICAgICAgICAgICAgIGRpbXMueCA9IHRoaXMuX21heENvbHM7XG4gICAgICAgICAgICAgICAgaXRlbS5zZXRTaXplKGRpbXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiBkaW1zLnkgPiB0aGlzLl9tYXhSb3dzKSB7XG4gICAgICAgICAgICAgICAgZGltcy55ID0gdGhpcy5fbWF4Um93cztcbiAgICAgICAgICAgICAgICBpdGVtLnNldFNpemUoZGltcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykgfHwgIXRoaXMuX2lzV2l0aGluQm91bmRzKHBvcywgZGltcywgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSB0aGlzLl9maXhHcmlkUG9zaXRpb24ocG9zLCBkaW1zKTtcbiAgICAgICAgICAgICAgICBpdGVtLnNldEdyaWRQb3NpdGlvbihuZXdQb3NpdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2FsY3VsYXRlQ29sV2lkdGgoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvUmVzaXplKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Q29scyA+IDAgfHwgdGhpcy5fdmlzaWJsZUNvbHMgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heENvbHMgPSB0aGlzLl9tYXhDb2xzID4gMCA/IHRoaXMuX21heENvbHMgOiB0aGlzLl92aXNpYmxlQ29scztcbiAgICAgICAgICAgICAgICB2YXIgbWF4V2lkdGg6IG51bWJlciA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblxuICAgICAgICAgICAgICAgIHZhciBjb2xXaWR0aDogbnVtYmVyID0gTWF0aC5mbG9vcihtYXhXaWR0aCAvIG1heENvbHMpO1xuICAgICAgICAgICAgICAgIGNvbFdpZHRoIC09ICh0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29sV2lkdGggPiAwKSB0aGlzLmNvbFdpZHRoID0gY29sV2lkdGg7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbFdpZHRoIDwgdGhpcy5taW5XaWR0aCB8fCB0aGlzLm1pbkNvbHMgPiB0aGlzLl9jb25maWcubWluX2NvbHMpIHtcbiAgICAgICAgICAgIHRoaXMubWluQ29scyA9IE1hdGgubWF4KHRoaXMuX2NvbmZpZy5taW5fY29scywgTWF0aC5jZWlsKHRoaXMubWluV2lkdGggLyB0aGlzLmNvbFdpZHRoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9jYWxjdWxhdGVSb3dIZWlnaHQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvUmVzaXplKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Um93cyA+IDAgfHwgdGhpcy5fdmlzaWJsZVJvd3MgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heFJvd3MgPSB0aGlzLl9tYXhSb3dzID4gMCA/IHRoaXMuX21heFJvd3MgOiB0aGlzLl92aXNpYmxlUm93cztcbiAgICAgICAgICAgICAgICBsZXQgbWF4SGVpZ2h0OiBudW1iZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZWxlbWVudEJhc2VkRHluYW1pY1Jvd0hlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1heEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRoaXMubWFyZ2luVG9wIC0gdGhpcy5tYXJnaW5Cb3R0b207XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHJvd0hlaWdodDogbnVtYmVyID0gTWF0aC5tYXgoTWF0aC5mbG9vcihtYXhIZWlnaHQgLyBtYXhSb3dzKSwgdGhpcy5taW5IZWlnaHQpO1xuICAgICAgICAgICAgICAgIHJvd0hlaWdodCAtPSAodGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSk7XG4gICAgICAgICAgICAgICAgaWYgKHJvd0hlaWdodCA+IDApIHRoaXMucm93SGVpZ2h0ID0gcm93SGVpZ2h0O1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yb3dIZWlnaHQgPCB0aGlzLm1pbkhlaWdodCB8fCB0aGlzLm1pblJvd3MgPiB0aGlzLl9jb25maWcubWluX3Jvd3MpIHtcbiAgICAgICAgICAgIHRoaXMubWluUm93cyA9IE1hdGgubWF4KHRoaXMuX2NvbmZpZy5taW5fcm93cywgTWF0aC5jZWlsKHRoaXMubWluSGVpZ2h0IC8gdGhpcy5yb3dIZWlnaHQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZVJhdGlvKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuX2F1dG9SZXNpemUgfHwgIXRoaXMuX21haW50YWluUmF0aW8pIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgdGhpcy5fdmlzaWJsZVJvd3MgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5yb3dIZWlnaHQgPSB0aGlzLmNvbFdpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5fdmlzaWJsZUNvbHMgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5jb2xXaWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5yb3dIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbWF4Q29scyA9PSAwICYmIHRoaXMuX21heFJvd3MgPT0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Zpc2libGVDb2xzID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucm93SGVpZ2h0ID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMuX2FzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl92aXNpYmxlUm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbFdpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLnJvd0hlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgY2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcbiAgICAgICAgY2hhbmdlcy5mb3JFYWNoQ2hhbmdlZEl0ZW0oKHJlY29yZDogYW55KSA9PiB7IHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XSA9IHJlY29yZC5jdXJyZW50VmFsdWU7IH0pO1xuICAgICAgICBjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgZGVsZXRlIHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XTsgfSk7XG5cbiAgICAgICAgdGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZXNpemVTdGFydChlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc2l6ZUVuYWJsZSB8fCAhdGhpcy5fcmVzaXppbmdJdGVtKSByZXR1cm47XG5cbiAgICAgICAgLy8gICAgU2V0dXBcbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnN0YXJ0TW92aW5nKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKHRoaXMuX3Jlc2l6aW5nSXRlbSk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKHRoaXMuX3Jlc2l6aW5nSXRlbSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2FsbG93T3ZlcmxhcCkge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnpJbmRleCA9IHRoaXMuX2xhc3RaVmFsdWUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICAgIFN0YXR1cyBGbGFnc1xuICAgICAgICB0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9yZXNpemVSZWFkeSA9IGZhbHNlO1xuXG4gICAgICAgIC8vICAgIEV2ZW50c1xuICAgICAgICB0aGlzLm9uUmVzaXplU3RhcnQuZW1pdCh0aGlzLl9yZXNpemluZ0l0ZW0pO1xuICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0ub25SZXNpemVTdGFydEV2ZW50KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhZ1N0YXJ0KGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ0VuYWJsZSB8fCAhdGhpcy5fZHJhZ2dpbmdJdGVtKSByZXR1cm47XG5cbiAgICAgICAgLy8gICAgU3RhcnQgZHJhZ2dpbmdcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLnN0YXJ0TW92aW5nKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKHRoaXMuX2RyYWdnaW5nSXRlbSk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKHRoaXMuX2RyYWdnaW5nSXRlbSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2FsbG93T3ZlcmxhcCkge1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLnpJbmRleCA9IHRoaXMuX2xhc3RaVmFsdWUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICAgIFN0YXR1cyBGbGFnc1xuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9kcmFnUmVhZHkgPSBmYWxzZTtcblxuICAgICAgICAvLyAgICBFdmVudHNcbiAgICAgICAgdGhpcy5vbkRyYWdTdGFydC5lbWl0KHRoaXMuX2RyYWdnaW5nSXRlbSk7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdTdGFydEV2ZW50KCk7XG5cbiAgICAgICAgLy8gICAgWm9vbVxuICAgICAgICBpZiAodGhpcy5fem9vbU9uRHJhZykge1xuICAgICAgICAgICAgdGhpcy5fem9vbU91dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfem9vbU91dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3NjYWxlKDAuNSwgMC41KScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Jlc2V0Wm9vbSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2RyYWcoZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgoPGFueT5kb2N1bWVudCkuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAoPGFueT5kb2N1bWVudCkuc2VsZWN0aW9uLmVtcHR5KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xuICAgICAgICB2YXIgbmV3TCA9IChtb3VzZVBvcy5sZWZ0IC0gdGhpcy5fcG9zT2Zmc2V0LmxlZnQpO1xuICAgICAgICB2YXIgbmV3VCA9IChtb3VzZVBvcy50b3AgLSB0aGlzLl9wb3NPZmZzZXQudG9wKTtcblxuICAgICAgICB2YXIgaXRlbVBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgdmFyIGdyaWRQb3MgPSB0aGlzLl9jYWxjdWxhdGVHcmlkUG9zaXRpb24obmV3TCwgbmV3VCk7XG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldFNpemUoKTtcblxuICAgICAgICBncmlkUG9zID0gdGhpcy5fZml4UG9zVG9Cb3VuZHNYKGdyaWRQb3MsIGRpbXMpO1xuXG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGdyaWRQb3MsIGRpbXMpKSB7XG4gICAgICAgICAgICBncmlkUG9zID0gdGhpcy5fZml4UG9zVG9Cb3VuZHNZKGdyaWRQb3MsIGRpbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdyaWRQb3MuY29sICE9IGl0ZW1Qb3MuY29sIHx8IGdyaWRQb3Mucm93ICE9IGl0ZW1Qb3Mucm93KSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0uc2V0R3JpZFBvc2l0aW9uKGdyaWRQb3MsIHRoaXMuX2ZpeFRvR3JpZCk7XG4gICAgICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclJlZi5pbnN0YW5jZS5zZXRHcmlkUG9zaXRpb24oZ3JpZFBvcyk7XG5cbiAgICAgICAgICAgIGlmIChbJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCddLmluZGV4T2YodGhpcy5jYXNjYWRlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZml4R3JpZENvbGxpc2lvbnMoZ3JpZFBvcywgZGltcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FzY2FkZUdyaWQoZ3JpZFBvcywgZGltcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2ZpeFRvR3JpZCkge1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLnNldFBvc2l0aW9uKG5ld0wsIG5ld1QpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkRyYWcuZW1pdCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xuICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0ub25EcmFnRXZlbnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZXNpemUoZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc1Jlc2l6aW5nKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbigpLmVtcHR5KSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLmVtcHR5KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoKDxhbnk+ZG9jdW1lbnQpLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgKDxhbnk+ZG9jdW1lbnQpLnNlbGVjdGlvbi5lbXB0eSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xuICAgICAgICBjb25zdCBpdGVtUG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGl0ZW1EaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldERpbWVuc2lvbnMoKTtcbiAgICAgICAgY29uc3QgZW5kQ29ybmVyID0ge1xuICAgICAgICAgICAgbGVmdDogaXRlbVBvcy5sZWZ0ICsgaXRlbURpbXMud2lkdGgsXG4gICAgICAgICAgICB0b3A6IGl0ZW1Qb3MudG9wICsgaXRlbURpbXMuaGVpZ2h0LFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzaXplVG9wID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uLmluY2x1ZGVzKCd0b3AnKTtcbiAgICAgICAgY29uc3QgcmVzaXplQm90dG9tID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uLmluY2x1ZGVzKCdib3R0b20nKTtcbiAgICAgICAgY29uc3QgcmVzaXplTGVmdCA9IHRoaXMuX3Jlc2l6ZURpcmVjdGlvbi5pbmNsdWRlcygnbGVmdCcpXG4gICAgICAgIGNvbnN0IHJlc2l6ZVJpZ2h0ID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uLmluY2x1ZGVzKCdyaWdodCcpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBuZXcgd2lkdGggYW5kIGhlaWdodCBiYXNlZCB1cG9uIHJlc2l6ZSBkaXJlY3Rpb25cbiAgICAgICAgbGV0IG5ld1cgPSByZXNpemVSaWdodFxuICAgICAgICAgICAgPyAobW91c2VQb3MubGVmdCAtIGl0ZW1Qb3MubGVmdCArIDEpXG4gICAgICAgICAgICA6IHJlc2l6ZUxlZnRcbiAgICAgICAgICAgICAgICA/IChlbmRDb3JuZXIubGVmdCAtIG1vdXNlUG9zLmxlZnQgKyAxKVxuICAgICAgICAgICAgICAgIDogaXRlbURpbXMud2lkdGg7XG4gICAgICAgIGxldCBuZXdIID0gcmVzaXplQm90dG9tXG4gICAgICAgICAgICA/IChtb3VzZVBvcy50b3AgLSBpdGVtUG9zLnRvcCArIDEpXG4gICAgICAgICAgICA6IHJlc2l6ZVRvcFxuICAgICAgICAgICAgICAgID8gKGVuZENvcm5lci50b3AgLSBtb3VzZVBvcy50b3AgKyAxKVxuICAgICAgICAgICAgICAgIDogaXRlbURpbXMuaGVpZ2h0O1xuXG4gICAgICAgIGlmIChuZXdXIDwgdGhpcy5taW5XaWR0aClcbiAgICAgICAgICAgIG5ld1cgPSB0aGlzLm1pbldpZHRoO1xuICAgICAgICBpZiAobmV3SCA8IHRoaXMubWluSGVpZ2h0KVxuICAgICAgICAgICAgbmV3SCA9IHRoaXMubWluSGVpZ2h0O1xuICAgICAgICBpZiAobmV3VyA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5XaWR0aClcbiAgICAgICAgICAgIG5ld1cgPSB0aGlzLl9yZXNpemluZ0l0ZW0ubWluV2lkdGg7XG4gICAgICAgIGlmIChuZXdIIDwgdGhpcy5fcmVzaXppbmdJdGVtLm1pbkhlaWdodClcbiAgICAgICAgICAgIG5ld0ggPSB0aGlzLl9yZXNpemluZ0l0ZW0ubWluSGVpZ2h0O1xuXG4gICAgICAgIGxldCBuZXdYID0gaXRlbVBvcy5sZWZ0O1xuICAgICAgICBsZXQgbmV3WSA9IGl0ZW1Qb3MudG9wO1xuXG4gICAgICAgIGlmIChyZXNpemVMZWZ0KVxuICAgICAgICAgICAgbmV3WCA9IGVuZENvcm5lci5sZWZ0IC0gbmV3VztcbiAgICAgICAgaWYgKHJlc2l6ZVRvcClcbiAgICAgICAgICAgIG5ld1kgPSBlbmRDb3JuZXIudG9wIC0gbmV3SDtcblxuICAgICAgICBsZXQgY2FsY1NpemUgPSB0aGlzLl9jYWxjdWxhdGVHcmlkU2l6ZShuZXdXLCBuZXdIKTtcbiAgICAgICAgY29uc3QgaXRlbVNpemUgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0U2l6ZSgpO1xuICAgICAgICBjb25zdCBpR3JpZFBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgYm90dG9tUmlnaHRDb3JuZXIgPSB7XG4gICAgICAgICAgICBjb2w6IGlHcmlkUG9zLmNvbCArIGl0ZW1TaXplLngsXG4gICAgICAgICAgICByb3c6IGlHcmlkUG9zLnJvdyArIGl0ZW1TaXplLnksXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHRhcmdldFBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgaUdyaWRQb3MpO1xuXG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVEaXJlY3Rpb24uaW5jbHVkZXMoJ3RvcCcpKVxuICAgICAgICAgICAgdGFyZ2V0UG9zLnJvdyA9IGJvdHRvbVJpZ2h0Q29ybmVyLnJvdyAtIGNhbGNTaXplLnk7XG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVEaXJlY3Rpb24uaW5jbHVkZXMoJ2xlZnQnKSlcbiAgICAgICAgICAgIHRhcmdldFBvcy5jb2wgPSBib3R0b21SaWdodENvcm5lci5jb2wgLSBjYWxjU2l6ZS54O1xuXG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHRhcmdldFBvcywgY2FsY1NpemUpKVxuICAgICAgICAgICAgY2FsY1NpemUgPSB0aGlzLl9maXhTaXplVG9Cb3VuZHNYKHRhcmdldFBvcywgY2FsY1NpemUpO1xuXG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHRhcmdldFBvcywgY2FsY1NpemUpKVxuICAgICAgICAgICAgY2FsY1NpemUgPSB0aGlzLl9maXhTaXplVG9Cb3VuZHNZKHRhcmdldFBvcywgY2FsY1NpemUpO1xuXG4gICAgICAgIGNhbGNTaXplID0gdGhpcy5fcmVzaXppbmdJdGVtLmZpeFJlc2l6ZShjYWxjU2l6ZSk7XG5cbiAgICAgICAgaWYgKGNhbGNTaXplLnggIT0gaXRlbVNpemUueCB8fCBjYWxjU2l6ZS55ICE9IGl0ZW1TaXplLnkpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXRHcmlkUG9zaXRpb24odGFyZ2V0UG9zLCB0aGlzLl9maXhUb0dyaWQpO1xuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJSZWYuaW5zdGFuY2Uuc2V0R3JpZFBvc2l0aW9uKHRhcmdldFBvcyk7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShjYWxjU2l6ZSwgdGhpcy5fZml4VG9HcmlkKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldFNpemUoY2FsY1NpemUpO1xuXG4gICAgICAgICAgICBpZiAoWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHRoaXMuY2FzY2FkZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKHRhcmdldFBvcywgY2FsY1NpemUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nhc2NhZGVHcmlkKHRhcmdldFBvcywgY2FsY1NpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9maXhUb0dyaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXREaW1lbnNpb25zKG5ld1csIG5ld0gpO1xuICAgICAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnNldFBvc2l0aW9uKG5ld1gsIG5ld1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblJlc2l6ZS5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XG4gICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZUV2ZW50KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhZ1N0b3AoZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGl0ZW1Qb3MgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLnNldEdyaWRQb3NpdGlvbihpdGVtUG9zKTtcbiAgICAgICAgdGhpcy5fYWRkVG9HcmlkKHRoaXMuX2RyYWdnaW5nSXRlbSk7XG5cbiAgICAgICAgdGhpcy5fY2FzY2FkZUdyaWQoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2l6ZSgpO1xuXG4gICAgICAgIHRoaXMuX2RyYWdnaW5nSXRlbS5zdG9wTW92aW5nKCk7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdTdG9wRXZlbnQoKTtcbiAgICAgICAgdGhpcy5vbkRyYWdTdG9wLmVtaXQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcblxuICAgICAgICB0aGlzLl9jbGVhbkRyYWcoKTtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJSZWYuZGVzdHJveSgpO1xuXG4gICAgICAgIHRoaXMuX2VtaXRPbkl0ZW1DaGFuZ2UoKTtcblxuICAgICAgICBpZiAodGhpcy5fem9vbU9uRHJhZykge1xuICAgICAgICAgICAgdGhpcy5fcmVzZXRab29tKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZXNpemVTdG9wKGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNSZXNpemluZykgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGl0ZW1EaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnNldFNpemUoaXRlbURpbXMpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW1Qb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXRHcmlkUG9zaXRpb24oaXRlbVBvcyk7XG5cbiAgICAgICAgdGhpcy5fYWRkVG9HcmlkKHRoaXMuX3Jlc2l6aW5nSXRlbSk7XG5cbiAgICAgICAgdGhpcy5fY2FzY2FkZUdyaWQoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2l6ZSgpO1xuXG4gICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5zdG9wTW92aW5nKCk7XG4gICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZVN0b3BFdmVudCgpO1xuICAgICAgICB0aGlzLm9uUmVzaXplU3RvcC5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XG5cbiAgICAgICAgdGhpcy5fY2xlYW5SZXNpemUoKTtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJSZWYuZGVzdHJveSgpO1xuXG4gICAgICAgIHRoaXMuX2VtaXRPbkl0ZW1DaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbGVhbkRyYWcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nSXRlbSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Bvc09mZnNldCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kcmFnUmVhZHkgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbGVhblJlc2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzaXplRGlyZWN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3Jlc2l6ZVJlYWR5ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBOZ0dyaWRJdGVtU2l6ZSB7XG4gICAgICAgIHdpZHRoICs9IHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQ7XG4gICAgICAgIGhlaWdodCArPSB0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tO1xuXG4gICAgICAgIHZhciBzaXpleCA9IE1hdGgubWF4KHRoaXMubWluQ29scywgTWF0aC5yb3VuZCh3aWR0aCAvICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpKTtcbiAgICAgICAgdmFyIHNpemV5ID0gTWF0aC5tYXgodGhpcy5taW5Sb3dzLCBNYXRoLnJvdW5kKGhlaWdodCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXggPSB0aGlzLl9tYXhDb2xzO1xuICAgICAgICBpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWSh7IGNvbDogMSwgcm93OiAxIH0sIHsgeDogc2l6ZXgsIHk6IHNpemV5IH0pKSBzaXpleSA9IHRoaXMuX21heFJvd3M7XG5cbiAgICAgICAgcmV0dXJuIHsgJ3gnOiBzaXpleCwgJ3knOiBzaXpleSB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcbiAgICAgICAgdmFyIGNvbCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQobGVmdCAvICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpICsgMSk7XG4gICAgICAgIHZhciByb3cgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRvcCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKSArIDEpO1xuXG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHsgY29sOiBjb2wsIHJvdzogcm93IH0sIHsgeDogMSwgeTogMSB9KSkgY29sID0gdGhpcy5fbWF4Q29scztcbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSByb3cgPSB0aGlzLl9tYXhSb3dzO1xuXG4gICAgICAgIHJldHVybiB7ICdjb2wnOiBjb2wsICdyb3cnOiByb3cgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYXNHcmlkQ29sbGlzaW9uKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldENvbGxpc2lvbnMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogQXJyYXk8TmdHcmlkSXRlbT4ge1xuICAgICAgICBpZiAodGhpcy5fYWxsb3dPdmVybGFwKSByZXR1cm4gW107XG5cbiAgICAgICAgY29uc3QgcmV0dXJuczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcblxuICAgICAgICBpZiAoIXBvcy5jb2wpIHsgcG9zLmNvbCA9IDE7IH1cbiAgICAgICAgaWYgKCFwb3Mucm93KSB7IHBvcy5yb3cgPSAxOyB9XG5cbiAgICAgICAgY29uc3QgbGVmdENvbCA9IHBvcy5jb2w7XG4gICAgICAgIGNvbnN0IHJpZ2h0Q29sID0gcG9zLmNvbCArIGRpbXMueDtcbiAgICAgICAgY29uc3QgdG9wUm93ID0gcG9zLnJvdztcbiAgICAgICAgY29uc3QgYm90dG9tUm93ID0gcG9zLnJvdyArIGRpbXMueTtcblxuICAgICAgICB0aGlzLl9pdGVtc0luR3JpZC5mb3JFYWNoKChpdGVtSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpO1xuXG4gICAgICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtc0luR3JpZC5kZWxldGUoaXRlbUlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGl0ZW1MZWZ0Q29sID0gaXRlbS5jb2w7XG4gICAgICAgICAgICBjb25zdCBpdGVtUmlnaHRDb2wgPSBpdGVtLmNvbCArIGl0ZW0uc2l6ZXg7XG4gICAgICAgICAgICBjb25zdCBpdGVtVG9wUm93ID0gaXRlbS5yb3c7XG4gICAgICAgICAgICBjb25zdCBpdGVtQm90dG9tUm93ID0gaXRlbS5yb3cgKyBpdGVtLnNpemV5O1xuXG4gICAgICAgICAgICBjb25zdCB3aXRoaW5Db2x1bW5zID0gbGVmdENvbCA8IGl0ZW1SaWdodENvbCAmJiBpdGVtTGVmdENvbCA8IHJpZ2h0Q29sO1xuICAgICAgICAgICAgY29uc3Qgd2l0aGluUm93cyA9IHRvcFJvdyA8IGl0ZW1Cb3R0b21Sb3cgJiYgaXRlbVRvcFJvdyA8IGJvdHRvbVJvdztcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkNvbHVtbnMgJiYgd2l0aGluUm93cykge1xuICAgICAgICAgICAgICAgIHJldHVybnMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJldHVybnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4R3JpZENvbGxpc2lvbnMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNvbGxpc2lvbnM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gdGhpcy5fZ2V0Q29sbGlzaW9ucyhwb3MsIGRpbXMpO1xuICAgICAgICBpZiAoY29sbGlzaW9ucy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgZm9yIChsZXQgY29sbGlzaW9uIG9mIGNvbGxpc2lvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKGNvbGxpc2lvbik7XG5cbiAgICAgICAgICAgIGNvbnN0IGl0ZW1EaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGNvbGxpc2lvbi5nZXRTaXplKCk7XG4gICAgICAgICAgICBjb25zdCBpdGVtUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBjb2xsaXNpb24uZ2V0R3JpZFBvc2l0aW9uKCk7XG4gICAgICAgICAgICBsZXQgbmV3SXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IGl0ZW1Qb3MuY29sLCByb3c6IGl0ZW1Qb3Mucm93IH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jb2xsaXNpb25GaXhEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgICAgICBuZXdJdGVtUG9zLnJvdyA9IHBvcy5yb3cgKyBkaW1zLnk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWShuZXdJdGVtUG9zLCBpdGVtRGltcykpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbVBvcy5jb2wgPSBwb3MuY29sICsgZGltcy54O1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtUG9zLnJvdyA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jb2xsaXNpb25GaXhEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgICAgIG5ld0l0ZW1Qb3MuY29sID0gcG9zLmNvbCArIGRpbXMueDtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKG5ld0l0ZW1Qb3MsIGl0ZW1EaW1zKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtUG9zLmNvbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbGxpc2lvbi5zZXRHcmlkUG9zaXRpb24obmV3SXRlbVBvcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKG5ld0l0ZW1Qb3MsIGl0ZW1EaW1zKTtcbiAgICAgICAgICAgIHRoaXMuX2FkZFRvR3JpZChjb2xsaXNpb24pO1xuICAgICAgICAgICAgY29sbGlzaW9uLm9uQ2FzY2FkZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhwb3MsIGRpbXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2Nhc2NhZGVHcmlkKHBvcz86IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltcz86IE5nR3JpZEl0ZW1TaXplKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2FsbG93T3ZlcmxhcCkgcmV0dXJuO1xuICAgICAgICBpZiAoIXBvcyAhPT0gIWRpbXMpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhc2NhZGUgd2l0aCBvbmx5IHBvc2l0aW9uIGFuZCBub3QgZGltZW5zaW9ucycpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5fZHJhZ2dpbmdJdGVtICYmICFwb3MgJiYgIWRpbXMpIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgICAgIGRpbXMgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0U2l6ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNSZXNpemluZyAmJiB0aGlzLl9yZXNpemluZ0l0ZW0gJiYgIXBvcyAmJiAhZGltcykge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xuICAgICAgICAgICAgZGltcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaXRlbXNJbkdyaWQ6IE5nR3JpZEl0ZW1bXSA9IEFycmF5LmZyb20odGhpcy5faXRlbXNJbkdyaWQsIChpdGVtSWQ6IHN0cmluZykgPT4gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCkpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XG4gICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgICAgICBpdGVtc0luR3JpZCA9IGl0ZW1zSW5HcmlkLnNvcnQoTmdHcmlkSGVscGVyLnNvcnRJdGVtc0J5UG9zaXRpb25WZXJ0aWNhbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG93ZXN0Um93UGVyQ29sdW1uOiBNYXA8bnVtYmVyLCBudW1iZXI+ID0gbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXNJbkdyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXNGaXhlZCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvd2VzdFJvd0Zvckl0ZW06IG51bWJlciA9IGxvd2VzdFJvd1BlckNvbHVtbi5nZXQoaXRlbVBvcy5jb2wpIHx8IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbG93ZXN0Um93Rm9yQ29sdW1uID0gbG93ZXN0Um93UGVyQ29sdW1uLmdldChpdGVtUG9zLmNvbCArIGkpIHx8IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlc3RSb3dGb3JJdGVtID0gTWF0aC5tYXgobG93ZXN0Um93Rm9yQ29sdW1uLCBsb3dlc3RSb3dGb3JJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRDb2wgPSBpdGVtUG9zLmNvbDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmlnaHRDb2wgPSBpdGVtUG9zLmNvbCArIGl0ZW1EaW1zLng7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyAmJiBkaW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3aXRoaW5Db2x1bW5zID0gcmlnaHRDb2wgPiBwb3MuY29sICYmIGxlZnRDb2wgPCAocG9zLmNvbCArIGRpbXMueCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXRoaW5Db2x1bW5zKSB7ICAgICAgICAgIC8vIElmIG91ciBlbGVtZW50IGlzIGluIG9uZSBvZiB0aGUgaXRlbSdzIGNvbHVtbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb29tQWJvdmVJdGVtID0gaXRlbURpbXMueSA8PSAocG9zLnJvdyAtIGxvd2VzdFJvd0Zvckl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyb29tQWJvdmVJdGVtKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJdGVtIGNhbid0IGZpdCBhYm92ZSBvdXIgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb3dlc3RSb3dGb3JJdGVtID0gTWF0aC5tYXgobG93ZXN0Um93Rm9ySXRlbSwgcG9zLnJvdyArIGRpbXMueSk7ICAgLy8gU2V0IHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogaXRlbVBvcy5jb2wsIHJvdzogbG93ZXN0Um93Rm9ySXRlbSB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIFdoYXQgaWYgaXQncyBub3Qgd2l0aGluIGJvdW5kcyBZP1xuICAgICAgICAgICAgICAgICAgICBpZiAobG93ZXN0Um93Rm9ySXRlbSAhPSBpdGVtUG9zLnJvdyAmJiB0aGlzLl9pc1dpdGhpbkJvdW5kc1kobmV3UG9zLCBpdGVtRGltcykpIHsgLy8gSWYgdGhlIGl0ZW0gaXMgbm90IGFscmVhZHkgb24gdGhpcyByb3cgbW92ZSBpdCB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ub25DYXNjYWRlRXZlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtRGltcy54OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdFJvd1BlckNvbHVtbi5zZXQoaXRlbVBvcy5jb2wgKyBpLCBsb3dlc3RSb3dGb3JJdGVtICsgaXRlbURpbXMueSk7IC8vIFVwZGF0ZSB0aGUgbG93ZXN0IHJvdyB0byBiZSBiZWxvdyB0aGUgaXRlbVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgaXRlbXNJbkdyaWQgPSBpdGVtc0luR3JpZC5zb3J0KE5nR3JpZEhlbHBlci5zb3J0SXRlbXNCeVBvc2l0aW9uSG9yaXpvbnRhbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG93ZXN0Q29sdW1uUGVyUm93OiBNYXA8bnVtYmVyLCBudW1iZXI+ID0gbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXNJbkdyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvd2VzdENvbHVtbkZvckl0ZW06IG51bWJlciA9IGxvd2VzdENvbHVtblBlclJvdy5nZXQoaXRlbVBvcy5yb3cpIHx8IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IGl0ZW1EaW1zLnk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvd2VzdE9mZnNldENvbHVtbjogbnVtYmVyID0gbG93ZXN0Q29sdW1uUGVyUm93LmdldChpdGVtUG9zLnJvdyArIGkpIHx8IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlc3RDb2x1bW5Gb3JJdGVtID0gTWF0aC5tYXgobG93ZXN0T2Zmc2V0Q29sdW1uLCBsb3dlc3RDb2x1bW5Gb3JJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcFJvdyA9IGl0ZW1Qb3Mucm93O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBib3R0b21Sb3cgPSBpdGVtUG9zLnJvdyArIGl0ZW1EaW1zLnk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyAmJiBkaW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3aXRoaW5Sb3dzID0gYm90dG9tUm93ID4gcG9zLmNvbCAmJiB0b3BSb3cgPCAocG9zLmNvbCArIGRpbXMueCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXRoaW5Sb3dzKSB7ICAgICAgICAgIC8vIElmIG91ciBlbGVtZW50IGlzIGluIG9uZSBvZiB0aGUgaXRlbSdzIHJvd3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb29tTmV4dFRvSXRlbSA9IGl0ZW1EaW1zLnggPD0gKHBvcy5jb2wgLSBsb3dlc3RDb2x1bW5Gb3JJdGVtKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm9vbU5leHRUb0l0ZW0pIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJdGVtIGNhbid0IGZpdCBuZXh0IHRvIG91ciBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdENvbHVtbkZvckl0ZW0gPSBNYXRoLm1heChsb3dlc3RDb2x1bW5Gb3JJdGVtLCBwb3MuY29sICsgZGltcy54KTsgIC8vIFNldCB0aGUgbG93ZXN0IGNvbCB0byBiZSB0aGUgb3RoZXIgc2lkZSBvZiBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BvczogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IGxvd2VzdENvbHVtbkZvckl0ZW0sIHJvdzogaXRlbVBvcy5yb3cgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobG93ZXN0Q29sdW1uRm9ySXRlbSAhPSBpdGVtUG9zLmNvbCAmJiB0aGlzLl9pc1dpdGhpbkJvdW5kc1gobmV3UG9zLCBpdGVtRGltcykpIHsgLy8gSWYgdGhlIGl0ZW0gaXMgbm90IGFscmVhZHkgb24gdGhpcyBjb2wgbW92ZSBpdCB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ub25DYXNjYWRlRXZlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtRGltcy55OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdENvbHVtblBlclJvdy5zZXQoaXRlbVBvcy5yb3cgKyBpLCBsb3dlc3RDb2x1bW5Gb3JJdGVtICsgaXRlbURpbXMueCk7IC8vIFVwZGF0ZSB0aGUgbG93ZXN0IGNvbCB0byBiZSBiZWxvdyB0aGUgaXRlbVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2ZpeEdyaWRQb3NpdGlvbihwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xuICAgICAgICBpZiAoIXRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkgcmV0dXJuIHBvcztcblxuICAgICAgICBjb25zdCBtYXhSb3cgPSB0aGlzLl9tYXhSb3dzID09PSAwID8gdGhpcy5fZ2V0TWF4Um93KCkgOiB0aGlzLl9tYXhSb3dzO1xuICAgICAgICBjb25zdCBtYXhDb2wgPSB0aGlzLl9tYXhDb2xzID09PSAwID8gdGhpcy5fZ2V0TWF4Q29sKCkgOiB0aGlzLl9tYXhDb2xzO1xuICAgICAgICBjb25zdCBuZXdQb3MgPSB7XG4gICAgICAgICAgICBjb2w6IHBvcy5jb2wsXG4gICAgICAgICAgICByb3c6IHBvcy5yb3csXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1GaXhEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIGZpeExvb3A6XG4gICAgICAgICAgICBmb3IgKDsgbmV3UG9zLmNvbCA8PSBtYXhSb3c7KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXNJblBhdGggPSB0aGlzLl9nZXRJdGVtc0luVmVydGljYWxQYXRoKG5ld1BvcywgZGltcywgbmV3UG9zLnJvdyk7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRSb3cgPSBuZXdQb3Mucm93O1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtc0luUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5yb3cgLSBuZXh0Um93ID49IGRpbXMueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnJvdyA9IG5leHRSb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBmaXhMb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dFJvdyA9IGl0ZW0ucm93ICsgaXRlbS5zaXpleTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF4Um93IC0gbmV4dFJvdyA+PSBkaW1zLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnJvdyA9IG5leHRSb3c7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIGZpeExvb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV3UG9zLmNvbCA9IE1hdGgubWF4KG5ld1Bvcy5jb2wgKyAxLCBNYXRoLm1pbi5hcHBseShNYXRoLCBpdGVtc0luUGF0aC5tYXAoKGl0ZW0pID0+IGl0ZW0uY29sICsgZGltcy54KSkpO1xuICAgICAgICAgICAgICAgIG5ld1Bvcy5yb3cgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2l0ZW1GaXhEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgZml4TG9vcDpcbiAgICAgICAgICAgIGZvciAoOyBuZXdQb3Mucm93IDw9IG1heFJvdzspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtc0luUGF0aCA9IHRoaXMuX2dldEl0ZW1zSW5Ib3Jpem9udGFsUGF0aChuZXdQb3MsIGRpbXMsIG5ld1Bvcy5jb2wpO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0Q29sID0gbmV3UG9zLmNvbDtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXNJblBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29sIC0gbmV4dENvbCA+PSBkaW1zLngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Bvcy5jb2wgPSBuZXh0Q29sO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgZml4TG9vcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5leHRDb2wgPSBpdGVtLmNvbCArIGl0ZW0uc2l6ZXg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1heENvbCAtIG5leHRDb2wgPj0gZGltcy54KSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy5jb2wgPSBuZXh0Q29sO1xuICAgICAgICAgICAgICAgICAgICBicmVhayBmaXhMb29wO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5ld1Bvcy5yb3cgPSBNYXRoLm1heChuZXdQb3Mucm93ICsgMSwgTWF0aC5taW4uYXBwbHkoTWF0aCwgaXRlbXNJblBhdGgubWFwKChpdGVtKSA9PiBpdGVtLnJvdyArIGRpbXMueSkpKTtcbiAgICAgICAgICAgICAgICBuZXdQb3MuY29sID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbXNJbkhvcml6b250YWxQYXRoKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSwgc3RhcnRDb2x1bW46IG51bWJlciA9IDApOiBOZ0dyaWRJdGVtW10ge1xuICAgICAgICBjb25zdCBpdGVtc0luUGF0aDogTmdHcmlkSXRlbVtdID0gW107XG4gICAgICAgIGNvbnN0IHRvcFJvdzogbnVtYmVyID0gcG9zLnJvdyArIGRpbXMueSAtIDE7XG5cbiAgICAgICAgdGhpcy5faXRlbXNJbkdyaWQuZm9yRWFjaCgoaXRlbUlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9pdGVtcy5nZXQoaXRlbUlkKTtcbiAgICAgICAgICAgIGlmIChpdGVtLmNvbCArIGl0ZW0uc2l6ZXggLSAxIDwgc3RhcnRDb2x1bW4pIHsgcmV0dXJuOyB9ICAgIC8vIEl0ZW0gZmFsbHMgYWZ0ZXIgc3RhcnQgY29sdW1uXG4gICAgICAgICAgICBpZiAoaXRlbS5yb3cgPiB0b3BSb3cpIHsgcmV0dXJuOyB9ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJdGVtIGZhbGxzIGFib3ZlIHBhdGhcbiAgICAgICAgICAgIGlmIChpdGVtLnJvdyArIGl0ZW0uc2l6ZXkgLSAxIDwgcG9zLnJvdykgeyByZXR1cm47IH0gICAgICAgIC8vIEl0ZW0gZmFsbHMgYmVsb3cgcGF0aFxuICAgICAgICAgICAgaXRlbXNJblBhdGgucHVzaChpdGVtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zSW5QYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldEl0ZW1zSW5WZXJ0aWNhbFBhdGgocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplLCBzdGFydFJvdzogbnVtYmVyID0gMCk6IE5nR3JpZEl0ZW1bXSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zSW5QYXRoOiBOZ0dyaWRJdGVtW10gPSBbXTtcbiAgICAgICAgY29uc3QgcmlnaHRDb2w6IG51bWJlciA9IHBvcy5jb2wgKyBkaW1zLnggLSAxO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1zSW5HcmlkLmZvckVhY2goKGl0ZW1JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCk7XG4gICAgICAgICAgICBpZiAoaXRlbS5yb3cgKyBpdGVtLnNpemV5IC0gMSA8IHN0YXJ0Um93KSB7IHJldHVybjsgfSAgIC8vIEl0ZW0gZmFsbHMgYWJvdmUgc3RhcnQgcm93XG4gICAgICAgICAgICBpZiAoaXRlbS5jb2wgPiByaWdodENvbCkgeyByZXR1cm47IH0gICAgICAgICAgICAgICAgICAgIC8vIEl0ZW0gZmFsbHMgYWZ0ZXIgcGF0aFxuICAgICAgICAgICAgaWYgKGl0ZW0uY29sICsgaXRlbS5zaXpleCAtIDEgPCBwb3MuY29sKSB7IHJldHVybjsgfSAgICAvLyBJdGVtIGZhbGxzIGJlZm9yZSBwYXRoXG4gICAgICAgICAgICBpdGVtc0luUGF0aC5wdXNoKGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaXRlbXNJblBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNYKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSwgYWxsb3dFeGNlc3NpdmVJdGVtczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhDb2xzID09IDAgfHwgKGFsbG93RXhjZXNzaXZlSXRlbXMgJiYgcG9zLmNvbCA9PSAxKSB8fCAocG9zLmNvbCArIGRpbXMueCAtIDEpIDw9IHRoaXMuX21heENvbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4UG9zVG9Cb3VuZHNYKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHBvcywgZGltcykpIHtcbiAgICAgICAgICAgIHBvcy5jb2wgPSBNYXRoLm1heCh0aGlzLl9tYXhDb2xzIC0gKGRpbXMueCAtIDEpLCAxKTtcbiAgICAgICAgICAgIHBvcy5yb3cgKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maXhTaXplVG9Cb3VuZHNYKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1TaXplIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1gocG9zLCBkaW1zKSkge1xuICAgICAgICAgICAgZGltcy54ID0gTWF0aC5tYXgodGhpcy5fbWF4Q29scyAtIChwb3MuY29sIC0gMSksIDEpO1xuICAgICAgICAgICAgZGltcy55Kys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNZKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSwgYWxsb3dFeGNlc3NpdmVJdGVtczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhSb3dzID09IDAgfHwgKGFsbG93RXhjZXNzaXZlSXRlbXMgJiYgcG9zLnJvdyA9PSAxKSB8fCAocG9zLnJvdyArIGRpbXMueSAtIDEpIDw9IHRoaXMuX21heFJvd3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4UG9zVG9Cb3VuZHNZKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcykpIHtcbiAgICAgICAgICAgIHBvcy5yb3cgPSBNYXRoLm1heCh0aGlzLl9tYXhSb3dzIC0gKGRpbXMueSAtIDEpLCAxKTtcbiAgICAgICAgICAgIHBvcy5jb2wrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2ZpeFNpemVUb0JvdW5kc1kocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogTmdHcmlkSXRlbVNpemUge1xuICAgICAgICBpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWShwb3MsIGRpbXMpKSB7XG4gICAgICAgICAgICBkaW1zLnkgPSBNYXRoLm1heCh0aGlzLl9tYXhSb3dzIC0gKHBvcy5yb3cgLSAxKSwgMSk7XG4gICAgICAgICAgICBkaW1zLngrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltcztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pc1dpdGhpbkJvdW5kcyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUsIGFsbG93RXhjZXNzaXZlSXRlbXM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHBvcywgZGltcywgYWxsb3dFeGNlc3NpdmVJdGVtcykgJiYgdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcywgYWxsb3dFeGNlc3NpdmVJdGVtcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4UG9zVG9Cb3VuZHMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpeFBvc1RvQm91bmRzWCh0aGlzLl9maXhQb3NUb0JvdW5kc1kocG9zLCBkaW1zKSwgZGltcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4U2l6ZVRvQm91bmRzKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1TaXplIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpeFNpemVUb0JvdW5kc1gocG9zLCB0aGlzLl9maXhTaXplVG9Cb3VuZHNZKHBvcywgZGltcykpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRvR3JpZChpdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGRpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xuICAgICAgICAgICAgdGhpcy5fZml4R3JpZENvbGxpc2lvbnMocG9zLCBkaW1zKTtcbiAgICAgICAgICAgIHBvcyA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYWxsb3dPdmVybGFwKSB7XG4gICAgICAgICAgICBpdGVtLnpJbmRleCA9IHRoaXMuX2xhc3RaVmFsdWUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2l0ZW1zSW5HcmlkLmFkZChpdGVtLnVpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVtb3ZlRnJvbUdyaWQoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9pdGVtc0luR3JpZC5kZWxldGUoaXRlbS51aWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZVNpemUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgbGV0IG1heENvbDogbnVtYmVyID0gdGhpcy5fZ2V0TWF4Q29sKCk7XG4gICAgICAgIGxldCBtYXhSb3c6IG51bWJlciA9IHRoaXMuX2dldE1heFJvdygpO1xuXG4gICAgICAgIGlmIChtYXhDb2wgIT0gdGhpcy5fY3VyTWF4Q29sIHx8IG1heFJvdyAhPSB0aGlzLl9jdXJNYXhSb3cpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1ck1heENvbCA9IG1heENvbDtcbiAgICAgICAgICAgIHRoaXMuX2N1ck1heFJvdyA9IG1heFJvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3dpZHRoJywgJzEwMCUnKTsvLyhtYXhDb2wgKiAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSsncHgnKTtcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50QmFzZWREeW5hbWljUm93SGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCAobWF4Um93ICogKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgJ3B4Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRNYXhSb3coKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaXRlbXNSb3dzOiBudW1iZXJbXSA9IEFycmF5LmZyb20odGhpcy5faXRlbXNJbkdyaWQsIChpdGVtSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpO1xuICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gMDtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnJvdyArIGl0ZW0uc2l6ZXkgLSAxO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgaXRlbXNSb3dzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRNYXhDb2woKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaXRlbXNDb2xzOiBudW1iZXJbXSA9IEFycmF5LmZyb20odGhpcy5faXRlbXNJbkdyaWQsIChpdGVtSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpO1xuICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gMDtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmNvbCArIGl0ZW0uc2l6ZXggLSAxO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgaXRlbXNDb2xzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRNb3VzZVBvc2l0aW9uKGU6IGFueSk6IE5nR3JpZFJhd1Bvc2l0aW9uIHtcbiAgICAgICAgaWYgKCgoPGFueT53aW5kb3cpLlRvdWNoRXZlbnQgJiYgZSBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHx8IChlLnRvdWNoZXMgfHwgZS5jaGFuZ2VkVG91Y2hlcykpIHtcbiAgICAgICAgICAgIGUgPSBlLnRvdWNoZXMubGVuZ3RoID4gMCA/IGUudG91Y2hlc1swXSA6IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWZQb3M6IGFueSA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICBsZXQgbGVmdDogbnVtYmVyID0gZS5jbGllbnRYIC0gcmVmUG9zLmxlZnQ7XG4gICAgICAgIGxldCB0b3A6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlZlBvcy50b3A7XG5cbiAgICAgICAgaWYgKHRoaXMuY2FzY2FkZSA9PSAnZG93bicpIHRvcCA9IHJlZlBvcy50b3AgKyByZWZQb3MuaGVpZ2h0IC0gZS5jbGllbnRZO1xuICAgICAgICBpZiAodGhpcy5jYXNjYWRlID09ICdyaWdodCcpIGxlZnQgPSByZWZQb3MubGVmdCArIHJlZlBvcy53aWR0aCAtIGUuY2xpZW50WDtcblxuICAgICAgICBpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuX3pvb21PbkRyYWcpIHtcbiAgICAgICAgICAgIGxlZnQgKj0gMjtcbiAgICAgICAgICAgIHRvcCAqPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICB0b3A6IHRvcFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldEFic29sdXRlTW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XG4gICAgICAgIGlmICgoKDxhbnk+d2luZG93KS5Ub3VjaEV2ZW50ICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB8fCAoZS50b3VjaGVzIHx8IGUuY2hhbmdlZFRvdWNoZXMpKSB7XG4gICAgICAgICAgICBlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IGUuY2xpZW50WCxcbiAgICAgICAgICAgIHRvcDogZS5jbGllbnRZXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0Q29udGFpbmVyQ29sdW1ucygpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBtYXhXaWR0aDogbnVtYmVyID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICBjb25zdCBpdGVtV2lkdGg6IG51bWJlciA9IHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0O1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihtYXhXaWR0aCAvIGl0ZW1XaWR0aCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0Q29udGFpbmVyUm93cygpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBtYXhIZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRoaXMubWFyZ2luVG9wIC0gdGhpcy5tYXJnaW5Cb3R0b207XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1heEhlaWdodCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRTY3JlZW5NYXJnaW4oKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgbWF4V2lkdGg6IG51bWJlciA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgY29uc3QgaXRlbVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodDtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKG1heFdpZHRoIC0gKHRoaXMuX21heENvbHMgKiBpdGVtV2lkdGgpKSAvIDIpOztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRJdGVtRnJvbVBvc2l0aW9uKHBvc2l0aW9uOiBOZ0dyaWRSYXdQb3NpdGlvbik6IE5nR3JpZEl0ZW0ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9pdGVtc0luR3JpZCwgKGl0ZW1JZDogc3RyaW5nKSA9PiB0aGlzLl9pdGVtcy5nZXQoaXRlbUlkKSkuZmluZCgoaXRlbTogTmdHcmlkSXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IHNpemU6IE5nR3JpZEl0ZW1EaW1lbnNpb25zID0gaXRlbS5nZXREaW1lbnNpb25zKCk7XG4gICAgICAgICAgICBjb25zdCBwb3M6IE5nR3JpZFJhd1Bvc2l0aW9uID0gaXRlbS5nZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICByZXR1cm4gcG9zaXRpb24ubGVmdCA+PSBwb3MubGVmdCAmJiBwb3NpdGlvbi5sZWZ0IDwgKHBvcy5sZWZ0ICsgc2l6ZS53aWR0aCkgJiZcbiAgICAgICAgICAgIHBvc2l0aW9uLnRvcCA+PSBwb3MudG9wICYmIHBvc2l0aW9uLnRvcCA8IChwb3MudG9wICsgc2l6ZS5oZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jcmVhdGVQbGFjZWhvbGRlcihpdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgZGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcblxuICAgICAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTmdHcmlkUGxhY2Vob2xkZXIpO1xuICAgICAgICB2YXIgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8TmdHcmlkUGxhY2Vob2xkZXI+ID0gaXRlbS5jb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclJlZiA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXI6IE5nR3JpZFBsYWNlaG9sZGVyID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgICBwbGFjZWhvbGRlci5yZWdpc3RlckdyaWQodGhpcyk7XG4gICAgICAgIHBsYWNlaG9sZGVyLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XG4gICAgICAgIHBsYWNlaG9sZGVyLnNldEdyaWRQb3NpdGlvbih7IGNvbDogcG9zLmNvbCwgcm93OiBwb3Mucm93IH0pO1xuICAgICAgICBwbGFjZWhvbGRlci5zZXRTaXplKHsgeDogZGltcy54LCB5OiBkaW1zLnkgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZW1pdE9uSXRlbUNoYW5nZSgpIHtcbiAgICAgICAgY29uc3QgaXRlbU91dHB1dDogYW55W10gPSBBcnJheS5mcm9tKHRoaXMuX2l0ZW1zSW5HcmlkKVxuICAgICAgICAgICAgLm1hcCgoaXRlbUlkOiBzdHJpbmcpID0+IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpKVxuICAgICAgICAgICAgLmZpbHRlcigoaXRlbTogTmdHcmlkSXRlbSkgPT4gISFpdGVtKVxuICAgICAgICAgICAgLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRFdmVudE91dHB1dCgpKTtcblxuICAgICAgICB0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KGl0ZW1PdXRwdXQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2RlZmluZUxpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudDtcblxuICAgICAgICB0aGlzLl9kb2N1bWVudE1vdXNlbW92ZSQgPSBmcm9tRXZlbnQ8TW91c2VFdmVudD4oZG9jdW1lbnQsICdtb3VzZW1vdmUnKTtcbiAgICAgICAgdGhpcy5fZG9jdW1lbnRNb3VzZXVwJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pihkb2N1bWVudCwgJ21vdXNldXAnKTtcbiAgICAgICAgdGhpcy5fbW91c2Vkb3duJCA9IGZyb21FdmVudChlbGVtZW50LCAnbW91c2Vkb3duJyk7XG4gICAgICAgIHRoaXMuX21vdXNlbW92ZSQgPSBmcm9tRXZlbnQoZWxlbWVudCwgJ21vdXNlbW92ZScpO1xuICAgICAgICB0aGlzLl9tb3VzZXVwJCA9IGZyb21FdmVudChlbGVtZW50LCAnbW91c2V1cCcpO1xuICAgICAgICB0aGlzLl90b3VjaHN0YXJ0JCA9IGZyb21FdmVudChlbGVtZW50LCAndG91Y2hzdGFydCcpO1xuICAgICAgICB0aGlzLl90b3VjaG1vdmUkID0gZnJvbUV2ZW50KGVsZW1lbnQsICd0b3VjaG1vdmUnKTtcbiAgICAgICAgdGhpcy5fdG91Y2hlbmQkID0gZnJvbUV2ZW50KGVsZW1lbnQsICd0b3VjaGVuZCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2VuYWJsZUxpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWRMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZW5hYmxlTW91c2VMaXN0ZW5lcnMoKTtcblxuICAgICAgICBpZiAodGhpcy5faXNUb3VjaERldmljZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVUb3VjaExpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZW5hYmxlZExpc3RlbmVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kaXNhYmxlTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YnM6IFN1YnNjcmlwdGlvbikgPT4gc3Vicy51bnN1YnNjcmliZSgpKTtcbiAgICAgICAgdGhpcy5fZW5hYmxlZExpc3RlbmVyID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaXNUb3VjaERldmljZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF9lbmFibGVUb3VjaExpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdG91Y2hzdGFydFN1YnMgPSB0aGlzLl90b3VjaHN0YXJ0JC5zdWJzY3JpYmUoKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMubW91c2VEb3duRXZlbnRIYW5kbGVyKGUpKTtcbiAgICAgICAgY29uc3QgdG91Y2htb3ZlU3VicyA9IHRoaXMuX3RvdWNobW92ZSQuc3Vic2NyaWJlKChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLm1vdXNlTW92ZUV2ZW50SGFuZGxlcihlKSk7XG4gICAgICAgIGNvbnN0IHRvdWNoZW5kU3VicyA9IHRoaXMuX3RvdWNoZW5kJC5zdWJzY3JpYmUoKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMubW91c2VVcEV2ZW50SGFuZGxlcihlKSk7XG5cbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdG91Y2hzdGFydFN1YnMsXG4gICAgICAgICAgICB0b3VjaG1vdmVTdWJzLFxuICAgICAgICAgICAgdG91Y2hlbmRTdWJzXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZW5hYmxlTW91c2VMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRvY3VtZW50TW91c2Vtb3ZlU3VicyA9IHRoaXMuX2RvY3VtZW50TW91c2Vtb3ZlJC5zdWJzY3JpYmUoKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMubW91c2VNb3ZlRXZlbnRIYW5kbGVyKGUpKTtcbiAgICAgICAgY29uc3QgZG9jdW1lbnRNb3VzZXVwU3VicyA9IHRoaXMuX2RvY3VtZW50TW91c2V1cCQuc3Vic2NyaWJlKChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLm1vdXNlVXBFdmVudEhhbmRsZXIoZSkpO1xuICAgICAgICBjb25zdCBtb3VzZWRvd25TdWJzID0gdGhpcy5fbW91c2Vkb3duJC5zdWJzY3JpYmUoKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMubW91c2VEb3duRXZlbnRIYW5kbGVyKGUpKTtcbiAgICAgICAgY29uc3QgbW91c2Vtb3ZlU3VicyA9IHRoaXMuX21vdXNlbW92ZSQuc3Vic2NyaWJlKChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLm1vdXNlTW92ZUV2ZW50SGFuZGxlcihlKSk7XG4gICAgICAgIGNvbnN0IG1vdXNldXBTdWJzID0gdGhpcy5fbW91c2V1cCQuc3Vic2NyaWJlKChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLm1vdXNlVXBFdmVudEhhbmRsZXIoZSkpO1xuXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGRvY3VtZW50TW91c2Vtb3ZlU3VicyxcbiAgICAgICAgICAgIGRvY3VtZW50TW91c2V1cFN1YnMsXG4gICAgICAgICAgICBtb3VzZWRvd25TdWJzLFxuICAgICAgICAgICAgbW91c2Vtb3ZlU3VicyxcbiAgICAgICAgICAgIG1vdXNldXBTdWJzXG4gICAgICAgICk7XG4gICAgfVxufVxuIl19
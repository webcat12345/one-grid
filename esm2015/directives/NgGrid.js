/**
 * @fileoverview added by tsickle
 * Generated from: directives/NgGrid.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, EventEmitter, ComponentFactoryResolver, KeyValueDiffers, Output } from '@angular/core';
import * as NgGridHelper from '../helpers/NgGridHelpers';
import { NgGridPlaceholder } from '../components/NgGridPlaceholder';
import { fromEvent } from 'rxjs';
export class NgGrid {
    // Constructor
    /**
     * @param {?} _differs
     * @param {?} _ngEl
     * @param {?} _renderer
     * @param {?} componentFactoryResolver
     */
    constructor(_differs, _ngEl, _renderer, componentFactoryResolver) {
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
    // [ng-grid] attribute handler
    /**
     * @param {?} v
     * @return {?}
     */
    set config(v) {
        if (v == null || typeof v !== 'object') {
            return;
        }
        this.setConfig(v);
        if (this._differ == null && v != null) {
            this._differ = this._differs.find(this._config).create();
        }
        this._differ.diff(this._config);
    }
    // Public methods
    /**
     * @return {?}
     */
    ngOnInit() {
        this._renderer.addClass(this._ngEl.nativeElement, 'grid');
        if (this.autoStyle)
            this._renderer.setStyle(this._ngEl.nativeElement, 'position', 'relative');
        this.setConfig(this._config);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed = true;
        this._disableListeners();
    }
    /**
     * @return {?}
     */
    generateItemUid() {
        /** @type {?} */
        const uid = NgGridHelper.generateUuid();
        if (this._items.has(uid)) {
            return this.generateItemUid();
        }
        return uid;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    setConfig(config) {
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
            const newMaxCols = this._getContainerColumns();
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
        (item) => {
            this._removeFromGrid(item);
            item.setCascadeMode(this.cascade);
        }));
        this._items.forEach((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            item.recalculateSelf();
            this._addToGrid(item);
        }));
        this._cascadeGrid();
        this._updateSize();
    }
    /**
     * @param {?} itemId
     * @return {?}
     */
    getItemPosition(itemId) {
        return this._items.has(itemId) ? this._items.get(itemId).getGridPosition() : null;
    }
    /**
     * @param {?} itemId
     * @return {?}
     */
    getItemSize(itemId) {
        return this._items.has(itemId) ? this._items.get(itemId).getSize() : null;
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this._differ != null) {
            /** @type {?} */
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} margins
     * @return {?}
     */
    setMargins(margins) {
        this.marginTop = Math.max(parseInt(margins[0]), 0);
        this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.marginRight;
    }
    /**
     * @return {?}
     */
    enableDrag() {
        this.dragEnable = true;
    }
    /**
     * @return {?}
     */
    disableDrag() {
        this.dragEnable = false;
    }
    /**
     * @return {?}
     */
    enableResize() {
        this.resizeEnable = true;
    }
    /**
     * @return {?}
     */
    disableResize() {
        this.resizeEnable = false;
    }
    /**
     * @param {?} ngItem
     * @return {?}
     */
    addItem(ngItem) {
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
        () => {
            ngItem.recalculateSelf();
            ngItem.onCascadeEvent();
            this._emitOnItemChange();
        }));
    }
    /**
     * @param {?} ngItem
     * @return {?}
     */
    removeItem(ngItem) {
        this._removeFromGrid(ngItem);
        this._items.delete(ngItem.uid);
        if (this._destroyed)
            return;
        this.triggerCascade().then((/**
         * @return {?}
         */
        () => {
            this._updateSize();
            this._items.forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => item.recalculateSelf()));
            this._emitOnItemChange();
        }));
    }
    /**
     * @param {?} ngItem
     * @return {?}
     */
    updateItem(ngItem) {
        this._removeFromGrid(ngItem);
        this._addToGrid(ngItem);
        this.triggerCascade().then((/**
         * @return {?}
         */
        () => {
            this._updateSize();
            ngItem.onCascadeEvent();
        }));
    }
    /**
     * @return {?}
     */
    triggerCascade() {
        if (!this._cascadePromise) {
            this._cascadePromise = new Promise((/**
             * @param {?} resolve
             * @return {?}
             */
            (resolve) => {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this._cascadePromise = null;
                    this._cascadeGrid(null, null);
                    resolve();
                }), 0);
            }));
        }
        return this._cascadePromise;
    }
    /**
     * @return {?}
     */
    triggerResize() {
        this.resizeEventHandler(null);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    resizeEventHandler(e) {
        // this._calculateColWidth();
        // this._calculateRowHeight();
        //
        // this._updateRatio();
        if (this._limitToScreen) {
            /** @type {?} */
            const newMaxColumns = this._getContainerColumns();
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
                (item) => {
                    item.recalculateSelf();
                }));
            }
        }
        else if (this._autoResize) {
            this._items.forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                item.recalculateSelf();
            }));
        }
        // this._updateSize();
    }
    /**
     * @param {?} e
     * @return {?}
     */
    mouseDownEventHandler(e) {
        /** @type {?} */
        var mousePos = this._getMousePosition(e);
        /** @type {?} */
        var item = this._getItemFromPosition(mousePos, true);
        if (item == null)
            return;
        /** @type {?} */
        const resizeDirection = item.canResize(e);
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
            const itemPos = item.getPosition();
            this._posOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) };
            e.preventDefault();
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    mouseUpEventHandler(e) {
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
    }
    /**
     * @param {?} e
     * @return {?}
     */
    mouseMoveEventHandler(e) {
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
    }
    //    Private methods
    /**
     * @private
     * @return {?}
     */
    _getFixDirectionFromCascade() {
        switch (this.cascade) {
            case 'up':
            case 'down':
            default:
                return 'vertical';
            case 'left':
            case 'right':
                return 'horizontal';
        }
    }
    /**
     * @private
     * @return {?}
     */
    _updatePositionsAfterMaxChange() {
        this._items.forEach((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            /** @type {?} */
            var pos = item.getGridPosition();
            /** @type {?} */
            var dims = item.getSize();
            if (!this._hasGridCollision(pos, dims) && this._isWithinBounds(pos, dims) && dims.x <= this._maxCols && dims.y <= this._maxRows) {
                return;
            }
            this._removeFromGrid(item);
            if (this._maxCols > 0 && dims.x > this._maxCols) {
                dims.x = this._maxCols;
                item.setSize(dims);
            }
            else if (this._maxRows > 0 && dims.y > this._maxRows) {
                dims.y = this._maxRows;
                item.setSize(dims);
            }
            if (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims, true)) {
                /** @type {?} */
                var newPosition = this._fixGridPosition(pos, dims);
                item.setGridPosition(newPosition);
            }
            this._addToGrid(item);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _calculateColWidth() {
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
    }
    /**
     * @private
     * @return {?}
     */
    _calculateRowHeight() {
        if (this._autoResize) {
            if (this._maxRows > 0 || this._visibleRows > 0) {
                /** @type {?} */
                var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
                /** @type {?} */
                let maxHeight;
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
    }
    /**
     * @private
     * @return {?}
     */
    _updateRatio() {
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
    }
    /**
     * @private
     * @param {?} changes
     * @return {?}
     */
    _applyChanges(changes) {
        changes.forEachAddedItem((/**
         * @param {?} record
         * @return {?}
         */
        (record) => { this._config[record.key] = record.currentValue; }));
        changes.forEachChangedItem((/**
         * @param {?} record
         * @return {?}
         */
        (record) => { this._config[record.key] = record.currentValue; }));
        changes.forEachRemovedItem((/**
         * @param {?} record
         * @return {?}
         */
        (record) => { delete this._config[record.key]; }));
        this.setConfig(this._config);
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _resizeStart(e) {
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
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _dragStart(e) {
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
    }
    /**
     * @private
     * @return {?}
     */
    _zoomOut() {
        this._renderer.setStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
    }
    /**
     * @private
     * @return {?}
     */
    _resetZoom() {
        this._renderer.setStyle(this._ngEl.nativeElement, 'transform', '');
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _drag(e) {
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
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _resize(e) {
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
        const mousePos = this._getMousePosition(e);
        /** @type {?} */
        const itemPos = this._resizingItem.getPosition();
        /** @type {?} */
        const itemDims = this._resizingItem.getDimensions();
        /** @type {?} */
        const endCorner = {
            left: itemPos.left + itemDims.width,
            top: itemPos.top + itemDims.height,
        };
        /** @type {?} */
        const resizeTop = this._resizeDirection.includes('top');
        /** @type {?} */
        const resizeBottom = this._resizeDirection.includes('bottom');
        /** @type {?} */
        const resizeLeft = this._resizeDirection.includes('left');
        /** @type {?} */
        const resizeRight = this._resizeDirection.includes('right');
        // Calculate new width and height based upon resize direction
        /** @type {?} */
        let newW = resizeRight
            ? (mousePos.left - itemPos.left + 1)
            : resizeLeft
                ? (endCorner.left - mousePos.left + 1)
                : itemDims.width;
        /** @type {?} */
        let newH = resizeBottom
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
        let newX = itemPos.left;
        /** @type {?} */
        let newY = itemPos.top;
        if (resizeLeft)
            newX = endCorner.left - newW;
        if (resizeTop)
            newY = endCorner.top - newH;
        /** @type {?} */
        let calcSize = this._calculateGridSize(newW, newH);
        /** @type {?} */
        const itemSize = this._resizingItem.getSize();
        /** @type {?} */
        const iGridPos = this._resizingItem.getGridPosition();
        /** @type {?} */
        const bottomRightCorner = {
            col: iGridPos.col + itemSize.x,
            row: iGridPos.row + itemSize.y,
        };
        /** @type {?} */
        const targetPos = Object.assign({}, iGridPos);
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
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _dragStop(e) {
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
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _resizeStop(e) {
        if (!this.isResizing)
            return;
        this.isResizing = false;
        /** @type {?} */
        const itemDims = this._resizingItem.getSize();
        this._resizingItem.setSize(itemDims);
        /** @type {?} */
        const itemPos = this._resizingItem.getGridPosition();
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
    }
    /**
     * @private
     * @return {?}
     */
    _cleanDrag() {
        this._draggingItem = null;
        this._posOffset = null;
        this.isDragging = false;
        this._dragReady = false;
    }
    /**
     * @private
     * @return {?}
     */
    _cleanResize() {
        this._resizingItem = null;
        this._resizeDirection = null;
        this.isResizing = false;
        this._resizeReady = false;
    }
    /**
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    _calculateGridSize(width, height) {
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
    }
    /**
     * @private
     * @param {?} left
     * @param {?} top
     * @return {?}
     */
    _calculateGridPosition(left, top) {
        /** @type {?} */
        var col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
        /** @type {?} */
        var row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);
        if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 }))
            col = this._maxCols;
        if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 }))
            row = this._maxRows;
        return { 'col': col, 'row': row };
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _hasGridCollision(pos, dims) {
        return false;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _getCollisions(pos, dims) {
        if (this._allowOverlap)
            return [];
        /** @type {?} */
        const returns = [];
        if (!pos.col) {
            pos.col = 1;
        }
        if (!pos.row) {
            pos.row = 1;
        }
        /** @type {?} */
        const leftCol = pos.col;
        /** @type {?} */
        const rightCol = pos.col + dims.x;
        /** @type {?} */
        const topRow = pos.row;
        /** @type {?} */
        const bottomRow = pos.row + dims.y;
        this._itemsInGrid.forEach((/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => {
            /** @type {?} */
            const item = this._items.get(itemId);
            if (!item) {
                this._itemsInGrid.delete(itemId);
                return;
            }
            /** @type {?} */
            const itemLeftCol = item.col;
            /** @type {?} */
            const itemRightCol = item.col + item.sizex;
            /** @type {?} */
            const itemTopRow = item.row;
            /** @type {?} */
            const itemBottomRow = item.row + item.sizey;
            /** @type {?} */
            const withinColumns = leftCol < itemRightCol && itemLeftCol < rightCol;
            /** @type {?} */
            const withinRows = topRow < itemBottomRow && itemTopRow < bottomRow;
            if (withinColumns && withinRows) {
                returns.push(item);
            }
        }));
        return returns;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixGridCollisions(pos, dims) {
        /** @type {?} */
        const collisions = this._getCollisions(pos, dims);
        if (collisions.length === 0) {
            return;
        }
        for (let collision of collisions) {
            this._removeFromGrid(collision);
            /** @type {?} */
            const itemDims = collision.getSize();
            /** @type {?} */
            const itemPos = collision.getGridPosition();
            /** @type {?} */
            let newItemPos = { col: itemPos.col, row: itemPos.row };
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
        this._fixGridCollisions(pos, dims);
    }
    /**
     * @private
     * @param {?=} pos
     * @param {?=} dims
     * @return {?}
     */
    _cascadeGrid(pos, dims) {
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
        let itemsInGrid = Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => this._items.get(itemId)));
        switch (this.cascade) {
            case 'up':
            case 'down':
                itemsInGrid = itemsInGrid.sort(NgGridHelper.sortItemsByPositionVertical);
                /** @type {?} */
                const lowestRowPerColumn = new Map();
                for (let item of itemsInGrid) {
                    if (item.isFixed)
                        continue;
                    /** @type {?} */
                    const itemDims = item.getSize();
                    /** @type {?} */
                    const itemPos = item.getGridPosition();
                    /** @type {?} */
                    let lowestRowForItem = lowestRowPerColumn.get(itemPos.col) || 1;
                    for (let i = 1; i < itemDims.x; i++) {
                        /** @type {?} */
                        const lowestRowForColumn = lowestRowPerColumn.get(itemPos.col + i) || 1;
                        lowestRowForItem = Math.max(lowestRowForColumn, lowestRowForItem);
                    }
                    /** @type {?} */
                    const leftCol = itemPos.col;
                    /** @type {?} */
                    const rightCol = itemPos.col + itemDims.x;
                    if (pos && dims) {
                        /** @type {?} */
                        const withinColumns = rightCol > pos.col && leftCol < (pos.col + dims.x);
                        if (withinColumns) { // If our element is in one of the item's columns
                            // If our element is in one of the item's columns
                            /** @type {?} */
                            const roomAboveItem = itemDims.y <= (pos.row - lowestRowForItem);
                            if (!roomAboveItem) { // Item can't fit above our element
                                lowestRowForItem = Math.max(lowestRowForItem, pos.row + dims.y); // Set the lowest row to be below it
                            }
                        }
                    }
                    /** @type {?} */
                    const newPos = { col: itemPos.col, row: lowestRowForItem };
                    //    What if it's not within bounds Y?
                    if (lowestRowForItem != itemPos.row && this._isWithinBoundsY(newPos, itemDims)) { // If the item is not already on this row move it up
                        this._removeFromGrid(item);
                        item.setGridPosition(newPos);
                        item.onCascadeEvent();
                        this._addToGrid(item);
                    }
                    for (let i = 0; i < itemDims.x; i++) {
                        lowestRowPerColumn.set(itemPos.col + i, lowestRowForItem + itemDims.y); // Update the lowest row to be below the item
                    }
                }
                break;
            case 'left':
            case 'right':
                itemsInGrid = itemsInGrid.sort(NgGridHelper.sortItemsByPositionHorizontal);
                /** @type {?} */
                const lowestColumnPerRow = new Map();
                for (let item of itemsInGrid) {
                    /** @type {?} */
                    const itemDims = item.getSize();
                    /** @type {?} */
                    const itemPos = item.getGridPosition();
                    /** @type {?} */
                    let lowestColumnForItem = lowestColumnPerRow.get(itemPos.row) || 1;
                    for (let i = 1; i < itemDims.y; i++) {
                        /** @type {?} */
                        let lowestOffsetColumn = lowestColumnPerRow.get(itemPos.row + i) || 1;
                        lowestColumnForItem = Math.max(lowestOffsetColumn, lowestColumnForItem);
                    }
                    /** @type {?} */
                    const topRow = itemPos.row;
                    /** @type {?} */
                    const bottomRow = itemPos.row + itemDims.y;
                    if (pos && dims) {
                        /** @type {?} */
                        const withinRows = bottomRow > pos.col && topRow < (pos.col + dims.x);
                        if (withinRows) { // If our element is in one of the item's rows
                            // If our element is in one of the item's rows
                            /** @type {?} */
                            const roomNextToItem = itemDims.x <= (pos.col - lowestColumnForItem);
                            if (!roomNextToItem) { // Item can't fit next to our element
                                lowestColumnForItem = Math.max(lowestColumnForItem, pos.col + dims.x); // Set the lowest col to be the other side of it
                            }
                        }
                    }
                    /** @type {?} */
                    const newPos = { col: lowestColumnForItem, row: itemPos.row };
                    if (lowestColumnForItem != itemPos.col && this._isWithinBoundsX(newPos, itemDims)) { // If the item is not already on this col move it up
                        this._removeFromGrid(item);
                        item.setGridPosition(newPos);
                        item.onCascadeEvent();
                        this._addToGrid(item);
                    }
                    for (let i = 0; i < itemDims.y; i++) {
                        lowestColumnPerRow.set(itemPos.row + i, lowestColumnForItem + itemDims.x); // Update the lowest col to be below the item
                    }
                }
                break;
            default:
                break;
        }
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixGridPosition(pos, dims) {
        if (!this._hasGridCollision(pos, dims))
            return pos;
        /** @type {?} */
        const maxRow = this._maxRows === 0 ? this._getMaxRow() : this._maxRows;
        /** @type {?} */
        const maxCol = this._maxCols === 0 ? this._getMaxCol() : this._maxCols;
        /** @type {?} */
        const newPos = {
            col: pos.col,
            row: pos.row,
        };
        if (this._itemFixDirection === 'vertical') {
            fixLoop: for (; newPos.col <= maxRow;) {
                /** @type {?} */
                const itemsInPath = this._getItemsInVerticalPath(newPos, dims, newPos.row);
                /** @type {?} */
                let nextRow = newPos.row;
                for (let item of itemsInPath) {
                    if (item.row - nextRow >= dims.y) {
                        newPos.row = nextRow;
                        break fixLoop;
                    }
                    nextRow = item.row + item.sizey;
                }
                if (maxRow - nextRow >= dims.y) {
                    newPos.row = nextRow;
                    break fixLoop;
                }
                newPos.col = Math.max(newPos.col + 1, Math.min.apply(Math, itemsInPath.map((/**
                 * @param {?} item
                 * @return {?}
                 */
                (item) => item.col + dims.x))));
                newPos.row = 1;
            }
        }
        else if (this._itemFixDirection === 'horizontal') {
            fixLoop: for (; newPos.row <= maxRow;) {
                /** @type {?} */
                const itemsInPath = this._getItemsInHorizontalPath(newPos, dims, newPos.col);
                /** @type {?} */
                let nextCol = newPos.col;
                for (let item of itemsInPath) {
                    if (item.col - nextCol >= dims.x) {
                        newPos.col = nextCol;
                        break fixLoop;
                    }
                    nextCol = item.col + item.sizex;
                }
                if (maxCol - nextCol >= dims.x) {
                    newPos.col = nextCol;
                    break fixLoop;
                }
                newPos.row = Math.max(newPos.row + 1, Math.min.apply(Math, itemsInPath.map((/**
                 * @param {?} item
                 * @return {?}
                 */
                (item) => item.row + dims.y))));
                newPos.col = 1;
            }
        }
        return newPos;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} startColumn
     * @return {?}
     */
    _getItemsInHorizontalPath(pos, dims, startColumn = 0) {
        /** @type {?} */
        const itemsInPath = [];
        /** @type {?} */
        const topRow = pos.row + dims.y - 1;
        this._itemsInGrid.forEach((/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => {
            /** @type {?} */
            const item = this._items.get(itemId);
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
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} startRow
     * @return {?}
     */
    _getItemsInVerticalPath(pos, dims, startRow = 0) {
        /** @type {?} */
        const itemsInPath = [];
        /** @type {?} */
        const rightCol = pos.col + dims.x - 1;
        this._itemsInGrid.forEach((/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => {
            /** @type {?} */
            const item = this._items.get(itemId);
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
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    _isWithinBoundsX(pos, dims, allowExcessiveItems = false) {
        return this._maxCols == 0 || (allowExcessiveItems && pos.col == 1) || (pos.col + dims.x - 1) <= this._maxCols;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixPosToBoundsX(pos, dims) {
        if (!this._isWithinBoundsX(pos, dims)) {
            pos.col = Math.max(this._maxCols - (dims.x - 1), 1);
            pos.row++;
        }
        return pos;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixSizeToBoundsX(pos, dims) {
        if (!this._isWithinBoundsX(pos, dims)) {
            dims.x = Math.max(this._maxCols - (pos.col - 1), 1);
            dims.y++;
        }
        return dims;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    _isWithinBoundsY(pos, dims, allowExcessiveItems = false) {
        return this._maxRows == 0 || (allowExcessiveItems && pos.row == 1) || (pos.row + dims.y - 1) <= this._maxRows;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixPosToBoundsY(pos, dims) {
        if (!this._isWithinBoundsY(pos, dims)) {
            pos.row = Math.max(this._maxRows - (dims.y - 1), 1);
            pos.col++;
        }
        return pos;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixSizeToBoundsY(pos, dims) {
        if (!this._isWithinBoundsY(pos, dims)) {
            dims.y = Math.max(this._maxRows - (pos.row - 1), 1);
            dims.x++;
        }
        return dims;
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @param {?=} allowExcessiveItems
     * @return {?}
     */
    _isWithinBounds(pos, dims, allowExcessiveItems = false) {
        return this._isWithinBoundsX(pos, dims, allowExcessiveItems) && this._isWithinBoundsY(pos, dims, allowExcessiveItems);
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixPosToBounds(pos, dims) {
        return this._fixPosToBoundsX(this._fixPosToBoundsY(pos, dims), dims);
    }
    /**
     * @private
     * @param {?} pos
     * @param {?} dims
     * @return {?}
     */
    _fixSizeToBounds(pos, dims) {
        return this._fixSizeToBoundsX(pos, this._fixSizeToBoundsY(pos, dims));
    }
    /**
     * @private
     * @param {?} item
     * @return {?}
     */
    _addToGrid(item) {
        /** @type {?} */
        let pos = item.getGridPosition();
        /** @type {?} */
        const dims = item.getSize();
        if (this._hasGridCollision(pos, dims)) {
            this._fixGridCollisions(pos, dims);
            pos = item.getGridPosition();
        }
        if (this._allowOverlap) {
            item.zIndex = this._lastZValue++;
        }
        this._itemsInGrid.add(item.uid);
    }
    /**
     * @private
     * @param {?} item
     * @return {?}
     */
    _removeFromGrid(item) {
        this._itemsInGrid.delete(item.uid);
    }
    /**
     * @private
     * @return {?}
     */
    _updateSize() {
        if (this._destroyed)
            return;
        /** @type {?} */
        let maxCol = this._getMaxCol();
        /** @type {?} */
        let maxRow = this._getMaxRow();
        if (maxCol != this._curMaxCol || maxRow != this._curMaxRow) {
            this._curMaxCol = maxCol;
            this._curMaxRow = maxRow;
        }
        this._renderer.setStyle(this._ngEl.nativeElement, 'width', '100%'); //(maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
        if (!this._elementBasedDynamicRowHeight) {
            this._renderer.setStyle(this._ngEl.nativeElement, 'height', (maxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + 'px');
        }
    }
    /**
     * @private
     * @return {?}
     */
    _getMaxRow() {
        /** @type {?} */
        const itemsRows = Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => {
            /** @type {?} */
            const item = this._items.get(itemId);
            if (!item)
                return 0;
            return item.row + item.sizey - 1;
        }));
        return Math.max.apply(null, itemsRows);
    }
    /**
     * @private
     * @return {?}
     */
    _getMaxCol() {
        /** @type {?} */
        const itemsCols = Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => {
            /** @type {?} */
            const item = this._items.get(itemId);
            if (!item)
                return 0;
            return item.col + item.sizex - 1;
        }));
        return Math.max.apply(null, itemsCols);
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _getMousePosition(e) {
        if ((((/** @type {?} */ (window))).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        /** @type {?} */
        const refPos = this._ngEl.nativeElement.getBoundingClientRect();
        /** @type {?} */
        let left = e.clientX - refPos.left;
        /** @type {?} */
        let top = e.clientY - refPos.top;
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
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    _getAbsoluteMousePosition(e) {
        if ((((/** @type {?} */ (window))).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        return {
            left: e.clientX,
            top: e.clientY
        };
    }
    /**
     * @private
     * @return {?}
     */
    _getContainerColumns() {
        /** @type {?} */
        const maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        /** @type {?} */
        const itemWidth = this.colWidth + this.marginLeft + this.marginRight;
        return Math.floor(maxWidth / itemWidth);
    }
    /**
     * @private
     * @return {?}
     */
    _getContainerRows() {
        /** @type {?} */
        const maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
        return Math.floor(maxHeight / (this.rowHeight + this.marginTop + this.marginBottom));
    }
    /**
     * @private
     * @return {?}
     */
    _getScreenMargin() {
        /** @type {?} */
        const maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        /** @type {?} */
        const itemWidth = this.colWidth + this.marginLeft + this.marginRight;
        return Math.floor((maxWidth - (this._maxCols * itemWidth)) / 2);
    }
    /**
     * @private
     * @param {?} position
     * @param {?=} dragStart
     * @return {?}
     */
    _getItemFromPosition(position, dragStart) {
        return Array.from(this._itemsInGrid, (/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => this._items.get(itemId))).find((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            if (!item)
                return false;
            /** @type {?} */
            const size = item.getDimensions();
            /** @type {?} */
            const pos = item.getPosition();
            if (position.left > (pos.left + this.marginLeft) && position.left < (pos.left + this.marginLeft + size.width) &&
                position.top > (pos.top + this.marginTop) && position.top < (pos.top + this.marginTop + size.height)) {
                if (dragStart) {
                    if (item.config.active) {
                        return item;
                    }
                }
                else {
                    return item;
                }
                return position.left >= pos.left && position.left < (pos.left + size.width)
                    && position.top >= pos.top && position.top < (pos.top + size.height);
            }
        }));
    }
    /**
     * @private
     * @param {?} item
     * @return {?}
     */
    _createPlaceholder(item) {
        /** @type {?} */
        const pos = item.getGridPosition();
        /** @type {?} */
        const dims = item.getSize();
        /** @type {?} */
        const factory = this.componentFactoryResolver.resolveComponentFactory(NgGridPlaceholder);
        /** @type {?} */
        var componentRef = item.containerRef.createComponent(factory);
        this._placeholderRef = componentRef;
        /** @type {?} */
        const placeholder = componentRef.instance;
        placeholder.registerGrid(this);
        placeholder.setCascadeMode(this.cascade);
        placeholder.setGridPosition({ col: pos.col, row: pos.row });
        placeholder.setSize({ x: dims.x, y: dims.y });
    }
    /**
     * @private
     * @return {?}
     */
    _emitOnItemChange() {
        /** @type {?} */
        const itemOutput = Array.from(this._itemsInGrid)
            .map((/**
         * @param {?} itemId
         * @return {?}
         */
        (itemId) => this._items.get(itemId)))
            .filter((/**
         * @param {?} item
         * @return {?}
         */
        (item) => !!item))
            .map((/**
         * @param {?} item
         * @return {?}
         */
        (item) => item.getEventOutput()));
        this.onItemChange.emit(itemOutput);
    }
    /**
     * @private
     * @return {?}
     */
    _defineListeners() {
        /** @type {?} */
        const element = this._ngEl.nativeElement;
        this._documentMousemove$ = fromEvent(document, 'mousemove');
        this._documentMouseup$ = fromEvent(document, 'mouseup');
        this._mousedown$ = fromEvent(element, 'mousedown');
        this._mousemove$ = fromEvent(element, 'mousemove');
        this._mouseup$ = fromEvent(element, 'mouseup');
        this._touchstart$ = fromEvent(element, 'touchstart');
        this._touchmove$ = fromEvent(element, 'touchmove');
        this._touchend$ = fromEvent(element, 'touchend');
    }
    /**
     * @private
     * @return {?}
     */
    _enableListeners() {
        if (this._enabledListener) {
            return;
        }
        this._enableMouseListeners();
        if (this._isTouchDevice()) {
            this._enableTouchListeners();
        }
        this._enabledListener = true;
    }
    /**
     * @private
     * @return {?}
     */
    _disableListeners() {
        this._subscriptions.forEach((/**
         * @param {?} subs
         * @return {?}
         */
        (subs) => subs.unsubscribe()));
        this._enabledListener = false;
    }
    /**
     * @private
     * @return {?}
     */
    _isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    ;
    /**
     * @private
     * @return {?}
     */
    _enableTouchListeners() {
        /** @type {?} */
        const touchstartSubs = this._touchstart$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseDownEventHandler(e)));
        /** @type {?} */
        const touchmoveSubs = this._touchmove$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseMoveEventHandler(e)));
        /** @type {?} */
        const touchendSubs = this._touchend$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseUpEventHandler(e)));
        this._subscriptions.push(touchstartSubs, touchmoveSubs, touchendSubs);
    }
    /**
     * @private
     * @return {?}
     */
    _enableMouseListeners() {
        /** @type {?} */
        const documentMousemoveSubs = this._documentMousemove$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseMoveEventHandler(e)));
        /** @type {?} */
        const documentMouseupSubs = this._documentMouseup$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseUpEventHandler(e)));
        /** @type {?} */
        const mousedownSubs = this._mousedown$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseDownEventHandler(e)));
        /** @type {?} */
        const mousemoveSubs = this._mousemove$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseMoveEventHandler(e)));
        /** @type {?} */
        const mouseupSubs = this._mouseup$.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.mouseUpEventHandler(e)));
        this._subscriptions.push(documentMousemoveSubs, documentMouseupSubs, mousedownSubs, mousemoveSubs, mouseupSubs);
    }
}
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
NgGrid.ctorParameters = () => [
    { type: KeyValueDiffers },
    { type: ElementRef },
    { type: Renderer2 },
    { type: ComponentFactoryResolver }
];
NgGrid.propDecorators = {
    onDragStart: [{ type: Output }],
    onDrag: [{ type: Output }],
    onDragStop: [{ type: Output }],
    onResizeStart: [{ type: Output }],
    onResize: [{ type: Output }],
    onResizeStop: [{ type: Output }],
    onItemChange: [{ type: Output }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmdHcmlkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZ3JpZC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvTmdHcmlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFhLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSx3QkFBd0IsRUFBK0QsZUFBZSxFQUFnRCxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHeFAsT0FBTyxLQUFLLFlBQVksTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRSxPQUFPLEVBQTRCLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQVMzRCxNQUFNLE9BQU8sTUFBTTs7Ozs7Ozs7SUEwSWYsWUFDWSxRQUF5QixFQUN6QixLQUFpQixFQUNqQixTQUFvQixFQUNwQix3QkFBa0Q7UUFIbEQsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7UUFDekIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7O1FBakk3QyxnQkFBVyxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO1FBQ3ZFLFdBQU0sR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUNsRSxlQUFVLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7UUFDdEUsa0JBQWEsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUN6RSxhQUFRLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7UUFDcEUsaUJBQVksR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUN4RSxpQkFBWSxHQUF5QyxJQUFJLFlBQVksRUFBMEIsQ0FBQzs7UUFHMUcsYUFBUSxHQUFXLEdBQUcsQ0FBQztRQUN2QixjQUFTLEdBQVcsR0FBRyxDQUFDO1FBQ3hCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFD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b0M7Ozs7O0lBQ3BDLDZCQUFxQzs7Ozs7SUFDckMseUJBQTZDOzs7OztJQUM3Qyw0QkFBb0M7Ozs7O0lBQ3BDLGdDQUF3Qzs7Ozs7SUFDeEMsOEJBQTZCOzs7OztJQUM3Qiw0QkFBb0M7Ozs7O0lBQ3BDLDZCQUFxQzs7Ozs7SUFDckMsZ0NBQXdDOzs7OztJQUN4QyxpQ0FBeUM7Ozs7O0lBQ3pDLDRCQUErQjs7Ozs7SUFDL0IsNEJBQStCOzs7OztJQUMvQiw0QkFBb0M7Ozs7O0lBQ3BDLDhCQUFzQzs7Ozs7SUFDdEMsK0NBQXVEOzs7OztJQUN2RCxtQ0FBNEQ7Ozs7O0lBQzVELHdDQUFpRTs7Ozs7SUFDakUsK0JBQXVDOzs7OztJQUN2QyxpQ0FBdUM7Ozs7O0lBQ3ZDLDZCQUFnQzs7Ozs7SUFHaEMscUNBQW9EOzs7OztJQUNwRCxtQ0FBa0Q7Ozs7O0lBQ2xELDZCQUE0Qzs7Ozs7SUFDNUMsNkJBQTRDOzs7OztJQUM1QywyQkFBMEM7Ozs7O0lBQzFDLDhCQUE2Qzs7Ozs7SUFDN0MsNkJBQTRDOzs7OztJQUM1Qyw0QkFBMkM7Ozs7O0lBQzNDLGdDQUE0Qzs7Ozs7SUFFNUMsa0NBQTBDOzs7OztJQThCMUMseUJBQThDOzs7OztJQW1CMUMsMEJBQWlDOzs7OztJQUNqQyx1QkFBeUI7Ozs7O0lBQ3pCLDJCQUE0Qjs7Ozs7SUFDNUIsMENBQTBEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgRXZlbnRFbWl0dGVyLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIEhvc3QsIFZpZXdFbmNhcHN1bGF0aW9uLCBUeXBlLCBDb21wb25lbnRSZWYsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlcnMsIE9uSW5pdCwgT25EZXN0cm95LCBEb0NoZWNrLCBWaWV3Q29udGFpbmVyUmVmLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nR3JpZENvbmZpZywgTmdHcmlkSXRlbUV2ZW50LCBOZ0dyaWRJdGVtUG9zaXRpb24sIE5nR3JpZEl0ZW1TaXplLCBOZ0dyaWRSYXdQb3NpdGlvbiwgTmdHcmlkSXRlbURpbWVuc2lvbnMsIE5nQ29uZmlnRml4RGlyZWN0aW9uIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9JTmdHcmlkJztcbmltcG9ydCB7IE5nR3JpZEl0ZW0gfSBmcm9tICcuL05nR3JpZEl0ZW0nO1xuaW1wb3J0ICogYXMgTmdHcmlkSGVscGVyIGZyb20gJy4uL2hlbHBlcnMvTmdHcmlkSGVscGVycyc7XG5pbXBvcnQgeyBOZ0dyaWRQbGFjZWhvbGRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmdHcmlkUGxhY2Vob2xkZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBPYnNlcnZhYmxlLCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbbmdHcmlkXScsXG4gICAgaW5wdXRzOiBbJ2NvbmZpZzogbmdHcmlkJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnKHdpbmRvdzpyZXNpemUpJzogJ3Jlc2l6ZUV2ZW50SGFuZGxlcigkZXZlbnQpJyxcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nR3JpZCBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgICBwdWJsaWMgc3RhdGljIENPTlNUX0RFRkFVTFRfUkVTSVpFX0RJUkVDVElPTlM6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYm90dG9tcmlnaHQnLFxuICAgICAgICAnYm90dG9tbGVmdCcsXG4gICAgICAgICd0b3ByaWdodCcsXG4gICAgICAgICd0b3BsZWZ0JyxcbiAgICAgICAgJ3JpZ2h0JyxcbiAgICAgICAgJ2xlZnQnLFxuICAgICAgICAnYm90dG9tJyxcbiAgICAgICAgJ3RvcCcsXG4gICAgXTtcblxuICAgIC8vIEV2ZW50IEVtaXR0ZXJzXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkRyYWdTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkRyYWdTdG9wOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZVN0YXJ0OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemVTdG9wOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkl0ZW1DaGFuZ2U6IEV2ZW50RW1pdHRlcjxBcnJheTxOZ0dyaWRJdGVtRXZlbnQ+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8TmdHcmlkSXRlbUV2ZW50Pj4oKTtcblxuICAgIC8vIFB1YmxpYyB2YXJpYWJsZXNcbiAgICBwdWJsaWMgY29sV2lkdGg6IG51bWJlciA9IDI1MDtcbiAgICBwdWJsaWMgcm93SGVpZ2h0OiBudW1iZXIgPSAyNTA7XG4gICAgcHVibGljIG1pbkNvbHM6IG51bWJlciA9IDE7XG4gICAgcHVibGljIG1pblJvd3M6IG51bWJlciA9IDE7XG4gICAgcHVibGljIG1hcmdpblRvcDogbnVtYmVyID0gMTA7XG4gICAgcHVibGljIG1hcmdpblJpZ2h0OiBudW1iZXIgPSAxMDtcbiAgICBwdWJsaWMgbWFyZ2luQm90dG9tOiBudW1iZXIgPSAxMDtcbiAgICBwdWJsaWMgbWFyZ2luTGVmdDogbnVtYmVyID0gMTA7XG4gICAgcHVibGljIHNjcmVlbk1hcmdpbjogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc1Jlc2l6aW5nOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGF1dG9TdHlsZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIHJlc2l6ZUVuYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIGRyYWdFbmFibGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBjYXNjYWRlOiBzdHJpbmcgPSAndXAnO1xuICAgIHB1YmxpYyBtaW5XaWR0aDogbnVtYmVyID0gMTAwO1xuICAgIHB1YmxpYyBtaW5IZWlnaHQ6IG51bWJlciA9IDEwMDtcbiAgICBwdWJsaWMgcmVzaXplRGlyZWN0aW9uczogc3RyaW5nW10gPSBOZ0dyaWQuQ09OU1RfREVGQVVMVF9SRVNJWkVfRElSRUNUSU9OUztcblxuICAgIC8vIFByaXZhdGUgdmFyaWFibGVzXG4gICAgcHJpdmF0ZSBfaXRlbXM6IE1hcDxzdHJpbmcsIE5nR3JpZEl0ZW0+ID0gbmV3IE1hcDxzdHJpbmcsIE5nR3JpZEl0ZW0+KCk7XG4gICAgcHJpdmF0ZSBfZHJhZ2dpbmdJdGVtOiBOZ0dyaWRJdGVtID0gbnVsbDtcbiAgICBwcml2YXRlIF9yZXNpemluZ0l0ZW06IE5nR3JpZEl0ZW0gPSBudWxsO1xuICAgIHByaXZhdGUgX3Jlc2l6ZURpcmVjdGlvbjogc3RyaW5nID0gbnVsbDtcbiAgICBwcml2YXRlIF9pdGVtc0luR3JpZDogU2V0PHN0cmluZz4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBwcml2YXRlIF9jb250YWluZXJXaWR0aDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2NvbnRhaW5lckhlaWdodDogbnVtYmVyO1xuICAgIHByaXZhdGUgX21heENvbHM6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfbWF4Um93czogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF92aXNpYmxlQ29sczogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF92aXNpYmxlUm93czogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9zZXRXaWR0aDogbnVtYmVyID0gMjUwO1xuICAgIHByaXZhdGUgX3NldEhlaWdodDogbnVtYmVyID0gMjUwO1xuICAgIHByaXZhdGUgX3Bvc09mZnNldDogTmdHcmlkUmF3UG9zaXRpb24gPSBudWxsO1xuICAgIHByaXZhdGUgX2FkZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyUmVmOiBDb21wb25lbnRSZWY8TmdHcmlkUGxhY2Vob2xkZXI+ID0gbnVsbDtcbiAgICBwcml2YXRlIF9maXhUb0dyaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9hdXRvUmVzaXplOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfZGlmZmVyOiBLZXlWYWx1ZURpZmZlcjxzdHJpbmcsIGFueT47XG4gICAgcHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfbWFpbnRhaW5SYXRpbzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2FzcGVjdFJhdGlvOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfcHJlZmVyTmV3OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfem9vbU9uRHJhZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2xpbWl0VG9TY3JlZW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9jZW50ZXJUb1NjcmVlbjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2N1ck1heFJvdzogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9jdXJNYXhDb2w6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfZHJhZ1JlYWR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfcmVzaXplUmVhZHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9lbGVtZW50QmFzZWREeW5hbWljUm93SGVpZ2h0OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfaXRlbUZpeERpcmVjdGlvbjogTmdDb25maWdGaXhEaXJlY3Rpb24gPSAnY2FzY2FkZSc7XG4gICAgcHJpdmF0ZSBfY29sbGlzaW9uRml4RGlyZWN0aW9uOiBOZ0NvbmZpZ0ZpeERpcmVjdGlvbiA9ICdjYXNjYWRlJztcbiAgICBwcml2YXRlIF9hbGxvd092ZXJsYXA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9jYXNjYWRlUHJvbWlzZTogUHJvbWlzZTx2b2lkPjtcbiAgICBwcml2YXRlIF9sYXN0WlZhbHVlOiBudW1iZXIgPSAxO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgcHJpdmF0ZSBfZG9jdW1lbnRNb3VzZW1vdmUkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICAgIHByaXZhdGUgX2RvY3VtZW50TW91c2V1cCQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gICAgcHJpdmF0ZSBfbW91c2Vkb3duJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgICBwcml2YXRlIF9tb3VzZW1vdmUkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICAgIHByaXZhdGUgX21vdXNldXAkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICAgIHByaXZhdGUgX3RvdWNoc3RhcnQkOiBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+O1xuICAgIHByaXZhdGUgX3RvdWNobW92ZSQ6IE9ic2VydmFibGU8VG91Y2hFdmVudD47XG4gICAgcHJpdmF0ZSBfdG91Y2hlbmQkOiBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+O1xuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBwcml2YXRlIF9lbmFibGVkTGlzdGVuZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8vIERlZmF1bHQgY29uZmlnXG4gICAgcHJpdmF0ZSBzdGF0aWMgQ09OU1RfREVGQVVMVF9DT05GSUc6IE5nR3JpZENvbmZpZyA9IHtcbiAgICAgICAgbWFyZ2luczogWzEwXSxcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIG1heF9jb2xzOiAwLFxuICAgICAgICBtYXhfcm93czogMCxcbiAgICAgICAgdmlzaWJsZV9jb2xzOiAwLFxuICAgICAgICB2aXNpYmxlX3Jvd3M6IDAsXG4gICAgICAgIGNvbF93aWR0aDogMjUwLFxuICAgICAgICByb3dfaGVpZ2h0OiAyNTAsXG4gICAgICAgIGNhc2NhZGU6ICd1cCcsXG4gICAgICAgIG1pbl93aWR0aDogMTAwLFxuICAgICAgICBtaW5faGVpZ2h0OiAxMDAsXG4gICAgICAgIGZpeF90b19ncmlkOiBmYWxzZSxcbiAgICAgICAgYXV0b19zdHlsZTogdHJ1ZSxcbiAgICAgICAgYXV0b19yZXNpemU6IGZhbHNlLFxuICAgICAgICBtYWludGFpbl9yYXRpbzogZmFsc2UsXG4gICAgICAgIHByZWZlcl9uZXc6IGZhbHNlLFxuICAgICAgICB6b29tX29uX2RyYWc6IGZhbHNlLFxuICAgICAgICBsaW1pdF90b19zY3JlZW46IGZhbHNlLFxuICAgICAgICBjZW50ZXJfdG9fc2NyZWVuOiBmYWxzZSxcbiAgICAgICAgcmVzaXplX2RpcmVjdGlvbnM6IE5nR3JpZC5DT05TVF9ERUZBVUxUX1JFU0laRV9ESVJFQ1RJT05TLFxuICAgICAgICBlbGVtZW50X2Jhc2VkX3Jvd19oZWlnaHQ6IGZhbHNlLFxuICAgICAgICBmaXhfaXRlbV9wb3NpdGlvbl9kaXJlY3Rpb246ICdjYXNjYWRlJyxcbiAgICAgICAgZml4X2NvbGxpc2lvbl9wb3NpdGlvbl9kaXJlY3Rpb246ICdjYXNjYWRlJyxcbiAgICAgICAgYWxsb3dfb3ZlcmxhcDogZmFsc2UsXG4gICAgfTtcbiAgICBwcml2YXRlIF9jb25maWcgPSBOZ0dyaWQuQ09OU1RfREVGQVVMVF9DT05GSUc7XG5cbiAgICAvLyBbbmctZ3JpZF0gYXR0cmlidXRlIGhhbmRsZXJcbiAgICBzZXQgY29uZmlnKHY6IE5nR3JpZENvbmZpZykge1xuICAgICAgICBpZiAodiA9PSBudWxsIHx8IHR5cGVvZiB2ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDb25maWcodik7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpZmZlciA9PSBudWxsICYmIHYgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fZGlmZmVyID0gdGhpcy5fZGlmZmVycy5maW5kKHRoaXMuX2NvbmZpZykuY3JlYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgX2RpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICAgICAgcHJpdmF0ZSBfbmdFbDogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICApIHtcbiAgICAgICAgdGhpcy5fZGVmaW5lTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgLy8gUHVibGljIG1ldGhvZHNcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2dyaWQnKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1N0eWxlKSB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgICB0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZGlzYWJsZUxpc3RlbmVycygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUl0ZW1VaWQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdWlkOiBzdHJpbmcgPSBOZ0dyaWRIZWxwZXIuZ2VuZXJhdGVVdWlkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1zLmhhcyh1aWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUl0ZW1VaWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1aWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbmZpZyhjb25maWc6IE5nR3JpZENvbmZpZyk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgdmFyIG1heENvbFJvd0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgeCBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjb25maWdbeF07XG4gICAgICAgICAgICB2YXIgaW50VmFsID0gIXZhbCA/IDAgOiBwYXJzZUludCh2YWwpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHgpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdtYXJnaW5zJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNYXJnaW5zKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbF93aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sV2lkdGggPSBNYXRoLm1heChpbnRWYWwsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyb3dfaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dIZWlnaHQgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhdXRvX3N0eWxlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRvU3R5bGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2F1dG9fcmVzaXplJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXV0b1Jlc2l6ZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZHJhZ2dhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnRW5hYmxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyZXNpemFibGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUVuYWJsZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWF4X3Jvd3MnOlxuICAgICAgICAgICAgICAgICAgICBtYXhDb2xSb3dDaGFuZ2VkID0gbWF4Q29sUm93Q2hhbmdlZCB8fCB0aGlzLl9tYXhSb3dzICE9IGludFZhbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4Um93cyA9IGludFZhbCA8IDAgPyAwIDogaW50VmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtYXhfY29scyc6XG4gICAgICAgICAgICAgICAgICAgIG1heENvbFJvd0NoYW5nZWQgPSBtYXhDb2xSb3dDaGFuZ2VkIHx8IHRoaXMuX21heENvbHMgIT0gaW50VmFsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXhDb2xzID0gaW50VmFsIDwgMCA/IDAgOiBpbnRWYWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Zpc2libGVfcm93cyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Zpc2libGVSb3dzID0gTWF0aC5tYXgoaW50VmFsLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndmlzaWJsZV9jb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlzaWJsZUNvbHMgPSBNYXRoLm1heChpbnRWYWwsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtaW5fcm93cyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluUm93cyA9IE1hdGgubWF4KGludFZhbCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbl9jb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5Db2xzID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWluX2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluSGVpZ2h0ID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWluX3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5XaWR0aCA9IE1hdGgubWF4KGludFZhbCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3pvb21fb25fZHJhZyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3pvb21PbkRyYWcgPSB2YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Nhc2NhZGUnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYXNjYWRlICE9IHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXNjYWRlID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzY2FkZUdyaWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdmaXhfdG9fZ3JpZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpeFRvR3JpZCA9IHZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWFpbnRhaW5fcmF0aW8nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYWludGFpblJhdGlvID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwcmVmZXJfbmV3JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJlZmVyTmV3ID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdsaW1pdF90b19zY3JlZW4nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW1pdFRvU2NyZWVuID0gIXRoaXMuX2F1dG9SZXNpemUgJiYgISF2YWw7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW1pdFRvU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4Q29scyA9IHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjZW50ZXJfdG9fc2NyZWVuJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2VudGVyVG9TY3JlZW4gPSB2YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Jlc2l6ZV9kaXJlY3Rpb25zJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemVEaXJlY3Rpb25zID0gdmFsIHx8IFsnYm90dG9tcmlnaHQnLCAnYm90dG9tbGVmdCcsICd0b3ByaWdodCcsICd0b3BsZWZ0JywgJ3JpZ2h0JywgJ2xlZnQnLCAnYm90dG9tJywgJ3RvcCddO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlbGVtZW50X2Jhc2VkX3Jvd19oZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50QmFzZWREeW5hbWljUm93SGVpZ2h0ID0gISF2YWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpeF9pdGVtX3Bvc2l0aW9uX2RpcmVjdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1GaXhEaXJlY3Rpb24gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpeF9jb2xsaXNpb25fcG9zaXRpb25fZGlyZWN0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29sbGlzaW9uRml4RGlyZWN0aW9uID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhbGxvd19vdmVybGFwJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWxsb3dPdmVybGFwID0gISF2YWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2FsbG93T3ZlcmxhcCAmJiB0aGlzLmNhc2NhZGUgIT09ICdvZmYnICYmIHRoaXMuY2FzY2FkZSAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIG92ZXJsYXAgaXRlbXMgd2hlbiBhIGNhc2NhZGUgZGlyZWN0aW9uIGlzIHNldC4nKTtcbiAgICAgICAgICAgIHRoaXMuX2FsbG93T3ZlcmxhcCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhZ0VuYWJsZSB8fCB0aGlzLnJlc2l6ZUVuYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlTGlzdGVuZXJzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlTGlzdGVuZXJzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5faXRlbUZpeERpcmVjdGlvbiA9PT0gJ2Nhc2NhZGUnKSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtRml4RGlyZWN0aW9uID0gdGhpcy5fZ2V0Rml4RGlyZWN0aW9uRnJvbUNhc2NhZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jb2xsaXNpb25GaXhEaXJlY3Rpb24gPT09ICdjYXNjYWRlJykge1xuICAgICAgICAgICAgdGhpcy5fY29sbGlzaW9uRml4RGlyZWN0aW9uID0gdGhpcy5fZ2V0Rml4RGlyZWN0aW9uRnJvbUNhc2NhZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9saW1pdFRvU2NyZWVuKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdNYXhDb2xzID0gdGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Q29scyAhPSBuZXdNYXhDb2xzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4Q29scyA9IG5ld01heENvbHM7XG4gICAgICAgICAgICAgICAgbWF4Q29sUm93Q2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbGltaXRUb1NjcmVlbiAmJiB0aGlzLl9jZW50ZXJUb1NjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5zY3JlZW5NYXJnaW4gPSB0aGlzLl9nZXRTY3JlZW5NYXJnaW4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NyZWVuTWFyZ2luID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9tYWludGFpblJhdGlvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2xXaWR0aCAmJiB0aGlzLnJvd0hlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMucm93SGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYWludGFpblJhdGlvID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF4Q29sUm93Q2hhbmdlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMuX21heFJvd3MgPiAwKSB7ICAgIC8vICAgIENhbid0IGhhdmUgYm90aCwgcHJpb3JpdGlzZSBvbiBjYXNjYWRlXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21heENvbHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXhSb3dzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb25zQWZ0ZXJNYXhDaGFuZ2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUNvbFdpZHRoKCk7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVJvd0hlaWdodCgpO1xuXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IHRoaXMuX21heENvbHMgKiB0aGlzLmNvbFdpZHRoO1xuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gdGhpcy5fbWF4Um93cyAqIHRoaXMucm93SGVpZ2h0O1xuXG4gICAgICAgIGlmIChtYXhXaWR0aCA+IDAgJiYgdGhpcy5taW5XaWR0aCA+IG1heFdpZHRoKSB0aGlzLm1pbldpZHRoID0gMC43NSAqIHRoaXMuY29sV2lkdGg7XG4gICAgICAgIGlmIChtYXhIZWlnaHQgPiAwICYmIHRoaXMubWluSGVpZ2h0ID4gbWF4SGVpZ2h0KSB0aGlzLm1pbkhlaWdodCA9IDAuNzUgKiB0aGlzLnJvd0hlaWdodDtcblxuICAgICAgICBpZiAodGhpcy5taW5XaWR0aCA+IHRoaXMuY29sV2lkdGgpIHRoaXMubWluQ29scyA9IE1hdGgubWF4KHRoaXMubWluQ29scywgTWF0aC5jZWlsKHRoaXMubWluV2lkdGggLyB0aGlzLmNvbFdpZHRoKSk7XG4gICAgICAgIGlmICh0aGlzLm1pbkhlaWdodCA+IHRoaXMucm93SGVpZ2h0KSB0aGlzLm1pblJvd3MgPSBNYXRoLm1heCh0aGlzLm1pblJvd3MsIE1hdGguY2VpbCh0aGlzLm1pbkhlaWdodCAvIHRoaXMucm93SGVpZ2h0KSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMubWluQ29scyA+IHRoaXMuX21heENvbHMpIHRoaXMubWluQ29scyA9IDE7XG4gICAgICAgIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLm1pblJvd3MgPiB0aGlzLl9tYXhSb3dzKSB0aGlzLm1pblJvd3MgPSAxO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJhdGlvKCk7XG5cbiAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCgoaXRlbTogTmdHcmlkSXRlbSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XG4gICAgICAgICAgICBpdGVtLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1zLmZvckVhY2goKGl0ZW06IE5nR3JpZEl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XG4gICAgICAgICAgICB0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2Nhc2NhZGVHcmlkKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SXRlbVBvc2l0aW9uKGl0ZW1JZDogc3RyaW5nKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmhhcyhpdGVtSWQpID8gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCkuZ2V0R3JpZFBvc2l0aW9uKCkgOiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJdGVtU2l6ZShpdGVtSWQ6IHN0cmluZyk6IE5nR3JpZEl0ZW1TaXplIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmhhcyhpdGVtSWQpID8gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCkuZ2V0U2l6ZSgpIDogbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdEb0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fZGlmZmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VzID0gdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5fY29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKGNoYW5nZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRNYXJnaW5zKG1hcmdpbnM6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tYXJnaW5Ub3AgPSBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzBdKSwgMCk7XG4gICAgICAgIHRoaXMubWFyZ2luUmlnaHQgPSBtYXJnaW5zLmxlbmd0aCA+PSAyID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1sxXSksIDApIDogdGhpcy5tYXJnaW5Ub3A7XG4gICAgICAgIHRoaXMubWFyZ2luQm90dG9tID0gbWFyZ2lucy5sZW5ndGggPj0gMyA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMl0pLCAwKSA6IHRoaXMubWFyZ2luVG9wO1xuICAgICAgICB0aGlzLm1hcmdpbkxlZnQgPSBtYXJnaW5zLmxlbmd0aCA+PSA0ID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1szXSksIDApIDogdGhpcy5tYXJnaW5SaWdodDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5hYmxlRHJhZygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kcmFnRW5hYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGlzYWJsZURyYWcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhZ0VuYWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmFibGVSZXNpemUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplRW5hYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGlzYWJsZVJlc2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNpemVFbmFibGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkSXRlbShuZ0l0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcbiAgICAgICAgbmdJdGVtLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9wcmVmZXJOZXcpIHtcbiAgICAgICAgICAgIHZhciBuZXdQb3MgPSB0aGlzLl9maXhHcmlkUG9zaXRpb24obmdJdGVtLmdldEdyaWRQb3NpdGlvbigpLCBuZ0l0ZW0uZ2V0U2l6ZSgpKTtcbiAgICAgICAgICAgIG5nSXRlbS5zZXRHcmlkUG9zaXRpb24obmV3UG9zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZ0l0ZW0udWlkID09PSBudWxsIHx8IHRoaXMuX2l0ZW1zLmhhcyhuZ0l0ZW0udWlkKSkge1xuICAgICAgICAgICAgbmdJdGVtLnVpZCA9IHRoaXMuZ2VuZXJhdGVJdGVtVWlkKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pdGVtcy5zZXQobmdJdGVtLnVpZCwgbmdJdGVtKTtcbiAgICAgICAgdGhpcy5fYWRkVG9HcmlkKG5nSXRlbSk7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlU2l6ZSgpO1xuXG4gICAgICAgIHRoaXMudHJpZ2dlckNhc2NhZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIG5nSXRlbS5yZWNhbGN1bGF0ZVNlbGYoKTtcbiAgICAgICAgICAgIG5nSXRlbS5vbkNhc2NhZGVFdmVudCgpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbWl0T25JdGVtQ2hhbmdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZUl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKG5nSXRlbSk7XG5cbiAgICAgICAgdGhpcy5faXRlbXMuZGVsZXRlKG5nSXRlbS51aWQpO1xuXG4gICAgICAgIGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnRyaWdnZXJDYXNjYWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiBpdGVtLnJlY2FsY3VsYXRlU2VsZigpKTtcbiAgICAgICAgICAgIHRoaXMuX2VtaXRPbkl0ZW1DaGFuZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZUl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21HcmlkKG5nSXRlbSk7XG4gICAgICAgIHRoaXMuX2FkZFRvR3JpZChuZ0l0ZW0pO1xuXG4gICAgICAgIHRoaXMudHJpZ2dlckNhc2NhZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICAgICAgICAgIG5nSXRlbS5vbkNhc2NhZGVFdmVudCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpZ2dlckNhc2NhZGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghdGhpcy5fY2FzY2FkZVByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc2NhZGVQcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzY2FkZVByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXNjYWRlR3JpZChudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fY2FzY2FkZVByb21pc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaWdnZXJSZXNpemUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplRXZlbnRIYW5kbGVyKG51bGwpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNpemVFdmVudEhhbmRsZXIoZTogYW55KTogdm9pZCB7XG4gICAgICAgIC8vIHRoaXMuX2NhbGN1bGF0ZUNvbFdpZHRoKCk7XG4gICAgICAgIC8vIHRoaXMuX2NhbGN1bGF0ZVJvd0hlaWdodCgpO1xuICAgICAgICAvL1xuICAgICAgICAvLyB0aGlzLl91cGRhdGVSYXRpbygpO1xuXG4gICAgICAgIGlmICh0aGlzLl9saW1pdFRvU2NyZWVuKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdNYXhDb2x1bW5zID0gdGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX21heENvbHMgIT09IG5ld01heENvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhDb2xzID0gbmV3TWF4Q29sdW1ucztcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl91cGRhdGVQb3NpdGlvbnNBZnRlck1heENoYW5nZSgpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2Nhc2NhZGVHcmlkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXJUb1NjcmVlbikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuTWFyZ2luID0gdGhpcy5fZ2V0U2NyZWVuTWFyZ2luKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYXV0b1Jlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCgoaXRlbTogTmdHcmlkSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMuX3VwZGF0ZVNpemUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW91c2VEb3duRXZlbnRIYW5kbGVyKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcywgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGl0ZW0gPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlc2l6ZURpcmVjdGlvbjogc3RyaW5nID0gaXRlbS5jYW5SZXNpemUoZSk7XG5cbiAgICAgICAgaWYgKHRoaXMucmVzaXplRW5hYmxlICYmIHJlc2l6ZURpcmVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9IHJlc2l6ZURpcmVjdGlvbjtcblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ0VuYWJsZSAmJiBpdGVtLmNhbkRyYWcoZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYWdSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0gPSBpdGVtO1xuXG4gICAgICAgICAgICBjb25zdCBpdGVtUG9zID0gaXRlbS5nZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5fcG9zT2Zmc2V0ID0geyAnbGVmdCc6IChtb3VzZVBvcy5sZWZ0IC0gaXRlbVBvcy5sZWZ0KSwgJ3RvcCc6IChtb3VzZVBvcy50b3AgLSBpdGVtUG9zLnRvcCkgfVxuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbW91c2VVcEV2ZW50SGFuZGxlcihlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnU3RvcChlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZVN0b3AoZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZHJhZ1JlYWR5IHx8IHRoaXMuX3Jlc2l6ZVJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9jbGVhbkRyYWcoKTtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuUmVzaXplKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbW91c2VNb3ZlRXZlbnRIYW5kbGVyKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVSZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplU3RhcnQoZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZHJhZ1JlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnU3RhcnQoZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnKGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNSZXNpemluZykge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplKGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICAgIFByaXZhdGUgbWV0aG9kc1xuICAgIHByaXZhdGUgX2dldEZpeERpcmVjdGlvbkZyb21DYXNjYWRlKCk6IE5nQ29uZmlnRml4RGlyZWN0aW9uIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBfdXBkYXRlUG9zaXRpb25zQWZ0ZXJNYXhDaGFuZ2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2l0ZW1zLmZvckVhY2goKGl0ZW06IE5nR3JpZEl0ZW0pID0+IHtcbiAgICAgICAgICAgIHZhciBwb3MgPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xuICAgICAgICAgICAgdmFyIGRpbXMgPSBpdGVtLmdldFNpemUoKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykgJiYgdGhpcy5faXNXaXRoaW5Cb3VuZHMocG9zLCBkaW1zKSAmJiBkaW1zLnggPD0gdGhpcy5fbWF4Q29scyAmJiBkaW1zLnkgPD0gdGhpcy5fbWF4Um93cykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiBkaW1zLnggPiB0aGlzLl9tYXhDb2xzKSB7XG4gICAgICAgICAgICAgICAgZGltcy54ID0gdGhpcy5fbWF4Q29scztcbiAgICAgICAgICAgICAgICBpdGVtLnNldFNpemUoZGltcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX21heFJvd3MgPiAwICYmIGRpbXMueSA+IHRoaXMuX21heFJvd3MpIHtcbiAgICAgICAgICAgICAgICBkaW1zLnkgPSB0aGlzLl9tYXhSb3dzO1xuICAgICAgICAgICAgICAgIGl0ZW0uc2V0U2l6ZShkaW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSB8fCAhdGhpcy5faXNXaXRoaW5Cb3VuZHMocG9zLCBkaW1zLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHRoaXMuX2ZpeEdyaWRQb3NpdGlvbihwb3MsIGRpbXMpO1xuICAgICAgICAgICAgICAgIGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jYWxjdWxhdGVDb2xXaWR0aCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhDb2xzID4gMCB8fCB0aGlzLl92aXNpYmxlQ29scyA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4Q29scyA9IHRoaXMuX21heENvbHMgPiAwID8gdGhpcy5fbWF4Q29scyA6IHRoaXMuX3Zpc2libGVDb2xzO1xuICAgICAgICAgICAgICAgIHZhciBtYXhXaWR0aDogbnVtYmVyID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbFdpZHRoOiBudW1iZXIgPSBNYXRoLmZsb29yKG1heFdpZHRoIC8gbWF4Q29scyk7XG4gICAgICAgICAgICAgICAgY29sV2lkdGggLT0gKHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpO1xuICAgICAgICAgICAgICAgIGlmIChjb2xXaWR0aCA+IDApIHRoaXMuY29sV2lkdGggPSBjb2xXaWR0aDtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29sV2lkdGggPCB0aGlzLm1pbldpZHRoIHx8IHRoaXMubWluQ29scyA+IHRoaXMuX2NvbmZpZy5taW5fY29scykge1xuICAgICAgICAgICAgdGhpcy5taW5Db2xzID0gTWF0aC5tYXgodGhpcy5fY29uZmlnLm1pbl9jb2xzLCBNYXRoLmNlaWwodGhpcy5taW5XaWR0aCAvIHRoaXMuY29sV2lkdGgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2NhbGN1bGF0ZVJvd0hlaWdodCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhSb3dzID4gMCB8fCB0aGlzLl92aXNpYmxlUm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4Um93cyA9IHRoaXMuX21heFJvd3MgPiAwID8gdGhpcy5fbWF4Um93cyA6IHRoaXMuX3Zpc2libGVSb3dzO1xuICAgICAgICAgICAgICAgIGxldCBtYXhIZWlnaHQ6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGVtZW50QmFzZWREeW5hbWljUm93SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heEhlaWdodCA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy5tYXJnaW5Ub3AgLSB0aGlzLm1hcmdpbkJvdHRvbTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93SGVpZ2h0OiBudW1iZXIgPSBNYXRoLm1heChNYXRoLmZsb29yKG1heEhlaWdodCAvIG1heFJvd3MpLCB0aGlzLm1pbkhlaWdodCk7XG4gICAgICAgICAgICAgICAgcm93SGVpZ2h0IC09ICh0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKTtcbiAgICAgICAgICAgICAgICBpZiAocm93SGVpZ2h0ID4gMCkgdGhpcy5yb3dIZWlnaHQgPSByb3dIZWlnaHQ7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJvd0hlaWdodCA8IHRoaXMubWluSGVpZ2h0IHx8IHRoaXMubWluUm93cyA+IHRoaXMuX2NvbmZpZy5taW5fcm93cykge1xuICAgICAgICAgICAgdGhpcy5taW5Sb3dzID0gTWF0aC5tYXgodGhpcy5fY29uZmlnLm1pbl9yb3dzLCBNYXRoLmNlaWwodGhpcy5taW5IZWlnaHQgLyB0aGlzLnJvd0hlaWdodCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdXBkYXRlUmF0aW8oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5fYXV0b1Jlc2l6ZSB8fCAhdGhpcy5fbWFpbnRhaW5SYXRpbykgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl92aXNpYmxlUm93cyA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnJvd0hlaWdodCA9IHRoaXMuY29sV2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLl92aXNpYmxlQ29scyA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbFdpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLnJvd0hlaWdodDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tYXhDb2xzID09IDAgJiYgdGhpcy5fbWF4Um93cyA9PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZUNvbHMgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3dIZWlnaHQgPSB0aGlzLmNvbFdpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3Zpc2libGVSb3dzID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sV2lkdGggPSB0aGlzLl9hc3BlY3RSYXRpbyAqIHRoaXMucm93SGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYXBwbHlDaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xuICAgICAgICBjaGFuZ2VzLmZvckVhY2hBZGRlZEl0ZW0oKHJlY29yZDogYW55KSA9PiB7IHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XSA9IHJlY29yZC5jdXJyZW50VmFsdWU7IH0pO1xuICAgICAgICBjaGFuZ2VzLmZvckVhY2hDaGFuZ2VkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XG4gICAgICAgIGNoYW5nZXMuZm9yRWFjaFJlbW92ZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyBkZWxldGUgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldOyB9KTtcblxuICAgICAgICB0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Jlc2l6ZVN0YXJ0KGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucmVzaXplRW5hYmxlIHx8ICF0aGlzLl9yZXNpemluZ0l0ZW0pIHJldHVybjtcblxuICAgICAgICAvLyAgICBTZXR1cFxuICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0uc3RhcnRNb3ZpbmcoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQodGhpcy5fcmVzaXppbmdJdGVtKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlUGxhY2Vob2xkZXIodGhpcy5fcmVzaXppbmdJdGVtKTtcblxuICAgICAgICBpZiAodGhpcy5fYWxsb3dPdmVybGFwKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0uekluZGV4ID0gdGhpcy5fbGFzdFpWYWx1ZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gICAgU3RhdHVzIEZsYWdzXG4gICAgICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX3Jlc2l6ZVJlYWR5ID0gZmFsc2U7XG5cbiAgICAgICAgLy8gICAgRXZlbnRzXG4gICAgICAgIHRoaXMub25SZXNpemVTdGFydC5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XG4gICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZVN0YXJ0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmFnU3RhcnQoZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5kcmFnRW5hYmxlIHx8ICF0aGlzLl9kcmFnZ2luZ0l0ZW0pIHJldHVybjtcblxuICAgICAgICAvLyAgICBTdGFydCBkcmFnZ2luZ1xuICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0uc3RhcnRNb3ZpbmcoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlUGxhY2Vob2xkZXIodGhpcy5fZHJhZ2dpbmdJdGVtKTtcblxuICAgICAgICBpZiAodGhpcy5fYWxsb3dPdmVybGFwKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0uekluZGV4ID0gdGhpcy5fbGFzdFpWYWx1ZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gICAgU3RhdHVzIEZsYWdzXG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2RyYWdSZWFkeSA9IGZhbHNlO1xuXG4gICAgICAgIC8vICAgIEV2ZW50c1xuICAgICAgICB0aGlzLm9uRHJhZ1N0YXJ0LmVtaXQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLm9uRHJhZ1N0YXJ0RXZlbnQoKTtcblxuICAgICAgICAvLyAgICBab29tXG4gICAgICAgIGlmICh0aGlzLl96b29tT25EcmFnKSB7XG4gICAgICAgICAgICB0aGlzLl96b29tT3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF96b29tT3V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAnc2NhbGUoMC41LCAwLjUpJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVzZXRab29tKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAnJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZHJhZyhlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcpIHJldHVybjtcblxuICAgICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5lbXB0eSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5lbXB0eSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCg8YW55PmRvY3VtZW50KS5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICg8YW55PmRvY3VtZW50KS5zZWxlY3Rpb24uZW1wdHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XG4gICAgICAgIHZhciBuZXdMID0gKG1vdXNlUG9zLmxlZnQgLSB0aGlzLl9wb3NPZmZzZXQubGVmdCk7XG4gICAgICAgIHZhciBuZXdUID0gKG1vdXNlUG9zLnRvcCAtIHRoaXMuX3Bvc09mZnNldC50b3ApO1xuXG4gICAgICAgIHZhciBpdGVtUG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xuICAgICAgICB2YXIgZ3JpZFBvcyA9IHRoaXMuX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihuZXdMLCBuZXdUKTtcbiAgICAgICAgdmFyIGRpbXMgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0U2l6ZSgpO1xuXG4gICAgICAgIGdyaWRQb3MgPSB0aGlzLl9maXhQb3NUb0JvdW5kc1goZ3JpZFBvcywgZGltcyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koZ3JpZFBvcywgZGltcykpIHtcbiAgICAgICAgICAgIGdyaWRQb3MgPSB0aGlzLl9maXhQb3NUb0JvdW5kc1koZ3JpZFBvcywgZGltcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ3JpZFBvcy5jb2wgIT0gaXRlbVBvcy5jb2wgfHwgZ3JpZFBvcy5yb3cgIT0gaXRlbVBvcy5yb3cpIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYWdnaW5nSXRlbS5zZXRHcmlkUG9zaXRpb24oZ3JpZFBvcywgdGhpcy5fZml4VG9HcmlkKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldEdyaWRQb3NpdGlvbihncmlkUG9zKTtcblxuICAgICAgICAgICAgaWYgKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZih0aGlzLmNhc2NhZGUpID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhncmlkUG9zLCBkaW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXNjYWRlR3JpZChncmlkUG9zLCBkaW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fZml4VG9HcmlkKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0uc2V0UG9zaXRpb24obmV3TCwgbmV3VCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uRHJhZy5lbWl0KHRoaXMuX2RyYWdnaW5nSXRlbSk7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdFdmVudCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Jlc2l6ZShlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzUmVzaXppbmcpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgoPGFueT5kb2N1bWVudCkuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAoPGFueT5kb2N1bWVudCkuc2VsZWN0aW9uLmVtcHR5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XG4gICAgICAgIGNvbnN0IGl0ZW1Qb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgaXRlbURpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0RGltZW5zaW9ucygpO1xuICAgICAgICBjb25zdCBlbmRDb3JuZXIgPSB7XG4gICAgICAgICAgICBsZWZ0OiBpdGVtUG9zLmxlZnQgKyBpdGVtRGltcy53aWR0aCxcbiAgICAgICAgICAgIHRvcDogaXRlbVBvcy50b3AgKyBpdGVtRGltcy5oZWlnaHQsXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNpemVUb3AgPSB0aGlzLl9yZXNpemVEaXJlY3Rpb24uaW5jbHVkZXMoJ3RvcCcpO1xuICAgICAgICBjb25zdCByZXNpemVCb3R0b20gPSB0aGlzLl9yZXNpemVEaXJlY3Rpb24uaW5jbHVkZXMoJ2JvdHRvbScpO1xuICAgICAgICBjb25zdCByZXNpemVMZWZ0ID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uLmluY2x1ZGVzKCdsZWZ0JylcbiAgICAgICAgY29uc3QgcmVzaXplUmlnaHQgPSB0aGlzLl9yZXNpemVEaXJlY3Rpb24uaW5jbHVkZXMoJ3JpZ2h0Jyk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIG5ldyB3aWR0aCBhbmQgaGVpZ2h0IGJhc2VkIHVwb24gcmVzaXplIGRpcmVjdGlvblxuICAgICAgICBsZXQgbmV3VyA9IHJlc2l6ZVJpZ2h0XG4gICAgICAgICAgICA/IChtb3VzZVBvcy5sZWZ0IC0gaXRlbVBvcy5sZWZ0ICsgMSlcbiAgICAgICAgICAgIDogcmVzaXplTGVmdFxuICAgICAgICAgICAgICAgID8gKGVuZENvcm5lci5sZWZ0IC0gbW91c2VQb3MubGVmdCArIDEpXG4gICAgICAgICAgICAgICAgOiBpdGVtRGltcy53aWR0aDtcbiAgICAgICAgbGV0IG5ld0ggPSByZXNpemVCb3R0b21cbiAgICAgICAgICAgID8gKG1vdXNlUG9zLnRvcCAtIGl0ZW1Qb3MudG9wICsgMSlcbiAgICAgICAgICAgIDogcmVzaXplVG9wXG4gICAgICAgICAgICAgICAgPyAoZW5kQ29ybmVyLnRvcCAtIG1vdXNlUG9zLnRvcCArIDEpXG4gICAgICAgICAgICAgICAgOiBpdGVtRGltcy5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKG5ld1cgPCB0aGlzLm1pbldpZHRoKVxuICAgICAgICAgICAgbmV3VyA9IHRoaXMubWluV2lkdGg7XG4gICAgICAgIGlmIChuZXdIIDwgdGhpcy5taW5IZWlnaHQpXG4gICAgICAgICAgICBuZXdIID0gdGhpcy5taW5IZWlnaHQ7XG4gICAgICAgIGlmIChuZXdXIDwgdGhpcy5fcmVzaXppbmdJdGVtLm1pbldpZHRoKVxuICAgICAgICAgICAgbmV3VyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5XaWR0aDtcbiAgICAgICAgaWYgKG5ld0ggPCB0aGlzLl9yZXNpemluZ0l0ZW0ubWluSGVpZ2h0KVxuICAgICAgICAgICAgbmV3SCA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQ7XG5cbiAgICAgICAgbGV0IG5ld1ggPSBpdGVtUG9zLmxlZnQ7XG4gICAgICAgIGxldCBuZXdZID0gaXRlbVBvcy50b3A7XG5cbiAgICAgICAgaWYgKHJlc2l6ZUxlZnQpXG4gICAgICAgICAgICBuZXdYID0gZW5kQ29ybmVyLmxlZnQgLSBuZXdXO1xuICAgICAgICBpZiAocmVzaXplVG9wKVxuICAgICAgICAgICAgbmV3WSA9IGVuZENvcm5lci50b3AgLSBuZXdIO1xuXG4gICAgICAgIGxldCBjYWxjU2l6ZSA9IHRoaXMuX2NhbGN1bGF0ZUdyaWRTaXplKG5ld1csIG5ld0gpO1xuICAgICAgICBjb25zdCBpdGVtU2l6ZSA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XG4gICAgICAgIGNvbnN0IGlHcmlkUG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xuICAgICAgICBjb25zdCBib3R0b21SaWdodENvcm5lciA9IHtcbiAgICAgICAgICAgIGNvbDogaUdyaWRQb3MuY29sICsgaXRlbVNpemUueCxcbiAgICAgICAgICAgIHJvdzogaUdyaWRQb3Mucm93ICsgaXRlbVNpemUueSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdGFyZ2V0UG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCBpR3JpZFBvcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZURpcmVjdGlvbi5pbmNsdWRlcygndG9wJykpXG4gICAgICAgICAgICB0YXJnZXRQb3Mucm93ID0gYm90dG9tUmlnaHRDb3JuZXIucm93IC0gY2FsY1NpemUueTtcbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZURpcmVjdGlvbi5pbmNsdWRlcygnbGVmdCcpKVxuICAgICAgICAgICAgdGFyZ2V0UG9zLmNvbCA9IGJvdHRvbVJpZ2h0Q29ybmVyLmNvbCAtIGNhbGNTaXplLng7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1godGFyZ2V0UG9zLCBjYWxjU2l6ZSkpXG4gICAgICAgICAgICBjYWxjU2l6ZSA9IHRoaXMuX2ZpeFNpemVUb0JvdW5kc1godGFyZ2V0UG9zLCBjYWxjU2l6ZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1kodGFyZ2V0UG9zLCBjYWxjU2l6ZSkpXG4gICAgICAgICAgICBjYWxjU2l6ZSA9IHRoaXMuX2ZpeFNpemVUb0JvdW5kc1kodGFyZ2V0UG9zLCBjYWxjU2l6ZSk7XG5cbiAgICAgICAgY2FsY1NpemUgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZml4UmVzaXplKGNhbGNTaXplKTtcblxuICAgICAgICBpZiAoY2FsY1NpemUueCAhPSBpdGVtU2l6ZS54IHx8IGNhbGNTaXplLnkgIT0gaXRlbVNpemUueSkge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnNldEdyaWRQb3NpdGlvbih0YXJnZXRQb3MsIHRoaXMuX2ZpeFRvR3JpZCk7XG4gICAgICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclJlZi5pbnN0YW5jZS5zZXRHcmlkUG9zaXRpb24odGFyZ2V0UG9zKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXRTaXplKGNhbGNTaXplLCB0aGlzLl9maXhUb0dyaWQpO1xuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJSZWYuaW5zdGFuY2Uuc2V0U2l6ZShjYWxjU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChbJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCddLmluZGV4T2YodGhpcy5jYXNjYWRlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZml4R3JpZENvbGxpc2lvbnModGFyZ2V0UG9zLCBjYWxjU2l6ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FzY2FkZUdyaWQodGFyZ2V0UG9zLCBjYWxjU2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2ZpeFRvR3JpZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnNldERpbWVuc2lvbnMobmV3VywgbmV3SCk7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0uc2V0UG9zaXRpb24obmV3WCwgbmV3WSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uUmVzaXplLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplRXZlbnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmFnU3RvcChlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcpIHJldHVybjtcblxuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgICB2YXIgaXRlbVBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcblxuICAgICAgICB0aGlzLl9kcmFnZ2luZ0l0ZW0uc2V0R3JpZFBvc2l0aW9uKGl0ZW1Qb3MpO1xuICAgICAgICB0aGlzLl9hZGRUb0dyaWQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcblxuICAgICAgICB0aGlzLl9jYXNjYWRlR3JpZCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG5cbiAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLnN0b3BNb3ZpbmcoKTtcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtLm9uRHJhZ1N0b3BFdmVudCgpO1xuICAgICAgICB0aGlzLm9uRHJhZ1N0b3AuZW1pdCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xuXG4gICAgICAgIHRoaXMuX2NsZWFuRHJhZygpO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclJlZi5kZXN0cm95KCk7XG5cbiAgICAgICAgdGhpcy5fZW1pdE9uSXRlbUNoYW5nZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLl96b29tT25EcmFnKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNldFpvb20oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3Jlc2l6ZVN0b3AoZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc1Jlc2l6aW5nKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgaXRlbURpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0U2l6ZSgpO1xuICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShpdGVtRGltcyk7XG5cbiAgICAgICAgY29uc3QgaXRlbVBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnNldEdyaWRQb3NpdGlvbihpdGVtUG9zKTtcblxuICAgICAgICB0aGlzLl9hZGRUb0dyaWQodGhpcy5fcmVzaXppbmdJdGVtKTtcblxuICAgICAgICB0aGlzLl9jYXNjYWRlR3JpZCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG5cbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLnN0b3BNb3ZpbmcoKTtcbiAgICAgICAgdGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplU3RvcEV2ZW50KCk7XG4gICAgICAgIHRoaXMub25SZXNpemVTdG9wLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcblxuICAgICAgICB0aGlzLl9jbGVhblJlc2l6ZSgpO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclJlZi5kZXN0cm95KCk7XG5cbiAgICAgICAgdGhpcy5fZW1pdE9uSXRlbUNoYW5nZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NsZWFuRHJhZygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmdJdGVtID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcG9zT2Zmc2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RyYWdSZWFkeSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NsZWFuUmVzaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZXNpemluZ0l0ZW0gPSBudWxsO1xuICAgICAgICB0aGlzLl9yZXNpemVEaXJlY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVzaXplUmVhZHkgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jYWxjdWxhdGVHcmlkU2l6ZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IE5nR3JpZEl0ZW1TaXplIHtcbiAgICAgICAgd2lkdGggKz0gdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodDtcbiAgICAgICAgaGVpZ2h0ICs9IHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b207XG5cbiAgICAgICAgdmFyIHNpemV4ID0gTWF0aC5tYXgodGhpcy5taW5Db2xzLCBNYXRoLnJvdW5kKHdpZHRoIC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkpO1xuICAgICAgICB2YXIgc2l6ZXkgPSBNYXRoLm1heCh0aGlzLm1pblJvd3MsIE1hdGgucm91bmQoaGVpZ2h0IC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWCh7IGNvbDogMSwgcm93OiAxIH0sIHsgeDogc2l6ZXgsIHk6IHNpemV5IH0pKSBzaXpleCA9IHRoaXMuX21heENvbHM7XG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHsgY29sOiAxLCByb3c6IDEgfSwgeyB4OiBzaXpleCwgeTogc2l6ZXkgfSkpIHNpemV5ID0gdGhpcy5fbWF4Um93cztcblxuICAgICAgICByZXR1cm4geyAneCc6IHNpemV4LCAneSc6IHNpemV5IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFBvc2l0aW9uKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xuICAgICAgICB2YXIgY29sID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChsZWZ0IC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkgKyAxKTtcbiAgICAgICAgdmFyIHJvdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodG9wIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgMSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSBjb2wgPSB0aGlzLl9tYXhDb2xzO1xuICAgICAgICBpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWSh7IGNvbDogY29sLCByb3c6IHJvdyB9LCB7IHg6IDEsIHk6IDEgfSkpIHJvdyA9IHRoaXMuX21heFJvd3M7XG5cbiAgICAgICAgcmV0dXJuIHsgJ2NvbCc6IGNvbCwgJ3Jvdyc6IHJvdyB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhc0dyaWRDb2xsaXNpb24ocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0Q29sbGlzaW9ucyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBBcnJheTxOZ0dyaWRJdGVtPiB7XG4gICAgICAgIGlmICh0aGlzLl9hbGxvd092ZXJsYXApIHJldHVybiBbXTtcblxuICAgICAgICBjb25zdCByZXR1cm5zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IFtdO1xuXG4gICAgICAgIGlmICghcG9zLmNvbCkgeyBwb3MuY29sID0gMTsgfVxuICAgICAgICBpZiAoIXBvcy5yb3cpIHsgcG9zLnJvdyA9IDE7IH1cblxuICAgICAgICBjb25zdCBsZWZ0Q29sID0gcG9zLmNvbDtcbiAgICAgICAgY29uc3QgcmlnaHRDb2wgPSBwb3MuY29sICsgZGltcy54O1xuICAgICAgICBjb25zdCB0b3BSb3cgPSBwb3Mucm93O1xuICAgICAgICBjb25zdCBib3R0b21Sb3cgPSBwb3Mucm93ICsgZGltcy55O1xuXG4gICAgICAgIHRoaXMuX2l0ZW1zSW5HcmlkLmZvckVhY2goKGl0ZW1JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCk7XG5cbiAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zSW5HcmlkLmRlbGV0ZShpdGVtSWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaXRlbUxlZnRDb2wgPSBpdGVtLmNvbDtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1SaWdodENvbCA9IGl0ZW0uY29sICsgaXRlbS5zaXpleDtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Ub3BSb3cgPSBpdGVtLnJvdztcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Cb3R0b21Sb3cgPSBpdGVtLnJvdyArIGl0ZW0uc2l6ZXk7XG5cbiAgICAgICAgICAgIGNvbnN0IHdpdGhpbkNvbHVtbnMgPSBsZWZ0Q29sIDwgaXRlbVJpZ2h0Q29sICYmIGl0ZW1MZWZ0Q29sIDwgcmlnaHRDb2w7XG4gICAgICAgICAgICBjb25zdCB3aXRoaW5Sb3dzID0gdG9wUm93IDwgaXRlbUJvdHRvbVJvdyAmJiBpdGVtVG9wUm93IDwgYm90dG9tUm93O1xuXG4gICAgICAgICAgICBpZiAod2l0aGluQ29sdW1ucyAmJiB3aXRoaW5Sb3dzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJucy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmV0dXJucztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maXhHcmlkQ29sbGlzaW9ucyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29sbGlzaW9uczogQXJyYXk8TmdHcmlkSXRlbT4gPSB0aGlzLl9nZXRDb2xsaXNpb25zKHBvcywgZGltcyk7XG4gICAgICAgIGlmIChjb2xsaXNpb25zLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgICBmb3IgKGxldCBjb2xsaXNpb24gb2YgY29sbGlzaW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbUdyaWQoY29sbGlzaW9uKTtcblxuICAgICAgICAgICAgY29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gY29sbGlzaW9uLmdldFNpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGNvbGxpc2lvbi5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgICAgIGxldCBuZXdJdGVtUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogaXRlbVBvcy5jb2wsIHJvdzogaXRlbVBvcy5yb3cgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbGxpc2lvbkZpeERpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgIG5ld0l0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKG5ld0l0ZW1Qb3MsIGl0ZW1EaW1zKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdJdGVtUG9zLmNvbCA9IHBvcy5jb2wgKyBkaW1zLng7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW1Qb3Mucm93ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbGxpc2lvbkZpeERpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICAgICAgbmV3SXRlbVBvcy5jb2wgPSBwb3MuY29sICsgZGltcy54O1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1gobmV3SXRlbVBvcywgaXRlbURpbXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0l0ZW1Qb3MuY29sID0gMTtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbVBvcy5yb3cgPSBwb3Mucm93ICsgZGltcy55O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGlzaW9uLnNldEdyaWRQb3NpdGlvbihuZXdJdGVtUG9zKTtcblxuICAgICAgICAgICAgdGhpcy5fZml4R3JpZENvbGxpc2lvbnMobmV3SXRlbVBvcywgaXRlbURpbXMpO1xuICAgICAgICAgICAgdGhpcy5fYWRkVG9HcmlkKGNvbGxpc2lvbik7XG4gICAgICAgICAgICBjb2xsaXNpb24ub25DYXNjYWRlRXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKHBvcywgZGltcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2FzY2FkZUdyaWQocG9zPzogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zPzogTmdHcmlkSXRlbVNpemUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5fYWxsb3dPdmVybGFwKSByZXR1cm47XG4gICAgICAgIGlmICghcG9zICE9PSAhZGltcykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FzY2FkZSB3aXRoIG9ubHkgcG9zaXRpb24gYW5kIG5vdCBkaW1lbnNpb25zJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLl9kcmFnZ2luZ0l0ZW0gJiYgIXBvcyAmJiAhZGltcykge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xuICAgICAgICAgICAgZGltcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRTaXplKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nICYmIHRoaXMuX3Jlc2l6aW5nSXRlbSAmJiAhcG9zICYmICFkaW1zKSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG4gICAgICAgICAgICBkaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpdGVtc0luR3JpZDogTmdHcmlkSXRlbVtdID0gQXJyYXkuZnJvbSh0aGlzLl9pdGVtc0luR3JpZCwgKGl0ZW1JZDogc3RyaW5nKSA9PiB0aGlzLl9pdGVtcy5nZXQoaXRlbUlkKSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgIGl0ZW1zSW5HcmlkID0gaXRlbXNJbkdyaWQuc29ydChOZ0dyaWRIZWxwZXIuc29ydEl0ZW1zQnlQb3NpdGlvblZlcnRpY2FsKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb3dlc3RSb3dQZXJDb2x1bW46IE1hcDxudW1iZXIsIG51bWJlcj4gPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtc0luR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc0ZpeGVkKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtRGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbG93ZXN0Um93Rm9ySXRlbTogbnVtYmVyID0gbG93ZXN0Um93UGVyQ29sdW1uLmdldChpdGVtUG9zLmNvbCkgfHwgMTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgaXRlbURpbXMueDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb3dlc3RSb3dGb3JDb2x1bW4gPSBsb3dlc3RSb3dQZXJDb2x1bW4uZ2V0KGl0ZW1Qb3MuY29sICsgaSkgfHwgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdFJvd0Zvckl0ZW0gPSBNYXRoLm1heChsb3dlc3RSb3dGb3JDb2x1bW4sIGxvd2VzdFJvd0Zvckl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdENvbCA9IGl0ZW1Qb3MuY29sO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodENvbCA9IGl0ZW1Qb3MuY29sICsgaXRlbURpbXMueDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zICYmIGRpbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpdGhpbkNvbHVtbnMgPSByaWdodENvbCA+IHBvcy5jb2wgJiYgbGVmdENvbCA8IChwb3MuY29sICsgZGltcy54KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpdGhpbkNvbHVtbnMpIHsgICAgICAgICAgLy8gSWYgb3VyIGVsZW1lbnQgaXMgaW4gb25lIG9mIHRoZSBpdGVtJ3MgY29sdW1uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb21BYm92ZUl0ZW0gPSBpdGVtRGltcy55IDw9IChwb3Mucm93IC0gbG93ZXN0Um93Rm9ySXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvb21BYm92ZUl0ZW0pIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZW0gY2FuJ3QgZml0IGFib3ZlIG91ciBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdFJvd0Zvckl0ZW0gPSBNYXRoLm1heChsb3dlc3RSb3dGb3JJdGVtLCBwb3Mucm93ICsgZGltcy55KTsgICAvLyBTZXQgdGhlIGxvd2VzdCByb3cgdG8gYmUgYmVsb3cgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IHsgY29sOiBpdGVtUG9zLmNvbCwgcm93OiBsb3dlc3RSb3dGb3JJdGVtIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgV2hhdCBpZiBpdCdzIG5vdCB3aXRoaW4gYm91bmRzIFk/XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb3dlc3RSb3dGb3JJdGVtICE9IGl0ZW1Qb3Mucm93ICYmIHRoaXMuX2lzV2l0aGluQm91bmRzWShuZXdQb3MsIGl0ZW1EaW1zKSkgeyAvLyBJZiB0aGUgaXRlbSBpcyBub3QgYWxyZWFkeSBvbiB0aGlzIHJvdyBtb3ZlIGl0IHVwXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRHcmlkUG9zaXRpb24obmV3UG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5vbkNhc2NhZGVFdmVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXN0Um93UGVyQ29sdW1uLnNldChpdGVtUG9zLmNvbCArIGksIGxvd2VzdFJvd0Zvckl0ZW0gKyBpdGVtRGltcy55KTsgLy8gVXBkYXRlIHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IHRoZSBpdGVtXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICBpdGVtc0luR3JpZCA9IGl0ZW1zSW5HcmlkLnNvcnQoTmdHcmlkSGVscGVyLnNvcnRJdGVtc0J5UG9zaXRpb25Ib3Jpem9udGFsKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb3dlc3RDb2x1bW5QZXJSb3c6IE1hcDxudW1iZXIsIG51bWJlcj4gPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtc0luR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtRGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbG93ZXN0Q29sdW1uRm9ySXRlbTogbnVtYmVyID0gbG93ZXN0Q29sdW1uUGVyUm93LmdldChpdGVtUG9zLnJvdykgfHwgMTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgaXRlbURpbXMueTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG93ZXN0T2Zmc2V0Q29sdW1uOiBudW1iZXIgPSBsb3dlc3RDb2x1bW5QZXJSb3cuZ2V0KGl0ZW1Qb3Mucm93ICsgaSkgfHwgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdENvbHVtbkZvckl0ZW0gPSBNYXRoLm1heChsb3dlc3RPZmZzZXRDb2x1bW4sIGxvd2VzdENvbHVtbkZvckl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wUm93ID0gaXRlbVBvcy5yb3c7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbVJvdyA9IGl0ZW1Qb3Mucm93ICsgaXRlbURpbXMueTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zICYmIGRpbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpdGhpblJvd3MgPSBib3R0b21Sb3cgPiBwb3MuY29sICYmIHRvcFJvdyA8IChwb3MuY29sICsgZGltcy54KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpdGhpblJvd3MpIHsgICAgICAgICAgLy8gSWYgb3VyIGVsZW1lbnQgaXMgaW4gb25lIG9mIHRoZSBpdGVtJ3Mgcm93c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb21OZXh0VG9JdGVtID0gaXRlbURpbXMueCA8PSAocG9zLmNvbCAtIGxvd2VzdENvbHVtbkZvckl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyb29tTmV4dFRvSXRlbSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZW0gY2FuJ3QgZml0IG5leHQgdG8gb3VyIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXN0Q29sdW1uRm9ySXRlbSA9IE1hdGgubWF4KGxvd2VzdENvbHVtbkZvckl0ZW0sIHBvcy5jb2wgKyBkaW1zLngpOyAgLy8gU2V0IHRoZSBsb3dlc3QgY29sIHRvIGJlIHRoZSBvdGhlciBzaWRlIG9mIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogbG93ZXN0Q29sdW1uRm9ySXRlbSwgcm93OiBpdGVtUG9zLnJvdyB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb3dlc3RDb2x1bW5Gb3JJdGVtICE9IGl0ZW1Qb3MuY29sICYmIHRoaXMuX2lzV2l0aGluQm91bmRzWChuZXdQb3MsIGl0ZW1EaW1zKSkgeyAvLyBJZiB0aGUgaXRlbSBpcyBub3QgYWxyZWFkeSBvbiB0aGlzIGNvbCBtb3ZlIGl0IHVwXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRHcmlkUG9zaXRpb24obmV3UG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5vbkNhc2NhZGVFdmVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLnk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXN0Q29sdW1uUGVyUm93LnNldChpdGVtUG9zLnJvdyArIGksIGxvd2VzdENvbHVtbkZvckl0ZW0gKyBpdGVtRGltcy54KTsgLy8gVXBkYXRlIHRoZSBsb3dlc3QgY29sIHRvIGJlIGJlbG93IHRoZSBpdGVtXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4R3JpZFBvc2l0aW9uKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XG4gICAgICAgIGlmICghdGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpKSByZXR1cm4gcG9zO1xuXG4gICAgICAgIGNvbnN0IG1heFJvdyA9IHRoaXMuX21heFJvd3MgPT09IDAgPyB0aGlzLl9nZXRNYXhSb3coKSA6IHRoaXMuX21heFJvd3M7XG4gICAgICAgIGNvbnN0IG1heENvbCA9IHRoaXMuX21heENvbHMgPT09IDAgPyB0aGlzLl9nZXRNYXhDb2woKSA6IHRoaXMuX21heENvbHM7XG4gICAgICAgIGNvbnN0IG5ld1BvcyA9IHtcbiAgICAgICAgICAgIGNvbDogcG9zLmNvbCxcbiAgICAgICAgICAgIHJvdzogcG9zLnJvdyxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5faXRlbUZpeERpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgZml4TG9vcDpcbiAgICAgICAgICAgIGZvciAoOyBuZXdQb3MuY29sIDw9IG1heFJvdzspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtc0luUGF0aCA9IHRoaXMuX2dldEl0ZW1zSW5WZXJ0aWNhbFBhdGgobmV3UG9zLCBkaW1zLCBuZXdQb3Mucm93KTtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dFJvdyA9IG5ld1Bvcy5yb3c7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zSW5QYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnJvdyAtIG5leHRSb3cgPj0gZGltcy55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3Mucm93ID0gbmV4dFJvdztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGZpeExvb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBuZXh0Um93ID0gaXRlbS5yb3cgKyBpdGVtLnNpemV5O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXhSb3cgLSBuZXh0Um93ID49IGRpbXMueSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdQb3Mucm93ID0gbmV4dFJvdztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgZml4TG9vcDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXdQb3MuY29sID0gTWF0aC5tYXgobmV3UG9zLmNvbCArIDEsIE1hdGgubWluLmFwcGx5KE1hdGgsIGl0ZW1zSW5QYXRoLm1hcCgoaXRlbSkgPT4gaXRlbS5jb2wgKyBkaW1zLngpKSk7XG4gICAgICAgICAgICAgICAgbmV3UG9zLnJvdyA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faXRlbUZpeERpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmaXhMb29wOlxuICAgICAgICAgICAgZm9yICg7IG5ld1Bvcy5yb3cgPD0gbWF4Um93Oykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zSW5QYXRoID0gdGhpcy5fZ2V0SXRlbXNJbkhvcml6b250YWxQYXRoKG5ld1BvcywgZGltcywgbmV3UG9zLmNvbCk7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRDb2wgPSBuZXdQb3MuY29sO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtc0luUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb2wgLSBuZXh0Q29sID49IGRpbXMueCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zLmNvbCA9IG5leHRDb2w7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBmaXhMb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dENvbCA9IGl0ZW0uY29sICsgaXRlbS5zaXpleDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF4Q29sIC0gbmV4dENvbCA+PSBkaW1zLngpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLmNvbCA9IG5leHRDb2w7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIGZpeExvb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV3UG9zLnJvdyA9IE1hdGgubWF4KG5ld1Bvcy5yb3cgKyAxLCBNYXRoLm1pbi5hcHBseShNYXRoLCBpdGVtc0luUGF0aC5tYXAoKGl0ZW0pID0+IGl0ZW0ucm93ICsgZGltcy55KSkpO1xuICAgICAgICAgICAgICAgIG5ld1Bvcy5jb2wgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRJdGVtc0luSG9yaXpvbnRhbFBhdGgocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplLCBzdGFydENvbHVtbjogbnVtYmVyID0gMCk6IE5nR3JpZEl0ZW1bXSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zSW5QYXRoOiBOZ0dyaWRJdGVtW10gPSBbXTtcbiAgICAgICAgY29uc3QgdG9wUm93OiBudW1iZXIgPSBwb3Mucm93ICsgZGltcy55IC0gMTtcblxuICAgICAgICB0aGlzLl9pdGVtc0luR3JpZC5mb3JFYWNoKChpdGVtSWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX2l0ZW1zLmdldChpdGVtSWQpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uY29sICsgaXRlbS5zaXpleCAtIDEgPCBzdGFydENvbHVtbikgeyByZXR1cm47IH0gICAgLy8gSXRlbSBmYWxscyBhZnRlciBzdGFydCBjb2x1bW5cbiAgICAgICAgICAgIGlmIChpdGVtLnJvdyA+IHRvcFJvdykgeyByZXR1cm47IH0gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZW0gZmFsbHMgYWJvdmUgcGF0aFxuICAgICAgICAgICAgaWYgKGl0ZW0ucm93ICsgaXRlbS5zaXpleSAtIDEgPCBwb3Mucm93KSB7IHJldHVybjsgfSAgICAgICAgLy8gSXRlbSBmYWxscyBiZWxvdyBwYXRoXG4gICAgICAgICAgICBpdGVtc0luUGF0aC5wdXNoKGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaXRlbXNJblBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbXNJblZlcnRpY2FsUGF0aChwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUsIHN0YXJ0Um93OiBudW1iZXIgPSAwKTogTmdHcmlkSXRlbVtdIHtcbiAgICAgICAgY29uc3QgaXRlbXNJblBhdGg6IE5nR3JpZEl0ZW1bXSA9IFtdO1xuICAgICAgICBjb25zdCByaWdodENvbDogbnVtYmVyID0gcG9zLmNvbCArIGRpbXMueCAtIDE7XG5cbiAgICAgICAgdGhpcy5faXRlbXNJbkdyaWQuZm9yRWFjaCgoaXRlbUlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9pdGVtcy5nZXQoaXRlbUlkKTtcbiAgICAgICAgICAgIGlmIChpdGVtLnJvdyArIGl0ZW0uc2l6ZXkgLSAxIDwgc3RhcnRSb3cpIHsgcmV0dXJuOyB9ICAgLy8gSXRlbSBmYWxscyBhYm92ZSBzdGFydCByb3dcbiAgICAgICAgICAgIGlmIChpdGVtLmNvbCA+IHJpZ2h0Q29sKSB7IHJldHVybjsgfSAgICAgICAgICAgICAgICAgICAgLy8gSXRlbSBmYWxscyBhZnRlciBwYXRoXG4gICAgICAgICAgICBpZiAoaXRlbS5jb2wgKyBpdGVtLnNpemV4IC0gMSA8IHBvcy5jb2wpIHsgcmV0dXJuOyB9ICAgIC8vIEl0ZW0gZmFsbHMgYmVmb3JlIHBhdGhcbiAgICAgICAgICAgIGl0ZW1zSW5QYXRoLnB1c2goaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBpdGVtc0luUGF0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pc1dpdGhpbkJvdW5kc1gocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplLCBhbGxvd0V4Y2Vzc2l2ZUl0ZW1zOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heENvbHMgPT0gMCB8fCAoYWxsb3dFeGNlc3NpdmVJdGVtcyAmJiBwb3MuY29sID09IDEpIHx8IChwb3MuY29sICsgZGltcy54IC0gMSkgPD0gdGhpcy5fbWF4Q29scztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maXhQb3NUb0JvdW5kc1gocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1gocG9zLCBkaW1zKSkge1xuICAgICAgICAgICAgcG9zLmNvbCA9IE1hdGgubWF4KHRoaXMuX21heENvbHMgLSAoZGltcy54IC0gMSksIDEpO1xuICAgICAgICAgICAgcG9zLnJvdyArKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2ZpeFNpemVUb0JvdW5kc1gocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogTmdHcmlkSXRlbVNpemUge1xuICAgICAgICBpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChwb3MsIGRpbXMpKSB7XG4gICAgICAgICAgICBkaW1zLnggPSBNYXRoLm1heCh0aGlzLl9tYXhDb2xzIC0gKHBvcy5jb2wgLSAxKSwgMSk7XG4gICAgICAgICAgICBkaW1zLnkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltcztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pc1dpdGhpbkJvdW5kc1kocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplLCBhbGxvd0V4Y2Vzc2l2ZUl0ZW1zOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFJvd3MgPT0gMCB8fCAoYWxsb3dFeGNlc3NpdmVJdGVtcyAmJiBwb3Mucm93ID09IDEpIHx8IChwb3Mucm93ICsgZGltcy55IC0gMSkgPD0gdGhpcy5fbWF4Um93cztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maXhQb3NUb0JvdW5kc1kocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1kocG9zLCBkaW1zKSkge1xuICAgICAgICAgICAgcG9zLnJvdyA9IE1hdGgubWF4KHRoaXMuX21heFJvd3MgLSAoZGltcy55IC0gMSksIDEpO1xuICAgICAgICAgICAgcG9zLmNvbCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZml4U2l6ZVRvQm91bmRzWShwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBOZ0dyaWRJdGVtU2l6ZSB7XG4gICAgICAgIGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcykpIHtcbiAgICAgICAgICAgIGRpbXMueSA9IE1hdGgubWF4KHRoaXMuX21heFJvd3MgLSAocG9zLnJvdyAtIDEpLCAxKTtcbiAgICAgICAgICAgIGRpbXMueCsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1zO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2lzV2l0aGluQm91bmRzKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSwgYWxsb3dFeGNlc3NpdmVJdGVtczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1dpdGhpbkJvdW5kc1gocG9zLCBkaW1zLCBhbGxvd0V4Y2Vzc2l2ZUl0ZW1zKSAmJiB0aGlzLl9pc1dpdGhpbkJvdW5kc1kocG9zLCBkaW1zLCBhbGxvd0V4Y2Vzc2l2ZUl0ZW1zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maXhQb3NUb0JvdW5kcyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4UG9zVG9Cb3VuZHNYKHRoaXMuX2ZpeFBvc1RvQm91bmRzWShwb3MsIGRpbXMpLCBkaW1zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maXhTaXplVG9Cb3VuZHMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogTmdHcmlkSXRlbVNpemUge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4U2l6ZVRvQm91bmRzWChwb3MsIHRoaXMuX2ZpeFNpemVUb0JvdW5kc1kocG9zLCBkaW1zKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkVG9HcmlkKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcbiAgICAgICAgbGV0IHBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgZGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcblxuICAgICAgICBpZiAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpKSB7XG4gICAgICAgICAgICB0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhwb3MsIGRpbXMpO1xuICAgICAgICAgICAgcG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9hbGxvd092ZXJsYXApIHtcbiAgICAgICAgICAgIGl0ZW0uekluZGV4ID0gdGhpcy5fbGFzdFpWYWx1ZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faXRlbXNJbkdyaWQuYWRkKGl0ZW0udWlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZW1vdmVGcm9tR3JpZChpdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2l0ZW1zSW5HcmlkLmRlbGV0ZShpdGVtLnVpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdXBkYXRlU2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICBsZXQgbWF4Q29sOiBudW1iZXIgPSB0aGlzLl9nZXRNYXhDb2woKTtcbiAgICAgICAgbGV0IG1heFJvdzogbnVtYmVyID0gdGhpcy5fZ2V0TWF4Um93KCk7XG5cbiAgICAgICAgaWYgKG1heENvbCAhPSB0aGlzLl9jdXJNYXhDb2wgfHwgbWF4Um93ICE9IHRoaXMuX2N1ck1heFJvdykge1xuICAgICAgICAgICAgdGhpcy5fY3VyTWF4Q29sID0gbWF4Q29sO1xuICAgICAgICAgICAgdGhpcy5fY3VyTWF4Um93ID0gbWF4Um93O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCAnMTAwJScpOy8vKG1heENvbCAqICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpKydweCcpO1xuICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnRCYXNlZER5bmFtaWNSb3dIZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsIChtYXhSb3cgKiAodGhpcy5yb3dIZWlnaHQgKyB0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKSkgKyAncHgnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2dldE1heFJvdygpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpdGVtc1Jvd3M6IG51bWJlcltdID0gQXJyYXkuZnJvbSh0aGlzLl9pdGVtc0luR3JpZCwgKGl0ZW1JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCk7XG4gICAgICAgICAgICBpZiAoIWl0ZW0pIHJldHVybiAwO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucm93ICsgaXRlbS5zaXpleSAtIDE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBpdGVtc1Jvd3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldE1heENvbCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpdGVtc0NvbHM6IG51bWJlcltdID0gQXJyYXkuZnJvbSh0aGlzLl9pdGVtc0luR3JpZCwgKGl0ZW1JZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCk7XG4gICAgICAgICAgICBpZiAoIWl0ZW0pIHJldHVybiAwO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29sICsgaXRlbS5zaXpleCAtIDE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBpdGVtc0NvbHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldE1vdXNlUG9zaXRpb24oZTogYW55KTogTmdHcmlkUmF3UG9zaXRpb24ge1xuICAgICAgICBpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xuICAgICAgICAgICAgZSA9IGUudG91Y2hlcy5sZW5ndGggPiAwID8gZS50b3VjaGVzWzBdIDogZS5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlZlBvczogYW55ID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIGxldCBsZWZ0OiBudW1iZXIgPSBlLmNsaWVudFggLSByZWZQb3MubGVmdDtcbiAgICAgICAgbGV0IHRvcDogbnVtYmVyID0gZS5jbGllbnRZIC0gcmVmUG9zLnRvcDtcblxuICAgICAgICBpZiAodGhpcy5jYXNjYWRlID09ICdkb3duJykgdG9wID0gcmVmUG9zLnRvcCArIHJlZlBvcy5oZWlnaHQgLSBlLmNsaWVudFk7XG4gICAgICAgIGlmICh0aGlzLmNhc2NhZGUgPT0gJ3JpZ2h0JykgbGVmdCA9IHJlZlBvcy5sZWZ0ICsgcmVmUG9zLndpZHRoIC0gZS5jbGllbnRYO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5fem9vbU9uRHJhZykge1xuICAgICAgICAgICAgbGVmdCAqPSAyO1xuICAgICAgICAgICAgdG9wICo9IDI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgIHRvcDogdG9wXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0QWJzb2x1dGVNb3VzZVBvc2l0aW9uKGU6IGFueSk6IE5nR3JpZFJhd1Bvc2l0aW9uIHtcbiAgICAgICAgaWYgKCgoPGFueT53aW5kb3cpLlRvdWNoRXZlbnQgJiYgZSBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHx8IChlLnRvdWNoZXMgfHwgZS5jaGFuZ2VkVG91Y2hlcykpIHtcbiAgICAgICAgICAgIGUgPSBlLnRvdWNoZXMubGVuZ3RoID4gMCA/IGUudG91Y2hlc1swXSA6IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogZS5jbGllbnRYLFxuICAgICAgICAgICAgdG9wOiBlLmNsaWVudFlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRDb250YWluZXJDb2x1bW5zKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG1heFdpZHRoOiBudW1iZXIgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIGNvbnN0IGl0ZW1XaWR0aDogbnVtYmVyID0gdGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQ7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1heFdpZHRoIC8gaXRlbVdpZHRoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRDb250YWluZXJSb3dzKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG1heEhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy5tYXJnaW5Ub3AgLSB0aGlzLm1hcmdpbkJvdHRvbTtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobWF4SGVpZ2h0IC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldFNjcmVlbk1hcmdpbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBtYXhXaWR0aDogbnVtYmVyID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICBjb25zdCBpdGVtV2lkdGg6IG51bWJlciA9IHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0O1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigobWF4V2lkdGggLSAodGhpcy5fbWF4Q29scyAqIGl0ZW1XaWR0aCkpIC8gMik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbUZyb21Qb3NpdGlvbihwb3NpdGlvbjogTmdHcmlkUmF3UG9zaXRpb24sIGRyYWdTdGFydD86IGJvb2xlYW4pOiBOZ0dyaWRJdGVtIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5faXRlbXNJbkdyaWQsIChpdGVtSWQ6IHN0cmluZykgPT4gdGhpcy5faXRlbXMuZ2V0KGl0ZW1JZCkpLmZpbmQoKGl0ZW06IE5nR3JpZEl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXRlbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zdCBzaXplOiBOZ0dyaWRJdGVtRGltZW5zaW9ucyA9IGl0ZW0uZ2V0RGltZW5zaW9ucygpO1xuICAgICAgICAgICAgY29uc3QgcG9zOiBOZ0dyaWRSYXdQb3NpdGlvbiA9IGl0ZW0uZ2V0UG9zaXRpb24oKTtcblxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxlZnQgPiAocG9zLmxlZnQgKyB0aGlzLm1hcmdpbkxlZnQpICYmIHBvc2l0aW9uLmxlZnQgPCAocG9zLmxlZnQgKyB0aGlzLm1hcmdpbkxlZnQgKyBzaXplLndpZHRoKSAmJlxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcCA+IChwb3MudG9wICsgdGhpcy5tYXJnaW5Ub3ApICYmIHBvc2l0aW9uLnRvcCA8IChwb3MudG9wICsgdGhpcy5tYXJnaW5Ub3AgKyBzaXplLmhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbmZpZy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbi5sZWZ0ID49IHBvcy5sZWZ0ICYmIHBvc2l0aW9uLmxlZnQgPCAocG9zLmxlZnQgKyBzaXplLndpZHRoKVxuICAgICAgICAgICAgICAgICAgICAmJiBwb3NpdGlvbi50b3AgPj0gcG9zLnRvcCAmJiBwb3NpdGlvbi50b3AgPCAocG9zLnRvcCArIHNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY3JlYXRlUGxhY2Vob2xkZXIoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xuICAgICAgICBjb25zdCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGRpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XG5cbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE5nR3JpZFBsYWNlaG9sZGVyKTtcbiAgICAgICAgdmFyIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE5nR3JpZFBsYWNlaG9sZGVyPiA9IGl0ZW0uY29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJSZWYgPSBjb21wb25lbnRSZWY7XG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyOiBOZ0dyaWRQbGFjZWhvbGRlciA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICAgICAgcGxhY2Vob2xkZXIucmVnaXN0ZXJHcmlkKHRoaXMpO1xuICAgICAgICBwbGFjZWhvbGRlci5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xuICAgICAgICBwbGFjZWhvbGRlci5zZXRHcmlkUG9zaXRpb24oeyBjb2w6IHBvcy5jb2wsIHJvdzogcG9zLnJvdyB9KTtcbiAgICAgICAgcGxhY2Vob2xkZXIuc2V0U2l6ZSh7IHg6IGRpbXMueCwgeTogZGltcy55IH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2VtaXRPbkl0ZW1DaGFuZ2UoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1PdXRwdXQ6IGFueVtdID0gQXJyYXkuZnJvbSh0aGlzLl9pdGVtc0luR3JpZClcbiAgICAgICAgICAgIC5tYXAoKGl0ZW1JZDogc3RyaW5nKSA9PiB0aGlzLl9pdGVtcy5nZXQoaXRlbUlkKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKGl0ZW06IE5nR3JpZEl0ZW0pID0+ICEhaXRlbSlcbiAgICAgICAgICAgIC5tYXAoKGl0ZW06IE5nR3JpZEl0ZW0pID0+IGl0ZW0uZ2V0RXZlbnRPdXRwdXQoKSk7XG5cbiAgICAgICAgdGhpcy5vbkl0ZW1DaGFuZ2UuZW1pdChpdGVtT3V0cHV0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kZWZpbmVMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5fZG9jdW1lbnRNb3VzZW1vdmUkID0gZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KGRvY3VtZW50LCAnbW91c2Vtb3ZlJyk7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50TW91c2V1cCQgPSBmcm9tRXZlbnQ8TW91c2VFdmVudD4oZG9jdW1lbnQsICdtb3VzZXVwJyk7XG4gICAgICAgIHRoaXMuX21vdXNlZG93biQgPSBmcm9tRXZlbnQoZWxlbWVudCwgJ21vdXNlZG93bicpO1xuICAgICAgICB0aGlzLl9tb3VzZW1vdmUkID0gZnJvbUV2ZW50KGVsZW1lbnQsICdtb3VzZW1vdmUnKTtcbiAgICAgICAgdGhpcy5fbW91c2V1cCQgPSBmcm9tRXZlbnQoZWxlbWVudCwgJ21vdXNldXAnKTtcbiAgICAgICAgdGhpcy5fdG91Y2hzdGFydCQgPSBmcm9tRXZlbnQoZWxlbWVudCwgJ3RvdWNoc3RhcnQnKTtcbiAgICAgICAgdGhpcy5fdG91Y2htb3ZlJCA9IGZyb21FdmVudChlbGVtZW50LCAndG91Y2htb3ZlJyk7XG4gICAgICAgIHRoaXMuX3RvdWNoZW5kJCA9IGZyb21FdmVudChlbGVtZW50LCAndG91Y2hlbmQnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9lbmFibGVMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VuYWJsZU1vdXNlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzVG91Y2hEZXZpY2UoKSkge1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlVG91Y2hMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VuYWJsZWRMaXN0ZW5lciA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZGlzYWJsZUxpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWJzOiBTdWJzY3JpcHRpb24pID0+IHN1YnMudW5zdWJzY3JpYmUoKSk7XG4gICAgICAgIHRoaXMuX2VuYWJsZWRMaXN0ZW5lciA9IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2lzVG91Y2hEZXZpY2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMDtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfZW5hYmxlVG91Y2hMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRvdWNoc3RhcnRTdWJzID0gdGhpcy5fdG91Y2hzdGFydCQuc3Vic2NyaWJlKChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLm1vdXNlRG93bkV2ZW50SGFuZGxlcihlKSk7XG4gICAgICAgIGNvbnN0IHRvdWNobW92ZVN1YnMgPSB0aGlzLl90b3VjaG1vdmUkLnN1YnNjcmliZSgoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5tb3VzZU1vdmVFdmVudEhhbmRsZXIoZSkpO1xuICAgICAgICBjb25zdCB0b3VjaGVuZFN1YnMgPSB0aGlzLl90b3VjaGVuZCQuc3Vic2NyaWJlKChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLm1vdXNlVXBFdmVudEhhbmRsZXIoZSkpO1xuXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRvdWNoc3RhcnRTdWJzLFxuICAgICAgICAgICAgdG91Y2htb3ZlU3VicyxcbiAgICAgICAgICAgIHRvdWNoZW5kU3Vic1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2VuYWJsZU1vdXNlTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBkb2N1bWVudE1vdXNlbW92ZVN1YnMgPSB0aGlzLl9kb2N1bWVudE1vdXNlbW92ZSQuc3Vic2NyaWJlKChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLm1vdXNlTW92ZUV2ZW50SGFuZGxlcihlKSk7XG4gICAgICAgIGNvbnN0IGRvY3VtZW50TW91c2V1cFN1YnMgPSB0aGlzLl9kb2N1bWVudE1vdXNldXAkLnN1YnNjcmliZSgoZTogTW91c2VFdmVudCkgPT4gdGhpcy5tb3VzZVVwRXZlbnRIYW5kbGVyKGUpKTtcbiAgICAgICAgY29uc3QgbW91c2Vkb3duU3VicyA9IHRoaXMuX21vdXNlZG93biQuc3Vic2NyaWJlKChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLm1vdXNlRG93bkV2ZW50SGFuZGxlcihlKSk7XG4gICAgICAgIGNvbnN0IG1vdXNlbW92ZVN1YnMgPSB0aGlzLl9tb3VzZW1vdmUkLnN1YnNjcmliZSgoZTogTW91c2VFdmVudCkgPT4gdGhpcy5tb3VzZU1vdmVFdmVudEhhbmRsZXIoZSkpO1xuICAgICAgICBjb25zdCBtb3VzZXVwU3VicyA9IHRoaXMuX21vdXNldXAkLnN1YnNjcmliZSgoZTogTW91c2VFdmVudCkgPT4gdGhpcy5tb3VzZVVwRXZlbnRIYW5kbGVyKGUpKTtcblxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBkb2N1bWVudE1vdXNlbW92ZVN1YnMsXG4gICAgICAgICAgICBkb2N1bWVudE1vdXNldXBTdWJzLFxuICAgICAgICAgICAgbW91c2Vkb3duU3VicyxcbiAgICAgICAgICAgIG1vdXNlbW92ZVN1YnMsXG4gICAgICAgICAgICBtb3VzZXVwU3Vic1xuICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==
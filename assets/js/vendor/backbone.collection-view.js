/*!
* Backbone.CollectionView, v0.11.8
* Copyright (c)2013 Rotunda Software, LLC.
* Distributed under MIT license
* http://github.com/rotundasoftware/backbone-collection-view
*/

!function(a,b){"function"==typeof define&&define.amd?define(["underscore","backbone","jquery"],b):"undefined"!=typeof exports?module.exports=b(require("underscore"),require("backbone"),require("backbone").$):b(a._,a.Backbone,a.jQuery||a.Zepto||a.$)}(this,function(a,b,c){function d(b){var c=[];if(!a.isArray(b))throw new Error("Option declarations must be an array.");return a.each(b,function(b){var d,e,f;if(e=!1,f=void 0,a.isString(b))d=b;else{if(!a.isObject(b))throw new Error("Each element in the option declarations array must be either a string or an object.");d=a.first(a.keys(b)),f=a.clone(b[d])}"!"===d[d.length-1]&&(e=!0,d=d.slice(0,d.length-1)),c.push({name:d,required:e,defaultValue:f})}),c}var e=b.View,f="model",g=["collection","modelView","modelViewOptions","itemTemplate","selectableModelsFilter","visibleModelsFilter","itemTemplateFunction","detachedRendering"],h={background:"transparent",border:"none","box-shadow":"none"};return b.CollectionView=b.View.extend({tagName:"ul",events:{"mousedown li, td":"_listItem_onMousedown","dblclick li, td":"_listItem_onDoubleClick",click:"_listBackground_onClick","click ul.collection-list, table.collection-list":"_listBackground_onClick",keydown:"_onKeydown"},spawnMessages:{focus:"focus"},passMessages:{"*":"."},initializationOptions:[{collection:null},{modelView:null},{modelViewOptions:{}},{itemTemplate:null},{itemTemplateFunction:null},{selectable:!0},{clickToSelect:!0},{selectableModelsFilter:null},{visibleModelsFilter:null},{sortableModelsFilter:null},{selectMultiple:!1},{clickToToggle:!1},{processKeyEvents:!0},{sortable:!1},{sortableOptions:null},{reuseModelViews:!0},{detachedRendering:!1},{emptyListCaption:null}],initialize:function(a){b.ViewOptions.add(this,"initializationOptions"),this.setOptions(a),this.collection||(this.collection=new b.Collection),this._hasBeenRendered=!1,this._isBackboneCourierAvailable()&&b.Courier.add(this),this.$el.data("view",this),this.$el.addClass("collection-list"),this.selectable&&this.$el.addClass("selectable"),this.processKeyEvents&&this.$el.attr("tabindex",0),this.selectedItems=[],this._updateItemTemplate(),this.collection&&this._registerCollectionEvents(),this.viewManager=new ChildViewContainer},onOptionsChanged:function(b,c){var d=!1,e=this;a.each(a.keys(b),function(f){var h=b[f],i=c[f];switch(f){case"collection":h!==i&&(e.stopListening(i),e._registerCollectionEvents());break;case"selectMultiple":!h&&e.selectedItems.length>1&&e.setSelectedModel(a.first(e.selectedItems),{by:"cid"});break;case"selectable":!h&&e.selectedItems.length>0&&e.setSelectedModels([]);break;case"sortable":b.sortable?e._setupSortable():e.$el.sortable("destroy");break;case"selectableModelsFilter":h&&a.isFunction(h)&&e._validateSelection();break;case"sortableOptions":e.$el.sortable("destroy"),e._setupSortable();break;case"sortableModelsFilter":e.$el.sortable("destroy"),e.viewManager.each(function(a){var b=e._isRenderedAsList()?a.$el.closest("li"):a;b.toggleClass("not-sortable",!e.sortableModelsFilter.call(e,a.model))}),e._setupSortable();break;case"itemTemplate":e._updateItemTemplate();break;case"processKeyEvents":h&&e.$el.attr("tabindex",0);break;case"modelView":e.viewManager.each(function(a){e.viewManager.remove(a),a.remove()})}a.contains(g,f)&&(d=!0)}),this._hasBeenRendered&&d&&this.render()},setOption:function(a,b){var c={};c[a]=b,this.setOptions(c)},getSelectedModel:function(b){return a.first(this.getSelectedModels(b))},getSelectedModels:function(b){var d=this;b=a.extend({},{by:f},b);var e=b.by,g=[];switch(e){case"id":a.each(this.selectedItems,function(a){g.push(d.collection.get(a).id)});break;case"cid":g=g.concat(this.selectedItems);break;case"offset":var h=0,i=this._getVisibleItemEls();i.each(function(){var a=c(this);a.is(".selected")&&g.push(h),h++});break;case"model":a.each(this.selectedItems,function(a){g.push(d.collection.get(a))});break;case"view":a.each(this.selectedItems,function(a){g.push(d.viewManager.findByModel(d.collection.get(a)))})}return g},setSelectedModels:function(b,d){if(!a.isArray(b))throw"Invalid parameter value";if(this.selectable||!(b.length>0)){d=a.extend({},{silent:!1,by:f},d);var e=d.by,g=[];switch(e){case"cid":g=b;break;case"id":this.collection.each(function(c){a.contains(b,c.id)&&g.push(c.cid)});break;case"model":g=a.pluck(b,"cid");break;case"view":a.each(b,function(a){g.push(a.model.cid)});break;case"offset":var h=0,i=this._getVisibleItemEls();i.each(function(){var d=c(this);a.contains(b,h)&&g.push(d.attr("data-model-cid")),h++})}var j=this.getSelectedModels(),k=a.clone(this.selectedItems);this.selectedItems=this._convertStringsToInts(g),this._validateSelection();var l=this.getSelectedModels();this._containSameElements(k,this.selectedItems)||(this._addSelectedClassToSelectedItems(k),d.silent||(this.trigger("selectionChanged",l,j),this._isBackboneCourierAvailable()&&this.spawn("selectionChanged",{selectedModels:l,oldSelectedModels:j})),this.updateDependentControls())}},setSelectedModel:function(a,b){a||0===a?this.setSelectedModels([a],b):this.setSelectedModels([],b)},render:function(){this._hasBeenRendered=!0,this.selectable&&this._saveSelection();var b;b=this._getContainerEl();var c=this.viewManager;this.viewManager=new ChildViewContainer,c.each(function(a){this.reuseModelViews&&this.collection.get(a.model.cid)?a.$el.detach():a.remove()},this),b.empty();var d;this.detachedRendering&&(d=document.createDocumentFragment()),this.collection.each(function(e){var f=c.findByModelCid(e.cid);(!this.reuseModelViews||a.isUndefined(f))&&(f=this._createNewModelView(e,this._getModelViewOptions(e))),this._insertAndRenderModelView(f,d||b)},this),this.detachedRendering&&b.append(d),this.sortable&&this._setupSortable(),this._showEmptyListCaptionIfAppropriate(),this.trigger("render"),this._isBackboneCourierAvailable()&&this.spawn("render"),this.selectable&&(this._restoreSelection(),this.updateDependentControls()),a.isFunction(this.onAfterRender)&&this.onAfterRender()},_showEmptyListCaptionIfAppropriate:function(){if(this._removeEmptyListCaption(),this.emptyListCaption){var b=this._getVisibleItemEls();if(0===b.length){var d;d=a.isFunction(this.emptyListCaption)?this.emptyListCaption():this.emptyListCaption;var e,f=c("<var class='empty-list-caption'>"+d+"</var>");e=this._isRenderedAsList()?f.wrapAll("<li class='not-sortable'></li>").parent().css(h):f.wrapAll("<tr class='not-sortable'><td colspan='1000'></td></tr>").parent().parent().css(h),this._getContainerEl().append(e)}}},_removeEmptyListCaption:function(){this._isRenderedAsList()?this._getContainerEl().find("> li > var.empty-list-caption").parent().remove():this._getContainerEl().find("> tr > td > var.empty-list-caption").parent().parent().remove()},_insertAndRenderModelView:function(b,c,d){var e=this._wrapModelView(b);11===c.nodeType?c.appendChild(e.get(0)):!a.isUndefined(d)&&d>=0&&d<c.children().length?c.children().eq(d).before(e):c.append(e);var f=b.render();f===!1&&(e.hide(),e.addClass("not-visible"));var g=!1;a.isFunction(this.visibleModelsFilter)&&(g=!this.visibleModelsFilter(b.model)),1===e.children().length?e.toggle(!g):b.$el.toggle(!g),e.toggleClass("not-visible",g),!g&&this.emptyListCaption&&this._removeEmptyListCaption(),this.viewManager.add(b)},updateDependentControls:function(){this.trigger("updateDependentControls",this.getSelectedModels()),this._isBackboneCourierAvailable()&&this.spawn("updateDependentControls",{selectedModels:this.getSelectedModels()})},remove:function(){this.viewManager.each(function(a){a.remove()}),b.View.prototype.remove.apply(this,arguments)},_removeModelView:function(a){var b=this.viewManager,c=b.findByModelCid(a.cid);this.selectable&&this._saveSelection(),b.remove(c),c.remove(),this._getContainerEl().children("[data-model-cid="+a.cid+"]").remove(),this.selectable&&this._restoreSelection(),this._showEmptyListCaptionIfAppropriate()},_validateSelectionAndRender:function(){this._validateSelection(),this.render()},_registerCollectionEvents:function(){this.listenTo(this.collection,"add",function(a){if(this._hasBeenRendered){var b=this._createNewModelView(a,this._getModelViewOptions(a));this._insertAndRenderModelView(b,this._getContainerEl(),this.collection.indexOf(a))}this._isBackboneCourierAvailable()&&this.spawn("add")}),this.listenTo(this.collection,"remove",function(a){this._hasBeenRendered&&this._removeModelView(a),this._isBackboneCourierAvailable()&&this.spawn("remove")}),this.listenTo(this.collection,"reset",function(){this._hasBeenRendered&&this.render(),this._isBackboneCourierAvailable()&&this.spawn("reset")}),this.listenTo(this.collection,"sort",function(a,b){this._hasBeenRendered&&b.add!==!0&&this.render(),this._isBackboneCourierAvailable()&&this.spawn("sort")})},_getContainerEl:function(){if(this._isRenderedAsTable()){var a=this.$el.find("> tbody");if(a.length>0)return a}return this.$el},_getClickedItemId:function(a){var b=null,d=c(a.currentTarget);if(d.closest(".collection-list").get(0)===this.$el.get(0)){var e=d.closest("[data-model-cid]");return e.length>0&&(b=e.attr("data-model-cid"),c.isNumeric(b)&&(b=parseInt(b,10))),b}},_updateItemTemplate:function(){var b;if(this.itemTemplate){if(0===c(this.itemTemplate).length)throw"Could not find item template from selector: "+this.itemTemplate;b=c(this.itemTemplate).html()}else b=this.$(".item-template").html();b&&(this.itemTemplateFunction=a.template(b))},_validateSelection:function(){var b=a.pluck(this.collection.models,"cid");this.selectedItems=a.intersection(b,this.selectedItems),a.isFunction(this.selectableModelsFilter)&&(this.selectedItems=a.filter(this.selectedItems,function(a){return this.selectableModelsFilter.call(this,this.collection.get(a))},this))},_saveSelection:function(){if(!this.selectable)throw"Attempt to save selection on non-selectable list";this.savedSelection={items:a.clone(this.selectedItems),offset:this.getSelectedModel({by:"offset"})}},_restoreSelection:function(){if(!this.savedSelection)throw"Attempt to restore selection but no selection has been saved!";this.setSelectedModels([],{silent:!0}),this.savedSelection.items.length>0&&(this.setSelectedModels(this.savedSelection.items,{by:"cid",silent:!0}),0===this.selectedItems.length&&this.setSelectedModel(this.savedSelection.offset,{by:"offset"}),this.selectedItems.length!==this.savedSelection.items.length&&(this.trigger("selectionChanged",this.getSelectedModels(),[]),this._isBackboneCourierAvailable()&&this.spawn("selectionChanged",{selectedModels:this.getSelectedModels(),oldSelectedModels:[]}))),delete this.savedSelection},_addSelectedClassToSelectedItems:function(b){a.isUndefined(b)&&(b=[]);var c=b;c=a.without(c,this.selectedItems),a.each(c,function(a){this._getContainerEl().find("[data-model-cid="+a+"]").removeClass("selected")},this);var d=this.selectedItems;d=a.without(d,b),a.each(d,function(a){this._getContainerEl().find("[data-model-cid="+a+"]").addClass("selected")},this)},_reorderCollectionBasedOnHTML:function(){var a=this;this._getContainerEl().children().each(function(){var b=c(this).attr("data-model-cid");if(b){var d=a.collection.get(b);d&&(a.collection.remove(d,{silent:!0}),a.collection.add(d,{silent:!0,sort:!a.collection.comparator}))}}),this.collection.trigger("reorder"),this._isBackboneCourierAvailable()&&this.spawn("reorder"),this.collection.comparator&&this.collection.sort()},_getModelViewConstructor:function(a){return this.modelView||e},_getModelViewOptions:function(b){return a.extend({model:b},this.modelViewOptions)},_createNewModelView:function(b,c){var d=this._getModelViewConstructor(b);if(a.isUndefined(d))throw"Could not find modelView constructor for model";var e=new d(c);return e.collectionListView=this,e},_wrapModelView:function(b){var c,d=this;return this._isRenderedAsTable()?c=b.$el.attr("data-model-cid",b.model.cid):this._isRenderedAsList()&&(c="li"===b.$el.prop("tagName").toLowerCase()?b.$el.attr("data-model-cid",b.model.cid):b.$el.wrapAll("<li data-model-cid='"+b.model.cid+"'></li>").parent()),a.isFunction(this.sortableModelsFilter)&&(this.sortableModelsFilter.call(d,b.model)||c.addClass("not-sortable")),a.isFunction(this.selectableModelsFilter)&&(this.selectableModelsFilter.call(d,b.model)||c.addClass("not-selectable")),c},_convertStringsToInts:function(b){return a.map(b,function(b){if(!a.isString(b))return b;var c=parseInt(b,10);return c==b?c:b})},_containSameElements:function(b,c){if(b.length!=c.length)return!1;var d=a.intersection(b,c).length;return d==b.length},_isRenderedAsTable:function(){return"table"===this.$el.prop("tagName").toLowerCase()},_isRenderedAsList:function(){return!this._isRenderedAsTable()},_getVisibleItemEls:function(){var a=[];return a=this._getContainerEl().find("> [data-model-cid]:not(.not-visible)")},_charCodes:{upArrow:38,downArrow:40},_isBackboneCourierAvailable:function(){return!a.isUndefined(b.Courier)},_setupSortable:function(){var b=a.extend({axis:"y",distance:10,forcePlaceholderSize:!0,items:this._isRenderedAsTable()?"> tbody > tr:not(.not-sortable)":"> li:not(.not-sortable)",start:a.bind(this._sortStart,this),change:a.bind(this._sortChange,this),stop:a.bind(this._sortStop,this),receive:a.bind(this._receive,this),over:a.bind(this._over,this)},a.result(this,"sortableOptions"));this.$el=this.$el.sortable(b)},_sortStart:function(a,b){var c=this.collection.get(b.item.attr("data-model-cid"));this.trigger("sortStart",c),this._isBackboneCourierAvailable()&&this.spawn("sortStart",{modelBeingSorted:c})},_sortChange:function(a,b){var c=this.collection.get(b.item.attr("data-model-cid"));this.trigger("sortChange",c),this._isBackboneCourierAvailable()&&this.spawn("sortChange",{modelBeingSorted:c})},_sortStop:function(a,b){var c=this.collection.get(b.item.attr("data-model-cid")),d=this._getContainerEl(),e=d.children().index(b.item);-1==e&&c&&this.collection.remove(c),c&&(this._reorderCollectionBasedOnHTML(),this.updateDependentControls(),this.trigger("sortStop",c,e),this._isBackboneCourierAvailable()&&this.spawn("sortStop",{modelBeingSorted:c,newIndex:e}))},_receive:function(a,b){var c=b.sender,d=c.data("view");if(d&&d.collection){var e=this._getContainerEl().children().index(b.item),f=d.collection.get(b.item.attr("data-model-cid"));d.collection.remove(f),this.collection.add(f,{at:e}),f.collection=this.collection,this.setSelectedModel(f)}},_over:function(a,b){this._getContainerEl().find("> var.empty-list-caption").hide()},_onKeydown:function(a){if(!this.processKeyEvents)return!0;var b=!1;if(1==this.getSelectedModels({by:"offset"}).length){var c=this.getSelectedModel({by:"offset"});a.which===this._charCodes.upArrow&&0!==c?(this.setSelectedModel(c-1,{by:"offset"}),b=!0):a.which===this._charCodes.downArrow&&c!==this.collection.length-1&&(this.setSelectedModel(c+1,{by:"offset"}),b=!0)}return!b},_listItem_onMousedown:function(b){if(this.selectable&&this.clickToSelect){var c=this._getClickedItemId(b);if(c){if(a.isFunction(this.selectableModelsFilter)&&!this.selectableModelsFilter.call(this,this.collection.get(c)))return;if(this.selectMultiple&&b.shiftKey){var d=-1;this.selectedItems.length>0&&this.collection.find(function(b){return d++,a.contains(this.selectedItems,b.cid)},this);var e=-1;this.collection.find(function(a){return e++,a.cid==c},this);for(var f=-1==d?e:d,g=Math.min(e,f),h=Math.max(e,f),i=[],j=g;h>=j;j++)i.push(this.collection.at(j).cid);if(this.setSelectedModels(i,{by:"cid"}),document.selection&&document.selection.empty)document.selection.empty();else if(window.getSelection){var k=window.getSelection();k&&k.removeAllRanges&&k.removeAllRanges()}}else this.selectMultiple&&(this.clickToToggle||b.metaKey)?a.contains(this.selectedItems,c)?this.setSelectedModels(a.without(this.selectedItems,c),{by:"cid"}):this.setSelectedModels(a.union(this.selectedItems,[c]),{by:"cid"}):this.setSelectedModels([c],{by:"cid"})}else this.setSelectedModels([])}},_listItem_onDoubleClick:function(a){var b=this._getClickedItemId(a);if(b){var c=this.collection.get(b);this.trigger("doubleClick",c),this._isBackboneCourierAvailable()&&this.spawn("doubleClick",{clickedModel:c})}},_listBackground_onClick:function(a){this.selectable&&c(a.target).is(".collection-list")&&this.setSelectedModels([])}},{setDefaultModelViewConstructor:function(a){e=a}}),b.ViewOptions={},b.ViewOptions.add=function(b,c){a.isUndefined(c)&&(c="options"),b.setOptions=function(b){var e=this,f={},g={},h=a.result(this,c);if(!a.isUndefined(h)){var i=d(h);a.each(i,function(c){if(thisOptionName=c.name,thisOptionRequired=c.required,thisOptionDefaultValue=c.defaultValue,thisOptionRequired&&(!b||!a.contains(a.keys(b),thisOptionName)&&a.isUndefined(e[thisOptionName])||a.isUndefined(b[thisOptionName])))throw new Error('Required option "'+thisOptionName+'" was not supplied.');b&&thisOptionName in b?(a.isUndefined(e[thisOptionName])||(g[thisOptionName]=e[thisOptionName],f[thisOptionName]=b[thisOptionName]),e[thisOptionName]=b[thisOptionName]):!a.isUndefined(thisOptionDefaultValue)&&a.isUndefined(e[thisOptionName])&&(e[thisOptionName]=thisOptionDefaultValue)})}a.keys(f).length>0&&(a.isFunction(e.onOptionsChanged)?e.onOptionsChanged(f,g):a.isFunction(e._onOptionsChanged)&&e._onOptionsChanged(f,g))},b.getOptions=function(){var b=a.result(this,c);if(a.isUndefined(b))return[];var e=d(b),f=a.pluck(e,"name");return a.pick(this,f)}},ChildViewContainer=function(a,b){var c=function(a){this._views={},this._indexByModel={},this._indexByCustom={},this._updateLength(),b.each(a,this.add,this)};b.extend(c.prototype,{add:function(a,b){var c=a.cid;this._views[c]=a,a.model&&(this._indexByModel[a.model.cid]=c),b&&(this._indexByCustom[b]=c),this._updateLength()},findByModel:function(a){return this.findByModelCid(a.cid)},findByModelCid:function(a){var b=this._indexByModel[a];return this.findByCid(b)},findByCustom:function(a){var b=this._indexByCustom[a];return this.findByCid(b)},findByIndex:function(a){return b.values(this._views)[a]},findByCid:function(a){return this._views[a]},findIndexByCid:function(a){var c=-1,d=b.find(this._views,function(b){return c++,b.model.cid==a?b:void 0});return d?c:-1},remove:function(a){var c=a.cid;a.model&&delete this._indexByModel[a.model.cid],b.any(this._indexByCustom,function(a,b){return a===c?(delete this._indexByCustom[b],!0):void 0},this),delete this._views[c],this._updateLength()},call:function(a){this.apply(a,b.tail(arguments))},apply:function(a,c){b.each(this._views,function(d){b.isFunction(d[a])&&d[a].apply(d,c||[])})},_updateLength:function(){this.length=b.size(this._views)}});var d=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return b.each(d,function(a){c.prototype[a]=function(){var c=b.values(this._views),d=[c].concat(b.toArray(arguments));return b[a].apply(b,d)}}),c}(b,a),b.CollectionView});
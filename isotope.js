isotope={options:{}};

function grabId(id)
{
	// console.log(id);
	if (typeof id=='object' && id.id) id=id.id;
	if (typeof id=='string') {
			//ObjectID("56cb3263d4d84c1558605467")
		var myRegexp=/^ObjectID\("(.*?)"\)$/
		var match = myRegexp.exec(id);
		if (match && match.length>1 && match[1]) {
			return match[1];
		}
	} else if (typeof id=='object' && id._str) {
		return id._str;
	}
	return id;
}


Template.isotopeItem.helpers({
	partial: function() {
		return Template.parentData(2).template;
	},
	position: function() {
		var idMap=[];
		var cursor=prepCursor(Template.parentData(2).cursor);
		// console.log({cur:cursor});
		if (cursor) {
			for (var c in cursor) {
				idMap = idMap.concat(cursor[c].map(function(i) {return i._id;}));
			}
		}
		return _.indexOf(idMap, this._id);
	},
	id: function() {
		return grabId(this._id);
	},
	itemClass:function() {
		return isotope.options.itemClass;//col-lg-3 col-md-4 col-sm-4 col-xs-12 isotopeBlock
	}
});

Template.isotopeItem.onRendered(function() {
	var $ul, li;
	$ul = Template.parentData(1).isotope;
	if ($ul != null ? $ul.data('isotope-initialized') : void 0) {
		li = $(this.find('li'));
		$ul.isotope('insert', li);
		setTimeout(function() {
			// console.log('updateSortData')
			return $ul.isotope('updateSortData').isotope();
		}, 100);
		return li.imagesLoaded(function() {
			// console.log('layout')
			return $ul.isotope('layout');
		});
	}
})

function prepCursor(cursor) {
	var result;
	if (Array.isArray(cursor)) {
		result=[];
		for (var c in cursor) {
			if (Array.isArray(cursor[c]) || cursor[c] instanceof Mongo.Collection.Cursor) {
				result.push(cursor[c]);
			} else {
				result.push([cursor[c]]);
			}
		}
	} else {
		if (cursor instanceof Mongo.Collection.Cursor) {
			result=[cursor];
		} else {
			result=[[cursor]];
		}
	}
	return result;
}


Template.isotope.helpers({
	cursor: function() {
		return prepCursor(this.cursor);
	},
	cssClasses: function() {
		return this.cssClass;
	}
});

Template.isotope.onCreated(function () {
	// if (this.data.cursor) this.data.cursor=prepCursor(this.data.cursor);
});


function reloadIsotope(context) 
{
	try {
		ref2 = $(context.find('.isotopeElementContainer'));
		for (l = 0, len2 = ref2.length; l < len2; l++) {
			el = ref2[l];
			// console.log(el);
			$el.isotope('insert', el);
		}
		setTimeout(function() {
			// console.log('updateSortData')
			return $el.isotope('updateSortData').isotope();
		}, 100);
		$el.imagesLoaded(function() {
			return $el.isotope('layout');
		});
	} catch (e) {
		
	}
}

Template.isotope.onRendered(function () {
	// console.log('Template.isotope.onRendered')
	var $el, el, j, k, l, len, len1, len2, masonryOptions, opt, options, ref, ref1, ref2;
	options = {
		itemSelector: 'li',
		sortBy: 'isotopePosition',
		sortAscending: true,
		getSortData: {
			isotopePosition: '[data-isotope-position] parseInt'
		}
	};
	
	ref = ['layoutMode', 'transitionDuration'];
	for (j = 0, len = ref.length; j < len; j++) {
		opt = ref[j];
		if (this.data[opt] != null) {
			options[opt] = this.data[opt];
		}
	}
	masonryOptions = {};
	ref1 = ['columnWidth', 'gutter', 'isFitWidth'];
	for (k = 0, len1 = ref1.length; k < len1; k++) {
		opt = ref1[k];
		if (this.data[opt] != null) {
			masonryOptions[opt] = this.data[opt];
		}
	}
	$el = $(this.find('ul.isotope'));
	if (!_.isEmpty(masonryOptions)) {
		options.masonry = masonryOptions;
	}
	// console.log({isotope:options});
	
	$el.isotope(options);
	
	ref2 = $(this.find('.isotopeElementContainer'));
	for (l = 0, len2 = ref2.length; l < len2; l++) {
		el = ref2[l];
		// console.log(el);
		$el.isotope('insert', el);
	}
	$el.attr('data-isotope-initialized', 'true');
	this.data.isotope = $el;
	$el.imagesLoaded(function() {
		return $el.isotope('layout');
	});
	var self=this;
	var cursor=prepCursor(this.data.cursor);
	// console.log({cursor:cursor});
	for (var ci in cursor) {
		// console.log({cursor:cursor[ci]});
		// console.log(cursor[ci] instanceof Mongo.Collection.Cursor);
		if (cursor[ci] instanceof Mongo.Collection.Cursor) {
		
			if ((cursor[ci].limit != null) || (cursor[ci].skip != null)) {
				/*return */cursor[ci].observeChanges({
					// added(id, fields) {
					// 	console.log('doc inserted');
					// },
					// changed(id, fields) {
					// 	console.log('doc updated');
					// },
					addedBefore: /*_.throttle(*/function() {
						// console.log('addedBefore');
						// reloadIsotope(self);
						try {
							ref2 = $(self.find('.isotopeElementContainer'));
							for (l = 0, len2 = ref2.length; l < len2; l++) {
								el = ref2[l];
								// console.log(el);
								$el.isotope('insert', el);
							}
							setTimeout(function() {
								// console.log('updateSortData')
								return $el.isotope('updateSortData').isotope();
							}, 100);
							$el.imagesLoaded(function() {
								return $el.isotope('layout');
							});
						} catch (e) {

						}
						return null;
					}/*,100)*/,
					movedBefore: function() {
						// console.log('movedBefore');
						return null;
					},
					removed: function(id) {
						// console.log('removed: '+id);
						if ($('ul.isotope').attr('data-isotope-initialized')) {
							var item, selector;
							selector = "[data-isotope-item-id=" + id + "]";
							item = $el.find(selector);
							return $el.isotope('remove', item).isotope('layout');
						}
					}
				});
			} else {
				/*return */cursor[ci].observe({
					added: /*_.throttle(*/function() {
						// console.log('addedBefore');
						// reloadIsotope(self);
						try {
							ref2 = $(self.find('.isotopeElementContainer'));
							for (l = 0, len2 = ref2.length; l < len2; l++) {
								el = ref2[l];
								// console.log(el);
								$el.isotope('insert', el);
							}
							setTimeout(function() {
								// console.log('updateSortData')
								return $el.isotope('updateSortData').isotope();
							}, 100);
							$el.imagesLoaded(function() {
								return $el.isotope('layout');
							});
						} catch (e) {

						}
						return null;
					}/*,100)*/,
					movedBefore: function() {
						// console.log('movedBefore');
						return null;
					},
					removed: function(doc) {
						// console.log('removed: '+doc._id);
						if ($('ul.isotope').attr('data-isotope-initialized')) {
							var item, selector;
							selector = "[data-isotope-item-id=" + doc._id + "]";
							item = $el.find(selector);
							return $el.isotope('remove', item).isotope('layout');
						}
					}
				});
			}
		}
	}
})

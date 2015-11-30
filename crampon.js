
/**
 * Module dependencies.
 */

var classes = require('component/classes');

/**
 * Expose `Crampon`.
 */

module.exports = Crampon;

/**
 * Define default options.
 */

var defaults = {
  width: '40px',
  color: '#000',
  markerWidth: '3px'
};

/**
 * Initialize a `Crampon` using a given `list`.
 *
 * @param {Element} list - [<ul>|<ol>]
 * @param {Object} options
 * @api public
 */

function Crampon(list, options) {
  if (!(this instanceof Crampon))
    return new Crampon(list);

  if (!list) throw new Error([
    'Crampon constructor: ',
    'undefined element argument'
    ].join());

  this.options = options || {};
  this.applyOptions();
  this.list = list;

  this.getListItems();
  this.getGroups();
}

/**
 * Applies user-defined options, or defaults.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.applyOptions = function () {
  var that = this;
  ['width', 'color', 'markerWidth']
  .forEach(function (opt) {
    that.options[opt] = that.options.hasOwnProperty(opt)
      ? that.options[opt]
      : defaults.hasOwnProperty(opt)
        ? defaults[opt]
        : null;
  });
  return this;
};

/**
 * Sets `#icons`.
 *
 * Example:
 * ```
 * {
 *   groupOne: 'firstIcon.png',
 *   groupTwo: 'secondIcon.png'
 * }
 * ```
 * @param {Object} map
 * @return {Crampon}
 * @api public
 */

Crampon.prototype.mapIcons = function (map) {
  if (typeof map !== 'object') {
    throw new Error([
      'Crampon#mapIcons: ',
      'invalid map argument'
    ].join());
  }
  this.icons = map;
  return this;
};

/**
 * Applies default styling to `#list`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.setListStyle = function () {
  var list = this.list;
  classes(list).add('crampon-list');
  list.style.paddingLeft = this.options.width;
  return this;
};

/**
 * Sets `Crampon#options.width`.
 *
 * @param {Number} width
 * @return {Crampon}
 * @api public
 */

Crampon.prototype.width = function (width) {
  this.options.width = parseInt(width, 10) + 'px';
  return this;
};

/**
 * Sets `Crampon#options.markerWidth`, in pixels.
 *
 * @param {Number} width
 * @return {Crampon}
 * @api public
 */

Crampon.prototype.markerWidth = function (width) {
  this.options.markerWidth = parseInt(width, 10) + 'px';
  return this;
};

/**
 * Sets `Crampon#options.color`.
 *
 * @param {String} color
 * @return {Crampon}
 * @api public
 */

Crampon.prototype.color = function (color) {
  this.options.color = color;
  return this;
};

/**
 * Gets a given option property of `#Crampon`.
 *
 * @param {String} name
 * @return {Mixed}
 * @api private
 */

Crampon.prototype.getOption = function (name) {
  if (this.options.hasOwnProperty(name)) {
    return this.options[name];
  }
  return null;
};

/**
 * Get all `#items` from `#list`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.getListItems = function () {
  var list = this.list;
  var nodes = list.querySelectorAll('li');
  var items = Array.prototype.slice.call(nodes);
  this.items = [];
  for (var i = 0; i < items.length; i++) {
    this.items.push(new Item(items[i]));
  }
  return this;
};

/**
 * Assemble `#groups` from `#items`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.getGroups = function () {
  var items = this.items;
  var groups = {};
  var len = items.length;
  for (var i = 0; i < len; i++) {
    var name = items[i].el.getAttribute('data-crampon');
    if (!name) {
      // missing crampon data attribute
      return;
    }
    if (groups[name]) {
      groups[name].push(items[i]);
    } else {
      groups[name] = [ items[i] ];
    }
  }
  this.groups = groups;
  return this;
};

/**
 * Insert `div.crampon-box` elements into
 * each `#items`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.addBoxes = function () {
  var items = this.items;
  var len = items.length;
  for (var i = 0; i < len; i++) {
    var box = document.createElement('div');
    box.className = 'crampon-box';
    box.style.height = getComputedStyle(items[i].el).height;
    box.style.lineHeight = getComputedStyle(items[i].el).height;
    items[i].el.insertBefore(box, items[i].el.firstChild);
  }
  return this;
};

/**
 * Adds visual content to the box of an `Item`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.addBoxContent = function () {
  var groups = this.groups;
  var groupIndex = 0;
  var color = this.options.color;
  var markerWidth = this.options.markerWidth;

  for (var name in groups) {
    if (!groups.hasOwnProperty(name)) continue;
    groupIndex++;
    var items = groups[name];

    for (var i = 0; i < items.length; i++) {
      var box = items[i].getBox();
      box.style.borderLeft = markerWidth + ' solid ' + color;

      // first in category
      if (i === 0) {
        items[i].addImage(this.icons[name]);
      }
      // last in category
      if (i === items.length - 1) {
        var boxHeight = getComputedStyle(box).height;
        box.style.height =
          (parseFloat(boxHeight, 10) * 0.85) + 'px';
      }
    }
  }
  return this;
};

/**
 * Renders the `Crampon` (modifies the DOM).
 *
 * @api public
 */

Crampon.prototype.render = function() {
  this.setListStyle();
  this.addBoxes();
  this.addBoxContent();
};

/**
 * Initialize an `Item#` from an LI element.
 *
 * @param {Element} el
 * @api private
 */

function Item(el) {
  this.el = el;
}

/**
 * Gets the `div.crampon-box` within a given `Item#`.
 *
 * @return {Element}
 * @api private
 */

Item.prototype.getBox = function () {
  var box = this.el.querySelector('.crampon-box');
  if (!box) return null;
  this.box = box;
  return box;
};

/**
 * Inserts an image into an `Item#el`.
 *
 * @param {String} src
 * @api private
 */

Item.prototype.addImage = function (src) {
  var image = document.createElement('img');
  if (typeof src !== 'string')
    throw new Error([
      'Crampon, Item#addImage: ',
      'invalid image src argument'
    ].join());
  var height = getComputedStyle(this.el).height;
  height = parseFloat(height, 10);
  image.style.marginTop = (height * 0.1) + 'px';
  image.style.maxHeight = (height * 0.8) + 'px';
  image.style.width = (height * 0.8) + 'px';
  image.style.left = -(height + 5) + 'px';
  image.src = src;
  this.box.appendChild(image);
};

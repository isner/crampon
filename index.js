
/**
 * Load dependencies.
 */

var classes = require('classes');

/**
 * Expose `Crampon`.
 */

exports = module.exports = Crampon;

/**
 * Initialize a `Crampon` using a given `list`.
 *
 * @param {Element} list
 * @api public
 */

function Crampon(list) {
  if (!(this instanceof Crampon))
    return new Crampon(list);

  this.list = list;
  this.width = '40px';
  this.radius = '7px';

  this.getListItems();
  this.getGroups();
}

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
 * Adds our default styling to `#list`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.setListStyle = function () {
  var list = this.list;
  classes(list).add('crampon-list');
  list.style.paddingLeft = this.width;
  return this;
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
 * Insert `div.crampon-box` elements into each `#items`.
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.addBoxes = function () {
  var items = this.items;
  var len = items.length;
  var radius = this.radius;
  for (var i = 0; i < len; i++) {
    var box = document.createElement('div');
    box.className = 'crampon-box';
    box.style.height = getComputedStyle(items[i].el).height;
    box.style.width = radius;
    box.style.left = '-' + radius;
    box.style.textIndent = '-' + (parseInt(radius, 10) * 2.5) + 'px';
    items[i].el.insertBefore(box, items[i].el.firstChild);
  }
  return this;
};

/**
 * Adds visual content to the box of an `Item`
 *
 * @return {Crampon}
 * @api private
 */

Crampon.prototype.addBoxContent = function () {
  var groups = this.groups;
  var groupIndex = 0;

  for (var name in groups) {
    // key does not belong to the prototype
    if (groups.hasOwnProperty(name)) {
      groupIndex++;
      var items = groups[name];
      var len = items.length;
      var radius = this.radius;

      for (var i = 0; i < len; i++) {
        var box = items[i].getBox();
          box.style.borderLeft = '1px solid black';

        // first in category
        if (i === 0) {
          box.innerHTML = groupIndex;
          box.style.borderRadius = radius + ' 0 0 0';
        }

        // last in category
        if (i === len - 1) {
          box.style.borderRadius = i === 0
            // last AND first
            ? radius + ' 0 0 ' + radius
            // only last
            : '0 0 0 ' + radius;
        }
      }
    }
  }
  return this;
};

/**
 * Initialize an `Item` from an LI element.
 *
 * @param {Element} el
 * @api private
 */

function Item(el) {
  this.el = el;
}

/**
 * Gets the `div.crampon-box` within a given `Item`
 *
 * @return {Element}
 * @api private
 */

Item.prototype.getBox = function () {
  return this.el.querySelector('.crampon-box');
};
/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Meta info, accessible in the global scope unless you use AMD option.
 */

require.loader = 'component';

/**
 * Internal helper object, contains a sorting function for semantiv versioning
 */
require.helper = {};
require.helper.semVerSort = function(a, b) {
  var aArray = a.version.split('.');
  var bArray = b.version.split('.');
  for (var i=0; i<aArray.length; ++i) {
    var aInt = parseInt(aArray[i], 10);
    var bInt = parseInt(bArray[i], 10);
    if (aInt === bInt) {
      var aLex = aArray[i].substr((""+aInt).length);
      var bLex = bArray[i].substr((""+bInt).length);
      if (aLex === '' && bLex !== '') return 1;
      if (aLex !== '' && bLex === '') return -1;
      if (aLex !== '' && bLex !== '') return aLex > bLex ? 1 : -1;
      continue;
    } else if (aInt > bInt) {
      return 1;
    } else {
      return -1;
    }
  }
  return 0;
}

/**
 * Find and require a module which name starts with the provided name.
 * If multiple modules exists, the highest semver is used. 
 * This function can only be used for remote dependencies.

 * @param {String} name - module name: `user~repo`
 * @param {Boolean} returnPath - returns the canonical require path if true, 
 *                               otherwise it returns the epxorted module
 */
require.latest = function (name, returnPath) {
  function showError(name) {
    throw new Error('failed to find latest module of "' + name + '"');
  }
  // only remotes with semvers, ignore local files conataining a '/'
  var versionRegexp = /(.*)~(.*)@v?(\d+\.\d+\.\d+[^\/]*)$/;
  var remoteRegexp = /(.*)~(.*)/;
  if (!remoteRegexp.test(name)) showError(name);
  var moduleNames = Object.keys(require.modules);
  var semVerCandidates = [];
  var otherCandidates = []; // for instance: name of the git branch
  for (var i=0; i<moduleNames.length; i++) {
    var moduleName = moduleNames[i];
    if (new RegExp(name + '@').test(moduleName)) {
        var version = moduleName.substr(name.length+1);
        var semVerMatch = versionRegexp.exec(moduleName);
        if (semVerMatch != null) {
          semVerCandidates.push({version: version, name: moduleName});
        } else {
          otherCandidates.push({version: version, name: moduleName});
        } 
    }
  }
  if (semVerCandidates.concat(otherCandidates).length === 0) {
    showError(name);
  }
  if (semVerCandidates.length > 0) {
    var module = semVerCandidates.sort(require.helper.semVerSort).pop().name;
    if (returnPath === true) {
      return module;
    }
    return require(module);
  }
  // if the build contains more than one branch of the same module
  // you should not use this funciton
  var module = otherCandidates.sort(function(a, b) {return a.name > b.name})[0].name;
  if (returnPath === true) {
    return module;
  }
  return require(module);
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~indexof@0.0.3", function (exports, module) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});

require.register("component~classes@1.2.4", function (exports, module) {
/**
 * Module dependencies.
 */

var index = require('component~indexof@0.0.3');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

});

require.register("crampon", function (exports, module) {

/**
 * Module dependencies.
 */

var classes = require('component~classes@1.2.4');

/**
 * Expose `Crampon`.
 */

exports = module.exports = Crampon;

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
 * @api private
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

});

require("crampon");

## crampon
Ice-climbing, category grouper.

Crampon adds visual grouping of list items that belong
together.

## Installation

Install with Component
```
$ component install isner/crampon
```

## Basic Usage

```
var Crampon = require('crampon');
var list = document.querySelector('ul');

var crampon = new Crampon(list);
crampon.mapIcons({
  'groupOne': 'myIcon.png',
  'groupTwo': 'yourIcon.svg'
});
crampon.render();
```

## API

### new Crampon(Element, [options])
Initializes a `Crampon#` associated with a given
list element. `Element` should be a `<ul>` or `<ol>`
that contains one or more `<li>`s.

### Crampon#width(String|Number)
Sets the width (in pixels) of the left-padding area
created to accomodate the crampon brackets.
```
var crampon = new Crampon(list);
crampon.width('50');
```
Defaults to `40px`.

### Crampon#color(String)
Sets the color of the crampon brackets.
```
var crampon = new Crampon(list);
crampon.color('#ccc');
```
Defaults to `#000`.

### Crampon#markerWidth(String|Number)
Sets the width (in pixels) of the line which marks
separate categories.
```
var crampon = new Crampon(list);
crampon.markerWidth('5px');
```
Defaults to `3px`.

## Limitations
1. Crampon will not reorder list items, so items that
belong in a category together must already be
positioned adjacently in the list prior to invoking
Crampon.

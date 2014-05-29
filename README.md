## Crampon
A visual categorization indicator for lists.

## General Usage
```
var Crampon = require('crampon');

var list = document.querySelector('ul');
var crampon = new Crampon(list);
crampon.render();
```

## API

### #width
Sets the width of the left-padding area created to
accomodate the crampon brackets.
```
var crampon = new Crampon(list);
crampon.width = '50px';
```

### #radius
Sets the border-radius of the crampon brackets.
```
var crampon = new Crampon(list);
crampon.radius = '10px';
```

### #color
Sets the color of the crampon brackets.
```
var crampon = new Crampon(list);
crampon.color = '#ccc';
```

## Limitations
1. Crampon will not reorder list items, so items that
belong in a category together must already be
positioned adjacently in the list prior to invoking
Crampon.

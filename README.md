## Crampon
A visual categorization indicator for lists.

### Usage

#### General
  ```
  var Crampon = require('crampon');

  var elem = document.querySelector('#myList');
  var crampon = new Crampon(elem);
  crampon.render();
  ```

#### #width
Sets the width of the left-padding area created to
accomodate the category brackets.
  ```
  var crampon = new Crampon(elem);
  crampon.width = '50px';
  ```

#### #radius
Sets the border-radius of the brackets displayed to
indicate categories.
  ```
  var crampon = new Crampon(elem);
  crampon.radius = '10px';
  ```

### Limitations
1. Crampon will not reorder list items, so items that
belong in a category together must already be
positioned adjacently in the list prior to invoking
Crampon.

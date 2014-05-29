# Crampon
A visual categorization indicator for lists.

## Installation
`component install isner/crampon`

## Usage
  ```
  var Crampon = require('crampon');
  var elem = document.querySelector('#myList');
  new Crampon(elem, {
    width: '50px',
    radius: '10px'
  });
  ```

## Limitations
1. Crampon will not reorder list items, so items that
belong in a category together must already be
positioned adjacently in the list prior to invoking
Crampon.

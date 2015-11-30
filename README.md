# Crampon

Crampon adds visual grouping of list items that belong
together.

## Usage

Given the following markup

```html
<ul>
  <li data-crampon="animal">Bear</li>
  <li data-crampon="animal">Lemur</li>
  <li data-crampon="animal">Whale</li>
  <li data-crampon="fruit">Apple</li>
  <li data-crampon="fruit">Orange</li>
</ul>
```

The following JavaScript

```js
var list = document.querySelector('ul');

new Crampon(list)
  .mapIcons({
    'animal': 'animal.png',
    'fruit': 'fruit.svg'
  })
  .render();
```

will construct a Crampon list which visually groups animals and fruit.

## Directions

Include `dist/crampon.js` & `dist/crampon.css` in your project. The JavaScript file exposes the `Crampon` constructor.

## Demo

Clone the repository and open `demo/index.html` in a browser.

## API

### new Crampon(el[, options])

Initializes a `Crampon` for a given
list element.

#### el {HTMLElement}

A `<ul>` or `<ol>` that contains one or more `<li>`s.

#### options {Object}

TODO

### Crampon#mapIcons(map)

Maps each list group to its corresponding icon (see [Usage](#usage) for example).

#### map {Object}

The map must contain *keys* which correspond to values used in the `data-crampon` attribute of each `<li>` in the list groups, and *values* that correspond to image files you wish to use to represent that group.

### Crampon#width(String|Number)

Sets the width (in pixels) of the left-padding area
created to accommodate the crampon brackets.

```js
var crampon = new Crampon(list);
crampon.width('50');
```

Defaults to `40px`.

### Crampon#color(String)

Sets the color of the crampon brackets.

```js
var crampon = new Crampon(list);
crampon.color('#ccc');
```

Defaults to `#000`.

### Crampon#markerWidth(String|Number)

Sets the width (in pixels) of the line which marks
separate categories.

```js
var crampon = new Crampon(list);
crampon.markerWidth('5px');
```

Defaults to `3px`.

## Limitations

1. Crampon will not reorder list items, so items that
belong in a category together must already be
positioned adjacently in the list prior to invoking
Crampon.

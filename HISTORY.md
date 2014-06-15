
# HISTORY

## 0.3.1

### New option: Marker width

You may now specify the width of the vertical
bars which marks categories.

Setter: `Crampon#markerWidth(String)`

* `String` should be the width value including `px`
* Defaults to `3px`

Getter: `Crampon#getOption('markerWidth')`

### Bug fixes

* A list item's category marker now displays
  properly when that list item is both the
  first and last item in the category

* The width of icons is limited to avoid
  overlapping with the category markers
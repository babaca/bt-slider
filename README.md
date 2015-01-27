bt-slider
================
_Current version: 0.1.0_

bt-slider is a directive that creates a range slider or slider that allows a user to change model values.

It has been styled to match one of my projects design.

Appearance
----------

![alt tag](https://raw.github.com/babaca/bt-slider/master/images/osx-chrome.png)

#### Requirements

- Angular (v1.3.8+)
- jQuery (v2.1.3+)
- jQueryUI (v1.11.2+)

Installation
------------

Download the files from Github or use Bower:

    $ bower install bt-slider

Add the JS and CSS to your page:

```html
<link rel="stylesheet" href="bt.slider.css"></link>
<script src="bt.slider.js"></script>
```

Add the `gui` module as a dependency for your app: `angular.module('myApp', ['gui']);`

GitHub Pages
------------

[Project page](https://github.com/babaca/bt-slider)

Quick example
-------------

A basic annotated dotted slider with a range of [ 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large' ]:

```html
<body ng-app="gui">    
    <bt-slider index="2" annotated="true" dotted="true" values="[ 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large' ]">
            </bt-slider>
```


A basic indicated slider with a range of [ 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large' ]:

```html
<body ng-app="gui">    
    <bt-slider index="1" values="[ 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large' ]" indicated="true">
            </bt-slider>
```

As the handles are moved the model values `min` and `max` will be updated in the parent controller.

Options
-------

Options are set as attributes on the `<bt-range-slider>`

### `=` two-way bindings

`min` - min value, represents an index of the position of the min handle

`max` - max value, represents an index of the position the position of the max handle

`index` - represents an index of the position the position of the handle in case of one values choice

`values` - set of the values to show on slider

`disabled` - disables the slider

### Additional options

`span-min` - the minimum span the user can select (must be a number)

`span-max` - the maximum span the user can select (must be a number)

`annotated` - sliders scale is annotated

`indicated` - selection limits are indicated

`dotted` - sliders scale is marked with dots

`color` - color of the scale and dot marks

`color-selected` - colot of selection

`color-disabled` - color of selected area in disabled mode


Tested
------------

- Chrome Version 39.0.2171.95 (64-bit) - Version 40.0.2214.91 (64-bit)
- Safari Version 8.0.2 (10600.2.5)
- Firefox 34.0.5 - 35.0

Credits
-------

Readme texts were generously borrowed from  [Daniel Crisp's](https://github.com/danielcrisp) awesome angular-rangeslider:

https://github.com/danielcrisp/angular-rangeslider

Licence
-------

This code is released under the [MIT Licence](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Babaca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

Attach event handlers, properties to a neighboring custom element.

\<xtal-decorator\> provides the ability to "decorate" neighboring custom element instances.  It is most focused on being able to latch custom element behavior onto a Polymer JS dom-bind element instance, but it can generally be used for customizing, or extending, the behavior of any custom element "inline," without formally subclassing the custom element.  Methods can be attached, where "this" refers to the actual custom element it is attached to.  Properties can also be attached, including specific Polymer JS properties with referenced method observers.  They can also pull in data from the global scope.

<!--
```
<custom-element-demo>
  <template>
  <link rel="import" href="https://rawgit.com/bahrus/xtal/master/bower_components/polymer/lib/elements/dom-bind.html">
    <link rel="import" href="xtal-decorator.html">
            <xtal-decorator>
          <template>
          <script type="text/ecmascript">
            [{
              properties: {
                iceCreamSelection: 'Vanilla',
              },
              polymerProperties:{
                numberOfConesSold:{
                  type: Number,
                  observer: 'observeChangeToNumberOfConesSold',
                  value: 0
                }
              },
              handleClick: function (e) {
                alert(this.iceCreamSelection + " ice cream coming right up!");
                this.numberOfConesSold++;
              },
              observeChangeToNumberOfConesSold: function(newVal, oldVal){
                alert("Number of Ice cream cones sold: " + this.numberOfConesSold);
              }
            }]
         </script>
         </template>
        </xtal-decorator>
        <dom-bind>
          <template>
            Selected Flavor: <span>[[iceCreamSelection]]</span><br>
            <span on-click="handleClick">Click <span style="color:red;cursor:pointer">Here</span> to Order Your Ice Cream</span><br>
            Number of cones sold: <span>[[numberOfConesSold]]</span>

          </template>
        </dom-bind>
    
  </template
</custom-element-demo>
```
-->

To use:

1)  Reference the library: 

```html
<link rel="import" href="xtal-decorator.html">
```

or

```html
<script async src="xtal-decorator.js">
```

or

```html
<script async type="module" src="xtal-decorator.js">
```

2)  The format of a _xtal-decorator_ applied to a Polymer JS dom-bind element is shown below:

```html
<template>
    <script type="text/ecmascript">
        var favoriteIceCreamFlavor = "Chocolate";
    </script>
    <xtal-decorator>
        <template>
        <script type="text/ecmascript">
        [{
            properties: {
                iceCreamSelection: favoriteIceCreamFlavor,
            },
            polymerProperties:{
                numberOfConesSold:{
                    type: Number,
                    observer: 'observeChangeToNumberOfConesSold',
                    value: 0
                }
            },
            handleClick: function (e) {
                alert(this.iceCreamSelection + " ice cream coming right up!");
                this.numberOfConesSold++;
            },
            observeChangeToNumberOfConesSold: function(newVal, oldVal){
                alert("Number of Ice cream cones sold: " + this.numberOfConesSold);
            }
        }]
        </script>
        </template>
    </xtal-decorator>
    <dom-bind>
        <template>
        Selected Flavor: <span>[[iceCreamSelection]]</span><br>
        <span on-click="handleClick">Click <span style="color:red;cursor:pointer">Here</span> to Order Your Ice Cream</span><br>
        Number of cones sold: <span>[[numberOfConesSold]]</span>

        </template>
    </dom-bind>
</template>
```

Essentially, it allows you to define an anomymous, "non-reusable" "web component", without the ceremony of:

- Coming up with a unique, meaningful name for the custom element
- Wrapping the logic into a class, calling customElements.define
- Optionally separating the custom element into a separate file so it can be referenced repeatedly.  

The template tag surrounding the script tag is optional -- without that tag, the browser will instantly evaluate the expression, and do nothing with it, as it isn't stored anywhere.  The expression will be evaluated again when the _xtal-decorator_ tag is upgraded.  So that's a waste of processing, and, potentially, a source of unexpected side effects.

Note that the contents inside the script tag is, at the top most level, an array.  This allows you to merge properties together from various locations, and override previous methods (which makes sense if some of the array elements are referencing common definitions).  I.e. you get some semblance of inheritance by using an array.

By default, _xtal-decorator_ searches for the all the dom-bind elements it can find in its vicinity.  But you can specify any css selector you'd like via the CssSelector property.  The logic to find the elements, to attach its behavior to, is as follows:

```JavaScript
this.parentElement.querySelectorAll(this.CssSelector)
``` 

## Referencing the component

_xtal-decorator_ has no dependencies.  As such it can be referenced via the classic script tag:

```html
<script async src="../xtal-decorator.js"></script>
```

or you can use ES6 modules:

```html
<script async type="module" src="../xtal-decorator.js"></script>
```


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

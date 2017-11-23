[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

Attach event handlers, properties to a neighboring custom element.  Even modify styles within the shadow DOM.

\<xtal-decorator\> provides the ability to "decorate" neighboring custom element instances.  It is most focused on being able to latch custom element behavior onto a Polymer JS dom-bind element instance, but it can generally be used for customizing, or extending, the behavior of any custom element instance "inline," without formally subclassing the custom element.  Methods can be attached, where "this" refers to the actual custom element it is attached to.  Properties can also be attached, including specific Polymer JS properties with referenced method observers.  They can also pull in data from the global scope.

Style tags can be appended as well, assuming the target has a shadow root.

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

Note that the script contained inside the script tag must be compatible with whatever browser you are targeting.  Since we don't need to define a class (see above) it is quite possible to target IE11 browsers with no build step.

By default, _xtal-decorator_ searches for the all the dom-bind elements it can find in its vicinity.  But you can specify any css selector you'd like via the CssSelector property.  The logic to find the elements, to attach its behavior to, is as follows:

```JavaScript
this.parentElement.querySelectorAll(this.CssSelector)
``` 

There are special values of the CssSelector where finding the target is done differently:  "_host" means find the containing element that has a shadow root, and apply the decorations to that element.

Since this component can be use to "hack" the behavior of a custom element without properly subclassing it, we might as well go all the way.  You can also "pierce" into the shadow DOM, and set properties / attach methods.  And you can set styles.

Why would you want to set styles deep within some element's shadow DOM, when there are things like CSS Properties and parts?  

Have you ever been under a tight deadline, and you don't have time to read through all the documentation / definitions to find what variable you need to set to change a color?  If so, this component is for you.  It uses the old deprecated >>> Shadoe DOM piercing selector:

```html
  <xtal-decorator selector="paper-input>>>paper-input-container>label">
    <template>
      <script type="text/ecmascript">
        [{
            style: {
              color: 'green'
            }
          }]
      </script>
    </template>
  </xtal-decorator>
```

## Timing

A key aspect of this component is being able to select targets to apply the decorations too.  However, the DOM nodes can change quite a bit over the course of time -- tags might upgrade to custom elements in an unpredictable amount of time, and DOM nodes may be created dynamically, which this component may want to respond to.

By default, *xtal-decorator* will search for matching nodes during the connectedCallback lifecycle event.  Often, this will be all you need.

However, especially if searching for _host or using the deprecated pierce selector ( ">>>" ), the timing for when the shadowRoot will be be attached to parents / sibling / child nodes is unpredictable.  

However, there are two validations one can configure before *xtal-decorator* will process.

The simplest validation is to specify the minimum number of targets the selector should locate before attaching the behavior.  This is done via the min-element-count attribute.

To achieve a much higher level of validation, one can add the attribute "validate-targets."  If this is present,then the decorator won't apply elements until the targets is finds passes the test specified by functional propert targetValidator. 

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

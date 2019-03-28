[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-decorator">

Add properties / methods to other DOM (custom) elements.

xtal-deco, xtal-decor and xtal-decorator provide a way of adding behavior to other elements -- "decorating" the element.  The affected elements can be native DOM elements, or custom element instances. xtal-decorator extends xtal-decor, which extends xtal-deco, each extension adding more functionality. xtal-deco and xtal-decor only affect the next sibling element.  xtal-decorator can apply to multiple elements.

The syntax is heavily influenced by Vue / Polymer 1.

## Adding behavior to the next element instance with xtal-deco

Syntax:


```html
<xtal-deco><script nomodule>
    ({
        on: {
            click: function (e) {
                alert(this.dataset.drinkSelection + ' coming right up!');
                this.numberOfDrinksSold++;
            }
        },
        props: {
            numberOfDrinksSold: 0,
        },
        methods:{
            onPropsChange: function () {
                console.log('Thanks, Rosmerta');
            }
        },
        vals:{
            title: 'Clicker',
        }
    })
</script></xtal-deco>
<button data-drink-selection="Butterbeer">Click me to Order Your Drink</button>
<!-- Pass down(p-d) prop numberOfDrinksSold when it changes -->
<p-d on="numberOfDrinksSold-changed" prop="textContent" val="target.numberOfDrinksSold"></p-d>
<span></span> drinks sold.

```

We can see there are four top level categories of things that we can attach -- event handlers via "on", properties with setters / getters via "props", methods and vals.  Any time a prop changes, the element fires an event:  [propName]-changed, and also calls method onPropsChange (actually a symbol-protected alias).

"vals" is used to simply set some initial property values on the target element(s).

**NB I:**  Here we are adding a property onto an existing native DOM element -- button in this case.  Although the property is added onto the element, and no attempt to do any kind of super.prop or super.method call is made, I can't completely rule out the possibility that something could go horribly wrong should a property with the same name be introduced into the browser native button element.  Please act responsibly and only choose property names (or method names) -- in this example "numberOfDrinksSold" -- whose chance of getting added natively to the button DOM element are lower than seeing a Libertarian POTUS in your pet mouse's lifespan.  These web components have a protective curse -- anyone trying to add a property or a method which has a higher probability will result in the developer receiving a one-way ticket to Azkaban.

If you really want to play it safe, there is an attribute, "use-symbols", which allows you to use symbols, which should be 100% safe:

```html
<xtal-deco use-symbols='["numberOfDrinksSold"]'><script nomodule>
    ({
        on: {
            click: function (e) {
                alert(this.dataset.drinkSelection + ' coming right up!');
                this[numberOfDrinksSold]++;
            }
        },
        props: {
            [numberOfDrinksSold]: 0,
        },
        methods:{
            onPropsChange: function () {
                console.log('Thanks, Rosmerta');
            }
        },
        vals:{
            title: 'Clicker',
        }
    })
</script></xtal-deco>
<button disabled data-drink-selection="Butterbeer">Click me to Order Your Drink</button>
<p-d on="Symbol-numberOfDrinksSold-changed" prop="textContent" val="detail.value"></p-d>
<span></span> drinks sold.
```

I *think* using property and method names starting with an underscore should also allow you to steer clear of the dementors. That would be easier than working with symbols.

## xtal-decor, xtal-decorator

xtal-decor and xtal-decorator are the kind of web components you would find hanging out in Knockturn Alley.

### Attach Script

xtal-decor, like xtal-deco, can also attach properties and functions to the next element, but you need to be more explicit:

```html
    <xtal-decor attach-script into-next-element></xtal-decor>
```

###  Template insertion into neighboring web component's Shadow DOM.

**NB II:** The benefits of this functionality should drop dramatically as ::part / ::theme becomes a [::thing](https://meowni.ca/posts/part-theme-explainer/).

Syntax:

```html
<xtal-decor insert-template into-next-element>
    <template>
        <style>
            label {
                background-color: blood-red;
            }
        </style>
    </template>
</xtal-decor>
<paper-input label="Shop" value="Fledermaus and Tanner Bats & Skins"></paper-input>
```

### Template insertion deep inside neighboring web component's Shadow DOM [Not fully tested]


```html
<xtal-decor insert-template and attach-script into-next-element>
    <template>
        <style>
            label {
                background-color: blood-red;
            }
        </style>
    </template>
    <template data-path="paper-input-container/iron-input">
        <tom-riddles-diary></tom-riddles-diary>
    </template>
    <script nomodule data-path="paper-input-container/iron-input/input">
       ({
           on: {
                    click: function (e) {
                        alert('Up to no good, are we?');
                    }
                }
       })
    </script>
</xtal-decor>
<paper-input label="Shop" value="Fledermaus and Tanner Bats & Skins"></paper-input>
```

The word "and" is optional and doesn't do anything other than make the markup more readable.

### xtal-decorator -- Extra Restricted Section

xtal-decorator extends xtal-decor, but rather than just target the next element, it can target all elements within the shadow DOM realm matching a selector:

```html
<xtal-decorator insert-template and attach-script where-target-selector="paper-input" >
...
</xtal-decorator>
```

## Syntax Reference

<!--
```
<custom-element-demo>
<template>
      <wc-info
        package-name="npm.xtal-decorator"
        href="https://unpkg.com/xtal-decorator@0.0.35/html.json"
      >
        <!-- Use experimental import maps -->
        <script defer src="https://cdn.jsdelivr.net/npm/es-module-shims@0.2.0/dist/es-module-shims.js"></script>
        <script type="importmap-shim">
          {
            "imports": {
              "xtal-latx/": "https://cdn.jsdelivr.net/npm/xtal-latx@0.0.88/",
              "trans-render/": "https://cdn.jsdelivr.net/npm/trans-render@0.0.60/",
              "hypo-link/": "https://cdn.jsdelivr.net/npm/hypo-link@0.0.8/",
              "xtal-element/": "https://cdn.jsdelivr.net/npm/xtal-element@0.0.23/",
              "wc-info/": "https://cdn.jsdelivr.net/npm/wc-info@0.0.28/"
              
            }
          }
          </script>
          
        <script  type="module-shim">
          import 'wc-info/wc-info.js';
        </script>
</template>
</custom-element-demo>
```
-->

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```



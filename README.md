[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-decorator">

Extend or Apply methods / properties onto other elements

xtal-deco, xtal-decor and xtal-decorator provide a way of adding behavior to other elements -- "decorating" the element.  The affected elements can be native DOM elements, or custom element instances. xtal-decorator extends xtal-decor, which extends xtal-deco, each extension adding more functionality. xtal-deco and xtal-decor only affect the next sibling element.  xtal-decorator can apply to multiple elements.

The syntax is heavily influenced by Vue.

## Adding behavior to the next element instance with xtal-deco

Syntax:


```html
<xtal-decorator attach-script into-next-element>
    <script nomodule>
        ({
            on: {
                click: function (e) {
                    alert(this.dataset.drinkSelection + ' ice cream coming right up!');
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
            }

        })
    </script>
</xtal-decorator>

<button data-drink-selection="Butterbeer">Click me to Order Your Drink</button>
<!-- Pass down(p-d) prop numberOfConesSold when it changes -->
<p-d on="numberOfConesSold-changed" to="{textContent:target.numberOfConesSold}"></p-d>
<span></span> drinks sold.

```

**NB I:**  Note that we are adding a property onto an existing native DOM element -- button in this case.  Please act responsibly and only choose property names (or method names) -- in this example "numberOfDrinksSold" -- whose chance of getting added natively to the button DOM element are lower than seeing a Libertarian POTUS in your pet mouse's lifespan.

## xtal-decor, xtal-decorator

xtal-decor and xtal-decorator are the kind of web components you would find hanging out in Knockturn Alley.

### Attach Script

xtal-decor, like xtal-deco, can also attach properties and functions to the next element, but you need to be more explicit:

```html
    <xtal-decor attach-script into-next-element></xtal-decorator
```

###  Template insertion into neighboring web component's Shadow DOM.

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

** NB II:** The benefits of this functionality should drop dramatically as ::part / ::theme become a ::thing.

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



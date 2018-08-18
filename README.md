[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

Extend or Apply methods / properties onto the next element

xtal-deco, xtal-decor and xtal-decorator provide a way of adding or overriding behavior of the next element -- "decorating" the element.  That next element can be a native DOM element, or a custom element. xtal-decorator extends xtal-deco with additional functionality

## Adding behavior to an element instance with xtal-deco

Syntax:


```html
    <xtal-deco>
        <script nomodule>
            ({
                on: {
                    click: function (e) {
                        alert(this.dataset.drinkSelection + ' butterbeer coming right up!');
                        this.numberOfDrinksSold++;
                    }
                },
                props:{
                    numberOfConesSold: 0,
                },
                onPropsChange: function(){
                    console.log('Thanks, Rosmerta');
                }
            })
        </script>
    </xtal-deco>
    
    <button data-drink-selection="Butterbeer">Click me to Order Your Butterbeer</button>
    <p-d-x on="numberOfDrinksSold-changed" skip-init to="{innerText:target.numberOfDrinksSold}"></p-d-x>
    <span></span> cones sold.

```

xtal-deco is ~830 bytes (minified / gzipped).



## xtal-decor, xtal-decorator

\<xtal-decorator\> extends \<xtal-decor\> which extends \<xtal-deco\>, and they are kind of the Knockturn Alley of web components.

### Attach Script

xtal-decorator can also attach properties and functions to the next element, but you need to be more explicit:

```html
    <xtal-decor attach-script></xtal-decorator
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

xtal-decor can also target elements within its Shadow DOM realm, rather than just the next element.

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

The word "and" is optional and does no harm.

### xtal-decorator -- Extra Restricted Section [TODO]

xtal-decorator extends xtal-decor, but rather than just target the next element, it targets all elements within the shadow DOM realm matching a selector:

```html
<xtal-decorator insert-template and attach-script where-target-selector="paper-input" >
...
</xtal-decorator>
```


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

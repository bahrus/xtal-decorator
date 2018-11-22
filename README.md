[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.32/dist/xtal-deco.iife.min.js?compression=gzip">

Extend or Apply methods / properties onto other elements

xtal-deco, xtal-decor and xtal-decorator provide a way of adding or overriding behavior of other elements -- "decorating" the element.  The affected elements can be native DOM elements, or custom element instances. xtal-decorator extends xtal-decor, which extends xtal-deco, each extension adding more functionality. xtal-deco and xtal-decor only affect the next sibling element.  xtal-decorator can apply to multiple elements.

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
        props:{
            numberOfDrinksSold: 0,
        },
        onPropsChange: function(){
            console.log('Thanks, Rosmerta');
        },
        setters:{
            someNativeButtonProp:{ //are there any?
                foo:'bar'
            }
        }
    })
    </script></xtal-deco>
    
    <button data-drink-selection="Butterbeer">Click me to order your drink</button>
    <p-d-x on="numberOfDrinksSold-changed" skip-init to="{innerText:target.numberOfDrinksSold}"></p-d-x>
    <span></span> drinks sold.

```

## Using the api only

```JavaScript
customElements.whenDefined('xtal-deco').then(() => {
    customElements.get('xtal-deco').attachBehavior(target, {
        on: {
            ...
        }
        ...
    })
}
```

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

All three of these components together weigh about 2.7kb minifed and gzipped.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```



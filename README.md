[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

Extend or Apply methods / properties onto the next element

xtal-deco and xtal-decorator provide a way of adding or overriding behavior of the next element -- "decorating" the element.  That next element can be a native DOM element, or a custom element. xtal-decorator extends xtal-deco with additional functionality

Syntax:


```html
    <xtal-deco>
        <script nomodule>
            ({
                on: {
                    click: function (e) {
                        alert(this.dataset.iceCreamSelection + ' ice cream coming right up!');
                        this.numberOfConesSold++;
                    }
                },
                props:{
                    numberOfConesSold: 0,
                },
                onPropsChange: function(){
                    console.log('i am here');
                }
            })
        </script>
    </xtal-deco>
    
    <button data-ice-cream-selection="Chocolate">Click me to Order Your Ice Cream</button>
    <p-d-x on="numberOfConesSold-changed" skip-init to="{innerText:target.numberOfConesSold}"></p-d-x>
    <span></span> cones sold.

```

xtal-deco is ~760 bytes (minified / gzipped).

## Style hacking [TODO]

\<xtal-decorator\> extends xtal-deco, by allowing style tags can be appended as well, assuming the target has a shadow root.



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

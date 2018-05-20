[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

Extend or Apply methods / properties onto neighboring elements

\<xtal-decorator\> provides the ability to "decorate" neighboring custom element instances.  It is most focused on being able to latch custom element behavior onto a Polymer JS dom-bind element instance, but it can generally be used for customizing, or extending, the behavior of any custom element instance "inline," without formally subclassing the custom element.  Methods can be attached, where "this" refers to the actual custom element it is attached to.  Properties can also be attached, including specific Polymer JS properties with referenced method observers.  They can also pull in data from the global scope.

Style tags can be appended as well, assuming the target has a shadow root.

<!--
```
<custom-element-demo>
  <template>
  <link rel="import" href="../polymer/lib/elements/dom-bind.html">
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

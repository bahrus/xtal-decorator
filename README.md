# \<xtal-decorator\>

Attach event handlers, properties to a neighboring custom element.

\<xtal-decorator\> provides some useful features for "decorating" neighboring custom elements, similar in concept to class decorators.  It is most focused on being able to latch custom element behavior onto a polymer dom-bind element, but it can generally be used for customizing the behavior of any custom element "inline," without extending it into another custom element.  Methods can be attached, where "this" refers to the actual custom element it is attached to.

Properties can also be configured this way, pulling in data from the global scope.



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

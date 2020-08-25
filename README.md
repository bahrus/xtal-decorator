[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-decorator)

# \<xtal-decorator\>

<a href="https://nodei.co/npm/xtal-decorator/"><img src="https://nodei.co/npm/xtal-decorator.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-decorator">

Propagate props / attributes / light children into other DOM (custom) elements.

xtal-decorator is a web component capable of creating spells of powerful, dark magic on other DOM elements (custom or otherwise).

xtal-decorator is part of a family of components, along with [xtal-decor](https://www.npmjs.com/package/xtal-decor) and [xtal-deco](https://www.npmjs.com/package/xtal-deco).  xtal-deco and xtal-decor strive to [live within the light](https://www.pinterest.com/pin/317433473707811040/).  They adhere to the principle of opt-in -- requiring DOM elements to request enhanced behavior via custom attributes (xtal-decor) or via proximity (xtal-deco).  Both xtal-deco and xtal-decor can apply "behaviors" on their target elements that last for the lifetime of the elements.

xtal-decorator, on the other hand, searches far and deep -- like xtal-decor, it can target any DOM within its Shadow DOM realm, but in addition, xtal-decorator can recursively pierce inside the Shadow DOM of elements within its realm.  Once the target is found, though, it can only do quick one-time things like 1) Set Props, or 2)  Set Attributes, and/or 3) Insert a template.

```html
<xtal-decorator selector-sequence='["ginny-weasly", "book-bag"]' props='...' attribs='...' insert-template=beforeEnd>
    <template>
    ...
        <tom-riddles-diary></tom-riddles-diary>
    ...
    </template>
</xtal-decorator>
...
<ginny-weasly>
 #shadow
    <book-bag></book-bag>
</ginny-weasly>
```



## Viewing Your Element

```
$ npm run test
$ npm run serve
```



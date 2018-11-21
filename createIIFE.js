const jiife = require('jiife');
const xs = 'node_modules/xtal-shell/';
const xl = 'node_modules/xtal-latx/';
const def = xl + 'define.js';
jiife.processFiles([xs + 'dashToCamelCase.js', xs + '/getChildren.js', xs + 'getChildFromSinglePath.js', 
                    'xtal-deco.js', def, xl + 'xtal-latx.js', xl + 'observeCssSelector.js',
                    'xtal-decor.js', 'xtal-decorator.js'], 
                    'dist/xtal-decorator.iife.js');
jiife.processFiles([def, 'xtal-deco.js'], 'dist/xtal-deco.iife.js');





const jiife = require('jiife');
jiife.processFiles(['node_modules/xtal-shell/dashToCamelCase.js', 'node_modules/xtal-shell/getChildren.js', 'node_modules/xtal-shell/getChildFromSinglePath.js', 
                    'xtal-deco.js', 'node_modules/xtal-latx/xtal-latx.js', 'xtal-decor.js', 'xtal-decorator.js'], 
                    'xtal-decorator.iife.js');




module xtal.elements {
    /**
    * `xtal-decorator`
    * Dynamically load custom elements from central config file. 
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
    class XtalDecorator extends HTMLElement {
        _CssSelector = 'dom-bind';
        static get is() {
            return 'xtal-decorator';
        }
        static get observedAttributes() {
            return [
                /** @type {string} 
                 * Selector to search for within the parent element.  Default value:  dom-bind
                 * This will select the target elements(s) to which properties and methods will be attached.
                 */
                'selector',
            ];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'selector':
                    this._CssSelector = newValue;
                    break;
            }
        }
        connectedCallback() {
            // let nextSibling = this.nextElementSibling;
            // while(nextSibling && nextSibling.tagName.indexOf("-") === -1){
            //     nextSibling = nextSibling.nextElementSibling;
            // }
            // if(!nextSibling) return;
            const targets = this.parentElement.querySelectorAll(this._CssSelector);
            const scriptTag = this.querySelector("script");
            const innerText = scriptTag.innerText;
            const objectsToMerge = eval(innerText) as any[];
            let propertiesToSet;
            for (let j = 0, jj = objectsToMerge.length; j < jj; j++) {
                const objectToMerge = objectsToMerge[j];
                for (var key in objectToMerge) {
                    const val = objectToMerge[key];
                    switch (typeof val) {
                        case 'function':
                            for(let i = 0, ii = targets.length; i < ii; i++){
                                const target = targets[i];
                                Object.defineProperty(target, key, {
                                    enumerable: false,
                                    configurable: true,
                                    writable: true,
                                    value: val,
                                });
                            }

                            break;
                        case 'object':
                            if(key === 'properties'){
                                if(!propertiesToSet) {
                                    propertiesToSet = val;
                                }else{
                                    this.mergeDeep(propertiesToSet, val);
                                }
                                
                                //Object.assign(target, val);
                            }
                            break;
                            
                        
                    }
                }
                                }
            for (let i = 0, ii = targets.length; i < ii; i++) {
                const target = targets[i];
                if(target['setProperties']){
                    target['setProperties'](propertiesToSet);
                }else{
                    Object.assign(target, propertiesToSet);
                }
            }


        }

        /**
         * Deep merge two objects.
         * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
         * @param target
         * @param source
         * 
         */
        mergeDeep(target, source) {
            if(typeof target !== 'object') return;
            if(typeof source !== 'object') return;
            for (const key in source) {
                const sourceVal = source[key];
                const targetVal = target[key];
                if(!sourceVal) continue; //TODO:  null out property?
                if(!targetVal){
                    console.log(key);
                    target[key] = sourceVal;
                    continue;
                }
                if(Array.isArray(sourceVal) && Array.isArray(targetVal)){
                    //warning!! code below not yet tested
                    if(targetVal.length > 0 && typeof targetVal[0].id === 'undefined') continue;
                    for(var i = 0, ii = sourceVal.length; i < ii; i++){
                        const srcEl = sourceVal[i];
                        if(typeof srcEl.id === 'undefined') continue;
                        const targetEl = targetVal.find(function(el){return el.id === srcEl.id;});
                        if(targetEl){
                            this.mergeDeep(targetEl, srcEl);
                        }else{
                            targetVal.push(srcEl);
                        }
                    }
                    continue;
                }
                switch(typeof sourceVal){
                    case 'object':
                        switch(typeof targetVal){
                            case 'object':
                                this.mergeDeep(targetVal, sourceVal);
                                break;
                            default:
                                console.log(key);
                                target[key] = sourceVal;
                                break;
                        }
                        break;
                    default:
                        console.log(key);
                        target[key] = sourceVal;
                }
            }
            return target;
        }
    }
    customElements.define(XtalDecorator.is, XtalDecorator);
}
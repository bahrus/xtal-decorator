module xtal.elements{
    class XtalDecorator extends HTMLElement{
        static get is(){
            return 'xtal-decorator';
        }
        connectedCallback(){
            let nextSibling = this.nextElementSibling;
            while(nextSibling && nextSibling.tagName.indexOf("-") === -1){
                nextSibling = nextSibling.nextElementSibling;
            }
            if(!nextSibling) return;
            const scriptTag = this.querySelector("script");
            const innerText = scriptTag.innerText;
            const objectsToMerge = eval(innerText) as any[];
            objectsToMerge.forEach(obj =>{
                this.mergeDeep(nextSibling, obj);
            })
            
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
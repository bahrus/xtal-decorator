import {XtallatX} from 'xtal-latx/xtal-latx.js';

export class XtalDeco extends XtallatX(HTMLElement){
    static get is(){return 'xtal-deco';}
    connectedCallback(){
        this.evaluateCode();
    }
    _nextSibling: HTMLElement;
    _script: HTMLScriptElement;
    evaluateCode(){
        if(!this._nextSibling){
            this._nextSibling = this.nextElementSibling;
        }
        if(!this._script){
            this._script = this.querySelector('script') as HTMLScriptElement;
        }
        if(!this._script || !this._nextSibling){
            setTimeout(() =>{
                this.evaluateCode();
            }, 50);
            return;
        }
        const evalObj = eval(this._script.innerHTML);
        const onObj = evalObj.on;
        if(onObj){
            for(let key in onObj){
                const handlerKey = key + '_decoHandler';
                const prop = Object.defineProperty(this._nextSibling, handlerKey, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: onObj[key],
                });
                this._nextSibling.addEventListener(key, this._nextSibling[handlerKey]);
            }
        }
    }
}
customElements.define(XtalDeco.is, XtalDeco);
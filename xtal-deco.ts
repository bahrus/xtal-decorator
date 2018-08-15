//import { XtallatX } from 'xtal-latx/xtal-latx.js';

export class XtalDeco extends HTMLElement {
    static get is() { return 'xtal-deco'; }
    connectedCallback() {
        this.evaluateCode();
    }
    _nextSibling: HTMLElement;
    _script: HTMLScriptElement;
    attachBehavior(evalObj) {
        for (const topKey in evalObj) {
            const subObj = evalObj[topKey];
            switch (topKey) {
                case 'on':
                    for (const key in subObj) {
                        const handlerKey = key + '_decoHandler';
                        const prop = Object.defineProperty(this._nextSibling, handlerKey, {
                            enumerable: false,
                            configurable: true,
                            writable: true,
                            value: subObj[key],
                        });
                        this._nextSibling.addEventListener(key, this._nextSibling[handlerKey]);
                    }
                    break;
                case 'props':
                    for (const key in subObj) {
                        const propVal = subObj[key];
                        Object.defineProperty(this._nextSibling, key, {
                            get: function () {
                                return this['_' + key];
                            },
                            set: function (val) {
                                // function to$(number){
                                //     const mod = number % 2;
                                //     return (number - mod) / 2 + '-' + mod;
                                // }
                                // function incAttr(target, name){
                                //     const ec = target._evCount;
                                //     if(name in ec) {
                                //         ec[name]++;
                                //     }else{
                                //         ec[name] = 0;
                                //     }
                                //     target.setAttribute('data-' + name, to$(ec[name]));
                                // }
                                this['_' + key] = val;
                                const eventName = key + '-changed';
                                const newEvent = new CustomEvent(eventName, {
                                    detail: {
                                        value: val
                                    },
                                    bubbles: true,
                                    composed: false,
                                } as CustomEventInit);
                                this.dispatchEvent(newEvent);
                                //incAttr
                            },
                            enumerable: true,
                            configurable: true,
                        });
                        this._nextSibling[key] = propVal;
                    }
                    break;
                default:
                    switch (typeof (subObj)) {
                        case 'function':
                            const prop = Object.defineProperty(this._nextSibling, topKey, {
                                enumerable: false,
                                configurable: true,
                                writable: true,
                                value: subObj,
                            });
                            break;
                        case 'object':
                            this._nextSibling[topKey] = subObj;
                            break;
                    }
            }
        }

    }
    evaluateCode() {
        if (!this._nextSibling) {
            this._nextSibling = this.nextElementSibling as HTMLElement;
        }
        if (!this._script) {
            this._script = this.querySelector('script') as HTMLScriptElement;
        }
        //Object.assign(this._nextSibling, XtallatX);
        if (!this._script || !this._nextSibling) {
            setTimeout(() => {
                this.evaluateCode();
            }, 50);
            return;
        }
        //this.attachBehavior(XtallatX)
        const evalObj = eval(this._script.innerHTML);
        this.attachBehavior(evalObj);
        this._nextSibling.removeAttribute('disabled');
    }
}
customElements.define(XtalDeco.is, XtalDeco);
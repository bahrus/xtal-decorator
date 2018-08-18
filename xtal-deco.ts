export class XtalDeco extends HTMLElement {
    constructor(){
        super();
        this.style.display = 'none';
    }
    static get is() { return 'xtal-deco'; }
    connectedCallback() {
        this.getElement('_nextSibling', t => (t.nextElementSibling as HTMLElement));
        this.getElement('_script', t => t.querySelector('script'));
    }
    _nextSibling: HTMLElement;
    _script: HTMLScriptElement;
    attachBehavior(evalObj, target) {
        for (const topKey in evalObj) {
            const subObj = evalObj[topKey];
            switch (topKey) {
                case 'on':
                    for (const key in subObj) {
                        const handlerKey = key + '_decoHandler';
                        const prop = Object.defineProperty(target, handlerKey, {
                            enumerable: false,
                            configurable: true,
                            writable: true,
                            value: subObj[key],
                        });
                        target.addEventListener(key, target[handlerKey]);
                    }
                    break;
                case 'props':
                    for (const key in subObj) {
                        const propVal = subObj[key];
                        Object.defineProperty(target, key, {
                            get: function () {
                                return this['_' + key];
                            },
                            set: function (val) {
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
                                if(this.onPropsChange) this.onPropsChange(key, val);
                            },
                            enumerable: true,
                            configurable: true,
                        });
                        target[key] = propVal;
                    }
                    break;
                default:
                    switch (typeof (subObj)) {
                        case 'function':
                            const prop = Object.defineProperty(target, topKey, {
                                enumerable: false,
                                configurable: true,
                                writable: true,
                                value: subObj,
                            });
                            break;
                        case 'object':
                            target[topKey] = subObj;
                            break;
                    }
            }
        }

    }

    getElement(fieldName: string, getter: (t: XtalDeco) => HTMLElement){
        this[fieldName] = getter(this);
        if(!this[fieldName]){
            setTimeout(() =>{
                this.getElement(fieldName, getter);
            })
            return;
        }
        this.onDecoPropsChange();
    }
    evaluateCode(scriptElement: HTMLScriptElement, target: HTMLElement) {
        //this.attachBehavior(XtallatX)
        const evalObj = eval(scriptElement.innerHTML);
        this.attachBehavior(evalObj, target);
        this._nextSibling.removeAttribute('disabled');
    }

    onDecoPropsChange(){
        if(!this._nextSibling || !this._script) return;
        this.evaluateCode(this._script, this._nextSibling);
    }

}
if(!customElements.get(XtalDeco.is)) customElements.define(XtalDeco.is, XtalDeco);
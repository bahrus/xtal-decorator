import { define } from 'xtal-latx/define.js';
import { decorate } from 'trans-render/decorate.js';
const spKey = '__xtal_deco_onPropsChange'; //special key
/**
 * `xtal-deco`
 *  Attach / override behavior to the next element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalDeco extends HTMLElement {
    static get is() { return 'xtal-deco'; }
    connectedCallback() {
        this.style.display = 'none';
        this.getElement('_nextSibling', t => t.nextElementSibling);
        this.getElement('_script', t => t.querySelector('script'));
    }
    static attachBehavior(target, evalObj) {
        decorate(target, evalObj.vals, evalObj);
    }
    getElement(fieldName, getter) {
        this[fieldName] = getter(this);
        if (!this[fieldName]) {
            setTimeout(() => {
                this.getElement(fieldName, getter);
            });
            return;
        }
        this.onDecoPropsChange();
    }
    evaluateCode(scriptElement, target) {
        //this.attachBehavior(XtallatX)
        const evalObj = eval(scriptElement.innerHTML);
        XtalDeco.attachBehavior(target, evalObj);
        const nS = this._nextSibling;
        const da = nS.getAttribute('disabled');
        if (da !== null) {
            if (da.length === 0 || da === "1") {
                nS.removeAttribute('disabled');
            }
            else {
                nS.setAttribute('disabled', (parseInt(da) - 1).toString());
            }
        }
    }
    onDecoPropsChange() {
        if (!this._nextSibling || !this._script)
            return;
        this.evaluateCode(this._script, this._nextSibling);
    }
}
define(XtalDeco);
//# sourceMappingURL=xtal-deco.js.map
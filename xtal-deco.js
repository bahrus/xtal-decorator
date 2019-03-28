import { define } from 'xtal-latx/define.js';
import { decorate } from 'trans-render/decorate.js';
import { XtallatX } from 'xtal-element/xtal-latx';
//import { XtallatX } from 'xtal-latx/xtal-latx.js';
//const spKey = '__xtal_deco_onPropsChange'; //special key
const use_symbols = 'use-symbols';
/**
 * `xtal-deco`
 *  Attach / override behavior to the next element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalDeco extends XtallatX(HTMLElement) {
    static get is() { return 'xtal-deco'; }
    static get observedAttributes() {
        return [use_symbols];
    }
    /**
     * Symbols to use for properties and methods
     */
    get useSymbols() {
        return this._useSymbols;
    }
    set useSymbols(nv) {
        this.attr(use_symbols, JSON.stringify(nv));
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case use_symbols:
                this._useSymbols = JSON.parse(nv);
                break;
        }
        this.onDecoPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(['useSymbols']);
        this.getElement('_nextSibling', t => t.nextElementSibling);
        this.getElement('_script', t => t.querySelector('script'));
    }
    static attachBehavior(target, evalObj) {
        decorate(target, evalObj);
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
        const symbols = this._useSymbols ? this._useSymbols.map(symbol => `const ${symbol} = Symbol('${symbol}');`).join('') : '';
        const funS = `return function(){
            ${symbols} 
            return ${scriptElement.innerHTML};
        }`;
        //console.log(funS);
        const evalObj = new Function(funS)()();
        //console.log(evalObj);
        evalObj.propDefs = evalObj.props;
        evalObj.propVals = evalObj.vals;
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

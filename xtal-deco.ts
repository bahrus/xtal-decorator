import {define} from 'xtal-latx/define.js';
import {decorate} from 'trans-render/decorate.js';
import {XtallatX} from 'xtal-element/xtal-latx';
import {hydrate} from 'trans-render/hydrate.js';
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
export class XtalDeco extends XtallatX(hydrate(HTMLElement)) {

    static get is() { return 'xtal-deco'; }
    static get observedAttributes(){
        return [use_symbols];
    }

    _useSymbols: string[];
    /**
     * Symbols to use for properties and methods
     */
    get useSymbols(){
        return this._useSymbols;
    }
    set useSymbols(nv){
        this.attr(use_symbols, JSON.stringify(nv)); 
    }

    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case use_symbols:
                this._useSymbols = JSON.parse(nv);
                break;
        }
        this.onDecoPropsChange();
    }

    connectedCallback() {
        this.style.display = 'none';
        this.propUp(['useSymbols']);
        this.getElement('_nextSibling', t => (t.nextElementSibling as HTMLElement));
        this.getElement('_script', t => t.querySelector('script'));
    }

    _nextSibling: HTMLElement;
    _script: HTMLScriptElement;
    static attachBehavior(target, evalObj) {
        decorate(target, evalObj);
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
        const symbols = this._useSymbols ? this._useSymbols.map(symbol => `const ${symbol} = Symbol('${symbol}');`).join('')  : '';
        const funS = `return function(){
            ${symbols} 
            return ${scriptElement.innerHTML.trim()};
        }`;
        //console.log(funS);
        const evalObj = new Function(funS)()();
        //console.log(evalObj);
        evalObj.propDefs = evalObj.props;
        evalObj.propVals = evalObj.vals;
        XtalDeco.attachBehavior(target, evalObj);
        const nS = this._nextSibling;
        const da = nS.getAttribute('disabled');
        if(da !== null){
            if(da.length === 0 ||da==="1"){
                nS.removeAttribute('disabled');
            }else{
                nS.setAttribute('disabled', (parseInt(da) - 1).toString());
            }
        }
    }

    onDecoPropsChange(){
        if(!this._nextSibling || !this._script) return;
        this.evaluateCode(this._script, this._nextSibling);
    }

}
define(XtalDeco);
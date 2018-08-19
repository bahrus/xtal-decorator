import { XtalDecor } from './xtal-decor.js';
const where_target_selector = 'where-target-selector';
export class XtalDecorator extends XtalDecor {
    constructor() {
        super(...arguments);
        /** Add watcher for  */
        this._host = document;
    }
    static get is() { return 'xtal-decorator'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([where_target_selector]);
    }
    /** @type {string}
     * Selector to search for within the parent element.
     * This will select the target elements(s) to which properties and methods will be attached.
    */
    get whereTargetSelector() {
        return this._whereTargetSelector;
    }
    set whereTargetSelector(val) {
        if (this._whereTargetSelector && this._whereTargetSelector !== val)
            throw 'Only supports one value';
        this.attr(where_target_selector, val);
    }
    insertListener(e) {
        if (e.animationName === this.id) {
            // This is the debug for knowing our listener worked!
            // event.target is the new node!
            //console.warn("Another node has been inserted! ", event, event.target);
            this.appendTemplates(event.target);
            this.attachScripts(event.target);
        }
    }
    addEventListener() {
        // See https://davidwalsh.name/detect-node-insertion
        if (this._boundInsertListener)
            return;
        const styleInner = /* css */ `
        @keyframes ${this.id} {
            from {
                opacity: 0.99;
            }
            to {
                opacity: 1;
            }
        }

        ${this._whereTargetSelector}{
            animation-duration: 0.001s;
            animation-name: ${this.id};
        }
        `;
        const style = document.createElement('style');
        style.innerHTML = styleInner;
        document.body.appendChild(style);
        this._boundInsertListener = this.insertListener.bind(this);
        document.addEventListener("animationstart", this._boundInsertListener, false); // standard + firefox
        document.addEventListener("MSAnimationStart", this._boundInsertListener, false); // IE
        document.addEventListener("webkitAnimationStart", this._boundInsertListener, false); // Chrome + Safari
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case where_target_selector:
                this._whereTargetSelector = newVal;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    connectedCallback() {
        this._upgradeProperties(['whereTargetSelector']);
        super.connectedCallback();
    }
    disconnectedCallback() {
        if (this._boundInsertListener) {
            document.removeEventListener("animationstart", this._boundInsertListener); // standard + firefox
            document.removeEventListener("MSAnimationStart", this._boundInsertListener); // IE
            document.removeEventListener("webkitAnimationStart", this._boundInsertListener); // Chrome + Safari
        }
    }
    onDecoPropsChange() {
        if (!this._whereTargetSelector) {
            super.onDecoPropsChange();
            return;
        }
        if (!this.id) {
            console.error('xtal-decorator requires an id');
            return;
        }
        this.addEventListener();
    }
}
if (!customElements.get(XtalDecorator.is))
    customElements.define(XtalDecorator.is, XtalDecorator);
//# sourceMappingURL=xtal-decorator.js.map
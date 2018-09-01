import { XtalDecor } from './xtal-decor.js';
import { define } from 'xtal-latx/define.js';
import { observeCssSelector } from 'xtal-latx/observeCssSelector.js';
const where_target_selector = 'where-target-selector';
export class XtalDecorator extends observeCssSelector(XtalDecor) {
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
            this.appendTemplates(e.target);
            this.attachScripts(e.target);
        }
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
    onDecoPropsChange() {
        if (!this._whereTargetSelector) {
            super.onDecoPropsChange();
            return;
        }
        if (!this.id) {
            console.error('xtal-decorator requires an id');
            return;
        }
        this.addEventListener(this.id, this._whereTargetSelector, this.insertListener);
    }
}
define(XtalDecorator);
//# sourceMappingURL=xtal-decorator.js.map
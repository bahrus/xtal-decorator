import { XtalDecor } from './xtal-decor.js';
import { define } from 'xtal-latx/define.js';
import { observeCssSelector } from 'xtal-latx/observeCssSelector.js';
const where_target_selector = 'where-target-selector';
export class XtalDecorator extends observeCssSelector(XtalDecor) {
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
            const target = e.target;
            setTimeout(() => {
                this.appendTemplates(target);
                this.attachScripts(target);
            }, 0);
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
        this.propUp(['whereTargetSelector']);
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
        this.addCSSListener(this.id, this._whereTargetSelector, this.insertListener);
    }
}
define(XtalDecorator);

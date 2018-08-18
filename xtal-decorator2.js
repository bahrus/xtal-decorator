import { XtalDeco } from './xtal-deco.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
export function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
const where_css_matches = 'where-css-matches';
const into_next_element = 'into-next-element';
const import_template = 'import-template';
const attach_script = 'attach-script';
export class XtalDecorator extends XtallatX(XtalDeco) {
    static get is() { return 'xtal-decorator'; }
    /** @type {string}
     * Selector to search for within the parent element.
     * This will select the target elements(s) to which properties and methods will be attached.
    */
    get whereCSSMatches() {
        return this._whereCSSMatches;
    }
    set whereCSSMatches(val) {
        if (this._whereCSSMatches && this._whereCSSMatches !== val)
            throw 'Only supports one value';
        this.attr(where_css_matches, val);
    }
    get intoNextElement() {
        return this._intoNextElement;
    }
    set intoNextElement(val) {
        this.attr(into_next_element, val, '');
    }
    get importTemplate() {
        return this._importTemplate;
    }
    set importTemplate(val) {
        this.attr(import_template, val, '');
    }
    get attachScript() {
        return this._attachScript;
    }
    set attachScript(val) {
        this.attr(attach_script, val, '');
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([where_css_matches, into_next_element, import_template, attach_script]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
            case where_css_matches:
                this._whereCSSMatches = newVal;
                break;
            case import_template:
                this._importTemplate = newVal !== null;
                break;
            case attach_script:
                this._attachScript = newVal !== null;
                break;
            case into_next_element:
                this._intoNextElement = (newVal !== null);
                break;
        }
        this.onDecoPropsChange();
    }
    connectedCallback() {
        this._upgradeProperties(['disabled', 'attachScript', 'importTemplate', 'intoNextElement', 'whereCSSMatches']);
        this._connected = true;
        this.onDecoPropsChange();
        this.addMutationObserver();
    }
    disconnectedCallback() {
        if (this._mutationObserver)
            this._mutationObserver.disconnect();
    }
    addMutationObserver() {
        this._mutationObserver = new MutationObserver((mutationsList) => {
            this.getTemplatesAndScripts();
            this.appendTemplates();
        });
        this.getTemplatesAndScripts();
        this.appendTemplates();
        this._mutationObserver.observe(this, { childList: true });
    }
    getTemplatesAndScripts() {
        this._templates = qsa('template', this);
        this._scripts = qsa('script', this);
    }
    onDecoPropsChange() {
        if (!this._connected || this.disabled)
            return;
        if (this._intoNextElement && !this._nextSibling) {
            this.getElement('_nextSibling', t => t.nextElementSibling);
            return;
        }
        this.appendTemplates();
        if (this._attachScript && this._intoNextElement)
            this.evaluateCode();
    }
    appendTemplates() {
        if (!this._templates)
            return;
        if (this._importTemplate && this._intoNextElement && this._nextSibling) {
            customElements.whenDefined(this._nextSibling.tagName.toLowerCase()).then(() => {
                const target = this._nextSibling;
                this._templates.forEach((template) => {
                    if (template.dataset.xtalTemplInserted)
                        return;
                    const clone = document.importNode(template.content, true);
                    target.shadowRoot.appendChild(clone);
                    template.dataset.xtalTemplInserted = 'true';
                });
            });
        }
    }
}
XtalDecorator._addedNodeInsertionStyle = false;
if (!customElements.get(XtalDecorator.is))
    customElements.define(XtalDecorator.is, XtalDecorator);
//# sourceMappingURL=xtal-decorator2.js.map
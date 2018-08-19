import { XtalDeco } from './xtal-deco.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { cd } from 'xtal-shell/cd.js';
export function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
//const where_css_matches = 'where-css-matches';
const into_next_element = 'into-next-element';
const import_template = 'import-template';
const attach_script = 'attach-script';
export class XtalDecor extends XtallatX(XtalDeco) {
    static get is() { return 'xtal-decor'; }
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
        return super.observedAttributes.concat([into_next_element, import_template, attach_script]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
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
    appendTemplates(target) {
        if (!this._templates)
            return;
        if (!target && this._intoNextElement)
            target = this._nextSibling;
        if (this._importTemplate && target) {
            customElements.whenDefined(target.tagName.toLowerCase()).then(() => {
                //const target = this._nextSibling;
                this._templates.forEach((template) => {
                    if (template.dataset.xtalTemplInserted)
                        return;
                    let subTarget = target;
                    const path = template.dataset.path;
                    if (path) {
                        subTarget = cd(target, path);
                        // $hell.$0 = target;
                        // subTarget = $hell.cd(path);
                    }
                    const clone = document.importNode(template.content, true);
                    subTarget.shadowRoot.appendChild(clone);
                    template.dataset.xtalTemplInserted = 'true';
                });
            });
        }
    }
    attachScripts(target) {
        if (!this._scripts)
            return;
        if (!target && this._intoNextElement)
            target = this._nextSibling;
        if (this._attachScript && target) {
            customElements.whenDefined(target.tagName.toLowerCase()).then(() => {
                //const target = this._nextSibling;
                this._scripts.forEach((script) => {
                    if (script.dataset.xtalScriptAttached)
                        return;
                    let subTarget = target;
                    const path = script.dataset.path;
                    if (path) {
                        subTarget = cd(target, path);
                    }
                    this.evaluateCode(script, subTarget);
                });
            });
        }
    }
}
XtalDecor._addedNodeInsertionStyle = false;
if (!customElements.get(XtalDecor.is))
    customElements.define(XtalDecor.is, XtalDecor);
//# sourceMappingURL=xtal-decor.js.map
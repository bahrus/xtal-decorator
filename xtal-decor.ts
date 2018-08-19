import { XtalDeco } from './xtal-deco.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { cd } from 'xtal-shell/cd.js';

export function qsa(css, from?: HTMLElement | Document | DocumentFragment): HTMLElement[] {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}

//const where_css_matches = 'where-css-matches';
const into_next_element = 'into-next-element';
const import_template = 'import-template';
const attach_script = 'attach-script';

export class XtalDecor extends XtallatX(XtalDeco) {
    static _addedNodeInsertionStyle = false;

    static get is() { return 'xtal-decor'; }

   

    _intoNextElement: boolean;
    get intoNextElement() {
        return this._intoNextElement;
    }
    set intoNextElement(val) {
        this.attr(into_next_element, val, '');
    }

    _importTemplate: boolean;
    get importTemplate() {
        return this._importTemplate;
    }
    set importTemplate(val) {
        this.attr(import_template, val, '');
    }

    _attachScript: boolean;
    get attachScript() {
        return this._attachScript;
    }
    set attachScript(val) {
        this.attr(attach_script, val, '');
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([into_next_element, import_template, attach_script]);
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
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

    _connected: boolean;
    _mutationObserver: MutationObserver;
    connectedCallback() {
        this._upgradeProperties(['disabled', 'attachScript', 'importTemplate', 'intoNextElement', 'whereCSSMatches']);
        this._connected = true;
        this.onDecoPropsChange();
        this.addMutationObserver();
    }
    disconnectedCallback() {
        if (this._mutationObserver) this._mutationObserver.disconnect();
    }
    addMutationObserver() {
        this._mutationObserver = new MutationObserver((mutationsList: MutationRecord[]) => {
            this.getTemplatesAndScripts();
            this.appendTemplates();                      
        });
        this.getTemplatesAndScripts();
        this.appendTemplates();
        this._mutationObserver.observe((<any>this as Node), { childList: true });

    }
    getTemplatesAndScripts(){
        this._templates = qsa('template', <any>this) as HTMLTemplateElement[];
        this._scripts = qsa('script', this as any) as HTMLScriptElement[];  
    }
    _templates: HTMLTemplateElement[];
    _scripts: HTMLScriptElement[];
    onDecoPropsChange() {
        if (!this._connected || this.disabled) return;
        if (this._intoNextElement && !this._nextSibling) {
            this.getElement('_nextSibling', t => (t.nextElementSibling as HTMLElement));
            return;
        }
        this.appendTemplates();
        if (this._attachScript && this._intoNextElement) this.evaluateCode();
    }

    appendTemplates() {
        if(!this._templates) return;
        if (this._importTemplate && this._intoNextElement && this._nextSibling) {
            customElements.whenDefined(this._nextSibling.tagName.toLowerCase()).then(() => {
                const target = this._nextSibling;
                this._templates.forEach((template: HTMLTemplateElement) =>{
                    if(template.dataset.xtalTemplInserted) return;
                    let subTarget = target;
                    const path = template.dataset.path;
                    if(path){
                        subTarget = cd(target, path);
                        // $hell.$0 = target;
                        // subTarget = $hell.cd(path);
                    }
                    const clone = document.importNode(template.content, true) as HTMLDocument;
                    subTarget.shadowRoot.appendChild(clone);
                    template.dataset.xtalTemplInserted = 'true';
                })
                
            })
        }
        
    }
    attachScripts(){
        if(!this._scripts) return;
        if(this._attachScript && this._intoNextElement && this._nextSibling){
            customElements.whenDefined(this._nextSibling.tagName.toLowerCase()).then(() => {
                const target = this._nextSibling;
                this._scripts.forEach((script: HTMLScriptElement) =>{
                    if(script.dataset.xtalScriptAttached) return;
                    let subTarget = target;
                    const path = script.dataset.path;
                    if(path){
                        subTarget = cd(target, path);
                    }
                    this.evaluateCode(script, subTarget);
                })
                
            })
        }
    }
}
if (!customElements.get(XtalDecor.is)) customElements.define(XtalDecor.is, XtalDecor);


    //@ts-check
    (function () {
    const DASH_TO_CAMEL = /-[a-z]/g;
function dashToCamelCase(dash) {
    return dash.replace(DASH_TO_CAMEL, m => m[1].toUpperCase());
}
function getChildren(parent) {
    switch (parent.nodeName) {
        case 'IFRAME':
            return this.$0.contentWindow.document.body.childNodes;
        default:
            const publicChildren = parent.childNodes;
            const returnObj = [];
            if (parent.shadowRoot) {
                parent.shadowRoot.childNodes.forEach((node) => {
                    returnObj.push(node);
                });
            }
            parent.childNodes.forEach(node => {
                returnObj.push(node);
            });
            return returnObj;
    }
}
function getChildFromSinglePath(el, token) {
    let idx = 0;
    let nonIndexedToken = token;
    if (token === '..') {
        // this.$0 = this.$0.parentElement;
        // return this.$0;
        return el.parentNode;
    }
    if (token.endsWith(']')) {
        const posOfOpen = token.indexOf('[');
        const indxString = token.substring(posOfOpen + 1, token.length - 1);
        idx = parseInt(indxString);
        nonIndexedToken = token.substring(0, posOfOpen);
    }
    //const children = this.$0.querySelectorAll(':scope > ' + nonIndexedToken);
    const matchingNodes = [];
    getChildren(el).forEach((child) => {
        if (child.matches && child.matches(nonIndexedToken)) {
            matchingNodes.push(child);
        }
    });
    return matchingNodes[idx];
}
class XtalDeco extends HTMLElement {
    constructor() {
        super();
        this.style.display = 'none';
    }
    static get is() { return 'xtal-deco'; }
    connectedCallback() {
        this.getElement('_nextSibling', t => t.nextElementSibling);
        this.getElement('_script', t => t.querySelector('script'));
    }
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
                                });
                                this.dispatchEvent(newEvent);
                                if (this.onPropsChange)
                                    this.onPropsChange(key, val);
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
        this.attachBehavior(evalObj, target);
        this._nextSibling.removeAttribute('disabled');
    }
    onDecoPropsChange() {
        if (!this._nextSibling || !this._script)
            return;
        this.evaluateCode(this._script, this._nextSibling);
    }
}
if (!customElements.get(XtalDeco.is))
    customElements.define(XtalDeco.is, XtalDeco);
const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        to$(number) {
            const mod = number % 2;
            return (number - mod) / 2 + '-' + mod;
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
//const where_css_matches = 'where-css-matches';
const into_next_element = 'into-next-element';
const import_template = 'import-template';
const attach_script = 'attach-script';
class XtalDecor extends XtallatX(XtalDeco) {
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
const where_target_selector = 'where-target-selector';
class XtalDecorator extends XtalDecor {
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
    })();  
        
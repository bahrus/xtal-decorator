
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
const spKey = '__xtal_deco_onPropsChange'; //special key
/**
 * `xtal-deco`
 *  Attach / override behavior to the next element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalDeco extends HTMLElement {
    static get is() { return 'xtal-deco'; }
    connectedCallback() {
        this.style.display = 'none';
        this.getElement('_nextSibling', t => t.nextElementSibling);
        this.getElement('_script', t => t.querySelector('script'));
    }
    static attachBehavior(target, evalObj) {
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
                                if (this[spKey])
                                    this[spKey](key, val);
                            },
                            enumerable: true,
                            configurable: true,
                        });
                        target[key] = propVal;
                    }
                    break;
                case 'setters':
                    for (const key in subObj) {
                        const propVal = subObj[key];
                        target[key] = propVal;
                    }
                    break;
                default:
                    switch (typeof (subObj)) {
                        case 'function':
                            const fnKey = (topKey === 'onPropsChange') ? spKey : topKey;
                            const prop = Object.defineProperty(target, fnKey, {
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
function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
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
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
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
function observeCssSelector(superClass) {
    const eventNames = ["animationstart", "MSAnimationStart", "webkitAnimationStart"];
    return class extends superClass {
        addCSSListener(id, targetSelector, insertListener) {
            // See https://davidwalsh.name/detect-node-insertion
            if (this._boundInsertListener)
                return;
            const styleInner = /* css */ `
            @keyframes ${id} {
                from {
                    opacity: 0.99;
                }
                to {
                    opacity: 1;
                }
            }
    
            ${targetSelector}{
                animation-duration: 0.001s;
                animation-name: ${id};
            }
            `;
            const style = document.createElement('style');
            style.innerHTML = styleInner;
            const host = getHost(this);
            if (host !== null) {
                host.shadowRoot.appendChild(style);
            }
            else {
                document.body.appendChild(style);
            }
            this._boundInsertListener = insertListener.bind(this);
            const container = host ? host.shadowRoot : document;
            eventNames.forEach(name => {
                container.addEventListener(name, this._boundInsertListener, false);
            });
            // container.addEventListener("animationstart", this._boundInsertListener, false); // standard + firefox
            // container.addEventListener("MSAnimationStart", this._boundInsertListener, false); // IE
            // container.addEventListener("webkitAnimationStart", this._boundInsertListener, false); // Chrome + Safari
        }
        disconnectedCallback() {
            if (this._boundInsertListener) {
                const host = getHost(this);
                const container = host ? host.shadowRoot : document;
                eventNames.forEach(name => {
                    container.removeEventListener(name, this._boundInsertListener);
                });
                // document.removeEventListener("animationstart", this._boundInsertListener); // standard + firefox
                // document.removeEventListener("MSAnimationStart", this._boundInsertListener); // IE
                // document.removeEventListener("webkitAnimationStart", this._boundInsertListener); // Chrome + Safari
            }
            if (super.disconnectedCallback !== undefined)
                super.disconnectedCallback();
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
/**
 * `xtal-decor`
 * Attach / override behavior in next element.  Insert template elements
 * @attribute: into-next-element:  boolean -- Modify behavior of next element.
 * @attribute: import-template: boolean -- Indicates there's at least one template to insert.
 * @attribute: attach-script: boolean -- Indicates there's script to attach.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalDecor extends XtallatX(XtalDeco) {
    static get is() { return 'xtal-decor'; }
    /**
     * Modify behavior of next element.
     */
    get intoNextElement() {
        return this._intoNextElement;
    }
    set intoNextElement(val) {
        this.attr(into_next_element, val, '');
    }
    /**
     * Indicates there's at least one template to insert.
     */
    get importTemplate() {
        return this._importTemplate;
    }
    set importTemplate(val) {
        this.attr(import_template, val, '');
    }
    /**
     * Indicates there's script to attach.
     */
    get attachScript() {
        return this._attachScript;
    }
    set attachScript(val) {
        this.attr(attach_script, val, '');
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            /**
            * Indicates there's at least one template to insert.
            */
            into_next_element,
            import_template,
            attach_script
        ]);
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
    do() {
        this.appendTemplates();
        this.attachScripts();
    }
    addMutationObserver() {
        this._mutationObserver = new MutationObserver((mutationsList) => {
            this.getTemplatesAndScripts();
            this.do();
        });
        this.getTemplatesAndScripts();
        this.do();
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
        this.do();
        // this.appendTemplates();
        // this.attachScripts();
        //if (this._attachScript && this._intoNextElement) this.attachScripts();
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
    doScripts(target) {
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
    }
    attachScripts(target) {
        if (!this._scripts)
            return;
        if (!target && this._intoNextElement)
            target = this._nextSibling;
        if (this._attachScript && target) {
            const ln = target.localName;
            if (ln.indexOf('-') > -1) {
                customElements.whenDefined(target.tagName.toLowerCase()).then(() => {
                    //const target = this._nextSibling;
                    this.doScripts(target);
                });
            }
            else {
                this.doScripts(target);
            }
        }
    }
}
XtalDecor._addedNodeInsertionStyle = false;
define(XtalDecor);
const where_target_selector = 'where-target-selector';
class XtalDecorator extends observeCssSelector(XtalDecor) {
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
        this.addCSSListener(this.id, this._whereTargetSelector, this.insertListener);
    }
}
define(XtalDecorator);
    })();  
        
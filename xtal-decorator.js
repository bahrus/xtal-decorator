(function () {
    /**
    * `xtal-decorator`
    * Attach methods, properties, observing behavior to an instance of another custom element, like <dom-bind></dom-bind>
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
    class XtalDecorator extends HTMLElement {
        constructor() {
            super(...arguments);
            this._CssSelector = 'dom-bind';
            this._minElementCount = 1;
            this._retries = 0;
        }
        static get is() {
            return 'xtal-decorator';
        }
        static get observedAttributes() {
            return [
                /** @type {string}
                 * Selector to search for within the parent element.  Default value:  dom-bind
                 * This will select the target elements(s) to which properties and methods will be attached.
                 */
                'selector',
                /** @type {number}
                 * When target may be dynamically generated, wait for this number of elements to be
                 * found via the selector before acting
                 */
                'min-element-count'
            ];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'selector':
                    this._CssSelector = newValue;
                    break;
                case 'min-element-count':
                    this._minElementCount = parseInt(newValue);
                    break;
            }
        }
        disconnectedCallback() {
            this._domObserver.disconnect();
        }
        getShadowSubTargets(targets, selector) {
            const newTargets = [];
            targets.forEach(target => {
                const shadowRoot = target.shadowRoot;
                const targets1 = shadowRoot.querySelectorAll(selector);
                const childTargets = [].slice.call(targets1);
                // console.log({
                //     selector: selector,
                //     target: target,
                //     childTargets: childTargets
                // })
                childTargets.forEach(childTarget => newTargets.push(childTarget));
            });
            return newTargets;
        }
        getHost() {
            let parentElement = this.parentElement;
            while (parentElement) {
                if (parentElement.shadowRoot)
                    return parentElement;
                parentElement = parentElement.parentElement;
            }
        }
        getTargets() {
            switch (this._CssSelector) {
                case '_host':
                    const host = this.getHost();
                    return host ? [host] : null;
                default:
                    const shadowSplitSelector = this._CssSelector.split('>>>');
                    let targets = [].slice.call(this.parentElement.querySelectorAll(shadowSplitSelector[0]));
                    for (let i = 1, ii = shadowSplitSelector.length; i < ii; i++) {
                        targets = this.getShadowSubTargets(targets, shadowSplitSelector[i]);
                    }
                    return targets;
            }
        }
        applyScript(scriptTag, targets) {
            if (!scriptTag)
                return;
            const innerText = scriptTag.innerText;
            if (innerText === this._previousEvaluatedText)
                return;
            const objectsToMerge = eval(innerText);
            this._previousEvaluatedText = innerText;
            let propertiesToSet;
            // objectsToMerge.forEach(objectToMerge => {
            // })
            for (let j = 0, jj = objectsToMerge.length; j < jj; j++) {
                const objectToMerge = objectsToMerge[j];
                for (var key in objectToMerge) {
                    const val = objectToMerge[key];
                    switch (typeof val) {
                        case 'function':
                            targets.forEach(target => {
                                Object.defineProperty(target, key, {
                                    enumerable: false,
                                    configurable: true,
                                    writable: true,
                                    value: val,
                                });
                            });
                            break;
                        case 'object':
                            switch (key) {
                                case 'style':
                                    for (const key in val) {
                                        targets.forEach(target => {
                                            target.style[key] = val[key];
                                        });
                                    }
                                    break;
                                case 'properties':
                                    if (!propertiesToSet) {
                                        propertiesToSet = val;
                                    }
                                    else {
                                        this.mergeDeep(propertiesToSet, val);
                                    }
                                    break;
                                case 'polymerProperties':
                                    for (const key in val) {
                                        const polyProp = val[key];
                                        if (polyProp.value !== undefined) {
                                            propertiesToSet[key] = polyProp.value;
                                        }
                                        if (polyProp.observer !== undefined) {
                                            targets.forEach(target => {
                                                customElements.whenDefined(target.tagName.toLowerCase()).then(() => {
                                                    if (target._createPropertyObserver) {
                                                        target._createPropertyObserver(key, polyProp.observer, true);
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }
            targets.forEach(target => {
                if (target['setProperties']) {
                    target['setProperties'](propertiesToSet);
                }
                else {
                    Object.assign(target, propertiesToSet);
                }
            });
        }
        applyStyle(styleTag, targets) {
            if (!styleTag)
                return;
            targets.forEach(target => {
                if (target.shadowRoot) {
                    const cn = styleTag.cloneNode(true);
                    target.shadowRoot.appendChild(cn);
                }
            });
        }
        evaluateCode() {
            const errRoot = 'XtalDecorator::evalutateCode:  ';
            const targets = this.getTargets();
            if (!targets || targets.length < this._minElementCount) {
                this._retries++;
                if (this._retries > 100) {
                    console.error(errRoot + 'No targets found with selector ' + this._CssSelector);
                    return;
                }
                setTimeout(() => {
                    this.evaluateCode();
                }, 100);
                return;
            }
            const templateTag = this.querySelector('template');
            let clone;
            if (templateTag) {
                clone = document.importNode(templateTag.content, true);
            }
            let scriptTag = this.querySelector('script');
            if (!scriptTag && clone) {
                scriptTag = clone.querySelector('script');
            }
            let styleTag = this.querySelector('style');
            if (!styleTag && clone) {
                styleTag = clone.querySelector('style');
            }
            if (!scriptTag && !styleTag) {
                console.error(errRoot + 'No script tag or style tag found to apply.' + this._CssSelector);
                return;
            }
            this.applyScript(scriptTag, targets);
            this.applyStyle(styleTag, targets);
        }
        connectedCallback() {
            this._domObserver = new MutationObserver(mutations => {
                mutations.forEach(function (mutation) {
                    this.evaluateCode();
                });
            });
            // configuration of the observer:
            const mutationConfig = { childList: true, subtree: true };
            // pass in the target node, as well as the observer options
            this._domObserver.observe(this, mutationConfig);
            this.evaluateCode();
        }
        /**
         * Deep merge two objects.
         * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
         * @param target
         * @param source
         *
         */
        mergeDeep(target, source) {
            if (typeof target !== 'object')
                return;
            if (typeof source !== 'object')
                return;
            for (const key in source) {
                const sourceVal = source[key];
                const targetVal = target[key];
                if (!sourceVal)
                    continue; //TODO:  null out property?
                if (!targetVal) {
                    target[key] = sourceVal;
                    continue;
                }
                if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                    //warning!! code below not yet tested
                    if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined')
                        continue;
                    for (var i = 0, ii = sourceVal.length; i < ii; i++) {
                        const srcEl = sourceVal[i];
                        if (typeof srcEl.id === 'undefined')
                            continue;
                        const targetEl = targetVal.find(function (el) { return el.id === srcEl.id; });
                        if (targetEl) {
                            this.mergeDeep(targetEl, srcEl);
                        }
                        else {
                            targetVal.push(srcEl);
                        }
                    }
                    continue;
                }
                switch (typeof sourceVal) {
                    case 'object':
                        switch (typeof targetVal) {
                            case 'object':
                                this.mergeDeep(targetVal, sourceVal);
                                break;
                            default:
                                target[key] = sourceVal;
                                break;
                        }
                        break;
                    default:
                        target[key] = sourceVal;
                }
            }
            return target;
        }
    }
    customElements.define(XtalDecorator.is, XtalDecorator);
})();
//# sourceMappingURL=xtal-decorator.js.map
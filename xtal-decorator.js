import { xc } from 'xtal-element/lib/XtalCore.js';
import('css-observe/css-observe.js');
const selSeq = Symbol('selSeq');
export const linkTemplateElement = ({ self, insertTemplate }) => {
    if (!insertTemplate)
        return;
    const templateElement = self.querySelector('template');
    if (templateElement === null) {
        setTimeout(() => {
            linkTemplateElement(self);
        }, 50);
        return;
    }
    self.templateElement = templateElement;
};
export const plantListeners = ({ self, selectorSequence, insertTemplate, templateElement }) => {
    if (insertTemplate && templateElement === undefined)
        return;
    plantListener(self, self, selectorSequence, false);
};
export function plantListener(host, shadowDOMCitizen, selectorSequence, inShadow) {
    if (inShadow && shadowDOMCitizen.shadowRoot === null) {
        setTimeout(() => {
            plantListener(host, shadowDOMCitizen, selectorSequence, inShadow);
        }, 50);
        return;
    }
    let newShadowDOMCitizen = inShadow ? shadowDOMCitizen.shadowRoot : shadowDOMCitizen.getRootNode();
    if (newShadowDOMCitizen === document) {
        newShadowDOMCitizen = document.body;
    }
    const head = selectorSequence[0];
    const tail = selectorSequence.slice(1);
    const jsonTail = JSON.stringify(tail);
    const observers = newShadowDOMCitizen.querySelectorAll('css-observe');
    for (const observer of observers) {
        if (JSON.stringify(observer[selSeq]) === JSON.stringify(tail) && observer.selector === head) {
            return;
        }
    }
    const cssObserve = document.createElement('css-observe');
    cssObserve[selSeq] = tail;
    cssObserve.observe = true;
    cssObserve.selector = head;
    cssObserve.addEventListener('latest-match-changed', e => {
        if (tail.length > 0) {
            plantListener(host, e.detail.value, tail, true);
        }
        else {
            host.targetElement = e.detail.value;
        }
    });
    newShadowDOMCitizen.appendChild(cssObserve);
}
export const doStuffToTargetElement = ({ targetElement, props, attribs, templateElement, insertTemplate }) => {
    if (insertTemplate) {
        const clone = templateElement.content.cloneNode(true);
        switch (insertTemplate) {
            case 'afterbegin':
                targetElement.prepend(clone);
                break;
            case 'beforeend':
                targetElement.append(clone);
                break;
            case 'beforebegin':
                Array.from(clone.children).forEach(child => {
                    targetElement.insertAdjacentElement('beforebegin', child);
                });
                break;
            case 'afterend':
                Array.from(clone.children).forEach(child => {
                    targetElement.insertAdjacentElement('afterend', child);
                });
                break;
            default:
                throw 'Not implemented yet';
        }
    }
    if (props !== undefined) {
        const copyOfProps = Object.assign({}, props);
        const style = copyOfProps.style;
        const dataset = copyOfProps.dataset;
        delete copyOfProps.style;
        delete copyOfProps.dataset;
        Object.assign(targetElement, copyOfProps);
        Object.assign(targetElement.dataset, dataset);
        Object.assign(targetElement.style, style);
    }
    if (attribs !== null) {
        for (const key in attribs) {
            const val = attribs[key];
            if (val === null) {
                targetElement.removeAttribute(key);
            }
            else {
                targetElement.setAttribute(key, val);
            }
        }
    }
};
export const propActions = [linkTemplateElement, plantListeners, doStuffToTargetElement];
const obj1 = {
    type: Object,
    dry: true,
    async: true,
};
const obj2 = {
    type: Object,
    dry: true,
    async: true,
    parse: true,
};
const propDefMap = {
    props: obj2, attribs: obj2, selectorSequence: obj2, templateElement: obj1,
    targetElement: {
        type: Object,
        dry: true,
        async: true,
        stopReactionsIfFalsy: true,
    },
    insertTemplate: {
        type: String,
        dry: true
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
export class XtalDecorator extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        /**
         * @private
         */
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    connectedCallback() {
        xc.hydrate(this, slicedPropDefs);
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
XtalDecorator.is = 'xtal-decorator';
xc.letThereBeProps(XtalDecorator, slicedPropDefs.propDefs, 'onPropChange');
xc.define(XtalDecorator);

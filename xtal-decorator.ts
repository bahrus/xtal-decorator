import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import('css-observe/css-observe.js');

const selSeq = Symbol('selSeq');

export const linkTemplateElement = ({self, insertTemplate}: XtalDecorator) => {
    if(!insertTemplate) return;
    const templateElement = self.querySelector('template');
    if(templateElement === null){
        setTimeout(() =>{
            linkTemplateElement(self);
        }, 50);
        return;
    }
    self.templateElement = templateElement;
}

export const plantListeners = ({self, selectorSequence, insertTemplate, templateElement}: XtalDecorator) => {
    if(insertTemplate && templateElement === undefined) return;
    plantListener(self, self, selectorSequence, false);
}

export function plantListener(host: XtalDecorator, shadowDOMCitizen: HTMLElement, selectorSequence: string[], inShadow: boolean){
    if(inShadow && shadowDOMCitizen.shadowRoot === null){
        setTimeout(() => {
            plantListener(host, shadowDOMCitizen, selectorSequence, inShadow);
        }, 50);
        return;
    }
    let newShadowDOMCitizen = inShadow ? shadowDOMCitizen.shadowRoot : shadowDOMCitizen.getRootNode();
    if(newShadowDOMCitizen === document){
        newShadowDOMCitizen = document.body;
    }
    const head = selectorSequence[0];
    const tail = selectorSequence.slice(1);
    const jsonTail = JSON.stringify(tail);

    const observers = (newShadowDOMCitizen as DocumentFragment).querySelectorAll('css-observe');
    for(const observer of observers){
        if(JSON.stringify(observer[selSeq]) === JSON.stringify(tail) && observer.selector === head){
            return;
        }
    }
    const cssObserve = document.createElement('css-observe') as any;
    cssObserve[selSeq] = tail;
    cssObserve.observe = true;
    cssObserve.selector = head;
    cssObserve.addEventListener('latest-match-changed', e => {
        if(tail.length > 0){
            plantListener(host, e.detail.value, tail, true);
        }else{
            host.targetElement = e.detail.value;
        }
    });
    newShadowDOMCitizen.appendChild(cssObserve);
}

export const doStuffToTargetElement = ({targetElement, props, attribs, templateElement, insertTemplate}: XtalDecorator) => {
    if(insertTemplate){
        const clone = templateElement.content.cloneNode(true) as DocumentFragment;
        switch(insertTemplate){
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
    if(props !== undefined){
        const copyOfProps = Object.assign({}, props);
        const style = copyOfProps.style;
        const dataset = copyOfProps.dataset;
        delete copyOfProps.style;
        delete copyOfProps.dataset;
        Object.assign(targetElement, copyOfProps);
        Object.assign(targetElement.dataset, dataset);
        Object.assign(targetElement.style, style);
    }
    if(attribs !== null){
        for(const key in attribs){
            const val = attribs[key];
            if(val === null){
                targetElement.removeAttribute(key);
            }else{
                targetElement.setAttribute(key, val);
            }
            
        }
    }
}
export const propActions = [linkTemplateElement, plantListeners, doStuffToTargetElement];

const obj1: PropDef = {
    type: Object,
    dry: true,
    async: true,
};
const obj2: PropDef = {
    type: Object,
    dry: true,
    async: true,
    parse: true,
}
const propDefMap: PropDefMap<XtalDecorator> = {
    props: obj2, attribs: obj2, selectorSequence: obj2,  templateElement: obj1,
    targetElement: {
        type: Object,
        dry: true,
        async: true,
        stopReactionsIfFalsy: true,
    },
    insertTemplate:  {
        type: String,
        dry: true
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);

export class XtalDecorator extends HTMLElement implements ReactiveSurface {
    static is = 'xtal-decorator';

    self = this;

    /**
     * @private
     */
    propActions = propActions;
    reactor = new xc.Reactor(this);
    /**
     * Property values to set on target elements
     * @attr props
     */
    props: {[key: string]: any} | undefined;
    /**
     * Attribute values to set on target elements
     * @attr attrib
     */
    attribs: {[key: string]: any} | undefined;
    /**
     * If template is provided in the innerHTML, indicate the 
     * placement of the cloned template relative to the target element.
     * @type {"beforebegin"|"afterbegin"|"beforeend"|"afterend"}
     */
    insertTemplate: InsertPosition | undefined;
    /**
     * Sequence of css selectors within nested ShadowDOM realms.
     */
    selectorSequence: string[] | undefined;
    /**
     * Temporary holding place for found element.
     * @private
     */
    targetElement: HTMLElement | undefined;
    /**
     * @private
     */
    templateElement: HTMLTemplateElement | undefined;

    connectedCallback(){
        xc.hydrate(this, slicedPropDefs);
    }
    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }
}

xc.letThereBeProps(XtalDecorator, slicedPropDefs.propDefs, 'onPropChange');
xc.define(XtalDecorator);

declare global {
    interface HTMLElementTagNameMap {
        "xtal-decorator": XtalDecorator,
    }
}
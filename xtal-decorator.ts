import { XtallatX, define, AttributeProps, PropAction, deconstruct, EventSettings} from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
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
    if(targetElement === undefined) return;
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
export const propActions = [linkTemplateElement, plantListeners, doStuffToTargetElement]

export class XtalDecorator extends XtallatX(hydrate(HTMLElement)) {
    static is = 'xtal-decorator';

    static attributeProps = ({disabled, props, attribs, insertTemplate, selectorSequence, targetElement, templateElement}: XtalDecorator) => ({
        obj: [props, attribs, selectorSequence, targetElement, templateElement],
        jsonProp:[props, attribs, selectorSequence],
        str: [insertTemplate],
    } as AttributeProps);

    props: {[key: string]: any} | undefined;
    attribs: {[key: string]: any} | undefined;
    insertTemplate: InsertPosition | undefined;
    selectorSequence: string[] | undefined;
    targetElement: HTMLElement | undefined;
    templateElement: HTMLTemplateElement | undefined;

    propActions = propActions;
}

define(XtalDecorator);
import {XtalDecorator} from './xtal-decorator.js';

/**
 * @element xtal-decorator
 */
export class XtalDecoratorExample0 extends XtalDecorator {
    insertTemplate = 'afterend' as InsertPosition;
    selectorSequence = [];
    props: {};
    attribs: {};
}
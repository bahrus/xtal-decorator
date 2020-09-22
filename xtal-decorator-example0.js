import { XtalDecorator } from './xtal-decorator.js';
/**
 * @element xtal-decorator
 */
export class XtalDecoratorExample0 extends XtalDecorator {
    constructor() {
        super(...arguments);
        this.insertTemplate = 'afterend';
        this.selectorSequence = [];
    }
}

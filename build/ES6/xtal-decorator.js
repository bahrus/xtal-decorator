import{XtalDecor}from"./xtal-decor.js";import{define}from"./node_modules/xtal-latx/define.js";const where_target_selector="where-target-selector";export class XtalDecorator extends XtalDecor{constructor(){super(...arguments);this._host=document}static get is(){return"xtal-decorator"}static get observedAttributes(){return super.observedAttributes.concat([where_target_selector])}get whereTargetSelector(){return this._whereTargetSelector}set whereTargetSelector(val){if(this._whereTargetSelector&&this._whereTargetSelector!==val)throw"Only supports one value";this.attr(where_target_selector,val)}insertListener(e){if(e.animationName===this.id){this.appendTemplates(event.target);this.attachScripts(event.target)}}addEventListener(){if(this._boundInsertListener)return;const styleInner=`
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
        `,style=document.createElement("style");style.innerHTML=styleInner;document.body.appendChild(style);this._boundInsertListener=this.insertListener.bind(this);document.addEventListener("animationstart",this._boundInsertListener,!1);document.addEventListener("MSAnimationStart",this._boundInsertListener,!1);document.addEventListener("webkitAnimationStart",this._boundInsertListener,!1)}attributeChangedCallback(name,oldVal,newVal){switch(name){case where_target_selector:this._whereTargetSelector=newVal;break;}super.attributeChangedCallback(name,oldVal,newVal)}connectedCallback(){this._upgradeProperties(["whereTargetSelector"]);super.connectedCallback()}disconnectedCallback(){if(this._boundInsertListener){document.removeEventListener("animationstart",this._boundInsertListener);document.removeEventListener("MSAnimationStart",this._boundInsertListener);document.removeEventListener("webkitAnimationStart",this._boundInsertListener)}}onDecoPropsChange(){if(!this._whereTargetSelector){super.onDecoPropsChange();return}if(!this.id){console.error("xtal-decorator requires an id");return}this.addEventListener()}}define(XtalDecorator);
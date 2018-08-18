export class XtalDeco extends HTMLElement{constructor(){super();this.style.display="none"}static get is(){return"xtal-deco"}connectedCallback(){this.getElement("_nextSibling",t=>t.nextElementSibling);this.getElement("_script",t=>t.querySelector("script"))}attachBehavior(evalObj){for(const topKey in evalObj){const subObj=evalObj[topKey];switch(topKey){case"on":for(const key in subObj){const handlerKey=key+"_decoHandler",prop=Object.defineProperty(this._nextSibling,handlerKey,{enumerable:!1,configurable:!0,writable:!0,value:subObj[key]});this._nextSibling.addEventListener(key,this._nextSibling[handlerKey])}break;case"props":for(const key in subObj){const propVal=subObj[key];Object.defineProperty(this._nextSibling,key,{get:function(){return this["_"+key]},set:function(val){this["_"+key]=val;const newEvent=new CustomEvent(key+"-changed",{detail:{value:val},bubbles:!0,composed:!1});this.dispatchEvent(newEvent);if(this.onPropsChange)this.onPropsChange(key,val)},enumerable:!0,configurable:!0});this._nextSibling[key]=propVal}break;default:switch(typeof subObj){case"function":Object.defineProperty(this._nextSibling,topKey,{enumerable:!1,configurable:!0,writable:!0,value:subObj});break;case"object":this._nextSibling[topKey]=subObj;break;}}}}getElement(fieldName,getter){this[fieldName]=getter(this);if(!this[fieldName]){setTimeout(()=>{this.getElement(fieldName,getter)});return}this.onDecoPropsChange()}evaluateCode(){const evalObj=eval(this._script.innerHTML);this.attachBehavior(evalObj);this._nextSibling.removeAttribute("disabled")}onDecoPropsChange(){if(!this._nextSibling||!this._script)return;this.evaluateCode()}}customElements.define(XtalDeco.is,XtalDeco);
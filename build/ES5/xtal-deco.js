import{define}from"./node_modules/xtal-latx/define.js";var spKey="__xtal_deco_onPropsChange";export var XtalDeco=function(_HTMLElement){babelHelpers.inherits(XtalDeco,_HTMLElement);function XtalDeco(){babelHelpers.classCallCheck(this,XtalDeco);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(XtalDeco).apply(this,arguments))}babelHelpers.createClass(XtalDeco,[{key:"connectedCallback",value:function connectedCallback(){this.style.display="none";this.getElement("_nextSibling",function(t){return t.nextElementSibling});this.getElement("_script",function(t){return t.querySelector("script")})}},{key:"attachBehavior",value:function attachBehavior(evalObj,target){for(var topKey in evalObj){var subObj=evalObj[topKey];switch(topKey){case"on":for(var key in subObj){var handlerKey=key+"_decoHandler",prop=Object.defineProperty(target,handlerKey,{enumerable:!1,configurable:!0,writable:!0,value:subObj[key]});target.addEventListener(key,target[handlerKey])}break;case"props":var _loop=function _loop(_key){var propVal=subObj[_key];Object.defineProperty(target,_key,{get:function get(){return this["_"+_key]},set:function set(val){this["_"+_key]=val;var eventName=_key+"-changed",newEvent=new CustomEvent(eventName,{detail:{value:val},bubbles:!0,composed:!1});this.dispatchEvent(newEvent);if(this[spKey])this[spKey](_key,val)},enumerable:!0,configurable:!0});target[_key]=propVal};for(var _key in subObj){_loop(_key)}break;case"setters":for(var _key2 in subObj){var propVal=subObj[_key2];target[_key2]=propVal}break;default:switch(babelHelpers.typeof(subObj)){case"function":var fnKey="onPropsChange"===topKey?spKey:topKey,_prop=Object.defineProperty(target,fnKey,{enumerable:!1,configurable:!0,writable:!0,value:subObj});break;case"object":target[topKey]=subObj;break;}}}}},{key:"getElement",value:function getElement(fieldName,getter){var _this=this;this[fieldName]=getter(this);if(!this[fieldName]){setTimeout(function(){_this.getElement(fieldName,getter)});return}this.onDecoPropsChange()}},{key:"evaluateCode",value:function evaluateCode(scriptElement,target){var evalObj=eval(scriptElement.innerHTML);this.attachBehavior(evalObj,target);this._nextSibling.removeAttribute("disabled")}},{key:"onDecoPropsChange",value:function onDecoPropsChange(){if(!this._nextSibling||!this._script)return;this.evaluateCode(this._script,this._nextSibling)}}],[{key:"is",get:function get(){return"xtal-deco"}}]);return XtalDeco}(babelHelpers.wrapNativeSuper(HTMLElement));define(XtalDeco);
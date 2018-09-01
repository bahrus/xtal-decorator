(function(){const DASH_TO_CAMEL=/-[a-z]/g;function dashToCamelCase(dash){return dash.replace(DASH_TO_CAMEL,m=>m[1].toUpperCase())}function getChildren(parent){switch(parent.nodeName){case"IFRAME":return this.$0.contentWindow.document.body.childNodes;default:const publicChildren=parent.childNodes,returnObj=[];if(parent.shadowRoot){parent.shadowRoot.childNodes.forEach(node=>{returnObj.push(node)})}parent.childNodes.forEach(node=>{returnObj.push(node)});return returnObj;}}function getChildFromSinglePath(el,token){let idx=0,nonIndexedToken=token;if(".."===token){return el.parentNode}if(token.endsWith("]")){const posOfOpen=token.indexOf("["),indxString=token.substring(posOfOpen+1,token.length-1);idx=parseInt(indxString);nonIndexedToken=token.substring(0,posOfOpen)}const matchingNodes=[];getChildren(el).forEach(child=>{if(child.matches&&child.matches(nonIndexedToken)){matchingNodes.push(child)}});return matchingNodes[idx]}class XtalDeco extends HTMLElement{static get is(){return"xtal-deco"}connectedCallback(){this.style.display="none";this.getElement("_nextSibling",t=>t.nextElementSibling);this.getElement("_script",t=>t.querySelector("script"))}attachBehavior(evalObj,target){for(const topKey in evalObj){const subObj=evalObj[topKey];switch(topKey){case"on":for(const key in subObj){const handlerKey=key+"_decoHandler",prop=Object.defineProperty(target,handlerKey,{enumerable:!1,configurable:!0,writable:!0,value:subObj[key]});target.addEventListener(key,target[handlerKey])}break;case"props":for(const key in subObj){const propVal=subObj[key];Object.defineProperty(target,key,{get:function(){return this["_"+key]},set:function(val){this["_"+key]=val;const newEvent=new CustomEvent(key+"-changed",{detail:{value:val},bubbles:!0,composed:!1});this.dispatchEvent(newEvent);if(this.onPropsChange)this.onPropsChange(key,val)},enumerable:!0,configurable:!0});target[key]=propVal}break;default:switch(typeof subObj){case"function":Object.defineProperty(target,topKey,{enumerable:!1,configurable:!0,writable:!0,value:subObj});break;case"object":target[topKey]=subObj;break;}}}}getElement(fieldName,getter){this[fieldName]=getter(this);if(!this[fieldName]){setTimeout(()=>{this.getElement(fieldName,getter)});return}this.onDecoPropsChange()}evaluateCode(scriptElement,target){const evalObj=eval(scriptElement.innerHTML);this.attachBehavior(evalObj,target);this._nextSibling.removeAttribute("disabled")}onDecoPropsChange(){if(!this._nextSibling||!this._script)return;this.evaluateCode(this._script,this._nextSibling)}}define(XtalDeco);function define(custEl){let tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)}const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){const v=val?"set":"remove";this[v+"Attribute"](name,trueVal||val)}to$(n){const mod=n%2;return(n-mod)/2+"-"+mod}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}function observeCssSelector(superClass){const eventNames=["animationstart","MSAnimationStart","webkitAnimationStart"];return class extends superClass{addEventListener(id,targetSelector,insertListener){if(this._boundInsertListener)return;const styleInner=`
            @keyframes ${this.id} {
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
            `,style=document.createElement("style");style.innerHTML=styleInner;const host=getHost(this);if(null!==host){host.shadowRoot.appendChild(style)}else{document.body.appendChild(style)}this._boundInsertListener=insertListener.bind(this);const container=host?host.shadowRoot:document;eventNames.forEach(name=>{container.addEventListener(name,this._boundInsertListener,!1)})}disconnectedCallback(){if(this._boundInsertListener){const host=getHost(this),container=host?host.shadowRoot:document;eventNames.forEach(name=>{container.removeEventListener(name,this._boundInsertListener)})}if(super.disconnectedCallback)super.disconnectedCallback()}}}function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}const into_next_element="into-next-element",import_template="import-template",attach_script="attach-script";class XtalDecor extends XtallatX(XtalDeco){static get is(){return"xtal-decor"}get intoNextElement(){return this._intoNextElement}set intoNextElement(val){this.attr(into_next_element,val,"")}get importTemplate(){return this._importTemplate}set importTemplate(val){this.attr(import_template,val,"")}get attachScript(){return this._attachScript}set attachScript(val){this.attr(attach_script,val,"")}static get observedAttributes(){return super.observedAttributes.concat([into_next_element,import_template,attach_script])}attributeChangedCallback(name,oldVal,newVal){super.attributeChangedCallback(name,oldVal,newVal);switch(name){case import_template:this._importTemplate=null!==newVal;break;case attach_script:this._attachScript=null!==newVal;break;case into_next_element:this._intoNextElement=null!==newVal;break;}this.onDecoPropsChange()}connectedCallback(){this._upgradeProperties(["disabled","attachScript","importTemplate","intoNextElement","whereCSSMatches"]);this._connected=!0;this.onDecoPropsChange();this.addMutationObserver()}disconnectedCallback(){if(this._mutationObserver)this._mutationObserver.disconnect()}addMutationObserver(){this._mutationObserver=new MutationObserver(()=>{this.getTemplatesAndScripts();this.appendTemplates()});this.getTemplatesAndScripts();this.appendTemplates();this._mutationObserver.observe(this,{childList:!0})}getTemplatesAndScripts(){this._templates=qsa("template",this);this._scripts=qsa("script",this)}onDecoPropsChange(){if(!this._connected||this.disabled)return;if(this._intoNextElement&&!this._nextSibling){this.getElement("_nextSibling",t=>t.nextElementSibling);return}this.appendTemplates();if(this._attachScript&&this._intoNextElement)this.evaluateCode()}appendTemplates(target){if(!this._templates)return;if(!target&&this._intoNextElement)target=this._nextSibling;if(this._importTemplate&&target){customElements.whenDefined(target.tagName.toLowerCase()).then(()=>{this._templates.forEach(template=>{if(template.dataset.xtalTemplInserted)return;let subTarget=target;const path=template.dataset.path;if(path){subTarget=cd(target,path)}const clone=document.importNode(template.content,!0);subTarget.shadowRoot.appendChild(clone);template.dataset.xtalTemplInserted="true"})})}}attachScripts(target){if(!this._scripts)return;if(!target&&this._intoNextElement)target=this._nextSibling;if(this._attachScript&&target){customElements.whenDefined(target.tagName.toLowerCase()).then(()=>{this._scripts.forEach(script=>{if(script.dataset.xtalScriptAttached)return;let subTarget=target;const path=script.dataset.path;if(path){subTarget=cd(target,path)}this.evaluateCode(script,subTarget)})})}}}XtalDecor._addedNodeInsertionStyle=!1;define(XtalDecor);const where_target_selector="where-target-selector";class XtalDecorator extends observeCssSelector(XtalDecor){constructor(){super(...arguments);this._host=document}static get is(){return"xtal-decorator"}static get observedAttributes(){return super.observedAttributes.concat([where_target_selector])}get whereTargetSelector(){return this._whereTargetSelector}set whereTargetSelector(val){if(this._whereTargetSelector&&this._whereTargetSelector!==val)throw"Only supports one value";this.attr(where_target_selector,val)}insertListener(e){if(e.animationName===this.id){this.appendTemplates(e.target);this.attachScripts(e.target)}}attributeChangedCallback(name,oldVal,newVal){switch(name){case where_target_selector:this._whereTargetSelector=newVal;break;}super.attributeChangedCallback(name,oldVal,newVal)}connectedCallback(){this._upgradeProperties(["whereTargetSelector"]);super.connectedCallback()}onDecoPropsChange(){if(!this._whereTargetSelector){super.onDecoPropsChange();return}if(!this.id){console.error("xtal-decorator requires an id");return}this.addEventListener(this.id,this._whereTargetSelector,this.insertListener)}}define(XtalDecorator)})();
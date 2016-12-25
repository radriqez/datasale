/**
 * Created by alex on 7/3/14.
 */
/**
 * MixIn's START
 */

/**
 * @mixin Visual
 */

function Visual(){

}

Visual.prototype.rootNode = null;
Visual.prototype.node = null;
Visual.prototype.hooks = {};

Visual.prototype.setHooks = function(hookToSelector){
    for(var key in hookToSelector){
        if(hookToSelector.hasOwnProperty(key)){
            var hookedNode = this.node.querySelector(hookToSelector[key]);
            if(hookedNode){
                this.hooks[key] = hookedNode;
            }else{
                console.log("Wrong Selector");
            }
        }
    }
}
/**
 * @param {HTMLElement} node
 */
Visual.prototype.setRootNode = function(node){
    if(node && (node instanceof HTMLElement)){
        this.rootNode = node;
    }else{
        throw new Error("Wrong node passed to setRootNode");
    }
}

Visual.prototype.getRootNode = function(){
    return this.rootNode;
}
/**
 * @param {HTMLElement} node
 */
Visual.prototype.setContentNode = function(node){
    if(node && (node instanceof HTMLElement)){
        this.node = node;
    }else{
        throw new Error("Wrong node passed to setContentNode");
    }
}

Visual.prototype.getContentNode = function(){
    return this.contentNode;
}

/**
 * @param {Visual | HTMLElement} element
 */
Visual.prototype.appendTo = function(element){
    var destinationNode = (element instanceof Visual ? element.getContentNode() : element);
    if(destinationNode){
        destinationNode.appendChild(this.getContentNode());
        this.setRootNode(destinationNode);
    }
}

Visual.prototype.removeContentNode = function(){
    if(this.rootNode && this.rootNode.contains(this.contentNode)){
        if(typeof HTMLElement.prototype.remove == "function"){
            this.getContentNode().remove();
        }else{
            this.rootNode.removeChild(this.getContentNode());
        }
    }
}

Visual.prototype.isInDom = function(){
    if(this.containerNode && this.rootNode.contains(this.contentNode)){
        return true;
    }else{
        return false;
    }
}

Visual.prototype.setHeight = function(height){
    this.node.style.height = height + 'px';
}

Visual.prototype.setWidth = function(width){
    this.node.style.width = width + 'px';
}

/**
 * Для обьектов несущих какую-либо информацию
 * @constructor
 */
function DTO(){
    this.data = {};
}


DTO.prototype.setDataParam = function(paramName, paramValue, namespace){
    if(!namespace){
        namespace = "main";
    }
    if(!this.data[namespace]){
        this.data[namespace] = {};
    }
    this.data[namespace][paramName] = paramValue;
}
/**
 * @param paramName
 * @param namespace
 * @returns {*|null}
 */
DTO.prototype.getDataParam = function(paramName, namespace){
    if(!namespace){
        namespace = "main";
    }
    return this.data[namespace] ? this.data[namespace][paramName] : null;
}
/**
 * @param {{}} data
 */
DTO.prototype.initializeWithData = function(data){
    for(var key in data){
        this.setDataParam(key, data[key]);
    }
}

/**
 * MixIn's END
 */


/**
 * Utils START
 */
function extendByPrototype(base, extention){
    var baseProto = base.prototype,
    extentionProto = extention.prototype;
    extend(baseProto, extentionProto);
}

/**
 *
 * @param {{}} base
 * @param {{}} extention
 * @param {Boolean} onlyOwnPropertiesFlag
 */
function extend(base, extention, onlyOwnPropertiesFlag){
    for (var key in extention){
        if(onlyOwnPropertiesFlag == true && extention.hasOwnProperty(key)){
            base[key] = extention[key];
        }else{
            base[key] = extention[key];
        }
    }
}
/**
 * Utils END
 */
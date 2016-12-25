/**
 * Created on 6/24/14.
 *
 */

(function(){
    /**
     * @param {HTMLElement} rootNode
     * @param {Array | Undefined} nodes
     * @constructor
     */
    function BlocksMap(rootNode, nodes){
        if(nodes){
            this.registerBlocks(nodes);
        }
        this.initialize();
        this.activationMode = 0
        this.activationModes = {
            "single": 0,
            "multiple": 1
        };
        if(navigator.userAgent.indexOf('Macintosh') > -1){
            this.modeChangeHotkey = (navigator.userAgent.indexOf('Chrome')  || navigator.userAgent.indexOf('Safari') > -1 ? 91 : 224);
        }else{
            this.modeChangeHotkey = 17; //Ctrl
        }
        this.lastHoveredMapNode = null;
        /*this.lastBlock = document.createElement('div');
        this.lastBlock.draggable = false;
        this.lastBlock.className = "info-block";
        this.lastBlock.innerHTML = "Use " + (navigator.userAgent.indexOf('Macintosh') >-1 ? "Cmd" : "Ctrl") + " to select multiple items";*/
        this.infoStr = "Use " + (navigator.userAgent.indexOf('Macintosh') >-1 ? "Cmd" : "Ctrl") + " to select multiple items";
    }
    extendByPrototype(BlocksMap, Visual);
    BlocksMap.prototype.typeTemplates = {
        //"blockType" : HTMLElement
    };
    BlocksMap.prototype.mapNodes = [];

    /**
     * @param {Array} nodes
     */
    BlocksMap.prototype.registerBlocks = function(nodes){
        for(var i= 0, l = nodes.length; i < l; i++){
            var node = nodes[i];
            this.registerBlock(node);
        }
    }

    BlocksMap.prototype.registerBlock = function(node){
//        var block = new Block(node); коллекция блоков
//        this.blocksCollection.push(block);
    }

    BlocksMap.prototype.buildMapNode = function(blocks){
        if(!this.node){
            throw new Error("Wrong map node");
        }

//        var blockSize = Math.min((window.innerHeight - 100 - ((blocks.length+1) * 2)) / blocks.length+1, 95);
        var blockSize = Math.min((window.innerHeight - (blocks.length * 3)) / (blocks.length+1), 95);
        for(var i= 0, l = blocks.length; i < l; i++){
            var block = blocks[i];
            var data = {
                id : block.getDataParam('id'),
                type: block.getDataParam('type'),
                icon: block.getDataParam('icon')
            };
            var tpl = this.generateDummyTplNode(data, blockSize);
            tpl.style.height = blockSize + 'px';
            this.node.appendChild(tpl);
            this.mapNodes.push(tpl);
        }
//        this.node.appendChild(this.lastBlock);
    }

    BlocksMap.prototype.clearMapNode = function(){
        while(this.node.firstChild){
            this.node.removeChild(this.node.firstChild);
        }
        this.mapNodes = [];
    }

    BlocksMap.prototype.rebuildMapNode = function(blocks){
        this.clearMapNode();
        this.buildMapNode(blocks);
    }

    BlocksMap.prototype.generateDummyTplNode = function(data, blockHeight){
        var height = blockHeight, width = height * 1.294;
        var str = "<img src='"+data.icon+"' draggable='false' height="+height+" width="+width+"/><span class='blocktypename' data-hook='data-type-name'>"+data.type.toUpperCase()+"</span><div class='hoveredstate-top abs'></div><div class='hoveredstate-right abs'></div><div class='hoveredstate-bottom abs'></div><div class='hoveredstate-left abs'></div>",
            div = document.createElement('div');
        div.innerHTML = str;
        div.draggable = true;
        div.className = 'item';
        $(div).attr('data-block-id', data.id);
        return div;
    }

    BlocksMap.prototype.catchDblClick = function(e){
//        document.body.addEventListener('dblclick', function(e){
//            var target = e.target || e.srcElement;
//            if(this.node.contains(target) && this.node !== target){
//                for(var i= 0, l = this.mapNodes.length; i < l; i++){
//                    var mn = this.mapNodes[i];
//                    if(mn.contains(target) || mn === target){
//                        target = mn;
//                        break;
//                    }
//                }
//                window.observer.emitEvent('scrolltoblock', {
//                    id : $(target).attr('data-block-id')
//                });
//            }
//        }.bind(this));
    }

    BlocksMap.prototype.catchActivate = function(){
        document.body.addEventListener('click', function(e){
            var target = e.target || e.srcElement,_index;
            var founded = false;
            if(this.node.contains(target) == false)
                return false;
            for(var i= 0, l = this.mapNodes.length; i < l; i++){
                var mn = this.mapNodes[i];
                if(target === mn || mn.contains(target)){
                    target = mn;
                    founded = true;
                }else if(this.activationMode == this.activationModes["single"]){
                    $(mn).removeClass('active');
                }
            }

            if(founded == false){
                return false;
            }
            this.changeActiveStateMapNode(target);
//            }
        }.bind(this));
    }

    BlocksMap.prototype.catchHover = function(){
        this.node.addEventListener('mouseover', function(e){
            var target = e.target || e.srcElement;
            for(var i= 0, l = this.mapNodes.length; i < l; i++){
                var mn = this.mapNodes[i];
                if(mn.contains(target)){ // if target === mn return true
                    this.setHoveredState(mn, true);
                }
            }
        }.bind(this));
        this.node.addEventListener('mouseout', function(e){
            var target = e.target || e.srcElement;
            for(var i= 0, l = this.mapNodes.length; i < l; i++){
                var mn = this.mapNodes[i];
                if(mn.contains(target)){ // if target === mn return true
                    this.setHoveredState(mn, false);
                }
            }
        }.bind(this));
        window.observer.addEventListener('listhoveredstatechange', function(data){
            var id = data.id,
                state = data.state;
            for(var i= 0, l = this.mapNodes.length; i < l; i++){
                var mn = this.mapNodes[i];
                if($(mn).attr('data-block-id') == id){
                    if(state)
                        $(mn).addClass('hovered');
                    else
                        $(mn).removeClass('hovered');
                }
            }
        }.bind(this));
    }

    BlocksMap.prototype.setHoveredState = function(mn,flag){
        var el = $(mn);
        var id = el.attr('data-block-id');
        if(flag){
            if(!el.hasClass('hovered')){
                el.addClass('hovered');
                window.observer.emitEvent('hoveredstatechange', {id : id, state : flag});
            }
        }else{
            if(el.hasClass('hovered')){
                el.removeClass('hovered');
                window.observer.emitEvent('hoveredstatechange', {id : id, state : flag});
            }
        }
    }

    BlocksMap.prototype.changeActiveStateMapNode = function(target, _isNeedScroll){
        var id = $(target).attr('data-block-id'),
            state = $(target).hasClass('active');
        if(state){
            $(target).removeClass('active');
        }else{
            $(target).addClass('active');
        }

        var activeElements = this.getActiveElements();
        var isNeedScroll = typeof _isNeedScroll == "undefined" ? true : _isNeedScroll;
        if(this.activationMode == 1 && activeElements.length > 1){
            isNeedScroll = false;
        }
        if(activeElements.length == 1){
            this.firstClickedMapNode = target;
        }
        window.observer.emitEvent('activestatechanged',{
            activeState : !state,
            id : id, activationMode : this.activationMode == 0 ? "single" : "multiple",
            isNeedScroll : isNeedScroll
        });
    }

    BlocksMap.prototype.getActiveElements = function(){
        var els = [];
        for(var i= 0, l = this.mapNodes.length; i < l; i++){
            if($(this.mapNodes[i]).hasClass('active'))
                els.push(this.mapNodes[i]);
        }
        return els;
    }

    BlocksMap.prototype.handleDragStart = function(e){
        var target = e.target || e.srcElement;
        if(this.mapNodes.indexOf(target) == -1)
        return false;
        if(this.activationMode == 0 && this.getActiveElements().indexOf(target) == -1){
            this.resetItemsState(true);
        }
        if(!$(target).hasClass('active') && this.getActiveElements().length == 0){
            this.changeActiveStateMapNode(target, false);
//            $(target).addClass('active');
        }
        var els = this.getActiveElements();
        if(els.length){
            var frame = document.createElement('div');
            frame.className = 'draggablemap';
            frame.style.height = els.length * els.clientHeight + 'px';
            frame.style.width = els[0].clientWidth + 'px';
            var finded = false, topOffset = 0, ids = [];
            for(var i= 0, l = els.length; i < l; i++){
                var el = els[i];
                ids.push($(el).attr('data-block-id'));
                frame.appendChild(el.cloneNode(true));
                if(el === target || el.contains(target)){
                    finded = true;
                    topOffset+= e.clientY - el.getBoundingClientRect().top;
                }
                if(finded == false){
                    topOffset+=el.clientHeight;
                }
//                el.style.display = 'none';
            }
            document.body.appendChild(frame);

            e.dataTransfer.setDragImage(frame, e.clientX - this.node.getBoundingClientRect().left, topOffset);
            setTimeout(function(){
                document.body.removeChild(frame);
            },1);

            this.setScrollMode(false);
        }
    }

    BlocksMap.prototype.setScrollMode = function(flag){
        if(!flag){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = '';
        }
    }

    BlocksMap.prototype.onDragEnd = function(e){
        e.preventDefault();
        if(!this.lastHoveredMapNode)
            return;
        var target = this.lastHoveredMapNode.node,
            activeElements = this.getActiveElements(), ids = [], toInsertBeforeId = null;
        for(var i= 0, l = this.mapNodes.length; i < l; i++){
            var mn =  this.mapNodes[i];
            if(mn.contains(target) || target == mn){
                target = mn;
                break;
            }
        }
        var offset = target.getBoundingClientRect().top + (target.clientHeight / 2),
            _toInsertBefore=null;
        if(this.lastHoveredMapNode.direction == "up"){
            _toInsertBefore = target;
//            _toInsertBefore = this.mapNodes[i];
        }else if(this.lastHoveredMapNode.direction == "down"){
            _toInsertBefore = target.nextSibling ? target.nextSibling : null;
//            _toInsertBefore = this.mapNodes[i+1] ? this.mapNodes[i+1] : null;
        }

        if(_toInsertBefore != null){
            toInsertBeforeId = $(_toInsertBefore).attr('data-block-id');
        }

        for(var i= 0, l = activeElements.length; i < l; i++){
            ids.push($(activeElements[i]).attr('data-block-id'));
            if(_toInsertBefore){
                this.node.insertBefore(activeElements[i], _toInsertBefore);
            }else{
                this.node.appendChild(activeElements[i]);
            }
//            activeElements[i].style.display = 'block';
        }
        this.resetItemsState(false);
        this.setScrollMode(true);
        this.lastHoveredMapNode = null;
        window.observer.emitEvent('mapelementssortchanged',
            {
                toInsertBeforeId : toInsertBeforeId,
                idsToMove : ids,
//                scrollTo : $(this.firstClickedMapNode).attr('data-block-id')
                scrollTo : $(activeElements[0]).attr('data-block-id')
            });
    }

    BlocksMap.prototype.deactivateAllMapNodes = function(){
        for(var i= 0, l = this.mapNodes.length; i < l; i++){
            if($(this.mapNodes[i]).hasClass('active')){
                this.changeActiveStateMapNode(this.mapNodes[i], false);
            }
        }
    }

    BlocksMap.prototype.resetItemsState = function(isNeedRemoveActive){
        if(typeof isNeedRemoveActive == "undefined"){
            isNeedRemoveActive = true;
        }
        for(var i= 0, l = this.mapNodes.length; i < l; i++){
            if(isNeedRemoveActive){
                $(this.mapNodes[i]).removeClass('active');
            }
            $(this.mapNodes[i]).removeClass('coulddropup');
            $(this.mapNodes[i]).removeClass('coulddropdown');
        }
        $(this.node).removeClass('dragging');
    }


    BlocksMap.prototype.handleDrag = function(){
        this._handleDragStart = this.handleDragStart.bind(this);
        this._onDragEnd = this.onDragEnd.bind(this);
        this.node.addEventListener('dragstart', this._handleDragStart);
        this.node.addEventListener('drop', this._onDragEnd);
        this.node.addEventListener('drag',function(e){
            e.preventDefault();
        });
        this.node.parentNode.addEventListener('dragover', function(e){
            e.preventDefault();
        });
        document.body.addEventListener('dragend', function(){
            this.resetItemsState(false);
            this.setScrollMode(true);
        }.bind(this));

        this.node.addEventListener('dragover', function(e){
            e.preventDefault();
            var target = e.target || e.srcElement;

            if(this.node.contains(target) && target != this.node){
                for(var i= 0, l = this.mapNodes.length; i < l; i++){
                    var mn = this.mapNodes[i];
                    if($(mn).hasClass('active')){
                        continue;
                    }
                    if(mn.contains(target) || target === mn){
                        var halfHeightOffset = mn.getBoundingClientRect().top + (mn.clientHeight / 2);
                        if(e.clientY < halfHeightOffset){
                            $(mn).addClass('coulddropup');
                            $(mn).removeClass('coulddropdown');
                            this.lastHoveredMapNode = {
                                node : mn,
                                direction : "up"
                            };
                        }else{
                            $(mn).addClass('coulddropdown');
                            $(mn).removeClass('coulddropup');
                            this.lastHoveredMapNode = {
                                node : mn,
                                direction : "down"
                            };
                        }
                    }else{
                        $(mn).removeClass('coulddropdown');
                        $(mn).removeClass('coulddropup');
                    }
                }
            }
        }.bind(this));
    }

    BlocksMap.prototype.catchActivationModeChange = function(){
        document.body.addEventListener('keydown',function(e){
            var code = e.keyCode || e.which;
            if(code && code == this.modeChangeHotkey){
                this.activationMode = this.activationModes["multiple"];
            }
        }.bind(this));
        document.body.addEventListener('keyup', function(e){
            var code = e.keyCode || e.which;
            if(code && code == this.modeChangeHotkey){
                this.activationMode = this.activationModes["single"];
            }
        }.bind(this));
    }

    BlocksMap.prototype.initialize = function(){
        window.observer.addEventListener('blocklistready', function(data){
            this.setRootNode(document.body);
            this.setContentNode(document.body.querySelector('[data-hook="blocks-map"]'));
            this.buildMapNode(data);
            this.catchActivate();
            this.catchActivationModeChange();
            this.handleDrag();
            this.catchDblClick();
            this.catchHover();
        },{
            single : false,
            context : this
        });
        window.observer.addEventListener('blocklistchanged', function(blocks){
            this.rebuildMapNode(blocks);
        }.bind(this));
    }

    window.blocksMap = new BlocksMap();

    /**
     * @param {HTMLElement | Undefined} rootNode
     * @param {HTMLElement | Undefined} contentNode
     * @constructor
     */
    function BlocksList(rootNode, contentNode){
        if(rootNode){
            this.setRootNode(rootNode);
        }
        if(contentNode){
            this.setContentNode(contentNode);
        }
        var self = this;

        function checkIfAmongBlocks(target){
            var amongBlocks = false;
            self.iterate(function(block){
                var node = block.node;
                if(target === node)
                    amongBlocks = true;
            });
            return amongBlocks;

        }
    }
    extendByPrototype(BlocksList, Visual);
    BlocksList.prototype.blocksCollection = [];

    /**
     * @param {HTMLElement} blockNode
     */
    BlocksList.prototype.addBlock = function(blockNode){
        var block = new Block(blockNode);
        block.setRootNode(this.node);
        this.blocksCollection.push(block);
    }

    BlocksList.prototype.getBlockById = function(id){
        for(var i= 0, l = this.blocksCollection.length; i < l; i++){
            var block = this.blocksCollection[i];
            if($(block.node).attr('recordid') == id){
                return block;
            }
        }
    }

    /**
     * @param {{}} block
     */
    BlocksList.prototype.removeBlock = function(block){
        block.removeContentNode();
    }

    BlocksList.prototype.removeBlockById = function(){

    }

    BlocksList.prototype.getLastBlockId = function(){
        return this.blocksCollection.length ? $(this.blocksCollection[this.blocksCollection.length-1]).attr('recrodid') : null;
    }

    BlocksList.prototype.initialize = function(rootNode, contentNode){
        var _initialize = function(){
            if(!rootNode){
                rootNode = document.body;
            }

            if(!contentNode){
                contentNode = document.body.querySelector('[data-hook="blocks-collection-content-node"]');
            }
            this.setRootNode(rootNode);
            this.setContentNode(contentNode);

            var allBlocks = document.body.querySelectorAll('.record');

            for(var i= 0, l = allBlocks.length; i < l; i++){
                this.addBlock(allBlocks[i]);
            }

            window.observer.emitEvent('blocklistready', this.blocksCollection);

            window.observer.addEventListener('activestatechanged', function(data){
                var activeState = data.activeState,
                    id = data.id,
                    activationMode = data.activationMode,
                    isNeedScroll = data.isNeedScroll;
                var block = this.getBlockById(id);
                if(!block){
                    throw new Error("Wrong block id");
                }
                if(activationMode == "single"){
                    this.iterate(function(block){
                        block.setActiveState(false);
                    });
                }
                block.setActiveState(activeState);
                if(isNeedScroll){
                    scrollTo(id);
                }
            },{
                single : false,
                context : this
            });

            window.observer.addEventListener('mapelementssortchanged', function(data){
                var idToInsertBefore = data.toInsertBeforeId,
                    ids = data.idsToMove,
                    scrollTo = data.scrollTo,
                    blockToInsertBefore;
                if(idToInsertBefore)
                    blockToInsertBefore = this.getBlockById(idToInsertBefore);
                for(var i= 0, l = ids.length; i < l; i++){
                    var block = this.getBlockById(ids[i]);
                    if(blockToInsertBefore){
                        block.rootNode.insertBefore(block.node, blockToInsertBefore.node);
                    }else{
                        block.rootNode.appendChild(block.node);
                    }
//                    block.setActiveState(false);
                }
                    window.observer.emitEvent('scrolltoblock',{id : scrollTo});
                    showSortButtons();
//                    window.blockList.rebuildList();
                    autosavesort_timer = setTimeout(function() {
                        saveRecordsSort();
                    },7000);

            },{
                single : false,
                context : this
            });

            window.observer.addEventListener('scrolltoblock', function(data){
                var id = data.id;
                if(id){
                    var block = this.getBlockById(id);
                    if(block){
                        scrollTo(block.getDataParam('id'));
                    }
                }
            },{
                single : false,
                context : this
            });

            window.observer.addEventListener('hoveredstatechange', function(data){
                var id = data.id, state = data.state;
                var block = this.getBlockById(id);
                block.setHoveredState(state);
            },{
                single : false,
                context : this
            });
        }.bind(this);

        _initialize();
    }

    BlocksList.prototype.getCollectionLength = function(){
        return this.blocksCollection.length;
    }

    BlocksList.prototype.iterate = function(func){
        for(var i= 0, l = this.blocksCollection.length; i < l; i++){
            var block = this.blocksCollection[i];
            func(block);
        }
    }

    BlocksList.prototype.rebuildList = function(){
        this.blocksCollection = [];
        var allBlocks = document.body.querySelectorAll('.record');

        for(var i= 0, l = allBlocks.length; i < l; i++){
            this.addBlock(allBlocks[i]);
        }
        window.observer.emitEvent('blocklistchanged', this.blocksCollection);
    }

    $(document).ready(function(){
        var rootNode = document.body;
        var contentNode = document.body.querySelector('[data-hook="blocks-map"]');
        window.blockList = new BlocksList(rootNode, contentNode);
        window.blockList.initialize();

        var bt = document.body.querySelector("[data-hook='blockmap-button']");
        bt.addEventListener('click',function(e){
            var bd = $(document.body)
            if(bd.hasClass('blocksmap-shown')){
                bd.removeClass('blocksmap-shown');
            }else{
                bd.addClass('blocksmap-shown');
                showinfo(window.blocksMap.infoStr);
            }
            e.preventDefault();
            e.stopPropagation();
            e.returnValue = false;
            blocksMap.deactivateAllMapNodes();
            return false;
        });

//        $(window).resize(function(){
//            if(this._resizeTimeout){
//                clearTimeout(this._resizeTimeout);
//            }
//            this._resizeTimeout = setTimeout(function(){
//                window.observer.emitEvent('blocklistchanged', this.blocksCollection);
//            }.bind(this), 100);
//        }.bind(this));
    });
    /**
     * @param {HTMLElement} node
     * @param {{}} data
     * @constructor
     */
    function Block(node, data){
        if(!(node instanceof HTMLElement)){
            throw new Error("Wrong node type passed to Block constructor!");
        }
        DTO.apply(this);
        if(data){
            this.initializeWithData(data);
        }
        this.activeState = false;
        this.hoveredState = false;
        this.setContentNode(node);
        this.node.onmouseenter = function(){
            window.observer.emitEvent('listhoveredstatechange', {id : this.getDataParam('id'), state : true});
        }.bind(this);

        this.node.onmouseleave = function(){
            window.observer.emitEvent('listhoveredstatechange', {id : this.getDataParam('id'), state : false});
        }.bind(this);
//        this.setDataParam('type', $(node).attr('data-record-type') ? $(node).attr('data-record-type') : node.id);
        var tplId = $(node).attr('data-record-type'),
            tpl = getTplById(tplId);
        this.setDataParam('id', $(node).attr('recordid') ? $(node).attr('recordid') : node.id);
        if(tpl){
            var type = getBlockTypeById(tpl.type);

            if (tpl.icon2) {
                tpl.icon = tpl.icon2;
            }

            this.setDataParam('icon', tpl.icon);
            this.setDataParam('type', type.title);
        }else{
            //this.setDataParam('icon', 'no tpl in $tpls with id ' + tplId);
            //this.setDataParam('type', 'no tpl in $tpls with id ' + tplId);
            this.setDataParam('icon', '/img/icon/image-01.png');
            this.setDataParam('type', '');            
        }
    }


    Block.prototype.dragHandle = null;
    Block.prototype.active = false;
    extendByPrototype(Block, Visual);
    extendByPrototype(Block, DTO);
    /**
     * Пока не понятно как будут таскаться блоки,
     * вместе в одном блоке или же по отдельности
     * Поэтому пока реализую через интерфейс
     * Сперва попробую через блок
     */
    Block.prototype.drag = function(node){
        node.appendChild(Block.node);
    }

    /**
     * @param {HTMLElement} node
     */
    Block.prototype.setDragHandle = function(node){
        if(!node || !(node instanceof HTMLElement)){
            throw new Error("Wrong ndoe passed to setDragHandle");
        }
        this.dragHandle = node;
    }

    Block.prototype.setHoveredState = function(flag){
        this.hoveredState = flag;
        this.changeViewHoveredState();
    }

    Block.prototype.setActiveState = function(flag){
        this.activeState = flag;
        this.changeViewActiveState();
    }

    Block.prototype.changeActiveState = function(){
        this.activeState = !this.activeState;
        this.changeViewActiveState();
    }

    Block.prototype.changeViewHoveredState = function(){
        if(this.hoveredState){
            $(this.node).addClass('hovered');
        }else{
            $(this.node).removeClass('hovered');
        }
    }

    Block.prototype.changeViewActiveState = function(){
        if(this.activeState){
            $(this.node).addClass('active');
        }else{
            $(this.node).removeClass('active');
        }
    }
})();
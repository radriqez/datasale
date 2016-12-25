	function initLibrary(){		
		var $htmlcode="";
		
		$htmlcode+="<div class='tp-library__body'>";

				$htmlcode+="	<div class='tp-library__header'>";
				$htmlcode+="		<div class='tp-library__header-title-wrapper'><div class='tp-library__header-title'>" + (lang=="RU" ? "Библиотека блоков" : "Blocks library") + "</div></div>";
				$htmlcode+="		<div class='tp-library__header-close-wrapper' onclick='javascript:hideLibrary();'><div class='tp-library__header-close'><img src='/tpl/img/page/tp-08-close.svg' class='tp-library__header-close-ico'></div></div>";		
				$htmlcode+="	</div>";

		$.each($types, function(i,f) {
	    	if(is_has_tpls_in_type(f.id)){
	    		if(i>12){$fweight="normal";}else{$fweight="600";}
				$htmlcode+="	<div class='tp-library__type-body' data-library-type-id='"+f.id+"'>";
				$htmlcode+="		<div class='tp-library__type'>";
				$htmlcode+="			<div class='tp-library__type-title-wrapper'><div class='tp-library__type-title' style='font-weight:"+$fweight+";'>"+ (lang=="RU" ? f.title_ru : f.title) + "</div></div>";
				$htmlcode+="			<div class='tp-library__type-icon-wrapper'><div class='tp-library__type-icon-plus'><img src='/tpl/img/page/tp-12-down.svg'></div><div class='tp-library__type-icon-minus'><img src='/tpl/img/page/tp-14-line.svg' style='opacity:0.3;'></div></div>";
				$htmlcode+="		</div>";								
				$htmlcode+="	</div>";												
			}
	    });

				$htmlcode+="<div class='tp-library__tn-spacer-top'>&nbsp;</div>";
				$htmlcode+="<div class='tp-library__tn'><div class='tp-library__tn-leftcol'><div class='tp-library__tn-title'>" + (lang=="RU" ? "Нулевой блок" : "Zero Block") +  "</div><div class='tp-library__tn-descr'>" + (lang=="RU" ? "Создай свой уникальный блок" : "Create your own unique block") +  "</div></div><div class='tp-library__tn-rightcol'><img src='/tpl/img/null/zero1_for_big_size_black.svg' class='tp-library__tn-ico'></div></div>";
				$htmlcode+="<div class='tp-library__tn-spacer-bottom'>&nbsp;</div>";

		$htmlcode+="</div>";
		
		$htmlcode+="<div class='tp-library-rightside'></div>";
			    
		$(".tp-library").html($htmlcode);
		
		
		$htmlcode="";
		$.each($types, function(i,f) {
	    	if(is_has_tpls_in_type(f.id)){
		    	$htmlcode+=getTplsList_for_type(f.id);
			}
	    });
		
		$(".tp-library-rightside").html($htmlcode);		
		
		
		$( ".tp-library__type-body" ).click(function() {
			
			var el=$(this);
			var type=el.attr('data-library-type-id');
			
			$('.tp-library__tpls-list-body').removeClass('tp-library__tpls-list-body_active');
			$('#tplslist'+type).addClass('tp-library__tpls-list-body_active');
			
			$(".tp-library__tpls-list-body_active").css("opacity","0");						

			$(".tp-library").addClass('tp-library_rightsideopened');
			$('.tp-library__type-body').removeClass('tp-library__type-body_active');
			el.addClass('tp-library__type-body_active');
			$(".tp-library-rightside").animate({scrollTop:0}, 0);
			$('.tp-library-rightside').scrollGuard();			
			
			setTimeout(function() { 
			    $(".tp-library__tpls-list-body").css("margin-top","30px");  
			    $(".tp-library__tpls-list-body").animate({"opacity": "1","margin-top": "0px"}, 500,"easeOutCirc",function() {});
			},100);
						
		  
		});		
		
	    $('.tp-library__tpl-icon').mouseover(function() {
		    var bl=$(this);
		    var icon=bl.attr('src');
		    var iconhover=bl.attr('data-src-hover');
		    if(iconhover!=''){
			    bl.attr('src',iconhover);    
			    bl.mouseout(function() {
				    bl.attr('src',icon);
				});
			}    
		});
		
		$('.tp-library__tpl-body').click(function() {
			var tplid = $(this).attr('data-tpl-id');
		    var afterid='';				
			if(window.afterid>0){ afterid=window.afterid; }
			var locked=$(this).attr('data-tpl-locked');
			if(locked=='yes'){
				alertTplDisable('');
			}else{
				addRecord(tplid,afterid);
				hideLibrary();
			}
		});

		$('.tp-library__tpls-list-body-close').click(function() {
			hideLibrary_rightside();
		});
		
		
		$('.tp-library__tn').click(function() {
		    var afterid='';				
			if(window.afterid>0){ afterid=window.afterid; }
				addRecord('396',afterid);
				hideLibrary();
		});		
		
		$('.tp-library__body').scrollGuard();
							    	    	
	}
	
	
	function getTplsList_for_type(type){
		var $htmlcode="";

		$htmlcode+="<div class='tp-library__tpls-list-body' id='tplslist"+type+"' data-tpls-for-type='"+type+"'>";	
		
		$htmlcode+="<div class='tp-library__tpls-list-body-close'><img src='/tpl/img/page/tp-08-close.svg'></div>";	

		var afterid=0;	

		$.each($tpls, function(i,f) {
			if(f.type==type && f.kit==currentkit && f.id!=='396' && f.id!=='421'){
					var opacity = "1";
					var locked="";
					if(f.disableforplan0=="y" && $uplan=="0"){var opacity = "0.5"; var locked="yes";}
					if(f.disableforplan1=="y" && $uplan=="1"){var opacity = "0.5";}					
				
					if(f.icon2!="")f.icon=f.icon2;
					$htmlcode+="<div class='tp-library__tpl-body' data-tpl-id='"+f.id+"' " + (locked=="yes" ? "data-tpl-locked='yes'" : "") + ">";
					$htmlcode+="	<div class='tp-library__tpl-wrapper' style='opacity:"+opacity+"'>";
					$htmlcode+="		<div>";
					$htmlcode+="			<div style=' width:320px; padding-left:10px; padding-right:10px;margin-bottom:10px; text-align:center;'>";
					$htmlcode+="				<img class='tp-library__tpl-icon' src='"+f.icon+"' "+(f.iconhover!="" ? "data-src-hover='"+f.iconhover+"'" : "")+">";
					$htmlcode+="				<div class='tp-library__tpl-bottom-wrapper'>";
					if(f.onlyforadmin=="y"){
					$htmlcode+="					<div class='tp-library__tpl-onlyforadmin-title'>Only for admin</div>";
					}										
					$htmlcode+="					<div class='tp-library__tpl-caption'><span class='tp-library__tpl-cod'>"
					if(locked=='yes'){
					$htmlcode+="						<img class='tp-library__tpl-lock' src='/tpl/img/page/tp-11-lock.svg'>";
					}										
					$htmlcode+=f.cod+"</span>&nbsp;&nbsp;"+"<span class='tp-library__tpl-title'>" + (lang=="RU"&&f.title_ru!=="" ? f.title_ru : f.title) + "&nbsp;&nbsp;</span>" + (lang=="RU"&&f.descr_ru!=="" ? f.descr_ru : f.descr) + "</div>";
					$htmlcode+="				</div>";
					$htmlcode+="			</div>";
					$htmlcode+="		</div>";
					$htmlcode+="	</div>";
					$htmlcode+="</div>";
			}
	    });


		$htmlcode+="</div>";
			    
		return($htmlcode);
	
	}
	
	
	function openLibrary(afterid){
		if(afterid>0){window.afterid=afterid;}else{delete window.afterid;}
	    $("#closelayer").css("height","100%");		
	    $("#closelayer").click(function() {hideLibrary();});
	    $("#mainmenu").finish();
	    $("#mainmenu").css("top","-60px");
	    
	    $(".tp-library").css("opacity","0");	    
	    $(".tp-library").css("left","0px");
	    $(".tp-library").animate({"opacity": "1"}, 400,"easeOutCirc",function() {
	    });
		
		$('.tp-library').addClass('tp-library_opened');
		$(document).keyup(library_keyUpFunc);	
		
		//setTimeout(function() { 
		//    $(".tp-library").animate({"opacity": "1","left": "0px"}, 500,"easeOutCirc",function() {
		//    });			
		//},100);
		
			    	    	
	}
	
	function hideLibrary(){
		$(".tp-library").css("left","-1000px");
		$("#closelayer").css({"height":"1px"});
		$("#mainmenu").stop();
		$("#mainmenu").animate({"opacity": "1","top": "0px"}, 400,"easeOutCirc");	
		delete window.afterid;	
		$(document).unbind("keyup", library_keyUpFunc);
	}	

	function hideLibrary_rightside(){
		$('.tp-library__tpls-list-body').removeClass('tp-library__tpls-list-body_active');
		$(".tp-library").removeClass('tp-library_rightsideopened');
		$('.tp-library__type-body').removeClass('tp-library__type-body_active');
	}	
		
	function library_keyUpFunc(e) {
	    if (e.keyCode == 27) { 
	        hideLibrary();
			e.preventDefault();		    
	        return false;        
	    }
	}	
	
	function is_has_tpls_in_type(type){
		var flag=false;
		$.each($tpls, function(i,f) {
			if(f.type==type){
				flag=true;
			}
	    });		
	    return(flag);
	}
	
		
	function showinfo(str) {
		var data = "";
			
		data += "<div class='alert alert-info alert-dismissable' style='text-align:center;'>";
		data += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
		data += str;
		data += "</div>";
		
		$("#info-alert").html(data);
		
		$("#info-alert").fadeTo(2000, 500).slideUp(500, function(){
		});		
	}
	

	function getshortcuttool(){
		var data = "";

		data += "<div class=\"tp-shortcuttools__container\" id=\"shortcuttools\">";
		data += "	<div class=\"tp-shortcuttools__wrapper\">";
	
		data += "		<div class=\"tp-shortcuttools__star\"><span class=\"glyphicon glyphicon-star\" style=\"color:#ccc;\"></span></div>";				

		data += "		<div class=\"tp-shortcuttools__table\">";

		data += "			<div class=\"tp-shortcuttools__one\">";
		data += "				<div class=\"tp-shortcuttools__one-item\" onclick=\"openLibrary('')\">";
		data += "					<div class=\"tp-shortcuttools__one-item-icon\"><span class=\"glyphicon glyphicon-align-justify\" style=\"color:#fff;\"></span></div>";		
		data += "					<div class=\"tp-shortcuttools__one-item-title\" id=\"tp_btn_allblock\">" + (lang=="RU" ? "Все блоки" : "More blocks") + "</div>";				
		data += "				</div>";
		data += "			</div>";

		data += "			<div class=\"tp-shortcuttools__space\">";
		data += "			</div>";

		data += "			<div class=\"tp-shortcuttools__two\">";		
		data += "            	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('18','')\">" + (lang=="RU" ? "Обложка" : "Cover") + "</div>";
		data += "           	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('33','')\">" + (lang=="RU" ? "Заголовок: средний" : "Medium Title") + "</div>";
		data += "            	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('127','')\">" + (lang=="RU" ? "Лид" : "Lead") + "</div>";            
		data += "            	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('106','')\">" + (lang=="RU" ? "Текст" : "Text") + "</div>";            
		data += "            	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('36','')\">" + (lang=="RU" ? "Фраза" : "Impact") + "</div>";
		data += "            	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('3','')\">" + (lang=="RU" ? "Изображение" : "Image") + "</div>";            
		data += "            	<div class=\"tp-shortcuttools__two-item-title tp-shortcuttools__two-item_right-border\" onclick=\"addRecord('341','')\">" + (lang=="RU" ? "Галерея" : "Gallery") + "</div>";                        
		data += "            	<div class=\"tp-shortcuttools__two-item-title\" onclick=\"addRecord('219','')\">" + (lang=="RU" ? "Линия" : "Line") + "</div>";                     
		data += "			</div>";
		
		data += "			<div class=\"tp-shortcuttools__space\">			</div>";	
		
		data += "			<div class=\"tp-shortcuttools__one tp-shortcuttools__one_white tp-shortcuttools__zero\">";
		data += "				<div class=\"tp-shortcuttools__one-item\" onclick=\"addRecord('396','')\">";
		data += "					<div class=\"tp-shortcuttools__one-item-icon\"><img src='/tpl/img/null/zero1_for_small_size_black.svg'></div>";
		data += "					<div class=\"tp-shortcuttools__one-item-title\">Zero</div>";
		data += "				</div>";
		data += "			</div>";	
		
		data += "		</div>";		
     		      
		data += "	</div>";
		data += "</div>";

		return(data);
	}
	
	
	
	function addEditFieldEvents_new(recordid){
	
		$("#record"+recordid+" [field]").click(editRecordField);
			
		$("#record"+recordid+" [imgfield]").hover(		
		  function() {
		    $( this ).css("opacity",0.7);
		  }, function() {
		    $( this ).css("opacity",1);
		  }
		);
		
	    $("#record"+recordid+" [imgfield], #record"+recordid+" [bgimgfield]").each(function() {
	        var $this = $(this);
	        var elementid = $this.attr('id');
	        
	        var field="";
	        
	        if(typeof $this.attr("imgfield")!=='undefined')field = $this.attr("imgfield");
	        if(typeof $this.attr("bgimgfield")!=='undefined')field = $this.attr("bgimgfield");
	        
	        if (! elementid) {
	            elementid = 'tuwidget'+parseInt(Math.floor(Math.random() * (999999 - 99999 + 1)) + 99999);
	            $this.attr('id', elementid);
	        }
	        
	        TUWidget.init($this).done(function(file){
	            var elem=$('#'+this.elementid);		        
	            if (elem.attr('bgimgfield')) {
	            }
	            elem.trigger('tuwidget_done',file);
	            showLoadIcon();	
		        var d={};
		        d['comm']="saverecord";
		        d['pageid']=$pageid;
		        d['recordid']=recordid;
		        d['onlythisfield']=field;
		        d[field+'-uploadmethod']='tu';
		        d[field+"-tuinfo-uuid"]=file.tuInfo.uuid;
		        d[field+"-tuinfo-cdnurl"]=file.tuInfo.cdnUrl;
		        d[field+"-tuinfo-name"]=file.tuInfo.name;
		        d[field+"-tuinfo-width"]=file.tuInfo.width;	
		        d[field+"-tuinfo-size"]=file.tuInfo.size;
				$.ajax({
				  type: "POST",
				  url: "/page/submit/",
				  data: d,
				  dataType : "text",
				  success: function(data){
				  	  console.log(data);
				  	  hideLoadIcon();
				  	  $('html, body').animate({scrollTop: $("#record"+recordid).offset().top-50+Math.floor((Math.random() * 100) + 1)}, 700);
				  },
				  error: function(){
				  	  hideLoadIcon();					  
				  	  alert('Request timeout (saving image)');					  	  
				  },
				  timeout: 1000*90	  		  				  					  
				});		            
	        });
	
	    });
			
	}
	
	

	function addEditUi (recordid,tplid) {
		var data = "";
		var tpl=[];
		$tpls.forEach(function(item, i, arr) {
			if(item['id']==tplid)tpl=item;
		});

		var tpls_sametype=[];
		$tpls.forEach(function(item, i, arr) {
			if(item['type']==tpl['type'] && item['id']!=='396' && item['id']!=='421')tpls_sametype[tpls_sametype.length]=item;
		});
		
		data = "<div class=\"recordbordertop\"></div>";
		$("#record"+recordid).prepend(data);
		
		
		data = "<div class=\"recordborderbottom\"></div>";
		data += "<div class=\"insertafterrecorbutton\"><center><a href=\"javascript:openLibrary('"+recordid+"');\"><img src=\"/tpl/img/page/tp-08-add.svg\"></a></center></div>";				
		
		$("#record"+recordid).append(data);

		
		data  = "<div class=\"recordediticons mainleft\" id=\"mainleft\">"
		data += " <div class=\"tp-record-edit-icons-left__wrapper\">";
		if(tplid!=='396' && tplid!=='421' && typeof tpl['id']!=='undefined'){
		data += "	<div class=\"tp-record-edit-icons-left__one\">";				  	
		data += "		<div class=\"tp-record-edit-icons-left__item\">";		
		data += "	    	<div type=\"button\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">";
		data += "	      		<div class=\"tp-record-edit-icons-left__item-tplcod\">"+tpl['cod']+"</div>";
		data += "	      		<div class=\"tp-record-edit-icons-left__item-dropicon\"><span class=\"caret\"></span></div>";
		data += "	    	</div>";
		data += "	    	<ul class=\"dropdown-menu\">";
		for(i=0;i<tpls_sametype.length;i++){
		if((tpls_sametype[i]['disableforplan0']=="y" && $uplan=="0") || (tpls_sametype[i]['disableforplan1']=="y" && $uplan=="1")){
		}else{
		data += "				<li><a href=\"javascript:changeRecordTpl('"+recordid+"','"+tpls_sametype[i]['id']+"');\" style=\"color:#000;\" class=\"tp-tplswitch-item\" data-tplinfo-icon=\"" + (tpls_sametype[i]['icon2']!=="" ? tpls_sametype[i]['icon2'] : tpls_sametype[i]['icon']) + "\">" + tpls_sametype[i]['cod'] + ": " + (lang=="RU"&&tpls_sametype[i]['title']!=="" ? tpls_sametype[i]['title_ru'] : tpls_sametype[i]['title']) + "</a></li>";			
		}
		}		
		data += "	    	</ul>";
		data += "		</div>";					
		data += "	</div>";
		}
		
		data += "	<div class=\"tp-record-edit-icons-left__one-right-space\">";				  	
		data += "	</div>";		
		data += "	<div class=\"tp-record-edit-icons-left__two\">";				  	
		data += "		<div class=\"tp-record-edit-icons-left__item\" onclick=\"editRecordSettings('"+recordid+"');\">";		
		data += "			<div class=\"tp-record-edit-icons-left__item-icon\"><span class=\"glyphicon glyphicon-cog\"></span></div>";
		data += "			<div class=\"tp-record-edit-icons-left__item-title\"><span class=\"recordedit_mainleft_but_settings_title\">" + (lang=="RU" ? "Настройки" : "Settings") + "</span></div>";
		data += "		</div>";					
		data += "	</div>";
		data += "	<div class=\"tp-record-edit-icons-left__three\">";				  	
		if(tplid!=='396' && tplid!=='421'){
		data += "		<div class=\"tp-record-edit-icons-left__item\" onclick=\"editRecordContent('"+recordid+"');\">";		
		data += "			<div class=\"tp-record-edit-icons-left__item-icon\"><img src=\"/tpl/img/page/tp-03-edit.svg\"></div>";
		data += "			<div class=\"tp-record-edit-icons-left__item-title\"><span class=\"recordedit_mainleft_but_settings_title\">" + (lang=="RU" ? "Контент" : "Content") + "</span></div>";
		data += "		</div>";					
		}else if(tplid==='421'){
		data += "		<div class=\"tp-record-edit-icons-left__item\" onclick=\"t396_openeditor('"+recordid+"');\">";		
		data += "			<div class=\"tp-record-edit-icons-left__item-icon\"><img src=\"/tpl/img/page/tp-03-edit.svg\"></div>";
		data += "			<div class=\"tp-record-edit-icons-left__item-title\"><span class=\"recordedit_mainleft_but_settings_title\">" + (lang=="RU" ? "Редактировать блок" : "Block Editor") + "</span></div>";
		data += "		</div>";										
		}else{
		data += "		<div class=\"tp-record-edit-icons-left__item\" onclick=\"t396_openeditor('"+recordid+"');\">";		
		data += "			<div class=\"tp-record-edit-icons-left__item-icon\"><img src=\"/tpl/img/page/tp-03-edit.svg\"></div>";
		data += "			<div class=\"tp-record-edit-icons-left__item-title\"><span class=\"recordedit_mainleft_but_settings_title\">" + (lang=="RU" ? "Редактировать блок" : "Block Editor") + "</span></div>";
		data += "		</div>";								
		}
		data += "	</div>";	
		if(tpl['editnotpublish']=='y'){
		data += "	<div class=\"tp-record-edit-icons-left__four\">";				  	
		data += "		<div class=\"tp-record-edit-icons-left__item\" onclick=\"showCornerNotice('"+(lang=="RU" ? "Примечание: Вид данного блока и его поведение в режиме редактирования может отличаться от вида в режиме предпросмотра или публикации." : "Appearance of this block in the editing mode might be different from its appearance on preview and on published page.")+"',8000);\">";		
		data += "			<div class=\"tp-record-edit-icons-left__item-icon\"><span class=\"fa fa-comment\" style=\"color:#ffcf5d;\"></span></div>";
		data += "		</div>";					
		data += "	</div>";				
		}				
		data += " </div>";
		data += "</div>";		
		if(typeof tpl['id']!=='undefined')data += "<div class=\"recordediticons secondleft tp-record-edit-icons-left__item-tpltitle\">" + (lang=="RU"&&tpl['title']!=="" ? tpl['title_ru'] : tpl['title']) + "</div>";		
		$("#record"+recordid).prepend(data);	
			
			
		data = "<div class=\"recordediticons mainright\" id=\"rightbuttons\">";
		
		data += " <div class=\"tp-record-edit-icons-right__wrapper\">";
		data += "	<div class=\"tp-record-edit-icons-right__one\">";				  
		data += "		<div class=\"tp-record-edit-icons-right__items\">";				  		
		data += "			<div class=\"tp-record-edit-icons-right__item-icon tp-record-edit-icons-right__item-icon_right-border\" onclick=\"dublicateRecord('"+recordid+"');\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Duplicate\" ><img src=\"/tpl/img/page/tp-04-duplicate.svg\"></div>";
		data += "			<div class=\"tp-record-edit-icons-right__item-icon tp-record-edit-icons-right__item-icon_right-border\" onclick=\"delRecord('"+recordid+"');\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"><img src=\"/tpl/img/page/tp-05-delete-3.svg\"></div>";
		data += "			<div class=\"tp-record-edit-icons-right__item-icon tp-record-edit-icons-right__item-icon_right-border \" onclick=\"offRecord('"+recordid+"');\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Hide\"><img src=\"/tpl/img/page/tp-05-off.svg\"></div>";
		data += "			<div type=\"button\" class=\"tp-record-edit-icons-right__item-icon dropdown-toggle\" style=\"padding-top:2px; padding-right:3px;width:24px;\" data-toggle=\"dropdown\"><span class=\"caret\"></span></div>";
		data += "			<ul class=\"dropdown-menu\">";
		data += "				<li><a href=\"javascript:record_buf_cut('"+recordid+"');\" style=\"padding-left:0px;color:#000;\">" + (lang=="RU" ? "Вырезать" : "Cut") + "</a></li>";
		data += "				<li><a href=\"javascript:record_buf_copy('"+recordid+"');\" style=\"padding-left:0px;color:#000;\">" + (lang=="RU" ? "Копировать" : "Copy") + "</a></li>";
		data += "				<li><a href=\"javascript:record_buf_paste('"+recordid+"');\" style=\"padding-left:0px;color:#000;\">" + (lang=="RU" ? "Вставить" : "Paste") + "</a></li>";
		data += "				<li><a href=\"javascript:selectModeOn('"+recordid+"');\" style=\"padding-left:0px;color:#000;\">" + (lang=="RU" ? "Выделить" : "Select") + "</a></li>";		
		data += "			</ul>";		
		data += "		</div>";							
		data += "	</div>";
		data += "	<div class=\"tp-record-edit-icons-right__one-right-space\">";				  	
		data += "	</div>";							
		data += "	<div class=\"tp-record-edit-icons-right__two\">";
		data += "		<div class=\"tp-record-edit-icons-right__items\">";				  						
		data += "			<div class=\"tp-record-edit-icons-right__item-icon btn-sort-draganddrop\" onclick=\"showCornerNotice('" + (lang=="RU" ? "Перетащите, чтобы изменить позицию блока (Drag and drop)" : "Drag and Drop any block to change their position") + "');\" id=\"sorthandle\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Order\"><span class=\"glyphicon glyphicon-sort\"></span></div>";			
		data += "			<div class=\"tp-record-edit-icons-right__item-icon btn-sort-recup\" onclick=\"upRecord('"+recordid+"');\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Order up\"><span class=\"glyphicon glyphicon-arrow-up\"></span></div>";					
		data += "			<div class=\"tp-record-edit-icons-right__item-icon btn-sort-recdown\" onclick=\"downRecord('"+recordid+"');\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Order down\"><span class=\"glyphicon glyphicon-arrow-down\"></span></div>";							
		data += "		</div>";		
		data += "	</div>";			
		data += " </div>";
		
		data += "</div>";		
		
		$("#record"+recordid).prepend(data);	
		
		$("#record"+recordid).mouseover(function() {
			$mouseoverrecodid=$(this).attr('recordid');
		});
		
		if($("#record"+recordid).attr("off")=="y"){
			minifyRecord(recordid);
		}
		
		bordersdragmodeon();		
		
		if($("#record"+recordid).height()<1){
			$("#record"+recordid).css('min-height','100px');
		}
		
	}

	function addEditUiDel (recordid) {
		var data = "";		

		data = "<div class=\"recordbordertop\"></div>";
		$("#record"+recordid).prepend(data);
		
		
		data = "<div class=\"recordborderbottom\"></div>";		
		$("#record"+recordid).append(data);
			
			
		data = "<div class=\"recordediticons mainright\" id=\"rightbuttons\">";
		
		data += " <div class=\"tp-record-edit-icons-right__wrapper\">";
		data += "	<div class=\"tp-record-edit-icons-right__one\">";				  
		data += "		<div class=\"tp-record-edit-icons-right__items\">";				  		
		data += "			<div class=\"tp-record-edit-icons-right__item-icon tp-record-edit-icons-right__item-icon_right-border\" onclick=\"delRecord('"+recordid+"');\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"><img src=\"/tpl/img/page/tp-05-delete-3.svg\"></div>";
		data += "		</div>";							
		data += "	</div>";
		data += " </div>";
		
		data += "</div>";		
		
		$("#record"+recordid).prepend(data);	
		
		$("#record"+recordid).mouseover(function() {
			$mouseoverrecodid=$(this).attr('recordid');
		});
		
		if($("#record"+recordid).attr("off")=="y"){
			$("#record"+recordid).css("opacity","0.4");
		}
		
		bordersdragmodeon();		
		
		if($("#record"+recordid).height()<1){
			$("#record"+recordid).css('min-height','100px');
		}
		
	}
	

	
	function alertTplDisable(flag){
		if(flag=="flag1")alert("This block is only available on Business plan. Please upgrade your subscription or activate trial period.");
		
		if(flag==""){
			var txt="Sorry, but this block is available on paid plans only.";
			var txt_ru="К сожалению, этот блок доступен только на платных аккаунтах.";
			var htmldata="<center><div style='padding:80px; font-size:20px;'><img src='https://static.tildacdn.com/6890b245-1402-4b7d-8379-ce30189779fb/ic2.jpg' width='200px'><br><br>"+(lang=="RU" ? txt_ru : txt)+"<br><br><a class='btn btn-default btn-lg' role='button' href='/identity/plan/' style='margin-right:10px;' data-dismiss='modal'>"+(lang=="RU" ? "Закрыть" : "Close")+"</a><a class='btn btn-primary btn-lg' role='button' href='/identity/plan/' style=''>"+(lang=="RU" ? "Активировать пробный период" : "Plans and Billing")+"</a></div></center>";
			$('#myModal').modal('show');
			$('#myModalContent').html(htmldata);
		}

	}
	
	function showHelpVideo(where){
		var data="<center><iframe width='820' height='492' style='paddong-top:20px; padding-bottom:20px;' src='//www.youtube.com/embed/tK2CzTov-5A?rel=0&autoplay=1' frameborder='0' allowfullscreen></iframe></center>";	
		if(where=="popup"){
			$('.onboardingpin').css('display','none');
			var htmldata="<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>"+(lang=="RU" ? "Посмотрите короткий ролик как редактировать страницу" : "See short video how to edit page")+"</h4></div><div id='myModalBody'><br>"+data+"</div>";
			$('#myHelpModal').modal('show');
			$('#myHelpModal .modal-dialog').css("width","860px");
			$('#myHelpModalContent').html(htmldata);
			$('#myHelpModal').on('hidden.bs.modal', function () {
			  $('#myHelpModalContent').html("");
			  $('.onboardingpin').css('display','block');
			})
		}else{
			$('#helpvideoplace').html(data);			
		}
	}

	function showEditRecordSettingsForm(data){
		showEditForm();
		
		var $htmlcode="";
		
		$htmlcode+=data;
			    
		$("#editforms").html($htmlcode);		
	}

	function showEditRecordContentForm(data){
		showEditFormXL();
		
		var $htmlcode="";
		
		$htmlcode+=data;
			    
		$("#editformsxl").html($htmlcode);		
	}

	function redactor_showTextSyle(cur){
		var content=cur.$editor;
		var y=$(content).has('div').is("div");
		if(y==true){
			content=content.children();
		}
		var fs=parseInt(content.css("font-size"));
		var lh=parseInt(content.css("line-height"));
		var ff=content.css("font-family").replace(', serif','').replace(', sans-serif','').replace("'",'').replace("'",'');
		var str=fs+"px, "+ff;
		var p=$("#for_redactor_toolbar").find(".redactor-toolbar");
		$("#rightfontinfo").remove();
		p.after('<div id="rightfontinfo" style="position:absolute; z-index:2060;top:0px;right:20px; height:50px; line-height:50px; font-size:11px; opacity:0.7;">'+str+'</div>');			
		
		$(".redactor-dropdown-box-setfontsize").children().each(function( index ) {
			if($(this).text()==(fs+"px")){
				$(this).css("background-color","#eeeeee");
				$(this).parent().animate({scrollTop: $(this).position().top-85}, 400);
			}else{
				$(this).css("background-color","");
			}
		});
		
		$(".redactor-dropdown-box-setfontfamily").children().each(function( index ) {
			if($(this).text()==(ff)){
				$(this).css("background-color","#eeeeee");
			}else{
				$(this).css("background-color","");
			}
		});

		$(".redactor-dropdown-box-setlineheight").children().each(function( index ) {
			if($(this).text().replace('px','')<=lh && $(this).next().text().replace('px','')>lh){
				$(this).css("background-color","#eeeeee");
				$(this).parent().animate({scrollTop: $(this).position().top-85}, 400);				
			}else{
				$(this).css("background-color","");
			}
		});
		
	}

	function getAttrStrintoArr(str){
	   if(str=="" || str==undefined || str==false)return('');
	   var stylestemp = str.split(';');
	   var styles = {};
	   var c = '';
	   for (var x = 0, l = stylestemp.length; x < l; x++) {
	     c = stylestemp[x].split(':');
	     styles[$.trim(c[0])] = $.trim(c[1]);
	   }
	   return(styles);

	}
	
	
	function drawguides(){
		if($("#guides").length)$("#guides").remove();
		
		$("body").append('<div id="guides"></div>');
		
		var g=$('#guides');
		var ww=$(window).width();
	
		var offset_left=parseInt((ww-1200)/2);
		var col_space=20;
		var col_width=100;
		
		if(ww<1200){
			offset_left=parseInt((ww-960)/2);
			col_width=80;
			col_space=10;
		}
		
		if(ww>=960){
			for(i=0;i<13;i++){
				var x1=(i*col_width)+offset_left-col_space;
				var x2=(i*col_width)+offset_left+col_space;
				var n=i+1;
				if(i!=0)g.append('<div id="guides_line_l_'+i+'" style="position:fixed; top:0px; left:'+x1+'px; height:100vh; background-color:blue; width:1px; opacity:0.3;"></div>');
				if(i!=12)g.append('<div id="guides_line_r_'+i+'" style="position:fixed; top:0px; left:'+x2+'px; height:100vh; background-color:blue; width:1px; opacity:0.3;"></div>');
				if(i!=12)g.append('<div id="guides_text_r_'+i+'" style="position:fixed; top:60px; left:'+x2+'px; height:100vh; color:blue; opacity:0.3; margin-left:5px;">'+n+'</div>');				
			}
		}
	
		if(ww<960){
				var x=parseInt(ww/2);
				g.append('<div id="guides_line_l" style="position:fixed; top:0px; left:'+x+'px; height:100vh; background-color:blue; width:1px; opacity:0.1;"></div>');
		}
			
		var doit;
		$(window).resize(function() {
			if($("#guides").length){
				clearTimeout(doit);
				doit = setTimeout(drawguides, 300);
			}
		});
	}
	
	function showguides(){
		if($("#guides").length){
			$("#guides").remove();
			$("#guidesmenubutton").css("display","none");
		}else{
			drawguides();
			$("#guidesmenubutton").css("display","block");			
		}
	}	
	
	function showpublishpopup() {
		var data = "";
			
		data += "<div id='loadingcenter' style='margin:30px; font-size:14px; text-align:center;'>";
		data += "<br><br>";
		data += "<img src='/tpl/img/ajax-loader.gif'>";
		data += "<br><br>";
		data += ""+(lang=="RU" ? "Пожалуйста подождите" : "Please wait")+"";
		data += "<br><br><br>";
		data += "</div>";
		

		$('#myModal').modal('show');
		$('#myModalContent').html(data);

		return(data);					
	}	
	
	
	

	function record_buf_cut(recordid){	
		if(recordid>0){	
		  	showLoadIcon();	
			$.ajax({
			  type: "POST",
			  url: "/page/submit/",
			  data: {comm: "cutrecord_tobuf", pageid:$pageid, recordid:recordid},
			  dataType : "text",
			  success: function(data){
			  	    hideLoadIcon();
					$(".record[data-cuted=yes]").css('opacity','');
					$(".record").removeAttr("data-cuted");
					$("#record"+recordid).css('opacity','0.5');
					$("#record"+recordid).attr('data-cuted','yes');
					showCornerNotice(""+(lang=="RU" ? "Блок скопирован в буфер" : "The block are copied to the clipboard")+"",3000);
			  },
			  error: function(){
			  	  hideLoadIcon();					  
			  	  alert('Request timeout (block cutting to buffer)');					  	  
			  },
			  timeout: 1000*90				  
			});
		}
	}
	
	function record_buf_copy(recordid){
		if(recordid>0){	
		  	showLoadIcon();	
			$.ajax({
			  type: "POST",
			  url: "/page/submit/",
			  data: {comm: "copyrecord_tobuf", pageid:$pageid, recordid:recordid},
			  dataType : "text",
			  success: function(data){
			  	    hideLoadIcon();
					$(".record[data-cuted=yes]").css('opacity','');
					$(".record").removeAttr("data-cuted");		  	    
					if(data!==""){
						console.log(data);
					}
			  },
			  error: function(){
			  	  hideLoadIcon();					  
			  	  alert('Request timeout (block coping to buffer)');					  	  
			  },
			  timeout: 1000*90				  
			});
		}
	}
	
	function selected_records_buf_copy(){
		var selectsarr = Array();
        $( ".record_selected", "#allrecords" ).each(function() {
	        selectsarr.push($(this).attr('id').replace('record', ''));
        });

		if(selectsarr.length>0){	
		  	showLoadIcon();	
			$.ajax({
			  type: "POST",
			  url: "/page/submit/",
			  data: {comm: "copyselectedrecords_tobuf", pageid:$pageid, selects: selectsarr},
			  dataType : "text",
			  success: function(data){
			  	  hideLoadIcon();		  
			  	  //hideSelectButtons();
			  	  console.log(data);
			  	  //location.reload();			  	    
			  	  //alert('Selected blocks copied to buffer. Exit from select mode and click Paste on record control.');
			  	  showCornerNotice(""+(lang=="RU" ? "Блоки скопированы в буфер. <b>Используйте кнопку вставить</b>" : "Blocks copied to the clipboard")+"",4000);	
			  	  window.somerecordsinbuffer='yes';
			  	  updateSelectModeButtons();
			  },
			  error: function(){
			  	  hideLoadIcon();					  
			  	  alert('Request timeout (coping blocks to buffer)');					  	  
			  },
			  timeout: 1000*90
			});
		}
	}	
	
	function record_buf_paste(recordid){
		//recordid - this is previous record, after whom need paste
	  	showLoadIcon();  	
		$.ajax({
		  type: "POST",
		  url: "/page/submit/",
		  data: {comm: "pasterecord_frombuf", pageid:$pageid, recordid:recordid},
		  dataType : "text",
		  success: function(data){
		  	    hideLoadIcon();
		  	    if(data!==""){
		  	    	if(data=="no data in buffer"){
			  	    		alert(""+(lang=="RU" ? "В буфере пусто" : "Nothing to paste")+"");
		  	    	}else{
							$("#record"+recordid).after(data);
							//console.log(data);
							
							var newreccid=$(data).attr('id');
							$("#"+newreccid).css('opacity','0');
							$("#"+newreccid).animate({"opacity": "1"}, 700,"easeInCirc");
			
							$('html, body').animate({scrollTop: $("#"+newreccid).offset().top-100}, 700);
							
							updateUndoButton();
							window.blockList.rebuildList();
							
							//del record in cutting buf
							showLoadIcon(); 
							$.ajax({
							  type: "POST",
							  url: "/page/submit/",
							  data: {comm: "delrecord_incutbuf", pageid:$pageid},
							  dataType : "text",
							  success: function(delrecid){
							  	    hideLoadIcon();		  	    
							  	    if(delrecid>0){
							              var block = $("#record"+delrecid),v;
							              if(v = document.body.querySelector('#record' + delrecid + ' video')){
							                  window.videoLoadProcessor.unergisterVideo(v);
							              }
							              block.remove();
										  //block.slideUp( "fast", function() {
										  //	  block.remove();
										  //});		  	  
									  	  updateUndoButton();
							              window.blockList.rebuildList();
							              $('html, body').stop();					  	    
										  $('html, body').animate({scrollTop: $("#"+newreccid).offset().top-100}, 700);
						        	}
							  }
							});
							//end del
					}
	        	}
		  }
		});						  	
	}
	
	function showformEditProjectSettings(projectid,tabname){	
	  	showLoadIcon();			
		$.ajax({
		  type: "POST",
		  url: "/projects/submit/",
		  data: {comm: "editprojectsettings", projectid: projectid},
		  dataType : "text",
		  success: function(data){
		  	    hideLoadIcon();				  
		  	    $('#myModal').modal('show');
		  	    $('#myModalContent').html(data);
		  	    if(tabname)$('#myModal #myTabProjectSettings a[href="#'+tabname+'"]').tab('show');
		  }
		});
	}

	function showformEditProjectSettings_new(projectid,tabname){
		if(tabname){}else{tabname='';}	
		var gourl="https://tilda.cc/projects/settings/?projectid="+projectid;
		if(tabname){gourl+="#tab="+tabname;}
		window.location.href = gourl;
	}	
	
	function selectModeOn(recordid){
		hideSortButtons();
		showSelectButtons();
		updateSelectModeButtons();
		hideEditRecordsButtons();
		
		$("[field]").off();
		$("[imgfield]").off();
		
		$(".record").click(function() {
			$(this).toggleClass("record_selected");
			$(this).toggleClass("active");
			updateSelectModeButtons();
		});
		
		if(typeof recordid !== 'undefined'){
			$("#record"+recordid).toggleClass("record_selected");
			$("#record"+recordid).toggleClass("active");
			updateSelectModeButtons();		
		}
		
		showCornerNotice(""+(lang=="RU" ? "Режим работы с группой блоков: <b>кликните на блок, чтобы его выделить.</b>" : "Group operation mode: <b>click block to select.</b>")+"",5000);				
	}

	function deleteRecordsSelected(){
		var selectsarr = Array();
        $( ".record_selected", "#allrecords" ).each(function() {
	        selectsarr.push($(this).attr('id').replace('record', ''));
        });
	
 	    showLoadIcon();	
		$.ajax({
		  type: "POST",
		  url: "/page/submit/",
		  data: {comm: "deleterecordsselected", pageid: $pageid, selects: selectsarr},
		  dataType : "text",
		  success: function(data){
		  	  hideLoadIcon();  	  
		  	  for (var i = 0; i < selectsarr.length; i++) {
			  	  var recordid=selectsarr[i];
	              var block = $("#record"+recordid),v;
	              if(v = document.body.querySelector('#record' + recordid + ' video')){
	                  window.videoLoadProcessor.unergisterVideo(v);
	              }
				  block.slideUp( "fast", function() {
				  	  block.remove();
				  });		  	  			  	  
			  }
			  $(".record").removeClass("record_selected");
			  
		  	  updateSelectModeButtons();			  
		  	  updateUndoButton();
              window.blockList.rebuildList();
              if(data!="")console.log(data);
			  
		  }
		});		
	}	

	function cancelSelect(){
	  	hideSelectButtons();	
	  	location.reload();  	
	}
	
	function showSelectButtons(){
		$('#saveselectbuttons').css({"display":"block"});	
		$('.record').css('cursor' , 'pointer');
						
		$('body').append("<div id='select_records_toolbar'><div class='select_records_toolbar__left'>"+(lang=="RU" ? "Режим работы с группой блоков: <b>кликните на блок, чтобы его выделить.</b>" : "Group operation mode: <b>click block to select.</b>")+"</div><div class='select_records_toolbar__right'><a href='javascript:cancelSelect();'>"+(lang=="RU" ? "Вернуться к редактированию" : "Back to editing</a>")+"</a></div></div>");
		$("#mainmenu").animate({"opacity": "0","top": "-50px"}, 400,"easeInCirc", function() {
			$("#select_records_toolbar").animate({"opacity": "1","top": "0px"}, 300,"easeOutCirc");
    	});		
	}

	function hideSelectButtons(){
		$('.record').css('cursor' , 'auto');	
		$('#saveselectbuttons').css({"display":"none"});	
	}
	
	
	function hideEditRecordsButtons(){
		$('.record').off('hover');
		$('.recordediticons').css('display','none');
		$('.recordediticons').css('display','none');
		$('.recordbordertop').css('display','none');		
		$('.recordborderbottom').css('display','none');
		$('.insertafterrecorbutton').css('display','none');
		$('#shortcuttooldiv').css('display','none');
		$('#dragsingleimagescont').css('display','none');		
	}
	
	function updateSelectModeButtons(){
		var selectsarr = Array();
        $( ".record_selected", "#allrecords" ).each(function() {
	        selectsarr.push($(this).attr('id').replace('record', ''));
        });

		if(selectsarr.length>0){
			$('#selectmodebtn-move').css('display','inline-block');
			$('#selectmodebtn-del').css('display','inline-block');			
			$('#selectmodebtn-copy').css('display','inline-block');
		}else{		
			$('#selectmodebtn-move').css('display','none');
			$('#selectmodebtn-del').css('display','none');			
			$('#selectmodebtn-copy').css('display','none');
		}		
		
		if(typeof window.somerecordsinbuffer !== 'undefined'){
			$('#selectmodebtn-paste').css('display','inline-block');
		}else{
			$('#selectmodebtn-paste').css('display','none');			
		}
	}
	
	function selected_records_movemodeon(){
		window.selectsarr = Array();
        $( ".record_selected", "#allrecords" ).each(function() {
	        window.selectsarr.push($(this).attr('id').replace('record', ''));
        });
        
  	    for (var i = 0; i < selectsarr.length; i++) {
	  	    var recordid=selectsarr[i];
	  	    $("#record"+recordid).css('opacity','0.15');
	  	}
                
		$('.record').removeClass('record_selected');
		$(".record").off('click');
		updateSelectModeButtons();
		
		//$('.record').css('cursor','default');
        $( ".record", "#allrecords" ).each(function() {
          var recordid=$(this).attr('id').replace('record', '');
		  data = "<div class=\"recordborderbottom\"></div>";
		  data += "<div class=\"insertafterrecorbutton\"><center><a href=\"javascript:moveSelectedRecords('"+recordid+"');\"><span class=\"glyphicon glyphicon-plus-sign\" style=\"color:#000; width:20px; height:20px;\"></span></a></center></div>";				
		  $(this).append( "<div class='moveplacer'>"+data+"</div>" );		  
        });
		
		$(".record").mouseover(function() {
		  $('.moveplacer').css('display','none');
		  $(this).find('.moveplacer').css('display','block');		  
		});
		$(".record").click(function() {
			var recordid=$(this).attr('id').replace('record', '');
			moveSelectedRecords(recordid);
		});		
		
		showCornerNotice(""+(lang=="RU" ? "Кликните в тот блок, после которого вы хотите поставить выбранные блоки." : "Click the block after which you want to put the selected blocks.")+"",8000);
	}
	
	function moveSelectedRecords(recordid){
		if(window.selectsarr.length>0){	
		  	showLoadIcon();	
			$.ajax({
			  type: "POST",
			  url: "/page/submit/",
			  data: {comm: "moveselectedrecords", pageid:$pageid, recordid:recordid, selects:window.selectsarr},
			  dataType : "text",
			  success: function(data){
			  	  hideLoadIcon();		  
			  	  console.log(data);
			  	  window.location.href='https://tilda.cc/page/?pageid='+$pageid+'#scrolltorecord='+window.selectsarr[0];
			  	  window.location.reload(true);
			  }
			});
		}			
	}
	
	function showCornerNotice(text,delay){
		if(typeof delay === 'undefined'){
			delay=6000;
		}
		$('body').append("<div class='cornernotice'><div class='cornernotice__text'>"+text+"</div></div>");
		$(".cornernotice").animate({"opacity": "100","right": "20px"}, 400,"easeInCirc", function() {
			setTimeout(function(){		
				$(".cornernotice").animate({"opacity": "0","right": "0px"}, 300,"easeOutCirc", function() {
					$(this).remove();
				});
			}, delay);				  
    	});				
	}
	
	$( document ).ready(function() {
		var gohash = location.hash.replace('#scrolltorecord=','');
		if(gohash && gohash>0){
			var recordid=parseInt(gohash, 10);
			if(recordid > 0 && $('#record'+recordid).length > 0){
		        $('html, body').animate({ scrollTop: $('#record'+recordid).offset().top-100}, 700);
				history.replaceState( {} , 'Tilda:', 'https://tilda.cc/page/?pageid='+$pageid );
			}
		}		
	});		
	
	function selected_records_pastemodeon(){        
		$('.record').removeClass('record_selected');
		$('.record').removeClass('active');
		$(".record").off('click');
		delete window.somerecordsinbuffer;
		updateSelectModeButtons();
		
        $( ".record", "#allrecords" ).each(function() {
          var recordid=$(this).attr('id').replace('record', '');
		  data = "<div class=\"recordborderbottom\"></div>";
		  data += "<div class=\"insertafterrecorbutton\"><center><a href=\"javascript:pasteSelectedRecords('"+recordid+"');\"><span class=\"glyphicon glyphicon-plus-sign\" style=\"color:#000; width:20px; height:20px;\"></span></a></center></div>";				
		  $(this).append( "<div class='moveplacer'>"+data+"</div>" );		  
        });
		
		$(".record").mouseover(function() {
		  $('.moveplacer').css('display','none');
		  $(this).find('.moveplacer').css('display','block');		  
		});
		$(".record").click(function() {
			var recordid=$(this).attr('id').replace('record', '');
			pasteSelectedRecords(recordid);
		});		
		
		showCornerNotice(""+(lang=="RU" ? "Кликните в тот блок, после которого вы хотите вставить блоки из буфера." : "Click the block after which you want to insert blocks from the clipboard.")+"",8000);		
	}
	
	function pasteSelectedRecords(recordid){
	  	showLoadIcon();	
	  	if(window.prevent_dubble_PasteCall=='y')return;
	  	window.prevent_dubble_PasteCall='y';
	  	
		$.ajax({
		  type: "POST",
		  url: "/page/submit/",
		  data: {comm: "pasterecord_frombuf", pageid:$pageid, recordid:recordid},
		  dataType : "text",
		  success: function(data){
		  	    hideLoadIcon();
		  	    if(data!==""){
				  	console.log(data);			  	    
		  	    	if(data=="no data in buffer"){
		  	    		alert('Nothing to Paste');
		  	    	}else{
						$("#record"+recordid).after(data);
						var newreccid=$(data).attr('id').replace('record', '');
						$('html, body').animate({scrollTop: $("#record"+newreccid).offset().top-100}, 700);
					  	window.location.href='https://tilda.cc/page/?pageid='+$pageid+'#scrolltorecord='+newreccid;
					  	window.location.reload(true);			  	    		        							
					}
		  	    }		  	    
			  	window.location.reload(true);
			  	//console.log('--pasted records');
		  }
		});		
	}	
	
	function stick_div_to_mouse(divname){
		if ( typeof $xp === 'undefined') {
			$mouseX = 0, $mouseY = 0;
			$xp = 350, $yp = 100;
		}
		
		$(document).mousemove(function(e){
		    $mouseX = e.pageX;
		    $mouseY = e.pageY;    
		});
				
		window.stickloop = setInterval(function(){
			//$xp += (($mouseX+100 - $xp)/12);
			$yp += (($mouseY-40 - $yp)/12);
			$(divname).css({left:$xp +'px', top:$yp +'px'});
		}, 30);		
	}
	
	function addEditOnReady(recordid){
		$("#record"+recordid).find(".tp-tplswitch-item").hover(
			function() {
				var icon=$(this).attr('data-tplinfo-icon');
				if ( $( ".tp-tplswitch-item__icon" ).length === 0 ) {				
			    	$('body').append( $( "<div class=\"tp-tplswitch-item__icon\"><img src=\""+icon+"\"></div>" ) );
					stick_div_to_mouse(".tp-tplswitch-item__icon");
				}else{
					$('.tp-tplswitch-item__icon').find('img').attr('src',icon);
				}
			    window.clearInterval(window.stickloopclose);
			  }, function() {
				window.stickloopclose = setTimeout(function(){
				    window.clearInterval(window.stickloop);
				    $('.tp-tplswitch-item__icon').remove();					
				}, 30);						  
			}					
		);
		$("#record"+recordid).find(".tp-tplswitch-item").click( function() {
		    window.clearInterval(window.stickloop);
		    $('.tp-tplswitch-item__icon').remove();					
		});
	}
	
	
	//вызываем, там где нужен редактор картинок
	function aviaryOnReady(callbackAviaryFunc)
	{
		// если редактор не загружен, то загружаем его
		if (! window.featherEditor) {
			/* загрузка библиотеки графического редактора (zoom, crop, effect,...) */
			var scriptAviary = document.createElement('script');
			scriptAviary.src = "https://dme0ih8comzn4.cloudfront.net/imaging/v3/editor.js";
			//"https://dme0ih8comzn4.cloudfront.net/imaging/v2/editor.js";
			document.documentElement.appendChild(scriptAviary);
			
			scriptAviary.onload = scriptAviary.onerror = function() {
			  if (!this.executed) { // выполнится только один раз
				this.executed = true;
				afterAviaryLoad(callbackAviaryFunc);
			  }
			};
			
			scriptAviary.onreadystatechange = function() {
			  var self = this;
			  if (this.readyState == "complete" || this.readyState == "loaded") {
				setTimeout(function() {
				  self.onload()
				}, 0); // сохранить "this" для onload
			  }
			};
		} else {
			//если загружен, то запускаем переданную функцию
			callbackAviaryFunc();
		}
	}
	
	// функция инициализирует редактор изображений
	function afterAviaryLoad(callbackAviaryFunc)
	{
		window.featherEditor = new Aviary.Feather({
			apiKey: 'eaa27e89c3ba4fc1baf7685ae220613e',
			theme: 'dark', // Check out our new 'light' and 'dark' themes!
			tools: 'all', //'effects,orientation,resize,crop,color,draw,text,colorsplash,sharpness,stickers',
			appendTo: '',
			maxSize: 1680,
			onLoad: function() {
				callbackAviaryFunc();
			},
			/* эту функцию нужно перегружать нужными значениями делая вызов launc({})*/
			onSave: function(imageID, newURL) {
				var img = document.getElementById(imageID);
				img.src = newURL;
				return window.featherEditor.close();
			},
			onError: function(errorObj) {
				alert(errorObj.message);
			}
		});
	}

	// удаление картинки
	function recdelimgitem(imageitemid) {
		$(document).ready(function(){
			var $box = $('#'+imageitemid).closest('.js-image-box');
			$box.find(".js-img-div").remove();
			$box.find(".js-img-del").val("yes");
		});
	}
	
	//редактирование картинки - вызывает редактор изображений
	function receditimgitem(recid, imageitemid){
		$(document).ready(function(){

			aviaryOnReady(function(){
				var src = $('#'+imageitemid).attr('src');
				if (src.indexOf('ucarecdn')>0 || src.indexOf('tildacdn.info')>0) {
					var pos = src.lastIndexOf('/');
					if(pos != src.length-1) {
						src = src.substring(0,pos+1);
					}
				} else if (src.substring(0,1) == '/') {
					src = 'https://tilda.cc' + src;
				}

				window.featherEditor.launch({
					image: imageitemid,
					url: src,
					onLoad: function(){ alert('loadd'); },
					onSave: function(imageID, newURL) {
						var img = document.getElementById(imageID);
						img.src = newURL;

						var $box = $('#'+imageitemid).closest('.js-image-box');
						$box.find('.js-img-file').val(newURL);
						$box.find('.js-img-name').val('');
						var title = newURL.substring(newURL.length-30);
						$box.find('.js-img-title').attr('href', newURL).html('...'+title);

						var size = window.featherEditor.getImageDimensions();
						if( size && size.width){
							$box.find('js-img-width').val(size.width);
						}
						return window.featherEditor.close();
					}
				});

			});
			
		});
	}
	
	//редактирование картинки через Aviary - вызывает редактор изображений
	//для uploadcare - функция называется receditimgitem
	function aviary_editimg(recid, imageitemid){
		$(document).ready(function(){
	
			aviaryOnReady(function(){
				var src = $('#'+imageitemid).attr('src');
				if (src.indexOf('ucarecdn')>0 || src.indexOf('tildacdn.info')>0) {
					var pos = src.lastIndexOf('/');
					if(pos != src.length-1) {
						src = src.substring(0,pos+1);
					}
				} else if (src.substring(0,1) == '/') {
					src = 'https://tilda.cc' + src;
				}
	
				window.featherEditor.launch({
					image: imageitemid,
					url: src,
					onLoad: function(){ alert('loadd'); },
					onSave: function(imageID, newURL) {
						var img = document.getElementById(imageID);
						img.src = newURL;
	
						var $box = $('#'+imageitemid).closest('.js-image-box');
						$box.find('.js-img-cdnurl').val(newURL);
						$box.find('.js-img-uuid').val('');
						$box.find('.js-img-name').val('');
						$box.find('.js-img-size').val('');
						$box.find('.js-img-width').val('');
						$box.find('.js-img-height').val('');
						var title = newURL.substring(newURL.length-30);
						$box.find('.js-img-title').attr('href', newURL).html('...'+title);
	
						var size = window.featherEditor.getImageDimensions();
						if( size && size.width){
							$box.find('js-img-width').val(size.width);
						}
						return window.featherEditor.close();
					}
				});
	
			});
			
		});
	}	
	
	// удаление картинки
	function recshowmoreimgitem(imageitemid) {
		$(document).ready(function(){
			var $box = $('#'+imageitemid);
			var vis=$box.css('display');
			if(vis=='block'){
				$box.css('display','none');				
			}else{
				$box.css('display','block');				
			}
		});
	}
	
	function UploadCarefileTypeLimit(types) {
		types = types.split(' ');
		return function(fileInfo) {
			if (fileInfo.name === null) {
			  return;
			}
			var extension = fileInfo.name.split('.').pop();
			extension = extension.toLowerCase();
			if (types.indexOf(extension) == -1) {
				throw new Error("fileType");
			}
		};
	}
	
	function showhideEditButtonInFieldContent(imgrecid, newURL) {
		var $box = $(imgrecid).closest('.js-image-box');
		var title = newURL.substring(newURL.length-30);
		$box.find('.js-img-title').attr('href', newURL).html('...'+title);
		if (title.substring(title.length-4)==".svg") {
			$box.find('.js-edit-img').css('opacity','0');
		} else {
			$box.find('.js-edit-img').css('opacity','1');
		}
		
	}
	
	
	function openImageSearchPopup(imgid) {
		
		$(document).ready(function(self){
			showLoadIcon();
			var $initlink = $('#'+imgid).closest('.js-image-box').find('a[data-imagesearch-type]');
			var type = $initlink && $initlink.data('imagesearch-type') ? $initlink.data('imagesearch-type') : '';
			$.ajax({
				type: "POST",
				url: "/projects/submit/searchimages/",
				data: {'imgid':imgid, 'imgcallback':'insertImageFromSearch', 'imgtype':type},
				dataType : "text",
				success: function(data){
					hideLoadIcon();
					showpopup('#popup_searchandselectimages',data);
					init_popup();
				},
				error: function(){
					alert('Request Timeout');
					location.reload();
				},
				timeout: 1000*30
			});
		}(this));
	}

	
	function insertImageFromSearch(imgid, url) {
		var uploadid;
		try {
			if(imgid.substring(imgid.length-5)=='imgid') {
				uploadid = imgid.substring(3,imgid.length-5);
				uploadid = uploadid + 'img';
			} else {
				uploadid = imgid.substring(3,imgid.length-6)+imgid.substring(imgid.length-6,imgid.length-2);
			}
			$('#'+imgid).attr('src', url);
			var $box = $('#'+imgid).closest('.js-image-box');
			if($box.length == 0) {
				$box = $('#tuwidget'+uploadid).closest('.js-image-box');
			}
			$box.find('.js-img-cdnurl').val(url);
			$box.find('.js-img-name').val('');
			$box.find('.js-img-size').val('');
			$box.find('.js-img-width').val('');
			$box.find('.js-img-height').val('');
			var title = url.substring(url.length-30);
			$box.find('.js-img-title').attr('href', url).html('...'+title);
			
			$('#tuwidget'+uploadid+'-previews').removeClass('tu-popup-progressbar-completed');
			$('#tuwidget'+uploadid+'-previews').removeClass('tu-popup-progressbar-start');
			
			$.ajax({
				type: "POST",
				dataType: "json",
				url: 'https://api.tildacdn.com/api/upload/',
				data: {
					'url': url,
					'publickey': Tildaupload_PUBLICKEY
				},
				success: function(json) {
					if ( json && json.result.length > 0){
						var file = json.result[0];
						$('#'+imgid).attr('src', file.cdnUrl);
						$box.find('.js-img-cdnurl').val(file.cdnUrl);
						$box.find('.js-img-name').val(file.name);
						$box.find('.js-img-size').val(file.size);
						$box.find('.js-img-uuid').val(file.uuid);
						
						if(file.width > 0) {
							$box.find('.js-img-width').val(file.width);
							$box.find('.js-img-height').val(file.height);
						}
						
						$box.find('.js-img-title').attr('href',file.cdnUrl).html(file.name);
						
						if ($('#tuwidget'+uploadid+'-previews').length > 0) {
							var tmp=file.cdnUrl;
							if(tmp.length>20) {
								tmp = tmp.substring(tmp.length-20);
							}
							$('#tuwidget'+uploadid+'-previews').find('span[data-tu-name]').html(tmp);
							$('#tuwidget'+uploadid+'-previews').find('span[data-tu-size]').html('');
							$('#tuwidget'+uploadid+'-previews').addClass('tu-popup-progressbar-completed');
						}

					} else {
						alert('Error. '+json.error);
					}
				}
			});
			
		} catch(e) {
			
		}
		return false;
	}
	
	function showFormCritycalText(recordid, typetext, domains, services,needpublished,lang) {
		var htmltext = '';
		var $jrecord = $('#record'+recordid);
		if ($jrecord.length == 0) {
			return false;
		}
		
		if ( $jrecord.find('.js-errorbox-all').length == 0) {
			return false;
		}

		if (typetext == "NO") {
			services = $('<textarea>').html(services).text();
			
			htmltext += ""
				+ '<span style="font-weight: 300">'+(lang=="RU"
					? "Форма подключена успешно. Текущие настройки:<br>Домены с которых будут приниматься данные: "
					: "Form has been assigned. Current settings:<br>Data will be received from domains:"
					)+'</span> '
				+ '<span style="font-weight: 500">'+domains+'</span>'
				+ "<br>"
				+ '<span style="font-weight: 300">'+(lang == "RU" ? "Данные отправляются на:" : "Data will be sent to:")+'</span> '
				+ '<span style="font-weight: 500">'+services+'</span>';
		}

		if (typetext == "NEED_INPUT_SCRIPT") {
			var abeg="",aend="";
			if ($('#allrecords').data('tilda-project-id')>0) {
				abeg = "<a href='/projects/settings/?projectid="+$('#allrecords').data('tilda-project-id')+"#tab=ss_menu_forms'>";
				aend = "</a>";
			}
			htmltext += (
				lang == "RU"
				? "<b>Внимание:</b> Настройка формы не завершена. У вас выбран вариант «принимать данные на свой скрипт», но адрес скрипта не указали. Пожалуйста, укажите адрес, на который будут приходить данные из формы. Либо, чтобы использовать наш сервис приема данных, подключите приемщик данных в "+abeg+"настройках сайта"+aend+"."
				: "<b>Attention:</b> form assigning is not completed. You’ve set “Own script for receive data ”, but you didn’t put down a script address. Please put down a script address to which data from the form has been sent. Or, to use our service of data capture, assign Data Receiver in the Site Settings."
			);
		}
		
		if (typetext == "NEED_CONNECT_RECEIVER") {
			htmltext += (
				lang == "RU"
				? "<b>Внимание:</b> Настройка формы не завершена. Пожалуйста, нажмите кнопку «Контент» этого блока и поставьте галочку напротив приемщика данных."
				: "<b>Attention:</b> form assigning is not completed. Please press the button “Content” of this block and check the box across the Data Receiver."
			);
		}

		if (needpublished == 'yes' && typetext=="NO") {
			htmltext += '<br><br><b>'+(lang == "RU"
				? "Обязательно опубликуйте страницу, чтобы применить внесенные изменения"
				: "Publish page please"
			)+'</b>';
		}
		
		if (typetext!='NO' || needpublished=='yes') {
			$('#record'+recordid+' .r').after('<div style="margin: 0px;text-align: left; font-family: tfutura,Arial; position: relative;"><div style=" background: yellow; padding: 40px 40px; " class="t-container"><div style="width: 40px; height: 40px; float: left; display: inline-block;margin-left: 80px;margin-top: -80px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height = "40px"  width = "40px"><polygon fill="yellow" stroke="yellow" stroke-width="0" points="0,40  40,20 40,40 0,40" /></svg></div>'+htmltext+'<br></div></div>');
		}
		
		return true;
	}

	function showCritycalText(recordid, typetext) {
		var htmltext = '';
		var $jrecord = $('#record'+recordid);
		if ($jrecord.length == 0) {
			return false;
		}
				
		if (typetext == "OLDTPL") {
			htmltext += (
				lang == "RU"
				? "Этот блок устарел и больше не поддерживается. Он может работать некорректно. Пожалуйста, добавьте из библиотеки новую версию блока или подберите аналогичный. Перенесите контент в новый блок и переопубликуйте страницу."
				: "This block is outdated and is not supported anymore. It may work incorrectly. Please add the new version of the block from the library or match the analogic one. Move the content to the new block and re-publish a page."
			);
		}		
		
		if (htmltext!='') {
			$('#record'+recordid+' .r').after('<div style="margin: 0px;text-align: left; font-family: tfutura,Arial; position: relative;"><div style=" background: yellow; padding: 40px 40px; " class="t-container"><div style="width: 40px; height: 40px; float: left; display: inline-block;margin-left: 80px;margin-top: -80px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height = "40px"  width = "40px"><polygon fill="yellow" stroke="yellow" stroke-width="0" points="0,40  40,20 40,40 0,40" /></svg></div>'+htmltext+'<br></div></div>');
		}
		
		return true;
	}	
	
	function minifyRecord(recordid){
		var b=$('#record'+recordid);
		var tplcod=b.find('.tp-record-edit-icons-left__item-tplcod').html();
		var tpltitle=b.find('.tp-record-edit-icons-left__item-tpltitle').html();
		if(typeof tplcod=='undefined')tplcod='';
		if(typeof tpltitle=='undefined')tpltitle='';
        b.find('.r').html("<div style='width:100%; height:65px; display:table; background-color:#eee;'><div style='display:table-cell; width:100%; vertical-align:middle; text-align:center; opacity:0.7; cursor:default;'><b>"+tplcod+". "+tpltitle+"</b>. <img src='https://static.tildacdn.com/lib/linea/0a73dde9-ce52-6771-0281-ee9e47000721/basic_eye_closed.svg' style='padding:10px 10px; width:30px;'> " + (lang=="RU" ? "Блок спрятан. Нажмите кнопку «Спрятать/Показать» справа, чтобы сделать его видимым." : "This block is hidden. Press on 'Hide/Show' button on the right side to activate it.") + "</div>");
        b.find('.r').css('padding','');		
        b.find('#mainleft').css('display','none');
        b.find('.tp-record-edit-icons-left__item-tpltitle').css('display','none');
        b.attr('off','y');
	}
	
	function tp_show_leftdrop(){
		$('.tp-menu__leftdrop-list').toggleClass('tp-menu__leftdrop-list_opened');
		
		$('.tp-menu__leftdrop-list').mouseleave(function() {
			$('.tp-menu__leftdrop-list').removeClass('tp-menu__leftdrop-list_opened');
		});
		
		$('.tp-menu__leftdrop-list').find('a').click(function() {
			$('.tp-menu__leftdrop-list').removeClass('tp-menu__leftdrop-list_opened');
		});
	}
	
	function tp_showOnboardingPins(){

		var pinstr="" + (lang == "RU" ? "<span class='onboardingpin__title'>Список страниц и настройки сайта. </span>Добавьте больше страниц, настройте шрифты, подключите домен, статистику, формы приема данных и платежную систему." : "<span class='onboardingpin__title'>Page list and Site settings. </span>Add more pages, set fonts, connect a domain, statistics, data capture forms and a payment system.");
		showOnboardingPin('page-onboarding-pin1',pinstr,240,28,'','fixed');

		var pinstr="" + (lang == "RU" ? "<span class='onboardingpin__title'>Опубликуйте страницу. </span>Она появится онлайн и вы получите ссылку, по которой любой человек сможет ее увидеть." : "<span class='onboardingpin__title'>Publish the page. </span>The page will be published online and you will have a link. Anyone with this link will be able to see the page.");
		showOnboardingPin('page-onboarding-pin2',pinstr,50,28,'#page_menu_publishlink','fixed');

		var pinstr="" + (lang == "RU" ? "<span class='onboardingpin__title'>Библиотека блоков. </span>Добавьте на страницу новый блок. Выберите подходящий из 350+ блоков, разбитых на категории." : "<span class='onboardingpin__title'>Blocks library. </span>Add a new block on the page. Choose one from 350+ blocks, divided into categories.");
		showOnboardingPin('page-onboarding-pin3',pinstr,30,0,'#tp_btn_allblock','','','-225');		
				
	}
		
	$.fn.scrollGuard = function() {
	  return this
	    .on( 'wheel', function ( e ) {
	      var $this = $(this);
	      if (e.originalEvent.deltaY < 0) {
	        /* scrolling up */
	        return ($this.scrollTop() > 0);
	      } else {
	        /* scrolling down */
	        return ($this.scrollTop() + $this.innerHeight() < $this[0].scrollHeight);
	      }
	    })
	  ;
	}; 	
	
	function converttozero(recordid){
		$('.pe-zero-convert-btn').css('display','none');
		$('.pe-zero-convert-notice').css('display','block');
		var str='';
		str += '<div style="font-size:14px; color:#777; padding-top:25px;">';
		if(lang=='RU'){
			str += 'При конвертации блок вернется к начальному состоянию — с текстом и фото по умолчанию.';
		}else{
			str += 'As a result of converting to Zero Block, the block will return to its starting appearance — with default text and photos. If you change text and photos to your own ones they will not be saved.';
		}
		str += '<a href="javascript:converttozero_do('+recordid+');" style="margin-top:10px; display:block; height:50px; width:200px; line-height:50px; padding:0 20px; background-color:#000; color:#fff;cursor: pointer;">' + (lang == "RU" ? "Конвертировать" : "Convert without saving content" ) + '</a>';
		str += '<a href="javascript:converttozero_cancel();" style="margin-top:5px; display:block; height:50px; width:200px; line-height:50px; padding:0 20px; border:1px solid rgba(0,0,0,0.1);cursor: pointer;">' + (lang == "RU" ? "Отмена" : "Cancel" ) + '</a>';		
		str += '</div>';
		$('.pe-zero-convert-notice').html(str);
	}

	function converttozero_cancel(){
		$('.pe-zero-convert-btn').css('display','block');
		$('.pe-zero-convert-notice').css('display','none');
	}
	
	function converttozero_do(recordid){
	    showLoadIcon();
	    $.ajax({
	      type: "POST",
	      url: "/page/submit/",
	      data: {comm: "converttozero", pageid: $pageid, recordid: recordid},
	      dataType : "text",
	      success: function(data){
		      hideLoadIcon();
		      if(data!=''){
			    alert(data);
		      }else{
			    closeEditForm();
			    $('html, body').animate({scrollTop: $("#record"+recordid).offset().top-100}, 700);
		      	updateRecord(recordid);
		      }
		      updateUndoButton();
	      },
	      error: function(){
	            alert('Request timeout (changing block template)');
	            hideLoadIcon();
	            location.reload();
	      },
	      timeout: 1000*90
	    });		
	}
		
	function addRedactor_to_textarea(el){	
		el.redactor({
			lang: (lang == "RU" ? "ru" : "en"),
        	linebreaks: true,
        	boldTag: 'b',
        	italicTag: 'i',
			replaceDivs: false,	        	
        	allowedTags: ['p', 'a', 'i', 'b','br','div','del','u','ul','ol','li','hr','sup','sub','em','table','tr','td','th','tbody','thead','strike','span','inline','strong','h1','h2','h3','h4','h5','h6'],
        	//buttonsHide: ['underline','formatting','image','indent','outdent','aligment',''],
			buttons: ['bold', 'italic', 'deleted', 'link','unorderedlist', 'orderedlist',''],
        	dragUpload: false,
        	//plugins: ['fontcolor','fontweight','setfontfamily','setfontsize','setalign'],
        	plugins: (window.country == "RU" || window.country == "BY" || window.country == "UA" ? ['underline','fontcolorex','fontweight','setfontfamily','setfontsize','setlineheight','setalign',"typograf",'clearstyle'] : ['underline','fontcolorex','fontweight','setfontfamily','setfontsize','setlineheight','setalign','clearstyle']),
		    initCallback: function()
		    {
				this.$toolbar.css("display","none");

		    },
			changeCallback: function(html)
			{
				window.waschanged="yes";
			},
		    focusCallback: function(e)
		    {
				this.$toolbar.css("display","block");
				var y=this.$editor.has('div').is("div");
				if(y==true) {
					var st=getAttrStrintoArr(this.$editor.find('div').attr('style'));
					if(st['font-size']!==undefined && st['font-size']!="")this.setfontsize.enter(st['font-size']);
					if(st['line-height']!==undefined && st['line-height']!="")this.setlineheight.enter(st['line-height']);
					if(st['text-align']!==undefined && st['text-align']!="")this.setalign.enter(st['text-align']);
					if(st['font-family']!==undefined && st['font-family']!="")this.setfontfamily.enter(st['font-family']);
					if(st['color']!==undefined && st['color']!="")this.fontcolorex.enter(st['color']);
					this.$editor.find('div').contents().unwrap();
				}
		    },
        	blurCallback: function(e)
			{
				this.$toolbar.css("display","none");
				if(window.waschanged){
					var value=this.$editor.html();
					value=value.replace(/&nbsp;/g, ' ');
				
					//if was set custom styles
					var str="";
					var el=this.$box.parent();
					if(el.attr('data-redactor-font-size')!=undefined)str=str+"font-size:"+el.attr('data-redactor-font-size')+";";
					if(el.attr('data-redactor-line-height')!=undefined)str=str+"line-height:"+el.attr('data-redactor-line-height')+";";
					if(el.attr('data-redactor-text-align')!=undefined)str=str+"text-align:"+el.attr('data-redactor-text-align')+";";
					if(el.attr('data-redactor-font-family')!=undefined)str=str+"font-family:"+el.attr('data-redactor-font-family')+";";
					if(el.attr('data-redactor-color')!=undefined)str=str+"color:"+el.attr('data-redactor-color')+";";
					if(str!=""){
						value='<div style="'+str+'" data-customstyle="yes">'+value+'</div>';
						this.$editor.html(value);
						this.code.sync();
					}
					setTimeout(function() {
						el.find('textarea').trigger('change');
					},100)						
				}
			},
			pasteBeforeCallback: function(html)
			{
				html=$.htmlClean(html, {format:true,allowedTags:['div','span','p','h1','h2','h3','a','i','b','br','del','u','ul','ol','li','sup','sub','em','strike','strong'],allowedClasses:[''],allowedAttributes:[['href'],['style'],['rel'],['data-verified'],['data-redactor-tag'],['data-redactor-style']]});
				html = html.replace(/<h1\s(.*?)>/gi, '<h1>');
				html = html.replace(/<h1><br\s?\/?><\/h1>/gi, '<br /><br />');
				html = html.replace(/<h1>([\w\W]*?)<\/h1>/gi, '$1<br /><br />');
				html = html.replace(/<h2\s(.*?)>/gi, '<h2>');
				html = html.replace(/<h2><br\s?\/?><\/h2>/gi, '<br /><br />');
				html = html.replace(/<h2>([\w\W]*?)<\/h2>/gi, '$1<br /><br />');
				html = html.replace(/<h3\s(.*?)>/gi, '<h3>');
				html = html.replace(/<h3><br\s?\/?><\/h3>/gi, '<br /><br />');
				html = html.replace(/<h3>([\w\W]*?)<\/h3>/gi, '$1<br /><br />');
				html = html.replace(/<div\s(.*?)>/gi, '<div>');
				html = html.replace(/<div><br\s?\/?><\/div>/gi, '<br />');
				html = html.replace(/<div>([\w\W]*?)<\/div>/gi, '$1<br />');
				return html;
			}
        });
	}
	
	
	function tp_showLimitsOutNotice(){
		var data="";
		
		data += "<div style='font-size:20px;'>" + (lang=="RU" ? "Время идет, работа делается. Пожалуйста, оплатите подписку или перейдите на бесплатный тариф." : "Your subscription plan has expired. Please prolong your subscription or change to Free plan.") + "</div>"
		
		data += "<br><br><a href='/identity/plan/' class='btn btn-primary'>"+(lang=="RU" ? "Тарифы и оплата" : "Plans and Billing") + "</a>";

		var htmldata="<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>"+(lang=="RU" ? "Пожалуйста, оплатите подписку" : "Please renew subscription")+"</h4></div><div id='myModalBody' style='padding:20px;'><br>"+data+"</div>";
		$('#myHelpModal').modal('show');
		$('#myHelpModal .modal-dialog').css("width","860px");
		$('#myHelpModalContent').html(htmldata);
		$('#myHelpModal').on('hidden.bs.modal', function () {
		  $('#myHelpModalContent').html("");
		})
	}	
	
	


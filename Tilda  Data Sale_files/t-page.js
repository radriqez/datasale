function addImageRecord(fileInfo) {
    if ($("#myfirstrecord")){$("#myfirstrecord").css({"display":"none"});}

    showLoadIcon();
    var field="img";
    var d={};
    d['comm']="addnewimagerecord";
    d['pageid']=$pageid;
    d['onlythisfield']=field;
    d[field+"file"]=fileInfo.uuid;
    d[field+"name"]=fileInfo.name;
    d[field+"width"]=fileInfo.originalImageInfo ? fileInfo.originalImageInfo.width : "0";
    d[field+"size"]=fileInfo.size;
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: d,
      dataType : "text",
      success: function(data){
          //console.log(data);
          hideLoadIcon();
          $("#allrecords").append(data);
          $('html, body').animate({scrollTop: $("#allrecords").offset().top+$("#allrecords").height()-100}, 700);
          updateUndoButton();
      }
    });
}

function editRecordImgField() {
    var recordid = getrecordid($(this));
    var field = $(this).attr("imgfield");
    var el = $(this);
	var imageOnly=true;
    console.log('image upload dialog opened');

    if (field=='img' || field=='img1' || field=='img2' || field=='img3' || field=='img4' || field=='img5' || field=='img6' || field=='img7' || field=='img8') {
        imageOnly = false;
        $(this).data('input-accept-types','image/*');
        //uploadcare.validators.push(UploadCarefileTypeLimit('jpe jpg jpeg gif png ico svg'))
    }
    uploadcare.openDialog({}, {
        imagesOnly: imageOnly,
        validarors: [
            UploadCarefileTypeLimit('jpe jpg jpeg gif png ico svg')
        ],
        inputAcceptTypes: 'image/*' 
    }).done(function(file) {
        el.attr("src","http://tilda.cc/tpl/img/ajax-loader.gif");
        el.after("<div id='imguplprogress"+recordid+"' style='margin:30px;'></div>");
        file.done(function(fileInfo) {
            el.attr("src",fileInfo.cdnUrl);
            $("#imguplprogress"+recordid).remove();
            showLoadIcon();
            var d={};
            d['comm']="saverecord";
            d['pageid']=$pageid;
            d['recordid']=recordid;
            d['onlythisfield']=field;
            d[field+"file"]=fileInfo.uuid;
            d[field+"name"]=fileInfo.name;
            d[field+"width"]=fileInfo.originalImageInfo ? fileInfo.originalImageInfo.width : "0";
            d[field+"size"]=fileInfo.size;
            $.ajax({
              type: "POST",
              url: "/page/submit/",
              data: d,
              dataType : "text",
              success: function(data){
                  console.log(data);
                  if(el.prop('nodeName')=="DIV"){
	                  updateRecord(recordid);
                  }
                  hideLoadIcon();
              },
              error: function(){
                  hideLoadIcon();
                  alert('Request timeout (saving image)');
              },
              timeout: 1000*90
            });
        }).fail(function(error, fileInfo) {
        }).progress(function(uploadInfo) {
            $("#imguplprogress"+recordid).html("upload: "+Math.round(uploadInfo.progress*100)+"%");
        });
    });
}

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function editRecordField() {
    //this id need because then you try re set click function (after cancel or save), this function is calling imidiatly.
    if($(this).data("noclickatthistime")=="yes"){
        $(this).data("noclickatthistime","");
        return;
    }

    console.log("entereditfield");

    //close and save other fields opened for edit
    $(".editinplacefield").each(function() {
        var orecordid=getrecordid($(this));
        var ofield = $(this).parent().attr("field");
        saveRecordEditedField(orecordid,ofield);
    });

    $(this).unbind('click',editRecordField);
    var css = $(this).css(["height","color","background-color","font-size","font-family","line-height","font-weight","text-align","letter-spacing"]);
    var field = $(this).attr("field");
    var recordid = getrecordid($(this));

    var temp=[];
    temp[field] = $(this).html();
    tempdatafields[recordid] = temp;

    var data = "";
    data += "<div id=\"editrecord"+recordid+"field"+field+"\" class=\"editinplacefield\">";
    data += "<textarea name=\""+field+"\" class=\"edittextarearecordfield\" id=\"textarearecord"+recordid+"field"+field+"\" style='width:100%; border:0; margin:0; padding:0;'>";
    data += ""+htmlEncode($(this).html())+"";
    data += "</textarea>";
    data += "</div>";

    $(this).html(data);
    $("#textarearecord"+recordid+"field"+field).css(css);


    $(this).find("#cnsleditrec").click(function() {
        var f=$("#record"+recordid+" [field='"+field+"']");
        f.html(tempdatafields[recordid][field]);
        f.data("noclickatthistime","yes");
        f.click(editRecordField);
    });

    $(this).find("#sveditrec").click(function() {
        saveRecordEditedField(recordid,field);
    });

    $("#for_redactor_toolbar").stop();
    $("#mainmenu").stop();

    $("#for_redactor_toolbar").html("");
    $("#for_redactor_toolbar").css("opacity","0");
    
    var elthis=$(this);
	
    $("#mainmenu").animate({"opacity": "0","top": "-60px"}, 400,"easeInCirc", function() {
		if(typeof elthis=='object' && elthis.attr('data-redactor-toolbar')=='no'){	    
	        console.log('no redactor toolbar');
        }else{
        	$("#for_redactor_toolbar").animate({"opacity": "1","top": "0px"}, 300,"easeOutCirc");	        
        }
    });

    /* $("#closelayer").css({"height":"100%"});
    //$("#rec"+recordid).css("z-index","1000"); */

	if(! window.country) {
		window.country = $('body').data('country');
	}
	
    window.waschanged="";
    $("#textarearecord"+recordid+"field"+field).redactor({
		lang: (lang=="RU" ? "ru" : "en"),
        buttons: ['bold', 'italic', 'deleted', 'link',''],
        focus: true,
        linebreaks: true,
        allowedTags: ['p', 'a', 'i', 'b','br','div','del','u','ul','ol','li','sup','sub','em','table','tr','td','th','tbody','thead','strike','span','inline','strong'],
        replaceDivs: false,
        cleanOnPaste: true,
        toolbarExternal: '#for_redactor_toolbar',
        plugins: (window.country == "RU" || window.country == "BY" || window.country == "UA" ? ['underline','fontcolorex','fontweight','setfontfamily','setfontsize','setlineheight','setalign','typograf','clearstyle'] : ['underline','fontcolorex','fontweight','setfontfamily','setfontsize','setlineheight','setalign','clearstyle']),
        dragUpload: false,
        initCallback: function(e)
        {
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

            redactor_showTextSyle(this);
            
            var attr=this.$editor.parent().parent().parent().parent().attr('data-elem-id');
            if (typeof attr !== typeof undefined && attr !== false) {
	            var forred=$('#for_redactor_toolbar');
	            forred.find('.re-fontcolor').css('display','none');
	            forred.find('.re-fontweight').css('display','none');
	            forred.find('.re-setfontfamily').css('display','none');
	            forred.find('.re-setfontsize').css('display','none');
	            forred.find('.re-setlineheight').css('display','none');
	            forred.find('.re-setalign').css('display','none');
	            forred.find('.re-clearstyle').css('display','none');
            }
            
        },
        changeCallback: function(html)
        {
            window.waschanged="yes";
        },
        dropdownShownCallback: function(dropdown, key, button)
        {
            redactor_showTextSyle(this);
        },
        blurCallback: function(e)
        {
            $("#for_redactor_toolbar").finish();
            $("#mainmenu").finish();

            $("#for_redactor_toolbar").animate({"opacity": "0","top": "-60px"}, 400,"easeInCirc", function() {
                $("#for_redactor_toolbar").html("");
                $("#mainmenu").animate({"opacity": "1","top": "0px"}, 300,"easeOutCirc");
            });

            if(window.waschanged){
                saveRecordEditedField(recordid,field);
            }else{
                var f=$("#record"+recordid+" [field='"+field+"']");
                f.html(tempdatafields[recordid][field]);
                f.data("noclickatthistime","yes");
                f.click(editRecordField);
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

function saveRecordEditedField(recordid,field,value) {
    var value=$("#textarearecord"+recordid+"field"+field).val();
    value=value.replace(/&nbsp;/g, ' ');

    //if was set custom styles
    var str="";
    var el=$("#editrecord"+recordid+"field"+field);
    if(el.attr('data-redactor-font-size')!=undefined)str=str+"font-size:"+el.attr('data-redactor-font-size')+";";
    if(el.attr('data-redactor-line-height')!=undefined)str=str+"line-height:"+el.attr('data-redactor-line-height')+";";
    if(el.attr('data-redactor-text-align')!=undefined)str=str+"text-align:"+el.attr('data-redactor-text-align')+";";
    if(el.attr('data-redactor-font-family')!=undefined)str=str+"font-family:"+el.attr('data-redactor-font-family')+";";
    if(el.attr('data-redactor-color')!=undefined)str=str+"color:"+el.attr('data-redactor-color')+";";
    if(str!=""){
        value='<div style="'+str+'" data-customstyle="yes">'+value+'</div>';
    }

	if(field.substr(0,3)=='li_'){
		console.log('li_');
	    var value_len=value.length;
	    if(value_len>3000){
		    alert( (lang=="RU" ? "Предупреждение: в поле слишком много текста. Мы настойчиво рекомендуем его сократить." : "Notice: there are too much data in the field. We strongly recommend decreasing the volume of it.") );
	    }		
	}
	
    showLoadIcon();
    var d={};
    d['comm']="saverecord";
    d['pageid']=$pageid;
    d['recordid']=recordid;
    d[field]=value;
    d['onlythisfield']=field;
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: d,
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          updateUndoButton();
      },
      error: function(){
          hideLoadIcon();
          alert('Request timeout (saving text)');
      },
      timeout: 1000*90
    });

    var f=$("#record"+recordid+" [field='"+field+"']");
    f.html(value);
    if(value==""){f.remove();}
    f.data("noclickatthistime","yes");
    f.click(editRecordField);

}

function getrecordid(temp){
    var i=0;

    while (!recordid && i<15) {
        var recordid=temp.attr("recordid");
        temp = temp.parent();
        i++;
    }
    if(!recordid)console.log("Error. Recordid not found");

    return(recordid);
}

function savesortmodeifactive(){
    var test=$('#savesortbuttons').css("display");
    if(test=="block")saveRecordsSort();
}

function delPage(pageid,projectid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/projects/submit/",
      data: {comm: "delpage", pageid: pageid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          closepopup();
          var backurl='/projects/';
          if (typeof projectid !== 'undefined') backurl+='?projectid='+projectid;
          window.location = backurl;
      },
      error: function(){
            alert('Request timeout (page deletion)');
            hideLoadIcon();
            closepopup();
            var backurl='/projects/';
            if (typeof projectid !== 'undefined') backurl+='?projectid='+projectid;
            window.location = backurl;
      },
      timeout: 1000*90
    });
}

function dublicatePage(pageid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/projects/submit/",
      data: {comm: "dublicatepage", pageid: pageid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          if(data==""){
            closepopup();
            window.location.href = "/projects/";
          }else if(data>0){
            closepopup();
            window.location.href = "/projects/pageduplicate/?pageid="+data;
          }else{
            $(".td-popup-error").html(data);
          }
      },
      error: function(){
            alert('Request timeout (page duplication)');
            hideLoadIcon();
            closepopup();
            window.location.href = "/projects/";
      },
      timeout: 1000*90
    });
}

function showformEditPageSettings_new(pageid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/projects/submit/",
      data: {comm: "editpagesettings", pageid: pageid},
      dataType : "text",
      success: function(data){
            hideLoadIcon();
            showpopup('#popup_pagesettings',data);
            init_popup();
      },
      error: function(){
            alert('Request timeout (opening page settings)');
            hideLoadIcon();
      },
      timeout: 1000*90
    });
}


function updatePage(pageid){
    location.reload();
}

function undo(){
    //if sortmode on
    var test=$('#savesortbuttons').css("display");
    if(test=="block"){
        cancelSort();
        return;
    }

    //if selectmode on
    var test=$('#saveselectbuttons').css("display");
    if(test=="block"){
        cancelSelect();
        return;
    }

    //other
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "undo", pageid: $pageid},
      dataType : "text",
      success: function(data){
            hideLoadIcon();

            try {
                var json = $.parseJSON(data);
            } catch (e) {
                console.log(data);
                updateUndoButton();
            }

            if(typeof json == 'object'){

                if(json['undoindex']==0){
                    hideUndoButton();
                }else{
                    showUndoButton();
                }

                var recordid=json['recordid'];

                if(json['comm']=="updaterecord" && recordid>0){
                    updateRecord(recordid);
                    $('html, body').animate({scrollTop: $("#record"+recordid).offset().top-100}, 700);
                }

                if(json['comm']=="showrecord" && recordid>0){
                    if ($("#myfirstrecord")){$("#myfirstrecord").css({"display":"none"});}

                    showLoadIcon();
                    $.ajax({
                      type: "POST",
                      url: "/page/get/",
                      data: {comm: "getrecordhtml", pageid: $pageid, recordid: recordid},
                      dataType : "text",
                      success: function(data){
                          hideLoadIcon();

                          if(json['afterid']>0){
                            $("#record"+json['afterid']).after(data);
                          }else{
                            $("#allrecords").prepend(data);
                          }

                          //replacetplimgbyuploadwidget(recordid);
                          //replacetplgallerybyuploadwidget(recordid);
                          window.blockList.rebuildList();
                          $('html, body').animate({scrollTop: $("#record"+recordid).offset().top-100}, 700);
                      }
                    });

                }

                if(json['comm']=="delrecord" && recordid>0){
                    $('html, body').animate({scrollTop: $("#record"+recordid).offset().top-100}, 700);
                    $("#record"+recordid).remove();
                }

                if(json['comm']=="reload"){
                    location.reload();
                }

            }else{
                console.log("some strange..");
                updateUndoButton();
            }

      },
      error: function(){
            alert('Request timeout (undo)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function updateUndoButton(){
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "updateundobutton", pageid: $pageid},
      dataType : "text",
      success: function(data){
          if(data){
              $obj = $.parseJSON(data);
              if($obj){
                  if($obj['undoindex']==0){
                      hideUndoButton();
                  }else{
                      showUndoButton();
                  }
              }
          }
      }
    });
}

function replacetplgallerybyuploadwidget(recordid){
    if(recordid>0){
        $( "img", "#record"+recordid ).each(function() {
            if($(this).attr('src')=="https://tilda.cc/img/imgfishgallery.gif"){
                  var placeholder = $(this);
                  uploadcare.openPanel(placeholder, [], {
                    multiple: true,
                    imagesOnly: true
                  }).done(function(fileGroup) {
                    var data="<center><img src='http://tilda.cc/tpl/img/ajax-loader.gif'><div id='imguplprogress"+recordid+"' style='margin:30px;'></div></center>";
                    $("#record"+recordid).html(data);

                    fileGroup.promise()
                      .done(function(fileGroupInfo) {
                        //console.log(fileGroupInfo.uuid);
                        $("#record"+recordid).html("<center style='margin:30px;'><br><br>Save and Update...<br><br></center>");
                        showLoadIcon();
                        $.ajax({
                          type: "POST",
                          url: "/page/submit/",
                          data: {comm: "addimagestogallery", pageid: $pageid, recordid: recordid, galleryfiles: fileGroupInfo.uuid},
                          dataType : "text",
                          success: function(data){
                              hideLoadIcon();
                              console.log(data);
                              updateRecord(recordid);
                          }
                        });
                      })
                      .fail(function(error, fileGroupInfo) {
                      })
                      .progress(function(uploadInfo) {
                          $("#imguplprogress"+recordid).html("upload: "+Math.round(uploadInfo.progress*100)+"%");
                      });
                  });
            }
            //console.log('msg:' + ttt);
        });
    }
}

function replacetplimgbyuploadwidget(recordid){
    //console.log(recordid)
    if(recordid>0){
        $( "img", "#record"+recordid ).each(function() {
            if($(this).attr('src')=="http://tilda.ws/files/page4/rec150/imgfish.jpg"){
                imageOnly = true;
                var field = $(this).attr('imgfield');
                if (field=='img' || field=='img1' || field=='img2' || field=='img3' || field=='img4' || field=='img5' || field=='img6') {
                    imageOnly = false;
                    $(this).data('input-accept-types','image/*');
                    //uploadcare.validators.push(UploadCarefileTypeLimit('jpe jpg jpeg gif png ico svg'))
                }

                var placeholder = $(this);
                uploadcare.openPanel(placeholder, {
                    imagesOnly: imageOnly,
                    validarors: [
                        UploadCarefileTypeLimit('jpe jpg jpeg gif png ico svg')
                    ],
                    inputAcceptTypes: 'image/*' 
                }).done(function(file) {
                    placeholder.attr("src","http://tilda.cc/tpl/img/ajax-loader.gif");
                    placeholder.after("<div id='imguplprogress"+recordid+"' style='margin:30px;'></div>");
                    file.done(function(fileInfo) {
                    //console.log(fileInfo.originalImageInfo.width);
                        placeholder.attr("src",fileInfo.cdnUrl);
                        $("#imguplprogress"+recordid).remove();
                        showLoadIcon();
                        if( fileInfo.originalImageInfo) {
                            imgwidth = fileInfo.originalImageInfo.width;
                        } else {
                            imgwidth = "0";
                        }
                        $.ajax({
                          type: "POST",
                          url: "/page/submit/",
                          data: {comm: "saverecord", pageid: $pageid, recordid: recordid, onlythisfield: 'img', imgfile: fileInfo.uuid, imgname: fileInfo.name, imgwidth: imgwidth, imgsize: fileInfo.size},
                          dataType : "text",
                          success: function(data){
                              hideLoadIcon();
                              addEditFieldEvents(recordid);
                          }
                        });
                    }).fail(function(error, fileInfo) {
                    }).progress(function(uploadInfo) {
                          $("#imguplprogress"+recordid).html("upload: "+Math.round(uploadInfo.progress*100)+"%");
                    });
                  });
            }
            //console.log('msg:' + ttt);
        });
    }
}

function makeScreenshot(){
    var wh=$(window).height();
    var ww=$(window).width();
    var ah=$("#allrecords").height();
    if(ah>ww){
        var h=ww;
    }else{
        var h=ah;
    }

    html2canvas($("#allrecords"), {
        //"proxy":"/getscreen/",
        "height":h,
        "onrendered": function(canvas) {
            var extra_canvas = document.createElement("canvas");
            var nw=canvas.width/2;
            var nh=canvas.height/2;

            extra_canvas.setAttribute('width',nw);
            extra_canvas.setAttribute('height',nh);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,nw,nh);

            var dataURL = extra_canvas.toDataURL();

            $.ajax({
              type: "POST",
              url: "/page/get/",
              data: {comm: "savepagethumb", pageid: $pageid, value: dataURL},
              dataType : "text",
              success: function(data){
              }
            });


        }
    });
}


var autosavesort_timer;
function sortModeOn(){
    hideSelectButtons();
    //showSortButtons();
    $('#allrecords').sortable({
        helper:'clone',
        opacity: 0.8,
        revert: true,
        tolerance :'pointer',
        handle : '#sorthandle',
        axis:'y',
        start: function(event, ui) {
            clearTimeout(autosavesort_timer);
        },
        change: function(event, ui) {
            clearTimeout(autosavesort_timer);
        },
        update: function(event, ui) {
            showSortButtons();
            window.blockList.rebuildList();
            autosavesort_timer = setTimeout(function() {
                saveRecordsSort();
            },7000);
        }
    });
}

function cancelSort(){
    hideSortButtons();
    location.reload();
}

function saveRecordsSort(){
    clearTimeout(autosavesort_timer);
    var sortarr = Array();
    $('#allrecords .record').each(function(){
       sortarr.push($(this).attr('id').replace('record', ''));
    });

    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "saverecordssort", pageid: $pageid, sorts: sortarr},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          hideSortButtons();
          //$('#allrecords').sortable("destroy");
          updateUndoButton();
      },
      error: function(){
            alert('Request timeout (saving blocks order)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function pagePublish_askAliasFirst(url){
    savesortmodeifactive();
    
    if(window.dontaskalias_pagepublish=='yes'){
	    pagePublish();
	    return;
    }
    
	var data = "";
		
	data += "<div style='margin:20px 60px;font-size:14px; text-align:center;'>";
		data += "<div style='margin-bottom:40px; margin-top:60px;font-size:20px;'>";
		data += "<div id='pub_setpagealias_error_div' style='background-color:yellow; color:#000; font-size:18px; display:none; padding:20px; margin-bottom:30px;'></div>";	
		data += ""+(lang=="RU" ? "Укажите адрес страницы" : "Please set link for this page")+"";
		data += "</div>";	
		data += '<table width="100%" style="font-size:16px;">';
		data += '<tr>';
		data += '<td><div class="td-item-group__project-url" style="color:#333;" onclick="$(\'#popup-ps-input-alias\').focus();">'+url+'/</div></td>';
		data += '<td style="width:100%;"><input type="text" name="alias" id="popup-ps-input-alias" class="td-input td-item-group__page-url" value="" placeholder="page'+$pageid+'.html" style="padding-top:5px;"></td>';
		data += '</tr>';
		data += '</table>';	
		data += "<div style='margin-top:30px; margin-bottom:30px; font-size:14px; opacity:0.7;'>";	
		data += ""+(lang=="RU" ? "Вы всегда можете изменить адрес в настройках страницы." : "You can always change a page address in Page Settings.")+"";	
		data += "<br>";		
		data += ""+(lang=="RU" ? "Изменить основной адрес сайта или подключить свой домен вы можете в <a href='/projects/settings/?projectid="+$projectid+"' target='_blank' style='color:#ff8562;'>настройках&nbsp;сайта</a>." : "To change the main site address or assign your own domain go to <a href='/projects/settings/?projectid="+$projectid+"' target='_blank' style='color:#ff8562;'>Site&nbsp;Settings</a>.")+"";		
		data += "</div>";	
		data+='<div style="padding:30px;text-align:center;">';
		data+='<a href="javascript:skipAlias_and_pagePublish()" type="button" class="btn btn-default">'+(lang=="RU" ? "Пропустить" : "Skip this step")+'</a>';
		data+='<a href="javascript:saveAlias_and_pagePublish()" type="button" class="btn btn-primary" style="margin-left:10px;">'+(lang=="RU" ? "Сохранить и продолжить" : "Save and continue")+'</a>';	
		data+='</div>';		
	data += "</div>";
	
	$('#myModal').modal('show');
	$('#myModalContent').html(data);
	
}

function skipAlias_and_pagePublish(){
	window.dontaskalias_pagepublish='yes';
	$('#page_menu_publishlink').attr('href','javascript:pagePublish()');
	pagePublish();
}

function saveAlias_and_pagePublish(){
	var alias=$('#popup-ps-input-alias').val();
	window.dontaskalias_pagepublish='yes';
	$('#page_menu_publishlink').attr('href','javascript:pagePublish()');
	if(alias!==''){
		showLoadIcon();
	    $.ajax({
	      type: "POST",
	      url: "/projects/submit/",
	      data: {comm:'savepagealias', pageid: $pageid, alias: alias},
	      dataType : "text",
	      success: function(data){
		        hideLoadIcon();
		        if(data==''){
			  		pagePublish();
			  	}else{
				  	$('#pub_setpagealias_error_div').css('display','block');
				  	$('#pub_setpagealias_error_div').html(data);
			  	}
	      },
	      error: function(){
	            alert('Request timeout (page save url). Please try again.');
	            hideLoadIcon();
	      },
	      timeout: 1000*90
	    });	
	}else{
		pagePublish();
	}
}

function pagePublish(){
    savesortmodeifactive();
    showpublishpopup();
    $.ajax({
      type: "POST",
      url: "/page/publish/",
      data: {pageid: $pageid},
      dataType : "text",
      success: function(data){
            $('#myModalContent #loadingcenter').slideUp();
            $('#myModalContent').append(data);
      },
      error: function(){
            alert('Request timeout (page publishing). Please try again.');
            hideLoadIcon();
      },
      timeout: 1000*90
    });
}

function pageUnpublish(pageid){
    //showpublishpopup();
	var data = "<div id='loadingcenter' style='margin:5px 0px; font-size:14px; text-align:left;'>";
		data += "<img src='/tpl/img/ajax-loader.gif' style='margin-right: 10px;'>";
		data += ""+(lang=="RU" ? "Пожалуйста подождите" : "Please wait")+"";
		data += "</div>";
    $('#formpageedit  #unpublishpagebox').html(data);
    
    $.ajax({
      type: "POST",
      url: "/page/unpublish/",
      data: {pageid: pageid},
      dataType : "text",
      success: function(data){
            $('#formpageedit #loadingcenter').slideUp();
            $('#formpageedit  #unpublishpagebox').html(data);
      },
      error: function(){
            alert('Request timeout (page unpublishing). Please try again.');
            hideLoadIcon();
      },
      timeout: 1000*90
    });
}

/*
function showShortCutToolsforInsertAfterRecord(afterid){
    removeshortcuttoolsafter();
    var data = getshortcuttool(afterid);
    $("#record"+afterid).after(data);
    $y=$("#shortcuttoolsafter").offset().top - 100;
    $('html, body').animate({scrollTop: $y}, 700);
}
*/

function showChooseTpls(recordid){
    $("#tplslist"+recordid).css({"display":"block"});
}

function changeRecordTpl(recordid,tplid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "changerecordtpl", pageid: $pageid, recordid: recordid, tplid: tplid},
      dataType : "text",
      success: function(data){
          $("#record"+recordid).html(data);
          hideLoadIcon();
          blhi=$("#record"+recordid).height();
          if(blhi==0){$("#record"+recordid).height('120');}
          updateUndoButton();
          window.blockList.rebuildList();
      },
      error: function(){
            alert('Request timeout (changing block template)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function upRecord(recordid){
    $thisid=$("#record"+recordid);

    if($thisid.prev().attr("recordid")){
        $thishtml=$thisid.clone();
        $thisid.prev().before($thishtml);
        $thisid.remove();
        scrollTo(recordid);
        //showSaveSortButtons();
        //updateUndoButton();
        saveRecordsSort();
    }
}

function downRecord(recordid){
    $thisid=$("#record"+recordid);

    if($thisid.next().attr("recordid")){
        $thishtml=$thisid.clone();
        $thisid.next().after($thishtml);
        $thisid.remove();
        scrollTo(recordid);
        //showSaveSortButtons();
        //updateUndoButton();
        saveRecordsSort();
    }
}

function offRecord(recordid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "offrecord", pageid: $pageid, recordid: recordid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          if(data=="y"){
		        minifyRecord(recordid);
                //$("#record"+recordid).css("opacity","0.3");
          }else{
	          	$('#record'+recordid).find('.r').html('');
	          	$('#record'+recordid).find('.r').css('min-height','65px');
	          	$('#record'+recordid).attr('off','n');
	            updateRecord_fixed(recordid);
                //$("#record"+recordid).css("opacity","1");
                //$("#record"+recordid).find('.r').css('display','block');                
          }
          updateUndoButton();
      },
      error: function(){
            alert('Request timeout (block off/on)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function addRecord(tplid,afterid){
    closeEditForm();
    showLoadIcon();
    removeshortcuttoolsafter();
    if ($("#myfirstrecord")){$("#myfirstrecord").css({"display":"none"});}

    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "addnewrecord", pageid: $pageid, afterid: afterid, tplid: tplid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          var newreccid=$(data).attr('id');

          if(afterid>0){
              $("#record"+afterid).after(data);
              $('html, body').animate({scrollTop: $("#record"+afterid).offset().top+$("#record"+afterid).height()-100}, 700);
          }else{
              $("#allrecords").append(data);
              //$('html, body').animate({scrollTop: $("#allrecords").offset().top+$("#allrecords").height()-400}, 700);
              $('html, body').animate({scrollTop: $("#"+newreccid).offset().top-100}, 700);
          }

          $("#"+newreccid).css('opacity','0');
          $("#"+newreccid).animate({"opacity": "1"}, 700,"easeInCirc");

          updateUndoButton();
          //replacetplimgbyuploadwidget($(data).attr('id').replace('record', ''));
          //replacetplgallerybyuploadwidget($(data).attr('id').replace('record', ''));
          window.blockList.rebuildList();
          if(tplid=="125" || tplid=="132" || tplid=="284" || tplid=="132")location.reload();
      },
      error: function(){
            alert('Request timeout (adding new block)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function dublicateRecord(recordid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "dublicaterecord", pageid: $pageid, recordid: recordid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          $("#record"+recordid).after(data);
          $('html, body').animate({scrollTop: $("#record"+recordid).offset().top+$("#record"+recordid).height()-100}, 700);

          var newreccid=$(data).attr('id');
          $("#"+newreccid).css('opacity','0');
          $("#"+newreccid).animate({"opacity": "1"}, 700,"easeInCirc");

          updateUndoButton();
          //replacetplimgbyuploadwidget($(data).attr('id').replace('record', ''));
          //replacetplgallerybyuploadwidget($(data).attr('id').replace('record', ''));
          window.blockList.rebuildList();
      },
      error: function(){
            alert('Request timeout (block duplicating)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function delRecord(recordid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/submit/",
      data: {comm: "deleterecord", pageid: $pageid, recordid: recordid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          var block = $("#record"+recordid),v;
          if(v = document.body.querySelector('#record' + recordid + ' video')){
              window.videoLoadProcessor.unergisterVideo(v);
          }

          block.slideUp( "fast", function() {
              block.remove();
          });

          updateUndoButton();
          window.blockList.rebuildList();
          if(data!="")console.log(data);
      },
      error: function(){
            alert('Request timeout (block deletion)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function updateRecord(recordid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/get/",
      data: {comm: "getrecordhtml", pageid: $pageid, recordid: recordid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          $("#record"+recordid).html(data);
          //alert(data);
          //replacetplimgbyuploadwidget(recordid);
          //replacetplgallerybyuploadwidget(recordid);
          window.blockList.rebuildList();
      },
      error: function(){
            alert('Request timeout (updating block)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function updateRecord_fixed(recordid){
    showLoadIcon();
    $.ajax({
      type: "POST",
      url: "/page/get/",
      data: {comm: "getrecordhtml", pageid: $pageid, recordid: recordid},
      dataType : "text",
      success: function(data){
          hideLoadIcon();
          $("#record"+recordid).replaceWith(data);
          window.blockList.rebuildList();
      },
      error: function(){
            alert('Request timeout (updating block)');
            hideLoadIcon();
            location.reload();
      },
      timeout: 1000*90
    });
}

function editRecordinplace(recordid,tryloadcontent){
    if(tempdatarecs[recordid]){
        canceleditRecordinplace(recordid);
        return;
    }
    if(!tryloadcontent) {
        tryloadcontent = 1;
    }
    var video = $("#record"+recordid + " video")[0];
    if(video) {
        window.videoLoadProcessor.unergisterVideo(video);
    }
    $('html, body').animate({scrollTop: $("#record"+recordid).offset().top-100}, 700);

    showLoadIcon();
    tempdatarecs[recordid] = $("#rec"+recordid).html();

    $.ajax({
      type: "POST",
      url: "/page/edit/",
      data: {pageid: $pageid, recordid: recordid, editinplace: 'yes'},
      dataType : "text",
      success: function(data){
          $("#rec"+recordid).html(data);
          hideLoadIcon();
          savesortmodeifactive();
      },
      error: function(){
            hideLoadIcon();
            if(tryloadcontent<4) {
                editRecordinplace(recordid, tryloadcontent+1);
            } else {
                alert('Request timeout (content panel opening)');
            }
      },
      timeout: 1000*90
    });
}

function canceleditRecordinplace(recordid){
    $("#rec"+recordid).html(tempdatarecs[recordid]);
    tempdatarecs[recordid]="";
    addEditFieldEvents(recordid);
}

function editRecordSettings(recordid, tryload){
    showLoadIcon();

    if (! tryload) {
        tryload = 1;
    }

    $.ajax({
      type: "POST",
      url: "/page/edit/",
      data: {pageid: $pageid, recordid: recordid, editsettings: 'yes'},
      dataType : "text",
      success: function(data){
          showEditRecordSettingsForm(data);
          hideLoadIcon();
          savesortmodeifactive();
      },
      error: function(){
            hideLoadIcon();
            if(tryload < 4) {
                editRecordSettings(recordid, tryload+1);
            } else {
                alert('Request timeout (opening block settings panel)');
            }
      },
      timeout: 1000*90
    });
}

function editRecordContent(recordid){
    showLoadIcon();

    $.ajax({
      type: "POST",
      url: "/page/edit/",
      data: {pageid: $pageid, recordid: recordid, editcontent: 'yes'},
      dataType : "text",
      success: function(data){
          showEditRecordContentForm(data);
          hideLoadIcon();
          savesortmodeifactive();
      }
    });
}

function editRecord(recordid){
    showEditForm();
    showLoadIcon();

    $.ajax({
      type: "POST",
      url: "/page/edit/",
      data: {pageid: $pageid, recordid: recordid},
      dataType : "text",
      success: function(data){
          $("#editforms").html(data);
          hideLoadIcon();
          savesortmodeifactive();
      }
    });
}

function hideUndoButton(){
    $('#undobutton').css({"display":"none"});
}

function showUndoButton(){
    $('#undobutton').css({"display":"block"});
}

function showEditForm(){
    $("#editforms").css({"overflow":"auto"});
    $("#editforms").css({"overflow-x":"hidden"});
    $("#editforms").css({"height":"100%"});
    $("#closelayer").css({"height":"100%"});
    $("#closelayer").click(function() {closeEditForm();});
    $("#mainmenu").finish();
    $("#mainmenu").css("top","-60px");

    $("#editforms").css("left","-100px");
    $("#editforms").css("visibility","visible");
    $("#editforms").animate({"opacity": "1","left": "0px"}, 500,"easeOutCirc",function() {
        $("#updatesaveeditrecordsettingsbuttons").css("position","fixed");
    });
}

function showEditFormXL(){
    $("#closelayer").css({"height":"100%"});
    $("#closelayer").click(function() {closeEditForm();});
    $("#mainmenu").finish();
    $("#mainmenu").css("top","-60px");
    $("#editformsxl").css({"overflow":"auto"});
    $("#editformsxl").css({"overflow-x":"hidden"});
    $("#editformsxl").css({"height":"100%"});
    $("#editformsxl").css("left","-100px");
    $("#editformsxl").css("visibility","visible");
    $("#editformsxl").animate({"opacity": "1","left": "0px"}, 500,"easeOutCirc",function() {
        $("#updatesaveeditrecordsettingsbuttons").css("position","fixed");
    });
}

function closeEditForm(){
      $("#editforms").css({"height":"1px"});
      $("#editforms").css("visibility","hidden");
      $("#editforms").html("");
      $("#closelayer").css({"height":"1px"});
      $("#mainmenu").stop();
      $("#mainmenu").animate({"opacity": "1","top": "0px"}, 400,"easeOutCirc");
      $("#editformsxl").css({"height":"1px"});
      $("#editformsxl").css("visibility","hidden");
      $("#editformsxl").html("");
}

function showSortButtons(){
    $('#savesortbuttons').css({"display":"block"});
    $('.sortupicon').css({"display":"block"});
    $('.sortdownicon').css({"display":"block"});
    $('.sortonicon').css({"display":"none"});
    //$('.record').css('cursor' , 'move');
}

function hideSortButtons(){
    //$('.record').css('cursor' , 'auto');
    $('#savesortbuttons').css({"display":"none"});
    $('.sortupicon').css({"display":"none"});
    $('.sortdownicon').css({"display":"none"});
    $('.sortonicon').css({"display":"block"});
}

function showLoadIcon(){
    $('#loadicon').css({"display":"block"});
}

function hideLoadIcon(){
    $('#loadicon').css({"display":"none"});
}

function removeshortcuttoolsafter(){
    $('#shortcuttoolsafter').remove();
}

function scrollTo(str){
    if(str>0){
	    if($("#record"+str).length){
	        var y=$("#record"+str).offset().top - 100;
			$('html, body').animate({scrollTop: y}, 500);
		}
    }
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    }else{
        alert("Url incorrecta");
    }
}

function bordersdragmodeon() {

    var offset="", padding="", startoffset="", recordid="", oldborder="";

    $( ".recordbordertop" ).draggable({
        axis: "y", grid: [ 15, 15 ],
        revert: true,
        start: function(event, ui) {
            startpadding = parseInt($(this).parent().find(".r").css('padding-top'));
            startoffset = $(this).offset().top;
            console.log("startpadding"+startpadding);
            console.log("startoffset"+startoffset);
            $(this).before('<div class="recordbordertop" id="bordercloned"></div>');
        },
        drag: function(event, ui) {
            offset = $(this).offset().top - startoffset;
            padding = startpadding + offset;
            if(padding<0)padding=0;
            $(this).parent().find(".r").css('padding-top',padding+'px');
            $(this).css('display','block');
            $(this).css('opacity','0.1');
        },
        stop: function() {
            $(this).css('opacity','1');
            offset="", padding="", startoffset="", recordid="";
            showLoadIcon();
            var endpadding = Math.round(parseFloat($(this).parent().find(".r").css('padding-top')) / 15) * 15;
            if(endpadding>210)endpadding=210;
            endpadding = endpadding + "px";
            console.log("endpadding"+endpadding);
            var recordid = $(this).parent().attr('recordid');
            $(this).parent().find("#bordercloned").remove();
            $.ajax({
              type: "POST",
              url: "/page/submit/",
              data: {comm: "saverecord", pageid: $pageid, recordid: recordid, margintop: endpadding, onlythisfield: 'margintop'},
              dataType : "text",
              success: function(data){
                  console.log(data);
                  hideLoadIcon();
                  updateRecord(recordid);
                  updateUndoButton();
              },
              error: function(){
                  hideLoadIcon();
              },
              timeout: 1000*90
            });

        }
    });

    $( ".recordborderbottom" ).draggable({
        axis: "y", grid: [ 15, 15 ],
        start: function() {
            startpadding = Math.round(parseFloat($(this).parent().find(".r").css('padding-bottom')));
            startoffset = Math.round(parseFloat($(this).offset().top));
            console.log("startpadding"+startpadding);
            console.log("startoffset"+startoffset);
        },
        drag: function() {
            offset = $(this).offset().top - startoffset;
            padding = startpadding + offset;
            if(padding<0)padding=0;
            $(this).parent().find(".r").css('padding-bottom',padding+'px');
            $(this).css('display','block');
        },
        stop: function() {
            offset="", padding="", startoffset="", recordid="";
            showLoadIcon();
            var endpadding = Math.round(parseFloat($(this).parent().find(".r").css('padding-bottom')) / 15) * 15;
            if(endpadding>210)endpadding=210;
            endpadding = endpadding + "px";
            var recordid = $(this).parent().attr('recordid');
            console.log("endpadding"+endpadding);
            $.ajax({
              type: "POST",
              url: "/page/submit/",
              data: {comm: "saverecord", pageid: $pageid, recordid: recordid, marginbottom: endpadding, onlythisfield: 'marginbottom'},
              dataType : "text",
              success: function(data){
                  console.log(data);
                  hideLoadIcon();
                  updateRecord(recordid);
                  updateUndoButton();
              },
              error: function(){
                  hideLoadIcon();
              },
              timeout: 1000*90
            });

        }
    });

}

function serializeEx($form) {
    var data = [];
    $form.find('input').each(function(){
        var $elem = $(this);
        var name = $elem.attr('name');
        if (! $elem.prop('disabled')) {
            if($elem.attr('type') == 'radio' || $elem.attr('type') == 'checkbox') {
                if($elem.is(':checked')) {
                    data[name] = $elem.val();
                }
            } else if ($elem.prop('tagName') == 'SELECT') {
                $data[name] = $elem.find('option:selected').val();
            } else {
                data[name] = $elem.val();
            }
        }
    });
    
    $form.find('textarea').each(function(){
        var $elem = $(this);
        var name = $elem.attr('name');
        if (! $elem.prop('disabled')) {
            $data[name] = $elem.html();
        }
    })

    $form.find('select').each(function(){
        var $elem = $(this);
        var name = $elem.attr('name');
        if (! $elem.prop('disabled')) {
            $data[name] = $elem.find('option:selected').val();
        }
    })
    return data;
}

var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i,
    manipulation_rcheckableType = /^(?:checkbox|radio)$/i;

jQuery.fn.extend({
    serializeEx: function() {
        return jQuery.param( this.serializeArrayEx() );
    },
    serializeArrayEx: function() {
        return this.map(function() {
         // Can add propHook for "elements" to filter or add form elements
         var elements = jQuery.prop( this, "elements" );
         return elements ? jQuery.makeArray( elements ) : this;
        })
        .filter(function() {
            var type = this.type;
            // Use .is(":disabled") so that fieldset[disabled] works
            return this.name && !jQuery( this ).is( ":disabled" ) &&
                rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                ( this.checked || !manipulation_rcheckableType.test( type )  );
        })
        .map(function( i, elem ) {
      
            var val;
            if(jQuery( this ).prop('tagName') == 'TEXTAREA') {
                val = jQuery( this ).html();
            } else {
                val = jQuery( this ).val();
            }
      
            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val ) {
                     return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    }) :
                { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();
    }
});
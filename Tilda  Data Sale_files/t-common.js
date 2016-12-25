function show_BubbleNotice(text,delay){
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

function showOnboardingPin(pinid,str,left,top,elem,fixed,shiftbubbleleft,shiftbubbletop){
	
	if( $(window).width()<1200 )return('');
	
	var firstopen = localStorage.getItem('tp-pin-'+pinid);
	if(firstopen!==null){
		return;
	}
		
	var data='';
	data += "<div class='onboardingpin' id='"+pinid+"' data-pin-left='"+left+"' data-pin-top='"+top+"' data-pin-fixed='"+fixed+"' data-pin-elem='"+elem+"'>";
	data += "<div class='onboardingpin__wrapper'>";
	data += "<div class='onboardingpin__pin'></div>";
	data += "<div class='onboardingpin__bubble' style='" + (shiftbubbleleft>-2000 ? "left:"+shiftbubbleleft+"px;" : "") + (shiftbubbletop>-2000 ? "top:"+shiftbubbletop+"px;" : "") + "' id='"+pinid+"'>";
	data += "<div class='onboardingpin__msg'>"+str+"</div>";
	data += "<div class='onboardingpin__btn-close'>OK</div>";				
	data += "</div>";
	data += "</div>";		
	data += "</div>";
	$('body').prepend(data);
	
	var el=$("#"+pinid);
	updatePinPosition(el);
	
	el.mouseover(function() {
	  if( $(this).hasClass('onboardingpin_opened')===true )return('');
	  $( this ).addClass('onboardingpin_opened');
	  $(this).find(".onboardingpin__bubble").css('opacity',0);
	  $(this).find(".onboardingpin__bubble").animate({"opacity": "1"}, 500,"easeOutCirc");
	  
	  if ( $( ".onboardingpin__filter" ).length==0 ) {
	  	$('body').prepend("<div class='onboardingpin__filter' style='opacity:0;'></div>");	  	
	  	$(".onboardingpin__filter").animate({"opacity": "0.7"}, 300,"easeOutCirc");
	  	
		$( ".onboardingpin__filter" ).click(function() {
			closeOnboardingPinHtml();
		});						  	
	  }
	  localStorage.setItem('tp-pin-'+pinid, Date.now() );		  
	});				

	$( ".onboardingpin__btn-close" ).click(function() {
		closeOnboardingPinHtml();
	});						

	setInterval(function() {
	  updatePinPosition(el);
	}, 2000);
	
}

function updatePinPosition(pin){
	var left=parseInt(pin.attr('data-pin-left'));
	var top=parseInt(pin.attr('data-pin-top'));	
	var fixed=pin.attr('data-pin-fixed');	
	
	var elem_left=0;
	var elem_top=0;
	var elem=pin.attr('data-pin-elem');
	if(elem!=''){
		if($(elem).length){
			var offset=$(elem).offset();
			elem_left=parseInt(offset.left);
			if(fixed!='fixed')elem_top=parseInt(offset.top);
		}
	}
	if(fixed=='fixed')pin.css('position','fixed');	
	pin.css('left',left+elem_left+'px');
	pin.css('top',top+elem_top+'px');
}

function closeOnboardingPinHtml(el){
	  $('.onboardingpin_opened').remove();
	  $('.onboardingpin__filter').remove();		
}

window.showLoadIcon = function (){
	if ($('#loadicon').length == 0) {
		$('body').append('<div id="loadicon" class="spinner"></div>');
	}
	$('#loadicon').css({"display":"block"});
}

window.hideLoadIcon = function (){
	if ($('#loadicon').length > 0) {
		$('#loadicon').css({"display":"none"});
	}
}

/* блок подключения приемщиков */
$(document).ready(function(){
	window.simplereloadpage = function (url, sleep) {
		if (sleep && sleep > 0) {
			window.setTimeout(function(){
					if (url && url > '') {
						window.location.href = url;
					} else {
						window.location.reload();
					}
				},
				sleep
			);
		} else {
			if (url && url > '') {
				window.location.href = url;
			} else {
				window.location.reload();
			}
		}
	}
	
	window.oauthstart = function (url, callback, title) {
		//var url='https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id='+client_id+'&redirect_uri=https%3A%2F%2Ftilda.cc%2Foauth%2Fmailchimp%2F%3Fstate%3D'+user_id;
		var w = $(window).width() > 700 ? 600 : parseInt($(window).width()*0.9);
		var h = $(window).height() > 600 ? 600 :  parseInt($(window).height()*0.9);
		var params = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width="+w+',height='+h;

		
		window.showLoadIcon();

		if (!title || title == undefined) {
			title = 'OAuth2 authorization';
		}
		window.oauthstartwin = window.open(url, title, params)
	
		window.oauthcheck = setInterval(
			function () {
				if(window.oauthstartwin && window.oauthstartwin.document){
					var elem = window.oauthstartwin.document.getElementById('messageid');
					if (elem) {
						window.hideLoadIcon();
						clearInterval(window.oauthcheck);
						window.oauthcheck = false;
						window.oauthstartwin.close();
						
						if (callback > '') {
							eval(callback+'()');
						}
					}
				}
			},
			200
		);

	}

	window.oauthmailchimp = function (url, callback) {
		//var url='https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id='+client_id+'&redirect_uri=https%3A%2F%2Ftilda.cc%2Foauth%2Fmailchimp%2F%3Fstate%3D'+user_id;
		var w = $(window).width() > 700 ? 600 : parseInt($(window).width()*0.9);
		var h = $(window).height() > 600 ? 600 :  parseInt($(window).height()*0.9);
		var params = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width="+w+',height='+h;

		window.showLoadIcon();

		window.oauthmailchimpwin = window.open(url, "Mailchimp Open ID authorization", params)
	
		window.oauthcheck = setInterval(
			function () {
				if(window.oauthmailchimpwin && window.oauthmailchimpwin.document){
					var elem = window.oauthmailchimpwin.document.getElementById('messageid');
					if (elem) {
						window.hideLoadIcon();
						clearInterval(window.oauthcheck);
						window.oauthcheck = false;
						window.oauthmailchimpwin.close();
						
						
						if (callback > '') {
							eval(callback+'()');
						}
					}
				}
			},
			200
		);
	}

	function mailchimpgetlists() {
		var projectid = $('#allrecords').data('tilda-project-id');
		showLoadIcon();
		$.post('/projects/forms/submit/',{comm:'getlist',recievertype:'mailchimp', projectid: projectid}, function(html){
				hideLoadIcon();
				
				$('#selectrecieverboxid').hide();
				if (html > '' && html.substring(0,1) == '<') {
					$('#dialogrecieverboxid').show();
					$('#formcontrolrecieverboxid').html(html)
					$('#formnewrecieverboxid').find('input').removeAttr('disabled');
					$form.show();
				} else {
					if (html > '' && html.substring(0,4) == 'http') {
						oauthmailchimp(html,'mailchimpgetlists');
					} else {
						$('#formcontrolrecieverboxid').html('');
						$('#formnewrecieverboxid').find('input').attr('disabled', 'disabled');
					}
				}
			},
			'html'
		);
	}

	function creategsheet() {
		var projectid = $('#allrecords').data('tilda-project-id');
		showLoadIcon();
		$.post('/projects/forms/submit/',{recievertype: 'gsheet', appid: 'new', comm:'recieveredit', projectid: projectid}, function(json){
			hideLoadIcon();
			if(json && json.message > '') {
				var recid = $('#sendformnewrecieverid').data('record-id');
				$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid green;">'+json.message+'</div>');
				
				if (json.result && json.result.hash) {
					var html = '<label class="pe-label"><input type="checkbox" name="formintegrations'+recid+'[]" value="'+json.result.hash+'" checked="checked"  data-form-type="'+json.result.type+'">Google Sheet: '+json.result.name+'</label>';
					$('#selectrecieverboxid').before(html);


					$('#formnewrecieverboxid').find('input').attr('disabled', 'disabled');
					$('#dialogrecieverboxid').hide();
					$('#selectrecieverboxid').show();
					
				}

			
			} else {
				var error = '';
				if(json && json.error) {
					error = json.error;
				} else {
					error = json;
				}

				$('#formnewrecieverlogid').html(error);
			}
		},'json');
	}
	function creategsheetwithauth() {
		var projectid = $('#allrecords').data('tilda-project-id');
		showLoadIcon();
		$.post('/projects/forms/submit/',{comm:'getoauthurl',recievertype:'gsheet', projectid: projectid}, function(html){
				hideLoadIcon();
				
				$('#selectrecieverboxid').hide();
				if (html > '' && html.substring(0,4) == 'http') {
					window.oauthstart(html,'creategsheet','Google.Sheets connect');
				} else {
					$('#formcontrolrecieverboxid').html('');
					$('#formnewrecieverboxid').find('input').attr('disabled', 'disabled');
				}
			},
			'html'
		);
	}
	
	$('body').off('change', '#selectrecieverboxid');
	$('body').on('change', '#selectrecieverboxid', function(e){
		var rtype = $(this).val();
		var lang = $(this).data('lang');
		var html = '';
		var $form = $('#dialogrecieverboxid');
		var projectid = $('#allrecords').data('tilda-project-id');
		var redirect_uri;
		$('#formnewrecieverlogid').html('');
		
		switch (rtype) {
			case 'js-reciever-email':
				html = '<input type="hidden" name="recievertype" value="email" class="js-not-send-on-server">';
				html += '<input type="text" name="appid" class="ss-input js-not-send-on-server" placeholder="'+(lang=='RU' ? 'Email' : 'Email')+'">';
				break;
			
			case 'js-reciever-mailchimp':
				showLoadIcon();
				mailchimpgetlists();
				return ;
				break;
			
			case 'js-reciever-gsheet':
				showLoadIcon();
				creategsheetwithauth();
				return ;
				break;

			default:
				if (rtype > '') {
					if (rtype.substring(0,2)=='js') {
						window.location.href='/projects/settings/?projectid='+projectid+'#tab=ss_menu_forms';
					} else {
						window.location.href='/projects/forms/'+rtype+'/?projectid='+projectid;
					}
				}
				break;
		}
		
		if (html > '') {
			$(this).hide();
			$('#formcontrolrecieverboxid').html(html)
			$('#formnewrecieverboxid').find('input').removeAttr('disabled');
			$form.show();
		} else {
			$('#formcontrolrecieverboxid').html('');
			$('#formnewrecieverboxid').find('input').attr('disabled', 'disabled');
		}
	});


	$('body').off('dblclick', '#sendformnewrecieverid');
	$('body').on('dblclick', '#sendformnewrecieverid', function(e){
		e.preventDefault();
		return false;
	});
	$('body').off('click', '#sendformnewrecieverid');
	$('body').on('click', '#sendformnewrecieverid', function(e){
		e.preventDefault();
		var arPosts = {};
		var lang = $(this).data('lang');
		var recid = $(this).data('record-id');
		$('#formnewrecieverlogid').html('');

		$('#formnewrecieverboxid').find('input,select').each(function(){
			if ($(this).attr('type')!='button' && $(this).attr('type')!='submit') {
				arPosts[ $(this).attr('name') ] = $(this).val();
			}
		});
		$('#formnewrecieverboxid').find('input').attr('disabled', 'disabled');
		$.post('/projects/forms/submit/', arPosts, function(json){
				var error = '';
				
				if (! json) {
					error = (lang == 'RU' ? '' : '');
				}
				
				if (json && json.error) {
					error = json.error;
				}
				
				if (error > '') {
					$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid red;">'+error+'</div>');
					$('#formnewrecieverboxid').find('input').removeAttr('disabled');
				} else {
					if (json.message > '') {
						$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid green;">'+json.message+'</div>');
						
						if (json.result && json.result.hash) {
							var html = '<label class="pe-label"><input type="checkbox" name="formintegrations'+recid+'[]" value="'+json.result.hash+'" checked="checked"  data-form-type="'+json.result.type+'">'+json.result.name+'</label>';
							$('#selectrecieverboxid').before(html);


							$('#formnewrecieverboxid').find('input').attr('disabled', 'disabled');
							$('#dialogrecieverboxid').hide();
							$('#selectrecieverboxid').show();
							
						}
					}
				}

			},
			'json'
		).fail(function(data){
			$('#formnewrecieverboxid').find('input').removeAttr('disabled');
			if (data && typeof(data) == 'string') {
				if (data.substring(0,1) == '{') {
					data = $.parseJSON(data);
				} else {
					$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid red;">'+data+'</div>');
				}
			}
			if (data && typeof(data) != 'string') {
				if (data.error) {
					$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid red;">'+data.error+'</div>');
				} else {
					if (data.responseText) {
						$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid red;">'+data.responseText+'</div>');
					} else {
						$('#formnewrecieverlogid').html('<div style="padding: 5px 10px; border: 2px solid red;">Temprary error. Please reload page and try again.</div>');
					}
				}
			}
		});
		return false;
	});
	
/*
	$('body').off('submit', '#formnewrecieverboxid');
	$('body').on('submit', '#formnewrecieverboxid', function(e){
		e.preventDefault();
		alert('submit');
		return false;
	});
*/
});
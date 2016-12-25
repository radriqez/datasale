function showbyid_and_hidebutton(block,butt){
	$(block).css('display','block');
	$(butt).css('display','none');
}

function showpopup(popup_div_id,data){
	$('body').addClass('td-body_popup-opened');
	$(popup_div_id).addClass('td-popup_opened');
	$(popup_div_id).find('.td-popup-window').html(data);
	$(popup_div_id).fadeIn('fast');
	$(document).keyup(keyUpFunc);		
}

function keyUpFunc(e) {
    if (e.keyCode == 27) { 
        closepopup();
    }
}

function closepopup(){
	$('body').removeClass('td-body_popup-opened');
	var popup=$(".td-popup_opened");
	if (popup.data('popup-content') != 'notdelete') {
		popup.find('.td-popup-window').html('');
	}
	popup.fadeOut();
	$(document).unbind("keyup", keyUpFunc);
}

function switchtab(tab){
	$(".td-tab-content").find('.td-tab-pane').removeClass('td-tab-pane_active');
	$(tab).addClass('td-tab-pane_active');
}

function init_popup(){
    $('.input-file input[type=file]').styler({
        filePlaceholder: 'Upload image'
    });
    $('.checkbox-btn').styler();


    $('.td-item-group').on('mouseenter focus', 'input', function(e) {
        $(e.delegateTarget).addClass('td-item-group_active');
    }).on('mouseleave blur', 'input', function(e) {
        if (e.type != 'mouseleave' || document.activeElement != this) $(e.delegateTarget).removeClass('td-item-group_active');
    });

    var $menu = $(".td-popup-menu__wrapper");
	
	if ($menu.length > 0) {
		var $line = $("#td_popup_menu__line"),
			$indicator = true,
			$active = $menu.find(".td-popup-menu__item_active"),
			default_pos = $active.offset().left - $menu.offset().left,
			default_width = $active.outerWidth();
		
		$line.css({
			left: default_pos,
			width: default_width
		});

		$(".td-popup-menu__item").click(
			function() {
				var self = $(this);
				var diff = self.offset().left - $menu.offset().left;
				$line.stop().animate({
					width: self.outerWidth(),
					left: diff
				}, 400);
			}
		);
	}
	
}

function generateFacebookBadgeForPage(projectid, pageid, id) {
	var btnid = id;
	$(document).ready(function(){
		script = '/projects/submit/badges/?projectid='+projectid+'&pageid='+pageid;
		var genbtn = $('#'+btnid);
		var inittext = genbtn.html();
		var newtext = genbtn.data('loading');
		genbtn.html(newtext);
		showLoadIcon();
		var fb_title = $('#td-ps-facebook__customize').find('[name=fb_title]').val();
		if (fb_title > '') {
			script = script + '&fb_title='+fb_title;
		}
		$.get(script,{},function(text){
			
			if (text.substring(0,4) != 'http') {
				text = 'https://'+text;
			}
			$('#facebookbadgeforpageid').css('background-image', "url('"+text+"')");
			$('#facebookpageimgid').val(text);
			$('#pagefbimgid').val(text);
			$('#fbimgpreviewsmallid').attr('src', text);
			hideLoadIcon();
			genbtn.html(inittext);
		},'text');
	});
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function delCookie(name) {
  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  console.log('del');
}

function delete_cookie( name, path, domain ) {

}

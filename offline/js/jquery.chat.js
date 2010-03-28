jQuery(function($)
{
	var action   = null;
	var form     = null;
	var textarea = null;
	var time     = null;
	var chat     = null;
	var userList = null;

	var sound = false;

	var lastKeyCode = 0;
	var lastMessage = '';

	var submitting = false;

	var messageMax = 50;

	var construct = function()
	{
		form     = $("#message");
		textarea = $("#message textarea");
		chat     = $("#chat");
		time     = $("#time").text();
		userList = $(".user_names");
		action   = form.attr("action")+'&ajax=1';

		separateUserList();

		// add events
		form.submit(postMessage);
		textarea.keydown(enterToSubmit);
		$("input[name=logout]").click(logout);

		//var timer;
		//timer = setInterval(function(){getNewMessages();}, 1500);
	}

	var postMessage = function()
	{
		var message  = textarea.val();

		if ( message.replace(/^[ \n]+$/, '') == '' )
		{
			return false;
		}

		if ( submitting == true )
		{
			return false;
		}

		if ( message == '/sound' )
		{
			if ( sound == true )
			{
				sound = false;
			}
			else
			{
				sound = true;
			}

			ringSound();
			textarea.val('');
			return false;
		}

		if ( message == '/user' )
		{
			userList.toggle();
			textarea.val('');
			return false;
		}

		if ( message == lastMessage )
		{
			if ( confirm('同じメッセージを送信しようとしています。送信を中止しますか？') )
			{
				textarea.val('');
				return false;
			}
		}

		submitting = true;
		lastMessage = message;

		var postData = form.serialize();
		var ontimeAction = action +'&now='+time

		textarea.val('');

		var messages = [{'id':'qwertyuiop', 'icon':'tanaka', 'name':'田中太郎', 'message':message}];
		appendNewMessages(messages);

		submitting = false;

		return false;

		$.post(ontimeAction, postData, 
			function(result)
			{
				submitting  = false;
				callbackMessages(result);
			}
		, 'json');

		return false;
	}

	var getNewMessages = function()
	{
		var ontimeAction = action +'&now='+time
		$.get(ontimeAction, {}, callbackMessages, 'json');
	}

	var callbackMessages = function(result)
	{
		if ( result.messages.length == 0 )
		{
			return;
		}

		var messages = result.messages;
		time = result.time;
		appendNewMessages(messages);
	}

	var logout = function()
	{
		$.post(action, {'logout':'logout'},
			function(result)
			{
				location.href = dura_url;
			}
		);
	}

	var appendNewMessages = function(messages)
	{
		var message = messages.shift();

		if ( message.id == '0' )
		{
			var content = '<div class="system">ーー '+message.message+'</div>';
		}
		else
		{
			var content = '<dl class="discuss '+message.icon+'" id="'+message.hush+'">';
			content += '<dt>'+message.name+'</dt>';
			content += '<dd><div class="bubble">';
			content += '<p class="body">'+message.message+'</p>';
			content += '</div></dd></dl>';
		}

		chat.prepend(content);

		if ( message.id == '0' )
		{
			if ( messages.length > 0 )
			{
				appendNewMessages(messages);
			}

			return;
		}

		if ( $(".discuss").length > messageMax )
		{
			while ( $(".discuss").length > messageMax )
			{
				$(".discuss:last").remove();
			}
		}

		var thisBobble = $(".bubble .body:first");
		var oldWidth  = thisBobble.width()+'px';
		var oldHeight = thisBobble.height()+'px';

		ringSound();

		thisBobble.css({
			'border-width' : '0px',
			'font-size' : '0px',
			'text-indent' : '-100000px',
			'opacity' : '0',
			'width': '0px',
			'height': '0px'
		});
		thisBobble.animate({ 
			'fontSize': "1em", 
			'borderWidth': "4px",
			'width': oldWidth,
			'height': oldHeight,
			'opacity': 1,
			'textIndent': 0
		}, 200, "easeInQuart",
			function()
			{
				if ( messages.length > 0 )
				{
					appendNewMessages(messages);
				}
			}
		);
	}

	var enterToSubmit = function(e)
	{
		if ( lastKeyCode != 32 && e.keyCode == 13 )
		{
			form.submit();
			return false;
		}

		lastKeyCode = e.keyCode;
	}

	var ringSound = function()
	{
		if ( $("a#sound").length && sound )
		{
			var soundUrl = $("a#sound").attr("href");

			try
			{
				$.sound.play(soundUrl);
			}
			catch(e)
			{
			}
		}
	}

	var separateUserList = function()
	{
		userList.find('li').each(
			function()
			{
				$(this).append(', ');
			}
		);
	}

	var var_dump = function($val)
	{
		$("#chat").prepend($val);
	}

	construct();
});
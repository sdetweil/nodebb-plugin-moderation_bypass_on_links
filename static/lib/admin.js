'use strict';

/* globals $, app, socket, define */
const our_admina="/plugins/post_link_list"
const our_keya = our_admina.split('/')[2]
define('/admin'+ our_admina, ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		console.log(our_keya+" loading our data")
		Settings.load(our_keya, $('.'+our_keya+'_settings'));
		console.log(our_keya+" loaded our data")
		$('#save').on('click', function () {
			Settings.save(our_keya, $('.'+our_keya+'_settings'), function () {
				app.alert({
					type: 'success',
					alert_id: our_keya+'-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});
	};

	return ACP;
});
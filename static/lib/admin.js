'use strict';

/* globals $, app, socket, define */
const our_admin="/plugins/post-link-list"
define('admin'+ our_admin, ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('post-link-list', $('.post-link-list'));

		$('#save').on('click', function () {
			Settings.save('post-link-list', $('.post-link-list'), function () {
				app.alert({
					type: 'success',
					alert_id: 'post-link-list-saved',
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
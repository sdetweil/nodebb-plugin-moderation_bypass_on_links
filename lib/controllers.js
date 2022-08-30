'use strict';

var Controllers = {};
//var hostControllerHelpers = require.main.require('./src/controllers/helpers'),
	//categories = require.main.require('./src/categories'),
	//db = require.main.require('./src/database');
//var async = require('async');

Controllers.renderAdminPage = function (req, res , next) {
	/*
		Make sure the route matches your path to template exactly.
		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/
console.log("our plugin render admin called ")
		res.render('admin/plugins/post_link_list', {
			post_link_list: ["foo","bar", "mary"]
		});
};

module.exports = Controllers;
'use strict';
const controllers = require('./lib/controllers');
const nconf = module.parent.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');

/*  new code   */


const plugin = {};
plugin.our_host =''
const our_admin="/plugins/post-link-list"
plugin.allowed_hosts=['github.com', 'pastebin.com','projects.raspberrypi.org', "forum.magicmirror.builders",'docs.magicmirror.builders']

plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin'+our_admin, hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin'+our_admin, controllers.renderAdminPage);

	plugin.settings = plugin.allowed_hosts
	// get our plugin  info , if set
	meta.settings.get(our_admin.split('/')[1], function(err, settings) {
		if (err) {
			winston.error('['+our_admin.slice(1)+'] Could not retrieve plugin settings!, using defaults');
			//return;
		}
		else {
			plugin.settings = settings;
		}
	});

	callback();
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: our_admin,
		icon: 'fa-tint',
		name: our_admin.split('/')[1],
	});

	callback(null, header);
};

plugin.postQueue = function (postData, callback) {
	try {
		// assume no links, or good links
		// let the post pass on thru
		postData.shouldQueue = false;
		console.log(JSON.stringify(postData,null,2))
		/*for (let link of postData.getlinks()){
			if (!checkLink(link)) {
				// bad link, send it to moderation queue
				postData.shouldQueue = true;
				// no need to check others, one bad link is enough
				break;
	  	}
	  } */
	} catch (error) {

	}

	callback(null, postData);
};

checkLink = function(link) {


	if(plugin.our_host === ''){
		plugin.our_host=nconf.get('url').toLowerCase().split('/')[2].split(':')[0]
		// add our url to the list
		plugin.allowed_hosts.push(plugin.our_host)
	}

	// if the link doesn't have a mode
	if (link.slice(0, 2) === '//') {
		// add http
		link = 'http:' + link;
	}

	// if it doesn't have a host (meaning us)
	if (link[0] === '/') {
		// add us
		link = nconf.get('url') + link;
	}

	// get just the host from the link
	let link_host = link.toLowerCase().split('/')[2].split(':')[0]

	if(allowed_hosts.includes(link_host))
		  console.log("allowed link")
			return true
		else
			console.log("link to host "+ link_host+" not allowed")
			return false;

};

module.exports = plugin;
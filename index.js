'use strict';
//const controllers = require('./lib/controllers');
const nconf = module.parent.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const Posts = require.main.require('./src/posts');

/*  new code   */


const plugin = {};

plugin.our_host =''

// only use the literal in pne place
const our_admin="/plugins/post_link_list"
// get the key part
const our_key = our_admin.split('/')[2]
// default (test) hosts
plugin.allowed_hosts=['github.com', 'pastebin.com','projects.raspberrypi.org', "forum.magicmirror.builders",'docs.magicmirror.builders']

// init function
plugin.init = function (params, callback) {

  console.log(our_admin +" entering init")

  // go to the rener link
	let renderAdminPage = function (req, res , next) {
		console.log('admin'+our_admin +" renderAdminPage called, settings=",plugin.settings)
		res.render('admin'+our_admin, {
			post_link_list: plugin.settings
		});
	};

	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin'+our_admin, hostMiddleware.admin.buildHeader, renderAdminPage);
	router.get('/api/admin'+our_admin, renderAdminPage);

	// get the default settings
	plugin.settings = plugin.allowed_hosts
	// get our plugin  info , if set
	meta.settings.get(our_key, function(err, settings) {
		console.log(our_admin+" retrieved settings ", err, settings)
		if (err) {
			winston.error('['+our_key+'] Could not retrieve plugin settings!, using defaults');
			//return;
		}
		else {
			// hm, got here with no data.. ???
			console.log(our_admin+" init found our settings ", settings)
			//plugin.settings = settings;
		}
	});
	console.log(our_admin +" leaving init")
	callback();
};

// watch dor data save
plugin.actionSettingsSet = async function (hookData) {
	console.log("settings saved for ", hookData)
  if (hookData.plugin === our_key) {
     // plugin.settings = await meta.settings.get(our_key);
      console.log("settings reloaded=",plugin.settings);
  }
};
// add our admin page to the plugin menu in admin
plugin.addAdminNavigation = function (header, callback) {
	console.log("adding admin nav ")
	header.plugins.push({
		route: our_admin,
		icon: 'fa-tint',
		name: our_key,
	});

	callback(null, header);
};

// add our data for the template to use
plugin.onAdmin = function (data, callback) {
		console.log(our_key+" onAdmin called")
		data.templateValues[our_key] = plugin.settings;
		console.log(our_key+" onAdmin called data=",data.templateValues[our_key] )
    callback(null, data);
};

// handler for post intending to go to moderation queue
// we will check the links to see if they are appropriate for new users, spamers advertise their sites.
// if an off site link is used, send to moderation queue, else let go thru without moderation,
// don't imact real new users as much as possible
plugin.postQueue = async function (postData) {
	try {
		// assume no links, or good links
		// let the post pass on thru
		const mockPost = { content: postData.data.content };
		await Posts.parsePost(mockPost);
		console.log(mockPost.content)
		const regex = /href=\"([^"]*)"/ig;
		// get just the href= for all the links
		let links=mockPost.content.match(regex)
		console.log("post data="+JSON.stringify(mockPost.content.match(regex),null,2))
		postData.shouldQueue = false;

		for (let link of links){
			console.log("x="+link)
			link=link.slice(6,-1)
			console.log("x1="+link)
			if (!plugin.checkLink(link)) {
				// bad link, send it to moderation queue
				postData.shouldQueue = true;
				// no need to check others, one bad link is enough
				break;
	  	}
	  }
	} catch (error) {
		console.error("oops. postQueue error=",error)
	}

	return postData;
};

// check the link in our 'good' list
plugin.checkLink = function(link) {

	// if we haven't saved our url host yet,  do it now
	if(plugin.our_host === ''){
		// get our host, inlcuding port
		plugin.our_host=nconf.get('url').toLowerCase().split('/')[2] //.split(':')[0]
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

	// get just the host from the link, including port
	let link_host = link.toLowerCase().split('/')[2] //.split(':')[0]

	// is there host link in our good list
	if(plugin.allowed_hosts.includes(link_host)){
		  console.log("allowed link to="+link_host)
		  // yes
			return true
		}
		else{
			console.log("link to host "+ link_host+" not allowed")
			// no
			return false;
		}

};

module.exports = plugin;
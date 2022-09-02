'use strict';

const nconf = module.parent.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const Posts = require.main.require('./src/posts');

const plugin = {};

plugin.our_host =''

// get the key part of our name from the folder
const our_key= __dirname.split('-').reverse()[0]
// only use the literal in pne place
const our_admin="/plugins/"+our_key
// regex to get href= link info from post html
const regex = /href=\"([^"]*)"/ig;

// default (test) hosts
plugin.allowed_hosts=['github.com', 'pastebin.com','projects.raspberrypi.org', "forum.magicmirror.builders",'docs.magicmirror.builders']

// init function
plugin.init = function (params, callback) {

  console.log(our_admin +" entering init, params=", __dirname)

  // go to the render link
	let renderAdminPage = function (req, res , next) {
		console.log('admin'+our_admin +" renderAdminPage called, settings=",plugin.settings, "admin"+our_admin)
		res.render('admin'+our_admin, {url_list:plugin.settings, name: our_key});
	};

	const router = params.router;
	const hostMiddleware = params.middleware;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin'+our_admin, hostMiddleware.admin.buildHeader, renderAdminPage);
	router.get('/api/admin'+our_admin, renderAdminPage);

	// set the default settings
	plugin.settings=[]

	console.log("trying to call meta get, our_key=", our_key)
  meta.settings.getOne(our_key, "urls").then( (ss) => {
		console.log(our_admin +" leaving init ss=",ss)
		if(ss)
			plugin.settings=ss
	})

	plugin.setList()
	callback();
};
// set the list to check 
plugin.setList = function(){
	// from settings
	plugin.allowed_hosts=plugin.settings
};	

// watch for data save
plugin.actionSettingsSet = async function (hookData) {
	console.log(our_key+" settings saved for ", hookData)
  if (hookData.plugin === our_key) {
		let s = await meta.settings.getOne(our_key, "urls");
    plugin.settings = s
    plugin.setList()
    console.log(our_key+" settings reloaded=",s);
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
// we will check the links to see if they are appropriate for new users, spammers advertise their sites.
// if an off site link is used, send to moderation queue, else let go thru without moderation,
// don't ipmact real new users as much as possible
plugin.postQueue = async function (postData) {
	try {
		// assume no links, or good link
		// let the post pass on thru

		postData.shouldQueue = false;
		// get the post meta content
		const mockPost = { content: postData.data.content };
		// convert to html
		await Posts.parsePost(mockPost);
		console.log(mockPost.content)

		// get just the href= for all the links
		let links=mockPost.content.match(regex)
		console.log("post data="+JSON.stringify(mockPost.content.match(regex),null,2))

		// loop thru the links, if any

		for (let link of links){
			console.log("x="+link)

			// remove the href="..."
			link=link.slice(6,-1)
			console.log("x1="+link)

			// check for this link host in the list 
			// false is not in the list, a bad result
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
	let link_host = link.toLowerCase().split('/')[2] 

	// is the host link in our good list
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
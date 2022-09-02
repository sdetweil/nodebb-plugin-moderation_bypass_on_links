'use strict';

/* globals $, app, socket, define */
const ACP = {};

const our_keya= "moderation_bypass_on_links"
const our_admina="/plugins/"+our_keya

console.log(" our key is "+our_keya)

define('admin/'+our_admina, ['settings','alerts'], function (Settings,alerts) {
	//var ACP = {};
	console.log(our_admina+ " admin define running")

	ACP.init = function () {
		console.log(our_keya+" ACP init running")

		// delete button clicked
		$('#delete').on('click', function () {
			console.log(our_keya +" delete clicked ")
			var selected = [];
			// get all the selected checkboxes, if any
			$('#urls input:checked').each(function() {
				  // get the url host name
			    selected.push($(this).attr('name'));
			});
			// if some were selected
			if(selected.length){
				// loop thru them to remove from page
				selected.forEach((url)=>{
					// remove the checkbox
					$("#urls").find('input[name="'+url+'"]').remove()
					// remove the input field after
					let input_field=$("#urls").find('input[value="'+url+'"]')
					// remove the break after
					$(input_field).next().remove();
					// remove the checkbox
					$(input_field).remove();
				})
			} else  {
				console.log("no items selected for delete")
			}
		})

		// add clicked
		$('#add').on('click', function () {
			console.log(our_keya +" new  clicked ")
			// get the value in the new field
			let newitem=$('#new').val().toLowerCase()
			// if not empty
			if(newitem !== ''){
				// if it is the full url, get just the server name(and port if any)
				if(newitem.startsWith('http')){
					newitem = newitem.split('/')[2]
				}
				//
				let selected = [];
				// get the existing list of urls
				$('#urls').find('input[type="text"]').each(function() {
				    selected.push($(this).attr('value'));
				});
				// don't allow duplicates
				if(!selected.includes(newitem)){
					console.log("got new entry="+newitem)
					// add a new checkbox
					$('<input type="checkbox"/>')
			     .attr("name", newitem)
			     .appendTo("#urls");
					// and read only entry field  with the data
					$('<input type="text" readonly maxlength="100" width="500"/>')
				     .attr("value", newitem)
				     .appendTo("#urls");
				  // append a line break
					$('<br>')
				     .appendTo("#urls");
				  // and clear the input field
				  $('#new').val('')
				}
			} else {
				console.log("new entry field empty")
			}
		})

		// save clicked
		$('#save').on('click', function () {
			console.log(our_keya +" save  clicked ")
			let selected = [];
			// get all the input fields (if any)
			$('#urls').find('input[type="text"]').each(function() {
				// get the value of the inout field (a url host name)
				selected.push($(this).attr('value'));
			});
			let url_list = {urls:selected}
			console.log("urls to save=",selected, url_list)

			//let sss=['github.com', 'pastebin.com','projects.raspberrypi.org', "forum.magicmirror.builders",'docs.magicmirror.builders'];
			try {
				// save the list
				Settings.set(our_keya,url_list).then( ()=>{
					console.log("settings save completed")
						alerts.alert({
							type: 'success',
							alert_id: our_keya+'-saved',
							title: 'Settings Saved',
							message: 'Please reload your NodeBB to apply these settings',
							clickfn: function () {
								socket.emit('admin.reload');
							},
						});
				})
			} catch(error){
				console.log("save error=",error)
			}

			console.log(our_keya +" settings save executed")
		});
	};
	console.log(our_admina+ " admin define ending returning acp keys=", Object.keys(ACP))
	return ACP;
});

module.exports = ACP;
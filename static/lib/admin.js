'use strict';

/* globals $, app, socket, define */
const ACP = {};
const our_admina="/plugins/post_link_list"
const our_keya = our_admina.split('/')[2]
const our_data = {}
our_data.items=""
define('admin/plugins/post_link_list', ['settings','alerts'], function (Settings,alerts) {
	//var ACP = {};
	console.log(our_admina+ " admin define running")

	ACP.init = function () {
		console.log(our_keya+" ACP init running")
		/*Settings.load(our_keya, our_data.items, (v)=>{console.log("settings loaded", v)

		//$('.'+our_keya+'_settings').val(['github.com', 'pastebin.com','projects.raspberrypi.org', "forum.magicmirror.builders",'docs.magicmirror.builders'])
		console.log(our_keya+" loaded our data= ", our_data.items )
		});*/


		$('#delete').on('click', function () {
			console.log(our_keya +" delete clicked ")
			var selected = [];
			$('#urls input:checked').each(function() {
			    selected.push($(this).attr('name'));
			});
			if(selected.length){
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

		$('#add').on('click', function () {
			console.log(our_keya +" new  clicked ")
			// get the value in the new field
			let newitem=$('#new').val().toLowerCase()
			// if not empty
			if(newitem !== ''){
				console.log("got new entry="+newitem)
				// add a new checkbox
				$('<input type="checkbox">')
		     .attr("name", newitem)
		     .appendTo("#urls");
				// and read only entry field  with the data
				$('<input type="text" readonly maxlength="100" width="500">')
			     .attr("value", newitem)
			     .appendTo("#urls");
			  // append a line break
				$('<br>')
			     .appendTo("#urls");
			  // and clear the input field
			  $('#new').val('')
			} else {
				console.log("new entry field empty")
			}
		})

		$('#save').on('click', function () {
			console.log(our_keya +" save  clicked ")
			var selected = [];
			$('#urls').find('input[type="text"]').each(function() {
			    selected.push($(this).attr('value'));
			});

			console.log("urls to save=",selected)

			//let sss=['github.com', 'pastebin.com','projects.raspberrypi.org', "forum.magicmirror.builders",'docs.magicmirror.builders'];
			try {
			Settings.save(our_keya,selected, (err,sss)=>{
				if(err){
					console.log("error during save",err)
				} else {
				console.log("settings save completed")
				console.log("returned value=",sss)
					alerts.alert({
						type: 'success',
						alert_id: our_keya+'-saved',
						title: 'Settings Saved',
						message: 'Please reload your NodeBB to apply these settings',
						clickfn: function () {
							socket.emit('admin.reload');
						},
					});
				}
			})
			} catch(error){
				console.log("save error=",error)
			}
		/*	meta.settings.set(our_key, function(err, sss) {
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
			}) */
			console.log(our_keya +" settings save executed")
		});
	};
	console.log(our_admina+ " admin define ending returning acp keys=", Object.keys(ACP))
	return ACP;
});

module.exports = ACP;
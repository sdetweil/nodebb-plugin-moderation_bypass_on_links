<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">Valid Link destinations</div>
	<div class="col-sm-10 col-xs-12">
		<div class="row {name}_defaults">
			 <form id="urls" role="form" class="{name}_settings">
				{{{each url_list}}}
					<input type="checkbox" name="{@value}"/>
					<input type="text" value="{@value}"  readonly maxlength="100" width="500"/><br>
				{{{ end }}}
			 </form>
			 </br> </br>			 
			 <label>to add a new url to the list, enter it here, then click add</br>
			  you can paste in a full url and the plugin will just use the host info
			 </label></br>
			 <input id="new" type="text" name="new" maxlength="100" width="500" style="border:1px solid #0a0909">
			 <button id="add" class="primary btn-primary mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
				 <i class="material-icons" width="500" height="600">add</i>
			 </button>
			 </br>
			 <label>to delete, select those to remove, then click delete</label></br>
			 <button id="delete" class="primary btn-primary mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
				 <i class="material-icons" width="500" height="600">delete</i>
			 </button>			 
		</div>
	</div>
</div>

<div class="floating-button">
	<button id="save" class="primary btn-primary mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
		<i class="material-icons">save</i>
	</button>
</div>
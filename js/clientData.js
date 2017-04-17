
var meta = {};
var formSubmitted = false;
var userSession;
var session;

function getValue(elem){
	var tag=elem.prop('tagName');
	var name=elem.attr('name');
	if(tag=='INPUT'){
		if(elem.attr('type')=='radio'){
			return $("input:radio[name="+name+"]:checked").val();
		}else if(elem.attr('type')=='checkbox'){
			var cb = $("input:checkbox[name="+name+"]");
			if(cb.prop('checked')) return cb.val();
			if(cb.attr('no-val')) { console.log(name + " N" ); return cb.attr('no-val'); }
			return null;
		}else{
			return elem.val();
		}
	}else if(tag=='SELECT'||tag=='TEXTAREA'){
		return elem.val();
	}else if(tag=='SPAN'){
		return elem.text();
	}else{
		if(elem.attr('value')) return elem.attr('value');
		else return null;
	}
}

function setValue(elem,value){
	var tag=elem.prop('tagName');
	var name=elem.attr('name');
	if(tag=='INPUT'){
		if(elem.attr('type')=='radio'){
			$("input:radio[name="+name+"]").val([value]);
			$("input:radio[name="+name+"][value="+value+"]").change();
		}else if(elem.attr('type')=='checkbox'){
			$("input:checkbox[name="+name+"]").val([value]);
		}else{
			elem.val(value);
		}
	}else if(tag=='SELECT'||tag=='TEXTAREA'){
		elem.val(value);
	}else if(tag=='SPAN'){
		elem.text(value);
	} else {
		elem.attr('value',value);
		if(elem.data('setdata'))elem.data('setdata')();
	}
	if(elem.change)	elem.change();
}

var _MODELS=[];

var simpleModel = {};

function getModelName(obj){
	if(obj){
		var name=typeof(obj)==='string'?obj:obj.attr('model');
		name=name.split(':')[0];return name;
	}
}

function findModel(name){
	for(var i=0;i<_MODELS.length;i++){
		if(_MODELS[i].name==name)return i;
	}
	return-1;
}

function findNode(obj){
	var m=getModel(obj);
	var modelName=getModelPath(obj);
	var nodes=modelName.split('.');
	var firstNode=nodes.shift();
	if(true){}
}

function getModel(obj){
	var name=getModelName(obj);
	var i=findModel(name);
	if(i>=0){
		return _MODELS[i];
	}else{
		_MODELS.push({'name':name,'data':{},'context':{isDirty:false}});
		return _MODELS[_MODELS.length-1];
	}
}

function getModels(arr){
	var res={};
	for(var i=0;i<arr.length;i++){
		res[arr[i]]=getModel(arr[i]);
	}
}

function setModels(models){
	for(var i in models){
		var model=getModel(i);
		model.data=models[i];
		propagateModel(i)
	}
}

function clearModel(obj){
	var name=getModelName(obj);
	var i=findModel(name);
	if(i>=0){
		_MODELS[i]={'name':name,'data':{},'context':{}}
	}
}

function modelNode(data,modelName,value){
	if(modelName){
		var p=modelName.split('.');
		var firstElem=p.shift();
		var core=firstElem.replace('@','');
		if(!data[core]){
			if(firstElem.substring(0,1)=='@'){
				data[core]=[];
			}else{
				data[core]={};
			}
		}
		return modelNode(data[core],p.join('.'),value);
	}else{
		if($.isArray(data)&&$.isArray(value)){
			data=value;
		}else if($.isArray(data)){
			data.push(value)
		}else{
			for(var i in value)data[i]=value[i];
		}
		return data;
	}
}

function getModelPath(obj){
	var modelName=typeof(obj)==='string'?obj:obj.attr('model');
	var p=modelName.split(':');
	if(p.length>1)return p[1];
	else return null;
}

function test(){
	alert(typeof($('#nameId'))+typeof('uewyqui'));
}
	
function set(){
	setValue($('[name='+$('[name=elem]').val()+']'),$('[name=val]').val());
}

function setField(elem){
	var model=getModel(elem);
	var modelName=getModelPath(elem);
	var d={};
	d[elem.attr('name')]=getValue(elem);
	modelNode(model.data,modelName,d);
	modelHasChanged(modelName,true);
}

function propagateModel(modelName){
	var model=getModel(modelName);
	$('[model]').each(function(){
		var p=$(this).attr('model').split(':');
		if(p[0]==modelName){
			var elemModelName=p[1];
			var node=modelNode(model.data,elemModelName);
			setValue($(this),node[$(this).attr("name")]);
		}
	});
}

function modelHasChanged(obj,isDirty){
	var model=getModel(obj);
	if(model&&model.context){
		model.context.isDirty=isDirty;
		if(model.context.change){
			model.context.change(model.context.isDirty);
		}
	}
}

function addSection(elem){
	var fromModelName=elem.attr('modelForm');
	var fromModel=getModel(fromModelName);
	var fromData=modelNode(fromModel.data,getModelPath(fromModelName));
	var toModel=getModel(elem.attr('toModel'));
	var modelName=getModelPath(elem);
	modelNode(toModel.data,modelName,copyHash(fromData));
	modelHasChanged();
}

function copyHash(a){
	return JSON.parse(JSON.stringify(a));
}

function showModel(id){
	if(!id)id='output';$('#'+id).text(JSON.stringify(_MODELS));
}

function initModels(){
	$('[model]').each(function(){
		$(this).off('change');
		setField($(this));
		$(this).change(function(){
			if($(this).attr('onchange')) eval($(this).attr('#onchange'));
			setField($(this));
		});
	});
	$('[modelAction=add]').click(function(){
		addSection($(this));
	});
}

function populateSelect(p){
	var elem=$('#'+p.id);
	if(elem.children) elem.children().remove();
	if(p.list){
		for(var i=0;i<p.list.length;i++){
			if(typeof p.list[i]=='string'||typeof p.list[i]=='number'){
				elem.append('<option value="'+p.list[i]+'">'+p.list[i]+'</option>');
			}else{
				elem.append('<option value="'+
				(p.valueField?p.list[i][p.valueField]:p.list[i].value)+'">'+
				(p.textField?p.list[i][p.textField]:p.list[i].text)+'</option>');
			}
		}
	}
}

function errorMSG(error) {
	$('#modalSaveButton').hide();
	$('.modal-title').addClass('error');
	$('.modal-title').html('<span class="error"><i class="fa fa-exclamation-circle"></i> Error</span>');
	$('.modal-body').html(error);
	setTimeout(function() { $('#myModal').modal({}) }, 200);
}

function message(msg) {
	$('#modalSaveButton').hide();
	$('.modal-title').removeClass('error');
	$('.modal-title').text('Message');
	$('.modal-body').html(msg);
	setTimeout(function() { $('#myModal').modal({});  }, 200);
}

function getModelMeta(type) {
	return modelMeta[type];
}

function getInputValues(modelName) {
	var d = {};
	$('[model=' + modelName+']').each(function() {
		d[$(this).attr('name')] = getValue($(this));
	});
	return d;
}

function setInputValues(modelName, d) {
	$('[model=' + modelName+']').each(function() {
		var name = $(this).attr('name');
		if(d[name]) setValue($(this), d[name]);
	});
}


function deleteRecord(p) {
	if(p.type && p.id) {
		var meta = getModelMeta(p.type);
		if(meta.deleteConfirm) {
			if(confirm(meta.deleteConfirm)) {
				$.ajax({
					'url' : 'deleteRecord.php',
					'data' : {
						'model' : p.type,
						'id' : p.id
					},
					'dataType' : 'json',
					'type' : 'POST',
					'success' : function(json) {
						if(json.result == 'OK') {	
							if(meta.onchange) eval(meta.onchange);
						} else errorMSG(json.error);
					},
					'error': defaultErrorFunction
				});
			}
		}
	}
}

function saveModalModel() {
	var model = $('#currentModel').val();
	var id = $('#currentID').val();
	if(model) {
		var meta = getModelMeta(model);
		var d = getInputValues(meta.model);
		if(id) d.id = id;
		console.log(meta.model + " " + JSON.stringify(d));
		$.ajax({
			'url' : 'saveData.php',
			'data' : {
				'model' : model,
				'data' : d
			},
			'dataType' : 'json',
			'type' : 'POST',
			'success' : function(json) {
				if(json.result == 'OK') {
					if(meta.onchange) eval(meta.onchange);
				} else errorMSG(json.error);
			},
			'error' : defaultErrorFunction
		})
	} else errorMSG("No model");
}

function pwdResetModal(p) {
	var meta = getModelMeta(p.type);
	$('#modalSaveButton').show();
	$('.modal-title').removeClass('error');
	var d = getModel('user').data;
	var title = meta.title; 
	for(var i=0; i<d.length; i++) {
			if(d[i]['id'] == p.id) {
				title += d[i].first_name + ' '+ d[i].last_name;
			}
	}
	
	$('#currentModel').val(p.type);
	$('#currentID').val(p.id);
	$('.modal-title').text(title);
	var tpl = $('#' + meta.tpl).html();
	tpl = replaceAll(tpl, meta.tplModel, meta.model);
	tpl = replaceAll(tpl, '_id', 'id');
	$('.modal-body').html(tpl);
	$('.modal-body').html(tpl);
	$('#myModal').modal({});
}

function edit(p) {
	// console.log(JSON.stringify(p));
	var meta = getModelMeta(p.type);
	// console.log(JSON.stringify(meta));
	var data = simpleModel[meta.dataModel];
	// console.log(JSON.stringify(data));
	if(data) {
		var d = data;
		for(var i=0; i<d.length; i++) {
			// console.log(i + " ");
			if(d[i]['id'] == p.id) {
				$('#currentModel').val(p.type);
				$('#currentID').val(p.id);
				$('#modalSaveButton').show();
				$('.modal-title').removeClass('error');
				$('.modal-title').text(meta.title);
				var tpl = '<form>' + $('#' + meta.tpl).html() +'</form>';
				tpl = replaceAll(tpl, meta.tplModel, meta.model);
				tpl = replaceAll(tpl, '_id', 'id');
				$('.modal-body').html(tpl);
				$('#myModal').modal(
				{});
				setInputValues(meta.model, d[i]);
			}
		}
	} else {
		errorMSG("Data not found");
	}
	/**/
}

function replaceAll(s, find, replace) {
	var re = new RegExp(find, 'g');
	return s.replace(re, replace);
}

function addNew(p) {
	var meta = getModelMeta(p.type);
	$('#currentModel').val(p.type);
	$('#currentID').val('');
	$('#modalSaveButton').show();
	if(p.save) {
		$('#modalSaveButton').off( "click");
		$('#modalSaveButton').click(function() { p.save() });
	} else {
		$('#modalSaveButton').off( "click");
		$('#modalSaveButton').click(function() { saveModalModel() });
	}
	$('.modal-title').removeClass('error');
	$('.modal-title').text(meta.newTitle);
	var tpl = $('#' + meta.tpl).html();
	tpl = replaceAll(tpl, meta.tplModel, meta.model);
	tpl = replaceAll(tpl, '_id', 'id');
	$('.modal-body').html(tpl);
	$('#myModal').modal(
	{});
	initModels();
}


function doThis(p) {
	var d = getModel(p.model);
	if(d) d = d.data; else errorMSG("No model found");
	if(p.validate) {
		if(! p.validate(d)) {
			if(p.callback)
				p.callback({ data: d, result: 'error', error: 'Validation failed' });
			return false;
		}
	}	
	$.ajax({
		'url': p.act,
		'data': d,
		'dataType' : 'json',
		'type' : p.type ? p.type : 'GET',
		'success': function(json) {
			if(json.result == 'OK') {
				if(p.callback) {
					
					p.callback(json);
				} else if(json.message) {
					message(json.message);
				}
			} else {
				errorMSG(json.error);
			}
		},
		'error' : function() {
			errorMSG('There was an error connecting');
		}
	
	});
	
}

function registerNewUser() {
	doThis({ 
		'act' : 'newuser.php', 
		'model' : 'user', 
		'type' : 'POST',
		'callback' : function(json) {

			$.ajax({
				'url' : 'sendPasswordLink.php',
				'data' : { 'email': json.email },
				'dataType' : 'json',
				'success' : function(json) {
					if(json.result == 'OK' ) {
						message(json.message);
					} else {
						errorMSG(json.error);
					}
				},
				error: function() {
					errorMSG('There was an error connecting');
				}
			}); 
			
		}
	});
	
}

function sendPasswordLink(d) {	
	$.ajax({
		'url': 'setPassword.php',
		'data': d,
		'type' : 'POST',
		'dataType': 'json',
		'success' : function(json) {
			if(json.result == 'OK') 
				message(json.message);
			else 
				errorMSG(json.error);
		},
		'error' : function() {
			errorMSG("There was an error connection");
		}
	});
}

function pageLoaded(data){
	initModels();
	$('form').submit(function (evt) {
		evt.preventDefault();
	});
	if(data.callback) data.callback(data || {});
}

function getTable(p) {
	var s = '<table class="table"' + (p.id ? ' id="' +p.id+'"' : '') + '>';
	if(p.columnNames) {
		s += '<tr>';
		if(p.canEdit) s += "<th></th>";
		for(var i=0; i<p.columnNames.length; i++) {
			s += '<th>' + p.columnNames[i] + '</th>'
		}
		s += '</tr>';
	}
	if(p.data) {
		for(var i=0; i<p.data.length; i++) {
			s += "<tr>";
			var rec = p.data[i];
			if(p.canEdit) s += '<td onclick="edit(\''+p.canEdit + '\',\'' +rec.id + '\')"><i class="fa fa-pencil"></i></td>';
			if(p.tpl){
			    var row = p.tpl;
			    for(var j=0; j<p.columns.length; j++) {
					if(rec[p.columns[j]]) {
						row = replaceAll(row, '{'+p.columns[j]+'}', rec[p.columns[j]]);
					} else if(p['default'] && p['default'][p.columns[j]]) 
						row = replaceAll(row, '{'+p.columns[j]+'}', p['default'][p.columns[j]]);
					else 
						row = replaceAll(row, '{'+p.columns[j]+'}', '');
				}
				s += row;
			} else { 
				for(var j=0; j<p.columns.length; j++) {
					s += "<td>";
					if(p.renderers && p.renderers[p.columns[j]]) {
						s += p.renderers[p.columns[j]].replace('{'+p.columns[j]+'}', rec[p.columns[j]]);
					} else {
						s += rec[p.columns[j]];
					}
				}
				}
			s += "</tr>";
		}
	}
	s += "</table>";
	return s;
}

function defaultErrorFunction(e, jqXHR, ajaxSettings, thrownError) {
	errorMSG('ERROR: ' + thrownError);
}


function getPasswordRules(){
	return "Minimum password length is 6 characters (maximum 30). " +
		"The password must contain 3 of the following 4: " +
		"upper case, lower case, number and special characters: !@#$%^&*()[]:,.-";
}
// checks the validity of passwords password and password2
function validatePassword(p) {
	if(p.password.length < 6) {
		return { result: 'error', 'error' : getPasswordRules() };
	}
	var cnt = 0;
	if(p.password.match(/[a-z]/)) cnt++;
	if(p.password.match(/[A-Z]/)) cnt++;
	if(p.password.match(/[0-9]/)) cnt++;
	if(p.password.match(/[\-!@#$%^&*()\[\]:,.]/)) cnt++;
	if(cnt < 3) {
		return { result: 'error', 'error' : getPasswordRules() };
	}
	if(p.password != p.password2) {
		return { result: 'error', 'error' : "Passwords do not match" };
	}
	return { 'result' : 'OK', 'message': 'Passwords OK' }
}


function addFormRow(p) {
	$('#' + $p['table']).append(p.tpl);	
}

function addTPLRow(p) {
	var html = $('#'+p.src).html();
	var nr = $('#' + p.id+'-rn').val();
	
	nr++;
	$('#' + p.id+'-rn').val(nr);
	html=replaceAll(html, '#id', p.id);
	html=replaceAll(html, '#rn', nr);
	$('#'+ p.t).find('tbody').append(html);
	return nr;
}

function  addPLAGRow(p) {
	var nr = addTPLRow({ 
		'src': 'plagTPL', 
		't' : 'plagTable',
		'id' : 'plag' });
	populateSelect({
		'id' : 'plag' + nr  + 'Agonist',
		'list' : meta.agonist,
		'textField' : 'name',
		'valueField' : 'id'
	});
	if(p && p.id) $('#plag' + nr  + 'Agonist').val(p.id);
	populateSelect({
		'id' : 'plag' + nr  + 'AggrVals',
		'list' : meta.aggrVals
	});
	if(p && p.aggregation) $('#plag' + nr  + 'AggrVals').val(p.aggregation);
}

function addPSERow(p) {
	var nr = addTPLRow({ 
		'src': 'pseTPL', 
		't' : 'pseTable',
		'id' : 'pse' });
	populateSelect({
		'id' : 'pse' + nr  + 'Method',
		'list' : meta.pse,
		'textField' : 'name',
		'valueField' : 'id'
	});
	populateSelect({
		'id' : 'pse' + nr  + 'GP',
		'list' : meta.gp
	});
	populateSelect({
		'id' : 'pse' + nr  + 'Level',
		'list' : meta.levels
	});
}

function addPLLevelRow(p) {
	var nr = addTPLRow({ 
		'src': 'plateletLevelTPL', 
		't' : 'plLevelTable',
		'id' : 'pl' });
	populateSelect({
		'id' : 'pl' + nr  + 'LvlMeth',
		'list' : meta.pl,
		'textField' : 'name',
		'valueField' : 'id'
	});
	populateSelect({
		'id' : 'pl' + nr  + 'LvlGP',
		'list' : meta.gp
	});
	populateSelect({
		'id' : 'pl' + nr  + 'LvlLevel',
		'list' : meta.levels
	});
}

function removeRowFromTable(id){
	$('#'+id).remove();
}

function refChanged(newRef) {
	if(newRef) {
		$('#refid').val(-1);
	} 
	if($('#refid').val() == -1) {
		$('#newRefId').slideDown(200);
	} else {
		$('#newRefId').slideUp(200);
	}
}

function getMutation(p) {
	$.ajax({
		'url' : 'getMutation.php',
		'data' : { 'id' : p.id },
		'dataType' : 'json',
		'type' : 'GET',
		'success' : function(json) {
			if(json.result == 'OK') {
				p.callback(json);
			} else {
				errorMSG(json.error);
			}
		},
		'error' : defaultErrorFunction
	});
}

function saveMutation(p) {
	var d = getInputValues('mut');
	// -- deal with repeating sections --
	var nr = d.plagRN;
	d.ag = [];
	for(var i=0; i<=nr; i++) {
		if(d['agonist-'+i]) d.ag.push({
			'id' : d['agonist-'+i],
			'aggregation' : d['aggregation-'+i]
		});
	}
	var nr = d.pseRN;
	d.pse = [];
	for(var i=0; i<=nr; i++) {
		if(d['pse-method-'+i]) d.pse.push({
			'id' : d['pse-method-'+i],
			'glycoprotein' : d['pse-glycoprotein-'+i],
			'level' : d['pse-level-'+i]
		});
	}
	var nr = d.plRN;
	d.pl = [];
	for(var i=0; i<=nr; i++) {
		if(d['pl-method-'+i]) d.pl.push({
			'id' : d['pl-method-'+i],
			'glycoprotein' : d['pl-gp-'+i],
			'level' : d['pl-level-'+i]
		});
	}
	d.refs = referenceArray;
	$.ajax({
		'url' : 'saveMutation.php',
		'data' : d,
		'dataType' : 'json',
		'type' : 'POST',
		'success' : function(json) {
			if(json.result == 'OK') {
				if(json.message) message(json.message);
				if(p && p.callback) p.callback(json);
			} else {
				errorMSG(json.error);
			}
		},
		'error': defaultErrorFunction
	});
}

function getShortRef(r) {
	return r.year + ': ' + r.authors.substr(0, 20) + '; ' + 
							r.title.substr(0, 20) + '; ' 
							 + r.journal.substr(0, 15) + ','+
							r.pages.substr(0, 10);
}

function getMeta(callback) {
	$.ajax({
		'url' : 'getData.php',
		'data': { 'dataset' : 'all' },
		'dataType' : 'json',
		'type' : 'GET',
		'success' : function(json) {
			if(json.result == 'OK') {
				meta = json;
				var refs = [];;
				for(var i=0; i<meta.refs.length; i++) {
					var r = meta.refs[i];
					var s = getShortRef(r);
					refs.push({ 'value': r['id'],
						'text' : s
					});
				}
				refs.push({ 'value': -1, text: 'Add new reference' });
				populateSelect({
					'id' : 'refid',
					'list' : refs,
					
				});
				if(callback) callback();
			} else {
				errorMSG(json.error);
			}
		},
		'error' : defaultErrorFunction
		
	});
}

function getURLParameter(name) {
    return decodeURIComponent(
        (location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
    );
}

function hasSession(p) {
	if(p.session) {
		$('.userHasSession').css('display', 'block'); 
		$('.noSession').css('display', 'none'); 
		if(p.admin) $('.requireAdmin').css('display', 'block');
		else $('.requireAdmin').css('display', 'none');
		if(p.contributor) $('.requireContributor').css('display', 'block');
		else $('.requireContributor').css('display', 'none');
		userSession = p.session;
	} else {
		$('.userHasSession').css('display', 'none');
		$('.noSession').css('display', 'block'); 
		$('.requireContributor').css('display', 'none');
		$('.requireAdmin').css('display', 'none');
	}
}

function logout() {
	$.ajax({
		'url': 'logout.php',
		'dataType' : 'json',
		'type': 'GET',
		'success' : function(json) {
			if(json.result == 'OK') {
				message(json.message);
				hasSession(false);
			} else {
				errorMSG(json.error);
			}
		}
	});
}

function loadPage(href, data) {
	$('#main').css('display', 'block');
	$('#main').css('display', 'none');
	$.ajax({
		'url': href.replace('#&', ''),
		'type': 'GET',
		'cache' : false,
		'success' : function(html){
//			alert(html);
			$('#main').html(html);
			$('#main').css('display', 'block');
			convertLinks();
			pageLoaded(data || {});
		}
	});
}
    
function convertLinks(){
	$('a').each(function() {
		var href=$(this).attr('href');
		if(href && href.indexOf('#&') >= 0) {
			$(this).off('click');
			$(this).click(function(e) {
				loadPage(href);
				e.preventDefault();
			});
		}
	});
}

function sendEmail() {
	if(formSubmitted) return false;
	formSubmitted = true;
	var d = getInputValues('email');
	$.ajax({
		'url': 'sendEmail.php',
		'data' : d,
		'type' : 'GET',
		'dataType' : 'json',
		'success' : function(json){
			if(json.result == 'OK') {
				message(json.message);		
			} else {
				errorMSG(json.error);
			}
			formSubmitted = false;
		},
		'error' : defaultErrorFunction
	});
}


function drawReferences(ref) {
	$('#references').children().remove();
	for(var i=0; i<ref.length; i++) {
		$('#references').append('<li id="refLi' + i + '"><input type="hidden" value="' + ref[i].id +'">'+ 
			(ref[i].txt ? ref[i].txt : getShortRef(ref[i])) +
		' <i class="fa fa-trash clickable" title="Remove" onclick="removeReference(' + i + ')"></i> ' + 
		"</li>");
	}
}

function addReference() {
	var id = $('#refid').val();
	var txt = $('#refid option:selected').text();
	referenceArray.push({ 'id' : id, 'txt': txt });
	drawReferences(referenceArray);
}

function removeReference(n) {
	referenceArray.splice(n, 1); 
	drawReferences(referenceArray);
}

function loadRefData(data) {
	$.ajax({
		'url' : 'getref.php',
		'data' : {  'id': data.id },
		'dataType' : 'json',
		'type' : 'GET',
		'success' : function(json) {
			if(json.result == 'OK' ) {
				if(json.data.length > 0) {
					setInputValues('refEdit', json.data[0]);
					$('#refEditId').val(data.id);
				}
			} else {
				errorMSG(json.error);
			}
		},
		'error' : defaultErrorFunction	
	});
}

function setMutApproval(id) {
	var data = getInputValues('mut');
	$.ajax({
		'url': 'setApproval.php',
		'data' : { 'id' : id, 'approved' : data.approved  },
		'dataType' : 'json',
		'type' : 'POST',
		'success' : function(json) {
			if(json.result == 'OK') {
				message(json.message);
			} else {
				errorMSG(json.error);
			}
		},
		'error' : defaultErrorFunction
	});
	
}

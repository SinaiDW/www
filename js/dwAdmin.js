var pageData = {},
	currentPage;

function parseJSONToOptions(json, field) {
	var out = [];
	var parts = field.split('.');
	for(var i=0; i<json.data.length; i++) {
		var o = {};		
		var rec = json.data[i];
		o.value = rec['DT_RowId'].replace('row_', '');
		if(parts.length > 1) {
			o.label = rec[parts[0]][parts[1]];
		} else {
			o.label = json.data[i][field];
		}
		out.push(o);
	}
	return out;
}

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


function pageLoaded(data){
	initModels();
	$('form').submit(function (evt) {
		evt.preventDefault();
	});
	if(data.callback) data.callback(data || {});
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

function initModels() {
	
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

function setPage(html, data) {
	$('#main').html(html);
	$('#main').css('display', 'block');
	convertLinks();
	pageLoaded(data || {});
}

function createCellPos( n ){
    var ordA = 'A'.charCodeAt(0);
    var ordZ = 'Z'.charCodeAt(0);
    var len = ordZ - ordA + 1;
    var s = "";
 
    while( n >= 0 ) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
 
    return s;
}

function  excelButton() {
	 return {
            extend: 'excelHtml5',
            text: '<i class="fa fa-excel"></i> Excel',
            customize: function( xlsx ) {
                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                var lastCol = sheet.getElementsByTagName('col').length - 1;
                var colRange = createCellPos( lastCol ) + '1';
                //Has to be done this way to avoid creation of unwanted namespace atributes.
                var afSerializer = new XMLSerializer();
                var xmlString = afSerializer.serializeToString(sheet);
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlString,'text/xml');
                var xlsxFilter = xmlDoc.createElementNS('http://schemas.openxmlformats.org/spreadsheetml/2006/main','autoFilter');
                var filterAttr = xmlDoc.createAttribute('ref');
                filterAttr.value = 'A1:' + colRange;
                xlsxFilter.setAttributeNode(filterAttr);
                sheet.getElementsByTagName('worksheet')[0].appendChild(xlsxFilter);
            }
        }
}

function loadPage(href, data, options) {
	$('#main').css('display', 'block');
	$('#main').css('display', 'none');
	if(options && options.requireSession && ! getCookie('sessionKey')) {
		errorMSG("No valid session");
		loadPage('login.html');
		return false;
	}
	$.ajax({
		'url': href.replace('#&', ''),
		'type': 'GET',
		'cache' : false,
		'success' : function(html){
//			alert(html);
			if(data) {
				currentPage = href;
				pageData[href] = data;
			}
			setPage(html, data);
		}
	});
}

function getCurrentPageData() {
	return pageData[currentPage];
}

function nameSite(name) {
	$('#spanNameId').text(name);
}

function showProjects() {
	var siteId = getCookie('siteId');
	if(siteId) {
		$('#spanNameId').text(getCookie('siteName'));
		loadPage('showProjects.php?siteId='+siteId);	
	} else {
		loadPage('mySites.php');
	}
}

function setSite(id, name) {
	nameSite(name);
	setCookie('siteId', id);
	setCookie('siteName', name);
	loadPage('/showProjects.php?siteId='+id);
}

function setLoginButton(hasSession) {
	if(hasSession) {
		$('#loginLink').text('Log out');
	} else {
		$('#loginLink').text('Log in');
	}
}

function checkSession() {
	if(getCookie('sessionKey')) {
		$.ajax({
			'url' : 'db/checkSession.php',
			'type' : 'GET',
			'dataType' : 'json'
		}).success(function(json) {
			if(json.result == 'OK') {
				if(json.data['hasSession']) {
					setLoginButton(true);
				} else {
					message("Your session has expired.");
					setLoginButton(false);
				}
			} else {
				errorMSG(json.error);
			}
		});
	} else {
		setLoginButton(false);
	}
	setTimeout(function() { checkSession(); }, 600000); // every 10 minutes
}

function login() {
	if(getCookie('sessionKey')) {
		setCookie('sessionKey', '');
		setLoginButton(false);
		loadPage("loggedOut.html");
	} else {
		loadPage("login.html");
	}
}

function loginSubmit() {
	var data = getInputValues('login');
	if(! data.network) {
		errorMSG("Network is required");
		return false;
	}
	if(!data.password) {
		errorMSG("Password is required");
		return false;
	}	
	if(!data.username) {
		errorMSG("Username is required");
		return false;
	}
	$.ajax({
		'url' : 'db/login.php',
		'data' : data,
		'dataType' : 'json',
		'type' : 'POST'		
	}).success(function(json) {
		if(json.result == 'OK') {
			message(json.message);
			if(json.sessionKey) {
				setCookie('sessionKey', json.sessionKey);
				setCookie('userid', json.userid);
				setLoginButton(true);
			}
			if(data.remember) {
				setCookie('username', data.username);
				setCookie('remember', data.remember);
				setCookie('network', data.network);
			} else {
				setCookie('username', '');
				setCookie('remember', '');
				setCookie('network', '');
			}
		} else {
			errorMSG(json.error);
			setCookie('sessionKey', '');
		}
		if(data.remember == 'on') {
			setCookie('username', data.username);
			setCookie('remember', data.remember);
			setCookie('network', data.network);			
		} else {
			setCookie('username', '');
			setCookie('remember', '');
			setCookie('network', '');
			$('#usernameInput').val('');
			$('#networkInput').val('');			
			$('#rememberInput').val('');			
		}
		$('#passwordInput').val('');			
	});
}

function getWorkbooks(name, id) {
	loadPage('showWorkbooks.php?name='+name+'&id='+id);
}

function showWorksheets(name, id) {
	loadPage('showWorksheets.php?name='+name+'&id='+id);
}


function loginSC() {
	var version = navigator.appName + ' ' + navigator.appVersion;
    var browsername = '?';
    var fullversion = '?';
    var majorversion = '?';
    var tooold = false;
    if (version.match(/Netscape/)) {
        if (version.match(/Netscape 4.*/)) tooold = true;
        browsername = navigator.appName;
        majorversion = navigator.appVersion.replace(/([0-9]*).*/, '$1');
        fullversion = version.replace(/Netscape ([0-9.]*) .*/, '$1');
    } else if (version.match(/MSIE/)) {
        if (version.match(/MSIE [34].*/)) tooold = true;
        browsername = navigator.appName;
        fullversion = navigator.appVersion.replace(/^.*MSIE ([0-9.]*).*$/, '$1');
        majorversion = navigator.appVersion.replace(/^.*MSIE ([0-9]*).*$/, '$1');
    }	
	 var data = { 
		'username': 'andreh01',
        'password': 'Sucrose4',
        'affiliation': 'MSH',
        'os': 'Windows',
        'version': version,
        'fullversion': fullversion,
        'majorversion': majorversion,
        'browser': browsername
    }
	$.ajax({ 'url':  "https://sinaicentral.mssm.edu/intranet/Home/login/jsonAuthenticate",
        'data': data,
        'success': function (json) {
            if (json.result == 'error') {
                errorMSG(json.error);
            } else {
                rec.msg = 'OK';
                rec.endPoint = new Date();
            }
        },
        'error': function (jqXHR, msg, errorThrown) {
            if (msg == 'timeout') {
                rec.msg = "Timeout: The authentication failed to reach the server, please wait a minute and try again.";
                rec.endPoint = new Date();
            } else {
                rec.msg = msg + " login issue: " + errorThrown;
                rec.endPoint = new Date();
            }
        },
        'async': false,
        'type': 'POST',
        'dataType': 'json',
        'timeout': 10000
    });
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


function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

$.urlParam = function(name) {
  var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
  return results[1] || 0;
}


function addDataTable(json) {
	return $('#projects' + json['id']).DataTable({
		dom: 'Bfrtip',
		data: json.data,
		columns: json.columns,
		'buttons' : [ 'excel' ]
	}); 
}

function addDataTableFromID(id) {
	$.ajax({
		'url' : '/db/getData.php',
		'data' : { 'id' : id },
		'dataType' : 'json',
		'type' : 'GET'
	}).success(function(json) {
		addDataTable(json.data);
	});
}

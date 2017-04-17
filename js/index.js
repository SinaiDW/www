function open_window(name,url, more) {
    mywin = window.open(url,name+more,'toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=0,resizable=1');
//    if(mywin.focus) mywin.focus();
    try {
        mywin.focus();
    } catch(e) {
        errorMSG("<p>Your browser's popup-window blocker is preventing Sinai Central from opening a new window. </p>" + 
        " <p>Please disable popup browsers on your browser and try again. </p> " + 
        ' <p><a href="http://sinaiknowledge.mssm.edu/instructions/popup-blockers">Click here for instructions</a></p>'
        
        );
    } 
}

function getExpiration() {
    var now = new Date();
    var oneYr = new Date();
    oneYr.setYear(now.getFullYear() + 1);
    return oneYr;
}

var cookieOptions = {
    expires: 365,
    path: '/'

}

function getCookieData() {
    var ck = {
        'username': $.cookie("username"),
        'affiliation': $.cookie('affiliation'),
        'remember': $.cookie('remember') == 'Y'
    }
    return ck;
}

function clearCookieData() {
    $.cookie("username", '', { expires: -1, path: '/' });
    $.cookie("affiliation", '', { expires: -1, path: '/' });
    $.cookie("remember", '', { expires: -1, path: '/' });

}

function setCookieData(data) {
    $.cookie("username", data.username, cookieOptions);
    $.cookie("affiliation", data.affiliation, cookieOptions);
    $.cookie("remember", data.remember ? 'Y' : '', cookieOptions);
    getCookieData();
}

function setAuthenticationCookie(data) {
    if(data.remember) {
        setCookieData(data);
    } else {
        clearCookieData();
    }
}

function link(elem) {
    $.getJSON(SERVER_ROOT + "/publicContent",
        { 'tag': elem },
        function (data) {
            if (data.content) {
                $('#defaultContainer').css('display', 'none');
                $('#contentContainer').html(data.content);
                $('#contentContainer').css('display', 'block');
            } else {
                errorMSG(data.error);
            }
        });

}

function homePage() {
    $('#defaultContainer').css('display', 'block');
    $('#contentContainer').css('display', 'none');
}


function setCurrentYear() {
    var year = new Date().getFullYear();
    $('#copyrightId').html('&copy; 2000-' + year + ' Mount Sinai Health System');
}

function gotoKioskMode() {
    document.location.href = SERVER_ROOT + "w4w";
}

function gotoActivate() {
    document.location.href = SERVER_ROOT + "login/registration?action=registration";
}

function forgotPassword() {
    document.location.href = SERVER_ROOT + "login/registration?action=password";
}

function passwordReset(p) {
    var s = '';
    for (var i in p) s += i + '=' + p[i] + '&';
    document.location.href = SERVER_ROOT + "login/changeAccountPasswordScreen?" + s;
}

function checkRemember() {
    if (!$('#rememberId').prop('checked')) {
        clearCookieData();
    }
}


function showCapsAlert(show) {
    $('#capsAlert').css('display', show ? 'inline-block' : 'none');
}

function checkCaps(e) {
    e = e || window.event;

    var key = e.which ? e.which : (e.keyCode ? e.keyCode : (e.charCode ? e.CharCode : 0));
    var shift = e.shiftKey || (e.modifiers && (e.modifiers & Event.SHIFT_MASK));
    showCapsAlert((key > 64 && key < 91 && !shift) || (key > 96 && key < 123 && shift));
}

function getBrowserData() {
    var data = {}
    data.version = navigator.appName + ' ' + navigator.appVersion;
    data.browsername = '?';
    data.fullversion = '?';
    data.majorversion = '?'
    if (data.version.match(/Netscape/)) {
        data.browsername = navigator.appName;
        data.majorversion = navigator.appVersion.replace(/([0-9]*).*/, '$1');
        data.fullversion = data.version.replace(/Netscape ([0-9.]*) .*/, '$1');
    } else if (data.version.match(/MSIE/)) {
        data.browsername = navigator.appName;
        data.fullversion = navigator.appVersion.replace(/^.*MSIE ([0-9.]*).*$/, '$1');
        data.majorversion = navigator.appVersion.replace(/^.*MSIE ([0-9]*).*$/, '$1');
    }
    ;
    data.agt = navigator.userAgent.toLowerCase();
    data.os = 'other';
    if ((data.agt.indexOf("win") != -1) || (data.agt.indexOf("16bit") != -1)) data.os = 'windows';
    if (data.agt.indexOf("mac") != -1) data.os = 'mac';
    return data;
}

/**
 * Detect version of IE for notifying users of unsupported browsers
 * @returns {*}
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    // test values
    // IE 10
    //ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    //ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // IE 12 / Spartan
    //ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    var msie = ua.indexOf('MSIE ');
    if (msie > -1) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > -1) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > -1) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


function encryptAuthentication(data) {
   var key = data.key;
   var publicKey = "-----BEGIN PUBLIC KEY-----" + key.split(" ").join("\n") + "-----END PUBLIC KEY-----";

   var encrypt = new JSEncrypt();
   encrypt.setPublicKey(publicKey);

   return { 'username': encrypt.encrypt(data.authentication.username),
            'password': encrypt.encrypt(data.authentication.password),
            'affiliation': data.authentication.affiliation
   };

}


function getAuthenticationData() {
    var un = $('#usernameInput').val();
    if (!un) {
        errorMSG('Username is required');
        $('#usernameId').focus();
        return false;
    }

    var pw = $('#passwordInput').val();
    if (!pw) {
        errorMSG('Password is required');
        $('#passwordId').focus();
        return false;
    }

    var affil = $('#networkInput').val().toString();
    if (!affil) {
        errorMSG('Login Network is required');
        $('#networkInput').focus();
        return false;
    }
    
    var rememberMe = false;
    if ($('#rememberId') && $('#rememberId').prop('checked')) {
        rememberMe = true;
    }
    
    return {
        'username' : un,
        'password' : pw,
        'affiliation' : affil,
        'remember' : rememberMe
    }
}

function defaultTimeOutError(jqXHR, msg, errorThrown) {
    if (msg == 'timeout') {
        errorMSG("Timeout: The authentication failed to reach the server, please wait a minute and try again.");
    } else if (msg == 'parsererror') {
        if (console) console.log("Error parsing: " + jqXHR.responseText);
        errorMSG("Sorry, we are unable to connect at this time.  Please try again in a minute.  If the problem persists contact ITDC.");
    } else {
        //errorMSG(msg + " login issue: " + errorThrown);
        errorMSG("Sorry, we are unable to connect at this time.  Please try again in a minute.  If the problem persists contact ITDC.");
        if (console) console.log(errorThrown);
    }
}

function defaultConnectError(jqXHR, msg, errorThrown) {
    if (msg == 'timeout') {
        errorMSG("Timeout: The authentication failed to reach the server, please wait a minute and try again.");
    } else if (msg == 'parsererror') {
        errorMSG("Error parsing: " + jqXHR.responseText);
    } else {
        errorMSG("Sorry, we are unable to connect at this time.  Please try again in a minute.  If the problem persists contact ITDC.")
    }
}

function checkServerDown(d, callback) {
    $.ajax({ 'url': SERVER_DOWN_URL, 
             'data': '',
             'success': function (data) {
                  lockout_static(data);
             },
         //If we don't find the server down page, it's safe to login
             'error': function (jqXHR, msg, errorThrown) {
                  callback();
             }
     });
   
}

/*** possible parameters:
 ***  timeOutError -> a function to handle errors
 ***  connectError -> a function to handle connection errors
 ***  authentication -> A hash if absent retrieves it from form data
 *** lockout -> A function to hanlde the lockout message
 ***/

function getURLParameter(name) {
        return decodeURIComponent(
            (location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
        );
    }
    
    var serv = 'https://sinaicentral.mssm.edu/intranet';
    var SERVER_ROOT =  serv + '/Home/';
    var APPLICATION_NAME = "login";
    var EVENT_NAME = "index";
var SERVER_DOWN_URL = 'index.shtml';
 
function authenticate(d) {
    if(!d) d = {};
    var errorFunc = d.errorFunc || errorMSG;
    var authentication = d.authentication || getAuthenticationData();
    if(authentication) {
        //Check if the server is completely down, so i stop logins
        checkServerDown(d, function() {
            $.ajax({ 'url': SERVER_ROOT + "login/startCommunicate", 
                'data': '', 
                'dataType': 'json',
                'success': function (data) {
                    if (data.lock_message){
                        if(p.lockout) {
                            p.lockout(data.lock_message);
                        } else {
                            lockout(data.lock_message);
                            return;
                        }
                    }

                    if (data.warn_message) //If we find out the server is going down, note the warn message.  If they didn't log in successfully we can show it.
                        var warn_message = data.warn_message;

                    var encData = encryptAuthentication({
                        authentication : authentication,
                        key: data.key 
                    }) 
                                       
                    if (d) for (var i in d) if(i!= authentication) encData[i] = d[i];

                    var browserData = getBrowserData();
                    for (var i in browserData) data[i] = browserData[i];

                    $.ajax({ 
                        'url': SERVER_ROOT + "login/jsonAuthenticate",
                        'data': encData,
                        'success': function (json) {
                            if (json.result == 'error') {
                                if(warn_message)
                                    warnMSG(warn_message);

                                if (json.errorKey && json.errorKey == "password_reset_required") {
                                    alert("Your password needs to be changed.  Click OK to continue to the password reset screen");
                                    passwordReset(json);
                                } else {
                                    errorFunc(json.error);
                                }
                            } else {
                                setAuthenticationCookie(authentication);   
                                if(d.url) {
                                   // note the forwarded URL has to check a valid session (Again).
                                    document.location.href = d.url 
                                } else if (d.passthru) {
                                    document.location.href = SERVER_ROOT +
                                        (json.passthru_appname ? json.passthru_appname + "/" + json.passthru_eventname + "?" :
                                            "passThrough?") + d.passthru_querystring;
                                } else {
                                    var win = open_window('prod', SERVER_ROOT + "login/redirect", 'sinaicentral');
                                    $('#passwordId').val('');
                                }
                            }
                        },
                        'error': d.connectError || defaultConnectError,
                        'async': false,
                        'type': 'POST',
                        'dataType': 'json',
                        'timeout': 10000
                    });
                },
                'error': d.timeOutError || defaultTimeOutError
            });
        });
    }
}

function checkServerStatus() {
    //Check if the server is completely down, so i stop logins
    $.ajax({ 'url': SERVER_DOWN_URL, 'data': '',
        'success': function (data) {
            lockout_static(data);
        }
    });

    //Check if we need to show a warning message that the server is going down or
    //lock the user from logging in
    $.ajax({ 'url': SERVER_ROOT + "login/startCommunicate?nokey=true", 'data': '', 'dataType': 'json',
        'success': function (data) {
            if (data.lock_message){
                lockout(data.lock_message);
            } else if (data.warn_message){
                warnMSG(data.warn_message);
            }
        }
    });

}

/**
 * Keep people from logging in and display a message
 */
function lockout(message){
    $('#loginContainer').html($('#lockoutContainer').html());
    $('#lockoutMessage').text(message);
}
/**
 * Show the server down static page.
 */
function lockout_static(message){
    $('#loginContainer').html(message);
}

function testAuthenticateResponse(rec) {
    var un = $('#usernameId').val();
    if (!un) {
        errorMSG('Username is required');
        $('#usernameId').focus();
        return false;
    }

    var pw = $('#passwordId').val();
    if (!pw) {
        errorMSG('Password is required');
        $('#passwordId').focus();
        return false;
    }

    var affil = $('#affiliationId').val().toString();
    if (!affil) {
        errorMSG('Affiliation is required');
        $('#affiliationId').focus();
        return false;
    }

    var version = navigator.appName + ' ' + navigator.appVersion;
    var browsername = '?';
    var fullversion = '?';
    var majorversion = '?'
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
    ;
    var agt = navigator.userAgent.toLowerCase();
    var os = 'other';
    if ((agt.indexOf("win") != -1) || (agt.indexOf("16bit") != -1)) os = 'windows';
    if (agt.indexOf("mac") != -1) os = 'mac';
    var data = { 'username': un,
        'password': pw,
        'affiliation': affil,
        'os': os,
        'version': version,
        'fullversion': fullversion,
        'majorversion': majorversion,
        'browser': browsername
    }
    $.ajax({ 'url': SERVER_ROOT + "login/jsonAuthenticate",
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


function logIn(d) {
    authenticate(d);
}

function errorMSG(e) {
    if (e.length < 100) {
        $('#messageBar').css('background-color', '#fcc4e7');
        $('#messageBar').html('* Error: ' + e);
    }
    else {
        $('#modalContainerId').css('display', 'block');
        $('#errorMSGId').css('display', 'block');
        $('#errorContentId').html(e);
        centerModal($('#errorMSGId'));
    }
}

/**
 * Displays warning message about server outages
 */
function warnMSG(message) {
    $('#warnContainer').addClass('warnContainerActive');
    $('#warnContainer').html(message);
}


function closeErrorMSG() {
    $('#modalContainerId').css('display', 'none');
    $('#errorMSGId').css('display', 'none');
}

function helpMSG(e) {
    $('#modalContainerId').css('display', 'block');
    $('#helpMSGId').css('display', 'block');
    $('#helpContentId').html(e);
    centerModal($('#helpMSGId'));
}

function helpErrorMSG() {
    $('#modalContainerId').css('display', 'none');
    $('#helpMSGId').css('display', 'none');
}


function centerModal(modal) {
    if(modal) {
        var w = Math.floor(Number(modal.css('width').replace('px', '')));
        var h = Math.floor(Number(modal.css('height').replace('px', '')));
        modal.css('margin-left', '-' + Math.floor(w / 2) + 'px');
        modal.css('margin-top', '-' + Math.floor(h / 2) + 'px');
    }
}

function initHelpIcons() {
    $.getJSON(SERVER_ROOT + "splashEdit/helpTagsJSON",
        { 'applicationName': APPLICATION_NAME,
            'eventName': EVENT_NAME },
        function (json) {
            if (json.result == 'OK') {
                TAGS = {};
                if (json && json.tags)
                    for (var i = 0; i < json.tags.length; i++) {
                        TAGS[json.tags[i].tag] = json.tags[i].content;
                    }
                $('.dynamicHelpIcon').each(function () {
                    var tag = $(this).attr('tag');
                    if (TAGS[tag]) {
                        $(this).css('visibility', 'visible');
                        $(this).click(function () {
                            helpMSG(TAGS[tag]);
                        });
                    }
                });
            } else {
                errorMSG(json.error);
            }
        }).fail(function () {
        });
}



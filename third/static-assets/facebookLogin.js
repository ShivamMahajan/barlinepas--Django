
/**
 * Function used to display loader.
 * @author Kalia Saab
 */
function displayScreenLoader()
{ 
	var html = '<div class="greyLoading"></div>';
		html += '<div id="loadingDiv"><img src="https://nashiron.com/public/images/loadingScreen.gif" /></div>';
	$(".loading").html(html);
	$(".loading").show();
	jQuery.fn.center = function ()
    {
        this.css("position","fixed");
        this.css("top", ($(window).height() / 2) - (this.outerHeight() / 2));
        this.css("left", ($(window).width() / 2) - (this.outerWidth() / 2));
        return this;
    }
   
    $('#loadingDiv').center();
    $(window).resize(function(){
       $('#loadingDiv').center();
    });
}
/**
 * Function used to remove loader.
 * @author Kalia Saab
 */
function removeScreenLoader()
{
	$(".loading").hide();
}


window.fbAsyncInit = function() {
    FB.init({
        //appId      : '1011575052197087', // App ID for local
        appId      : '1554471128211513', // App ID
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true,  // parse XFBML
        version    : 'v2.2' // use version 2.2
    });
    
    FB.Event.subscribe('auth.authResponseChange', function(response) {
        if (response.status === 'connected') 
        {
            //document.getElementById("message").innerHTML +=  "<br>Connected to Facebook";
            //SUCCESS   
        }    
        else if (response.status === 'not_authorized') 
        {
            //document.getElementById("message").innerHTML +=  "<br>Failed to Connect";
            //FAILED
        } else 
        {
            //document.getElementById("message").innerHTML +=  "<br>Logged Out";
            //UNKNOWN ERROR
        }
    });
};

function fbLogin()
{
    FB.login(function(response) {
       if (response.authResponse) {
                //getUserInfo();
                checkUserDetail();
            } else {
             console.log('User cancelled login or did not fully authorize.');
            }
        },
        {
            scope: 'public_profile,email'
        }
    );
}

function getUserInfo() {
    FB.api('/me?fields=name,email', function(response) {
        var str="<b>Name</b> : "+response.name+"<br>";
            str +="<b>Email:</b> "+response.email+"<br>";
        alert(str);
        
    });
}

function checkUserDetail() {
	displayScreenLoader();
    FB.api('/me?fields=email', function(response) {
	 console.log(response);
		
			var current_url = window.location.href;
		 $.ajax({
            url: "guestlogin/checkfbuser",
            method:"get",
            data: {'email':response.email,'current_url':current_url },
            type:"post",
            success : function(data) {
                if(data == 'notexisted'){
                  removeScreenLoader();
                    $("#fbUserType").show();
                    $('#login').hide();
                }else{
					window.location.href = "https://nashiron.com/guestlogin/checkfbuser?email="+response.email+"&current_url="+window.location.href ;
				}
            }
        });
		
		return false
        /* $.ajax({
            url: "guestlogin/checkfbuser",
            method:"post",
            data: {'email':response.email},
            type:"post",
            success : function(data) {
                if(data=='successfull') {
                    window.location.reload();
                } else if (data=='normal_user') {
                    fbLogout();
                    $('div.mesage').html('<span class="msg"> Sorry! this Email is already exist.</span>');
                } else if(data == 'server_error'){
                    $('div.mesage').html('<span class="msg"> Sorry! Server busy! please try again.</span>');
                } else {
                    $("#fbUserType").show();
                    $('#login').hide();
                }
            }
        });*/
    });
}

function saveUserDetail() {
	displayScreenLoader();
    var role=$('input:radio[name=fb_user_role]:checked').val();
    FB.api('/me?fields=name,email', function(response) {
        $.ajax({
            url: "guestlogin/savefbuser",
            method:"post",
            data: {'fullName':response.name, 'email':response.email, 'role':role},
            type:"post",
            success : function(data) {
				 removeScreenLoader();
                if(data=='successfull') {
                   // window.location.reload();
				   window.location.href = "https://nashiron.com/guestlogin/checkfbuser?email="+response.email+"&current_url="+window.location.href 
                } else if (data=='normal_user') {
                    fbLogout();
                    $("#fbUserType").hide();
                    $('#login').show();
                    $('div.mesage').html('<span class="msg"> Sorry! this Email is already exist.</span>');
                }
            }
        });
    });
}

function fbLogout()
{
    FB.logout();
}

// Load the SDK asynchronously
(function(d){
        //var APP_PATH = "<?php echo Config::get('constants.APP_PATH');?>";
        //console.log(APP_PATH);
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        //js.src = "//connect.facebook.net/en_US/all.js";
        js.src =  APP_PATH + "public/js/frontend/facebook_all.js";
        ref.parentNode.insertBefore(js, ref);
}(document));  

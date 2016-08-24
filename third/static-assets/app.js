
  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response, scope) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //testSocial();
	 //FB.api("/me",function(response) {
	 	scope.loginSocialPost( /*response.email */);
	//});
	//blpApp.redirectLogin(scope.loginSocialPost);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 'Please log ' +
        //'into this app.';
	 //blpApp.route(blpApp.getSocialRedirectLink());
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 'Please log ' +
        //'into Facebook.';
	//blpApp.route(blpApp.getSocialRedirectLink());
	//blpApp.redirectLogin(scope.loginSocialPost);
    }
  }
  function testSocial() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      //document.getElementById('status').innerHTML =
      //  'Thanks for logging in, ' + response.name + '!';
      //blpApp.socialLogin(response);
    });
  }
 function isUndefined(value) {
         return typeof value === 'undefined';
  };
 function isBoolean(value) {
         return typeof value === 'boolean';
  };

var blpApp = blpApp || {};
// NOTE:
// dev shift using different port number for development
//
//
blpApp.baseUrl = "https://"+ document.location.host+"/";
blpApp.fbLoaded = false;
blpApp.defaults = {
	"socialLoginUrl": blpApp.baseUrl+"user/login?social_auth=1",
	"socialAppId": "979698678780653",
         "mediaElements": false,
         "usernameMin": 0,
         "usernameMax": 126,
         "passwordMin": 0,
         "passwordMax": 126,
         "emailRegex": new RegExp("\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b")
};
blpApp.statusCodes = {
	"OK": "OK",
        "WARNING": "WARNING",
	"ERROR": "ERROR"
};
blpApp.cmpDate = function(date1,date2) {
        if (blpApp.getDate(date1)===blpApp.getDate(date2)) {
                 return true;
         }
         return false;
};


blpApp.getListingDate = function(listing) {
	   return listing.listing.date.replace(/\s/, "T");
   	 };

blpApp.generateEvents = function(listings) {
	   	var events = [];
		for (var i in listings ) {
			var listingDate = blpApp.getListingDate(listings[i]);
			events.push({
				'title': listings[i].listing.title,
				'description': listings[i].listing.description,
				'start': listingDate,
				'end': listingDate
			 });
	 	 }
		return events;
	 };

blpApp.checkValidation = function( type, value ) {

  var validationOut = blpApp['checkValidation'+type](value);
  return validationOut;
};
blpApp.checkValidationusername = function( value ) {
  return value.length> blpApp.defaults.usernameMin && value.length< blpApp.defaults.usernameMax;
};
blpApp.checkValidationpassword = function( value ) {
  return  value.length > blpApp.defaults.passwordMin && value.length < blpApp.defaults.passwordMax;
};
blpApp.checkValidationemail = function( value ) {
  return  value.match(blpApp.defaults.emailRegex);
};

// general purpose re-implement in Angular factory
blpApp.getCurrentUser = function(http,callback) {
      http({
                'method': 'GET',
                'url': blpApp.baseUrl+"generics/_current_user"
              }).then(function(data) {
                 if ( data.data.status === blpApp.statusCodes.OK &&
                       (data.data.type === "user"
                        ||
                        data.data.type==="venue"
                        )
                        ) {
                    if (data.data.data.fields.blp_customer_active == 0 || data.data.data.fields.blp_merchant_active == 0 ){
                          jQuery('.notverified').show();
                          jQuery('.notverified').html('Please verify your email');
                          /*setTimeout(function () {
                             jQuery('.notverified').hide();
                          }, 5000);*/
                          jQuery(".notverified").css("margin-top","80px");
                          jQuery(".myAcc-user").css("margin-top","0px");
                        }


                                callback(data.data.data);
                   } else {
                        callback(false);
                  }
                });
};



blpApp.warn = function(msg,type /** error  or success **/) {
 // document.body.scrollTop = 0;
  jQuery(document).scrollTop(0);
  var callback = typeof arguments[arguments.length-1] === 'function' ? arguments[arguments.length-1] :function(){};
  type = type || "error";
   $("#warn_box").show();
   $("#warn_box").find(".error").text("");
   $("#warn_box").find(".error").hide();
   $("#warn_box").find(".success").text("");
   $("#warn_box").find(".success").hide();
   $("#warn_box").find(".warning").text("");
   $("#warn_box").find(".warning").hide();
   $("#warn_box").find("."+type).show();
   $("#warn_box").find("."+type).text(msg);
   setTimeout(function() {
         $("#warn_box").find(".error").text("");
         $("#warn_box").find(".error").hide();
         $("#warn_box").find(".success").text("");
         $("#warn_box").find(".success").hide();
         $("#warn_box").find(".warning").text("");
         $("#warn_box").find(".warning").hide();

         $("#warn_box").hide();
               callback();
         }, 5000);



   //alert(msg);
};

blpApp.popupWarn = function(msg,type /** error  or success **/) {
 // document.body.scrollTop = 0;
  jQuery(document).scrollTop(0);
  var callback = typeof arguments[arguments.length-1] === 'function' ? arguments[arguments.length-1] :function(){};
  type = type || "error";
   $("#popup_warn_box").show();
   $("#popup_warn_box").find(".error").text("");
   $("#popup_warn_box").find(".error").hide();
   $("#popup_warn_box").find(".success").text("");
   $("#popup_warn_box").find(".success").hide();
   $("#popup_warn_box").find(".warning").text("");
   $("#popup_warn_box").find(".warning").hide();
   $("#popup_warn_box").find("."+type).show();
   $("#popup_warn_box").find("."+type).text(msg);
   setTimeout(function() {
         $("#popup_warn_box").find(".error").text("");
         $("#popup_warn_box").find(".error").hide();
         $("#popup_warn_box").find(".success").text("");
         $("#popup_warn_box").find(".success").hide();
         $("#popup_warn_box").find(".warning").text("");
         $("#popup_warn_box").find(".warning").hide();

         $("#popup_warn_box").hide();
               callback();
         }, 5000);
};
blpApp.popupVenueWarn = function(msg,type /** error  or success **/) {
 // document.body.scrollTop = 0;
  jQuery(document).scrollTop(0);
  var callback = typeof arguments[arguments.length-1] === 'function' ? arguments[arguments.length-1] :function(){};
  type = type || "error";
   $("#popup_venue_warn_box").show();
   $("#popup_venue_warn_box").find(".error").text("");
   $("#popup_venue_warn_box").find(".error").hide();
   $("#popup_venue_warn_box").find(".success").text("");
   $("#popup_venue_warn_box").find(".success").hide();
   $("#popup_venue_warn_box").find(".warning").text("");
   $("#popup_venue_warn_box").find(".warning").hide();
   $("#popup_venue_warn_box").find("."+type).show();
   $("#popup_venue_warn_box").find("."+type).text(msg);
   setTimeout(function() {
         $("#popup_venue_warn_box").find(".error").text("");
         $("#popup_venue_warn_box").find(".error").hide();
         $("#popup_venue_warn_box").find(".success").text("");
         $("#popup_venue_warn_box").find(".success").hide();
         $("#popup_venue_warn_box").find(".warning").text("");
         $("#popup_venue_warn_box").find(".warning").hide();

         $("#popup_venue_warn_box").hide();
               callback();
         }, 5000);
};

blpApp.getMediaLink = function( initial ) {
  return blpApp.baseUrl+"media/"+initial;
};
blpApp.getUserMediaLink = function( initial ) {
  return blpApp.baseUrl+"media/customer_profile/"+initial;
};
blpApp.getSocialRedirectLink = function() {
    return "https://www.facebook.com/dialog/oauth?client_id="+blpApp.defaults.socialAppId+"&redirect_uri="+encodeURIComponent(blpApp.defaults.socialLoginUrl)+"&scope=email";
};
blpApp.redirectLogin = function(callback) {
  FB.login(function(response) {
	if (response) {
		callback();
	}
   }, {"scope": "email,public_profile"});
};
blpApp.log = function(msg, data) {
	console.log("BLP: " + msg);
	console.log("BLP DATA: " );
};
blpApp.getCurrentCustomer = function(httpRequester,callback) {
   httpRequester({
	"method": "GET",
	"url": blpApp.baseUrl+"generics/_get_current_customer"
	}).then(function(data) {
		callback(data.data.data);
	 });
};
blpApp.getCurrentMerchant = function(httpRequester,callback) {
	httpRequester({
	"method": "GET",
	"url": blpApp.baseUrl+"generics/_get_current_merchant"
	}).then(function(data) {
		callback(data.data.data);
	});
};
blpApp.getCities = function() {
	return "DEPRECATED_2016_02_04";
};



blpApp.route = function( area ) {
  document.location.replace(area);
};
blpApp.ensureTwo = function(incomingNumber) {
	return incomingNumber.toString().length === 1?  ("0"+incomingNumber.toString()) : incomingNumber.toString();
};
blpApp.getDate = function(date) {
	return (date.getFullYear())+"-"+blpApp.ensureTwo(date.getMonth()+1)+"-"+blpApp.ensureTwo(date.getDate())+"T00:00:00";
};
blpApp.getDateInput = function(date,daysAhead,splitter) {
    splitter=splitter||"-";
    return (date.getFullYear())+splitter+(blpApp.ensureTwo(date.getMonth()+1))+splitter+blpApp.ensureTwo(date.getDate()+daysAhead);
};


blpApp.loadCalendar2 = function(tgt,events,selectable) {
  var selsected_date = new Date();
  var currentDate = new Date();
  selected_date = document.location.href.match(/date=(.*)/);
  if (selected_date != null && selected_date[1] != null) {
    var dateArray = selected_date[1].split("-");
    selsected_date = dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    currentDate.setDate(dateArray[2]);
    currentDate.setMonth(dateArray[1]);
    currentDate.setYear(dateArray[0]);
  }

       if ( jQuery(tgt).fullCalendar() ) {
                jQuery(tgt).fullCalendar('destroy');
          }

   scopeObj = typeof arguments[arguments.length-3] === 'object' ? arguments[arguments.length-3]:undefined;
   headers = typeof arguments[arguments.length-2]==='object' ? arguments[arguments.length-2]:undefined;
   callback = typeof arguments[arguments.length-1] ==='string' ? arguments[arguments.length-1]:undefined;
   var headers = headers ||  {
                        'left': 'prev, next today',
                        'center': 'title',
                        'right': ''
                };
   var defaultDate = blpApp.getDate(new Date());
	events = events || [];
	var scopeObj  = scopeObj || false ;
   var handler = jQuery(tgt).fullCalendar({
      	 /*'header': headers,
      	 defaultDate: defaultDate,
      	 selectHelper: selectable,
      	 events: events,
      	 editable: false,*/
         defaultDate: moment(selsected_date),
         selectable: selectable,
         height: "auto",
         dayRender: function (date, cell) {
            if ((currentDate.getDate() === date._d.getDate()) && (currentDate.getMonth() === date._d.getMonth())) {
                cell.addClass("fc-highlight");
            }
          },
      	select: function(start,end,event,view) {
      		//blpApp.selectedDate=blpApp.getDate(start);
      		if (scopeObj) {
      		scopeObj[callback](end._d, event.title);
      		//jQuery(tgt).fullCalendar("unselect");
      		}
      	 },
      	 //selectable :  se
    });
   var handler = jQuery(tgt).fullCalendar('getCalendar');
   return handler;
};


blpApp.loadCalendar = function(tgt,events,selectable) {
  var selsected_date = new Date();
  var currentDate = new Date();
  selected_date = document.location.href.match(/date=(.*)/);
  if (selected_date != null && selected_date[1] != null) {
    var dateArray = selected_date[1].split("-");
    selsected_date = dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2];
    currentDate.setDate(dateArray[2]);
    currentDate.setMonth(dateArray[1]);
    currentDate.setYear(dateArray[0]);
  }

       if ( jQuery(tgt).fullCalendar() ) {
                jQuery(tgt).fullCalendar('destroy');
          }

   scopeObj = typeof arguments[arguments.length-3] === 'object' ? arguments[arguments.length-3]:undefined;
   headers = typeof arguments[arguments.length-2]==='object' ? arguments[arguments.length-2]:undefined;
   callback = typeof arguments[arguments.length-1] ==='string' ? arguments[arguments.length-1]:undefined;
   var headers = headers ||  {
                        'left': 'prev, next today',
                        'center': 'title',
                        'right': ''
                };
   var defaultDate = blpApp.getDate(new Date());
	events = events || [];
	var scopeObj  = scopeObj || false ;
   var handler = jQuery(tgt).fullCalendar({
      	 /*'header': headers,
      	 defaultDate: defaultDate,
      	 selectHelper: selectable,
      	 events: events,
      	 editable: false,*/
         defaultDate: moment(selsected_date),
         selectable: selectable,
         height: "auto",
         dayRender: function (date, cell) {
            if ((currentDate.getDate() === date._d.getDate()) && (currentDate.getMonth() === date._d.getMonth())) {
                cell.addClass("fc-highlight");
            }
          },
      	select: function(start,end,event,view) {
      		//blpApp.selectedDate=blpApp.getDate(start);
      		if (scopeObj) {
      		scopeObj[callback](end._d, event.title);
      		//jQuery(tgt).fullCalendar("unselect");
      		}
      	 },
      	 //selectable :  se
    });
   var handler = jQuery(tgt).fullCalendar('getCalendar');
   return handler;
};



blpApp.module = angular.module("blpApp",['ngSanitize','ngCookies','ngCkeditor','uiGmapgoogle-maps','nemLogging'])
.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBe90gyyIt06v6HUWGCSXp55w1RosVNSPQ',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
blpApp.module.directive("ngBindHtmlDynamic",function($compile) {
   return {
	 restrict: 'A',
	 link: function(scope,element,attrs) {
		scope.$watch(attrs.ngBindHtmlDynamic,function(html) {
			element.html(html);
			$compile(element.contents())(scope);
		});
	}
   };
});

blpApp.module.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol("[[");
  $interpolateProvider.endSymbol("]]");
});

blpApp.module.controller("blpAppPagesController", ['$scope', function($scope) {
        $scope.navOptions = [
                      {
                        "title": "FAQ",
                        "link": "/pages/faq"
                       },
                      {
                        "title": "Terms of Service",
                        "link": "/pages/terms"
                      },
                       {
                        "title": "Privacy Policy",
                        "link": "/pages/privacy_policy"
                        },
                        {
                        "title": "Contact",
                        "link": "mailto:nathan.vellayan@barlinepass.com?Subject=Hello%20again",
                        "target":"_top"
                        }
                ];
      }]);




blpApp.module.controller("blpAppHeaderController", ['$scope', function($scope) {
	}]);

blpApp.module.controller("blpAppFooterController", ['$scope', function($scope) {
              $scope.helpMenuOptions = [{
                        "class": "title",
                        "title": "FAQ",
                        "link": "/pages/faq"
                },
                {
                        "class": "option",
                        "title": "Terms of Service",
                        "link": "/pages/terms"
                },
                {
                        "class": "option",
                        "title": "Privacy Policy",
                        "link": "/pages/privacy_policy"
                },
                {
                        "class": "option",
                        "title": "Contact Us",
                        "link": "mailto:nathan.vellayan@barlinepass.com?Subject=Contact%20Us",
                        "target":"_top"
                }

                ];

              $scope.siteMenuOptions = [];
              $scope.otherMenuOptions = [];

              $scope.copyrightText = "Copyright © 2016 byBarLinePass"


     }]);
blpApp.module.controller("blpAppHomeController", ['$scope', '$http', '$sce',  function($scope, $http, $sce) {
    $scope.currentClass ="";
    $scope.showIfLogged = { "display": "none" };
    $scope.showIfNotLogged =  { "display": "block" };
    $scope.homeVideo = {};
    $scope.homeTitle = "Welcome To BarLinePass";
    $scope.homeLogoText = "BarLinePass Application";
    $scope.homeText = "";
    $scope.navItems = [] ;
    $scope.filterOptions = [];
    $scope.filterOptionBuilt={};
    $scope.cities = [];
    $scope.showcaseCities = [];
    $scope.currentUser = false;
    $scope.quantities = [];
    $scope.logoutLink = "/user/logout";
    $scope.username="";
    $scope.showIfVenueLogged = { "display": "none" };
    $scope.showIfUserLogged= { "display": "none" };
    $scope.selectedCity = "";

      jQuery(document).ready(function () {

        
        $('select').on('change', function() {
          var qty=$('#qty').val().charAt(0);        

                if (qty=='g')
                {
                  // alert("You have to select the number of people");
                  blpApp.warn("Please select number of tickets and search again.");
                  $('#qty').addClass("show_error");
                  return;
                }else{
                   $('#qty').removeClass("show_error");


                }
        })
    });


    $scope.init = function() {

         blpApp.getCurrentUser($http,function(currentUser) {
                //blpApp.currentUser = currentUser;
                //
                //blpApp.log("Current user", currentUser);
                $scope.currentUser = currentUser;
                if ( typeof $scope.currentUser === 'object' ){
                        $scope.showIfLogged={"display":"block"};
                        $scope.showIfNotLogged = {"display":"none"};
                        if($scope.currentUser.model == "home.merchant"){
                          $scope.showIfVenueLogged = { "display": "block" };
                        }else if ($scope.currentUser.model == "home.customer"){
                          $scope.showIfUserLogged = { "display": "block" };
                        }else{
                          $scope.showIfVenueLogged= { "display": "none" };
                          $scope.showIfUserLogged= { "display": "none" };
                        }
                }
              $scope.getHomeVideo(function(homeVideo) {
                  homeVideo.src=$sce.trustAsResourceUrl(homeVideo.src);
                  $scope.homeVideo = homeVideo;
                  var dateInput = blpApp.getDateInput(new Date, 0, "-");

                  $scope.initHomeVideo();
                  /*var saveddate = jQuery('#selected_date_header').val();
                  if (isUndefined(saveddate)) {
                    jQuery("#"+ "date").val(dateInput);
                  }else {
                    jQuery("#"+ "date").val(saveddate);
                  }*/
                  //jQuery("#"+ "date").val(dateInput);
                  $scope.getNavItems(function(navMenu) {
                          $scope.navItems=navMenu;
                          $scope.getFilterOptions(function(filterOptions) {
                                  $scope.filterOptions = filterOptions;
                                  for ( var i in filterOptions ) {
                                          if (filterOptions[i].name==="city") {
                                           $scope.cities=filterOptions[i].options;
                                           $scope.showcaseCities = $scope.getShowcaseCities(filterOptions[i].options);
                                           $scope.currentCity=$scope.cities[0];
                                          } else if (filterOptions[i].name==="qty") {
                                           $scope.quantities=filterOptions[i].options;
                                           $scope.currentQuantity=$scope.quantities[0];
                                          }
                                   }

                          });
                  });
              });
	});
    };
   $scope.browseCity= function(city) {
      document.location.replace(blpApp.baseUrl+"listings/browse?city="+city.value);
   };

   $scope.getLogout= function() {
      document.location.replace(blpApp.baseUrl+"user/logout");
   };

   $scope.initHomeVideo = function() {
        if ( document.getElementById("homeVideo")!==null && blpApp.defaults.mediaElements) {
         MediaElement("homeVideo", {
                success: function(video) {
                        video.play();
                 },
                error: function(log) {
                        blpApp.log("Could not play video", arguments);
                }
         });
        }
    };


   $scope.getShowcaseCities = function(options) {
         var cities = [];
         for (var i in options ) {
          /*if(options[i].value == "Washington"){
            $scope.selectedCity = options[i]
          }*/
                if  ( options[i].showcase ) {
                   cities.push( options[i] );
                 }
             }
         return cities;
        };
   $scope.buildFilterOption = function(filterOption)  {
	 return $scope['buildFilter'+filterOption.type](filterOption);
   };
   $scope.buildFilterinput = function(filterOption) {
  	return $scope.buildFullElement("<input type='text' name='"+filterOption.name+"' id='"+filterOption.name+"' />",filterOption);
   };
   $scope.buildFilterdate = function(filterOption) {
	return $scope.buildFullElement("<input type='date' name='"+filterOption.name+"' id='"+filterOption.name+"' />", filterOption);
   };
   $scope.buildFilterselect = function(filterSelect) {
        var optionKey = "filterOptions["+filterSelect['idx']+"]['options']";
  	var optionModelKey = "filterOptions["+filterSelect['idx']+"][0]";
	 $scope['option'+ filterSelect['name'] + 'ModelIdx'] ={"child": 0, "parent": filterSelect['id']};
	 var handler = "currentClass='+filterSelect.name+'; changeSelect()";
	//$scope['filterSelectOptions
	 var selectWrp = jQuery("<div></div>");
	 var selectBox = jQuery("<select></select>");
	 jQuery(selectBox).attr("id",filterSelect['name']);
	 jQuery(selectBox).attr("ng-change",handler);
	 jQuery(selectBox).attr("ng-options", "option.title for option in " +optionKey + " track by option.value");
	 jQuery(selectBox).attr("ng-model", optionModelKey);
	 jQuery(selectWrp).append(selectBox);
	 var selectText = jQuery(selectWrp).html();
	return $scope.buildFullElement(selectText, filterSelect);
   };
   $scope.buildFullElement = function(element,meta) {
	 var label= "<label>"+meta.title+"</label>";
   var divWrapper = "<div> ";
	 divWrapper+=label;
	 divWrapper+=element;
	 divWrapper+="</div>";
	 return divWrapper;
   };
   $scope.changeSelect = function() {
	 var optionKey =  $scope.currentClass+"Options", modelKey=$scope.currentClass+"Selected";
   	 var currentObject =  $scope['option' +$scope.currentClass+"ModelIdx"];
	 var listOfSelect =  {};
	 var oldIdx = 0;
	 var filterOptions = $scope.filterOptions;
	 for (var i in filterOptions) {
		if (filterOptions[i].type==='select' &&  filterOptions[i].name ===$scope.currentClass) {
			for (var j in filterOptions[i].options ) {
				if ( filterOptions[i].options[j].value === currentValue ) {
					var temp = filterOptions[i].options[currentObject.child];
				     	filterOptions[i].options[currentObject.child] = filterOptions[i].options[j];
					filterOptions[i].options[j]=temp;
					currentObject.child=j;
				}
			}
		}
	}
   };

   //$scope.checkSelected = function(el


   $scope.getHomeVideo = function(callback) {
	$http({
		'method': 'GET',
		'url':  blpApp.baseUrl+ "generics/_home_video"
	 }).then(function(data) {
		callback(data.data);
	 });
   };

   $scope.getUsername = function() {
       if ( $scope.currentUser ) {
        if ( $scope.currentUser && typeof $scope.currentUser.fields.blp_merchant_email !== 'undefined' ) {
          $scope.username=$scope.currentUser.fields.blp_merchant_name;
        } else if ($scope.currentUser && typeof $scope.currentUser.fields.blp_customer_first_name !== 'undefined' && typeof $scope.currentUser.fields.blp_customer_last_name !== 'undefined' ) {
          $scope.username =$scope.currentUser.fields.blp_customer_first_name+' '+$scope.currentUser.fields.blp_customer_last_name;
        } else if ($scope.currentUser && typeof $scope.currentUser.fields.blp_customer_first_name !== 'undefined') {
          $scope.username =$scope.currentUser.fields.blp_customer_first_name;
        } else if ($scope.currentUser && typeof $scope.currentUser.fields.blp_customer_email !== 'undefined' && typeof $scope.currentUser.fields.blp_customer_first_name == 'undefined') {
          $scope.username =$scope.currentUser.fields.blp_customer_email;
        }
       }
         return $scope.username;
  };
   $scope.getCurrentUser = function(callback) {
        $http({
                'method': 'GET',
                'url': blpApp.baseUrl+"generics/_current_user"
              }).then(function(data) {
                 callback(data.data);
                });
      };
   $scope.getNavItems = function(callback) {
	 $http({
		'method': 'GET',
		'url': blpApp.baseUrl+"generics/_nav_menu"
	}).then(function(data) {
		//$scope.navItems=data.data;
		callback(data.data);
	});
	};
   $scope.getFilterOptions = function(callback) {
	 $http({
		'method': 'GET',
		'url': blpApp.baseUrl + "generics/_filter_options"
	}).then(function(data) {
		callback(data.data);
	});
  };
  $scope.getResults = function() {
   var selectedDate = jQuery("#date").val().split('-');
   var finalDate = selectedDate[2]+'-'+selectedDate[0]+'-'+selectedDate[1];
   var dataCollected= {
		"date": finalDate,
		"city": encodeURIComponent(jQuery("#city").val()),
		"qty": jQuery("#qty").val(),
	};

        var qty=dataCollected.qty.charAt(0);        

        if (qty=='g')
        {
          // alert("You have to select the number of people");
          blpApp.warn("Please select number of tickets and search again.");
                      $('#qty').addClass("show_error");
          return;
        }else{
           $('#qty').removeClass("show_error");


        }



        var now = new Date; //Current Date time

        var then = new Date(Date.parse(dataCollected.date)); //Selected date time Mon Aug 15 2016 05:30:00 GMT+0530 (IST)
        // make sure we have a one day offset
        // BUGFIX
         var then = new Date(then.getTime()+((3600*24)*1000)); //Tue Aug 16 2016 05:30:00 GMT+0530 (IST)


        if ( blpApp.cmpDate(now,then) || then > now ) {
          if ( dataCollected['date'] &&  dataCollected['city'] && dataCollected['qty'] ) {
             return blpApp.route( blpApp.baseUrl+"listings/view?city="+dataCollected['city']+"&qty="+dataCollected['qty']+"&date="+dataCollected['date']);
          }
         } else {
             blpApp.warn("The date selected was in the past. Please select a date today or in the future");
           }
      };
   $scope.navigate = function(navItem) {
	 document.location.replace( blpApp.baseUrl+navItem.link);
	};
   $scope.init();
}]);

blpApp.module.controller("blpAppBookingDetailsController", ['$scope', '$http', '$sce', function($scope, $http, $sce) {
$scope.blp_customer_booking_details_data = [];
  $scope.getVenueBookingDetails = function(bookingId) {
      $http({
        "method": "POST",
        "data": {"sale_parent_id": bookingId},
        "url": blpApp.baseUrl+"user/get_venue_sales_details",
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function( response ) {
        if(response != "" && response != null){
          //$scope.blp_customer_booking_details_disable = {"display":"block"};
          //$scope.blp_customer_booking_details_enable = {"display":"none"};
          $scope.blp_customer_booking_details_data = response.data;
        }else{
          //$scope.blp_customer_booking_details_disable = {"display":"none"};
          //$scope.blp_customer_booking_details_enable = {"display":"block"};
          $scope.blp_customer_booking_details_data = [];
        }
      });
  };
}]);

// start blpAppVenueDetailsController controller
blpApp.module.controller("blpAppVenueDetailsController", ['$scope', '$http', '$sce', function($scope, $http, $sce) {
  $scope.currentCity = {};
  $scope.editorOptions = {
                language: 'en'
               // uiColor: '#000000'
    };
  $http({
    'url': blpApp.baseUrl+"generics/_get_cities",
    'method': 'GET',
  }).then(function(cities) {
    $scope.cities =cities.data.data;
    console.log($scope.cities);
    $scope.currentCity=$scope.cities[0];
  });

  $scope.blp_merchant_id = [];
  $scope.blp_merchant_name = [];
  $scope.blp_merchant_city = [];
  $scope.blp_merchant_address = [];
  $scope.blp_merchant_state = [];
  $scope.blp_merchant_zip = [];
  $scope.blp_merchant_description = [];
  $scope.blp_merchant_email = [];
  $scope.blp_merchant_phone_number = [];
  $scope.blp_merchant_created_date = [];
  var httpRequest = $http({
    method: 'GET',
    url: blpApp.baseUrl+"user/get_venue_details"
  }).success(function(data, status) {
    $scope.blp_merchant_name = data.blp_merchant_name;
    $scope.blp_merchant_city = data.blp_merchant_city;
    $scope.blp_merchant_description = data.blp_merchant_description;
    $scope.venueDescription = data.blp_merchant_description;
    $scope.blp_merchant_email = data.blp_merchant_email;
    $scope.blp_merchant_address = data.blp_merchant_address;
    $scope.blp_merchant_state = data.blp_merchant_state;
    $scope.blp_merchant_zip = data.blp_merchant_zip;
    $scope.blp_merchant_phone_number = data.blp_merchant_phone_number;
    $scope.blp_merchant_created_date = data.blp_merchant_created_at;
  });


  $scope.updateVenueDetails = function() {
    var venueFields = $scope.getVenueFields();
    var filter =   /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if(venueFields.venueName == ''){
            blpApp.warn("Please enter Name", "error");
            $(document).find('#registerVenueName').focus();
        } else if(venueFields.venuePhoneNumber == '') {
            blpApp.warn("Please enter Phone number", "error");
            $(document).find('#venuePhoneNumber').focus();
        }
        else if(!filter.test(venueFields.venuePhoneNumber)) {
              blpApp.warn("Please enter correct phone number format", "error");
              $(document).find('#venuePhoneNumber').focus();
        }

         else if(venueFields.venueCity == '') {
            blpApp.warn("Please select City", "error");
            $(document).find('#venueAddress').focus();
        }  else if(venueFields.venueAddress == '') {
            blpApp.warn("Please enter Address", "error");
            $(document).find('#venueAddress').focus();
        }  else if(venueFields.venueState == '') {
            blpApp.warn("Please enter State", "error");
            $(document).find('#venueState').focus();
        }  else if(venueFields.venueZip == '') {
            blpApp.warn("Please enter Zip", "error");
            $(document).find('#venueZip').focus();
        }/* else if(venueFields.venueDescription == '') {
            blpApp.warn("Please enter Description", "error");
            $(document).find('#venueDescription').focus();
        }*/else if(venueFields.venueEmail == '') {
            blpApp.warn("Please enter Email", "error");
            $(document).find('#venueEmail').focus();
        } else {
          $http({
            "method": "POST",
            "data": venueFields,
            "url": blpApp.baseUrl+"user/update_venue_details",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).then(function( responseData ) {
            if(responseData.data == "False"){
              blpApp.warn("Venue details could not be updated! try again", "error");
              return false;
            }
              else if (responseData.data == 'EmailFalse'){
                blpApp.warn("Email id already exist", "error");
                return false;
              }
              else{
              blpApp.warn("Venue details has been updated successfully", "success");
              var ndata = $.param({
                              'venueDescription': $scope.venueDescription
                });
              $http({
                "method": "POST",
                "data": ndata,
                "url": blpApp.baseUrl+"user/update_venue_description",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }).then(function( responseData ) {
                if(responseData.data == "False"){
                  blpApp.warn("Venue description could not be updated! try again", "error");
                  return false;
                }
              });


              return true;
            }
          });
        }
   };

   $scope.getVenueFields = function() {
     console.log('coming in');
     console.log($scope.venueDescription);
    return {
      "venueName": jQuery.trim(jQuery("#venueName").val()),
      "venuePhoneNumber": jQuery.trim(jQuery("#venuePhoneNumber").val()),
      "venueCity": jQuery.trim(jQuery("#venueCity").val()),
      "venueAddress": jQuery.trim(jQuery("#venueAddress").val()),
      "venueState": jQuery.trim(jQuery("#venueState").val()),
      "venueZip": jQuery.trim(jQuery("#venueZip").val()),
      //"venueDescription": $scope.venueDescription,
      "venueEmail": jQuery.trim(jQuery("#venueEmail").val())

     };
   };

   $scope.changeVenuePass = function() {
    var oldPassword = jQuery("#oldPassword").val();
    var newPassword = jQuery("#newPassword").val();
    var confirmPassword = jQuery("#confirmPassword").val();
    if (oldPassword === "" || isUndefined(oldPassword)){
      blpApp.popupWarn("Please enter old Password");
    }else if (newPassword === "" || isUndefined(newPassword)) {
      blpApp.popupWarn("Please enter new password", "error");
    } else if(newPassword.length < 6 || newPassword.length > 20) {
      blpApp.popupWarn("Password length should be 6-20 characters", "error");
    } else if(confirmPassword === "" || isUndefined(confirmPassword)){
      blpApp.popupWarn("Please enter confirm password", "error");
    } else if(newPassword != confirmPassword){
      blpApp.popupWarn("New password and confirm password should be same", "error");
    } else {
      $scope.validateVenueOldPassword(oldPassword,newPassword);
    }
  };
  $scope.validateVenueOldPassword = function(oldPassword, newPassword) {
    $http({
      "method": "POST",
      "data": {"old_password": oldPassword, "new_password": newPassword},
      "url": blpApp.baseUrl+"user/check_venue_old_password",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function( response ) {
      if(response.data == "False"){
        blpApp.popupWarn("Old password doesn't match! try again", "error");
        return false;
      }else{
        blpApp.popupWarn("Password has been changed", "success");
        setTimeout(function () {
           jQuery('.closeImg').trigger('click');
        }, 2000);
        return true;
      }
    });
  };

}]);
// end blpAppVenueDetailsController controller

// start blpAppUserDetailsController controller
blpApp.module.controller("blpAppUserDetailsController", ['$scope', '$http', '$sce', function($scope, $http, $sce) {
  $scope.currentCity = {};
  $scope.currentPhoto = {};
  $scope.photos = {};
  $scope.bookings = {};
  var uploader = document.getElementById("photoUpload");
  uploader.onchange = function() {
    $scope.uploadPhoto();
  };

  $http({
    'url': blpApp.baseUrl+"generics/_get_cities",
    'method': 'GET',
  }).then(function(cities) {
    $scope.cities =cities.data.data;
    $scope.currentCity=$scope.cities[0];
    $scope.getPhotos(function(photos) {
       $scope.photos = photos;
    });
  });

  $scope.blp_customer_id = [];
  $scope.blp_customer_first_name = [];
  $scope.blp_customer_last_name = [];
  $scope.blp_customer_email = [];
  $scope.blp_customer_phone_number = [];
  $scope.blp_customer_created_date = [];
  $scope.blp_customer_active = [];
  $scope.blp_customer_booking_details_data = [];
  var httpRequest = $http({
    method: 'GET',
    url: blpApp.baseUrl+"user/get_user_details"
  }).success(function(data, status) {
    $scope.blp_customer_first_name = data.blp_customer_first_name;
    //$scope.blp_merchant_city = data.blp_merchant_city;
    $scope.blp_customer_last_name = data.blp_customer_last_name;
    $scope.blp_customer_email = data.blp_customer_email;
    $scope.blp_customer_phone_number = data.blp_customer_phone_number;
    $scope.blp_customer_created_date = data.blp_customer_created_at;
    $scope.blp_customer_active = data.blp_customer_active;
  });

  $scope.getPhotoLink = function(photo) {
    return  blpApp.getUserMediaLink(photo.fields.blp_customer_photo_filename);
  };

  $scope.uploadPhoto = function() {
    $scope.fileReader = new FileReader;
    var fileUploader =  document.getElementById("photoUpload");
    if ( typeof fileUploader.files[0] !== 'undefined' ) {
      $scope.fileReader.callback = function(dataGiven){
        $scope.uploadFile(dataGiven, $scope.fileReader.ext);
      };
      $scope.fileReader.onloadend = function() {
        var result =  $scope.fileReader.result.replace(/.*base64.*,/, "");
        $scope.fileReader.callback(result);
      };
      var fileExt = $scope.getFileExtension(fileUploader.files[0] );
      if(fileExt != ''){
        $scope.fileReader.ext =  fileExt;
        $scope.fileReader.readAsDataURL( fileUploader.files[0] );
      }else{
        blpApp.warn("Could not upload file please select valid file");
      }
    } else {
      blpApp.warn("Could not upload file please select a file");
    }
  }

  $scope.getFileExtension = function(file) {
    var matches = file.name.match(/\.(jpg|jpeg|png|gif)$/, file.name);
    return matches ?  matches[1] : "";
  };
  $scope.uploadFile = function(data,ext) {
    $http({
      'method': 'POST',
      'url' :  blpApp.baseUrl+"generics/_upload_user_photo?ext="+ext,
      "data": data
    }).then(function(data) {
      if ( data.data.status === blpApp.statusCodes.OK ) {
        blpApp.warn("New photo was uploaded successfully", "success");
        $scope.getPhotos(function(photos) {
           $scope.photos = photos;
        });
      } else {
        blpApp.warn("Unable to upload photo please try again");
      }
    });
  };

  $scope.getPhotos = function(callback) {
     $http({
      "method": "GET",
      "url": blpApp.baseUrl + "generics/_get_customer_photos?customer_id=" + $scope.blp_customer_id
      }).then( function( data )  {
        callback(data.data.data);
      });
  };

  $scope.updateUserDetails = function() {
    var userFields = $scope.getUserFields();
    var filter =   /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

        if(userFields.firstName == ''){
            blpApp.warn("Please enter First Name", "error");
            $(document).find('#customerFirstName').focus();
        } else if(userFields.lastName == ''){
            blpApp.warn("Please enter Last Name", "error");
            $(document).find('#customerLastName').focus();
        } else if(userFields.phoneNumber == '') {
            blpApp.warn("Please enter Phone number", "error");
            $(document).find('#customerPhoneNumber').focus();
        } else if(!filter.test(userFields.phoneNumber)) {
            blpApp.warn("Please enter correct phone number format", "error");
            $(document).find('#venuePhoneNumber').focus();
        } else if(userFields.customerEmail == '') {
            blpApp.warn("Please enter Email", "error");
            $(document).find('#customerEmail').focus();
        } else {
          $http({
            "method": "POST",
            "data": userFields,
            "url": blpApp.baseUrl+"user/update_customer_details",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).then(function( responseData ) {
            if(responseData.data == "False"){
              blpApp.warn("User details could not be updated! try again", "error");
              return false;
            }
            else if (responseData.data == 'EmailFalse'){
              blpApp.warn("Email id already exist", "error");
              return false;
            }
            else{
              blpApp.warn("User details have been updated successfully", "success");
              return true;
            }
          });
        }
   };

   $scope.getUserFields = function() {
    return {
      "firstName": jQuery.trim(jQuery("#customerFirstName").val()),
      "lastName": jQuery.trim(jQuery("#customerLastName").val()),
      "phoneNumber": jQuery.trim(jQuery("#customerPhoneNumber").val()),
      "email": jQuery.trim(jQuery("#customerEmail").val()),
     };
   };
  //on load get bookings list end user
  $http({
    "method": "GET",
    "url": blpApp.baseUrl + "generics/_get_customer_bookings"
  }).then( function( data )  {
    if(data.data.data.length > 0){
      $scope.bookings = data.data.data;
    }else{
      $scope.bookings = {};
    }
  });

   $scope.changeUserPass = function() {
    var oldPassword = jQuery("#oldPassword").val();
    var newPassword = jQuery("#newPassword").val();
    var confirmPassword = jQuery("#confirmPassword").val();
    if (oldPassword === "" || isUndefined(oldPassword)){
      blpApp.popupWarn("Please enter old Password");
    }else if (newPassword === "" || isUndefined(newPassword)) {
      blpApp.popupWarn("Please enter new password", "error");
    } else if(newPassword.length < 6 || newPassword.length > 20) {
      blpApp.popupWarn("Password length should be 6-20 characters", "error");
    } else if(confirmPassword === "" || isUndefined(confirmPassword)){
      blpApp.popupWarn("Please enter confirm password", "error");
    } else if(newPassword != confirmPassword){
      blpApp.popupWarn("New password and confirm password should be same", "error");
    } else {
      $scope.validateOldPassword(oldPassword,newPassword);
    }
  };
  $scope.validateOldPassword = function(oldPassword, newPassword) {
    $http({
      "method": "POST",
      "data": {"old_password": oldPassword, "new_password": newPassword},
      "url": blpApp.baseUrl+"user/check_old_password",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function( response ) {
      if(response.data == "False"){
        blpApp.popupWarn("Old password doesn't match! try again", "error");
        return false;
      }else{
        blpApp.popupWarn("Password has been changed", "success");
        setTimeout(function () {
           jQuery('.closeImg').trigger('click');
        }, 2000);
        return true;
      }
    });
  };

  $scope.getBookingDetails = function(bookingId) {

      $http({
        "method": "POST",
        "data": {"sale_parent_id": bookingId},
        "url": blpApp.baseUrl+"user/get_sales_details",
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function( response ) {
        if(response != "" && response != null){

          //$scope.blp_customer_booking_details_disable = {"display":"block"};
          //$scope.blp_customer_booking_details_enable = {"display":"none"};
          $scope.blp_customer_booking_details_data = response.data;
        }else{
          //$scope.blp_customer_booking_details_disable = {"display":"none"};
          //$scope.blp_customer_booking_details_enable = {"display":"block"};
          $scope.blp_customer_booking_details_data = [];
        }
      });
  };

}]);
// end blpAppUserDetailsController controller

blpApp.module.controller("blpAppBarListingController", ['$scope', '$http', '$sce','$cookies','$location', function($scope, $http, $sce,$cookies,$location)  {
  $scope.noBarList = {"display":"none"};
  $scope.barList = [];
  $scope.gotcha=function(merchantId,merchantcity,merchantaddress,venueid)
  {
    
    // alert(merchantaddress);
    var qty=jQuery("#qty").val().charAt(0);
    var quantityVal = parseInt(qty);

    if (isNaN(quantityVal))
    {
      // alert("You have to select the number of people");
      blpApp.warn("Please select number of tickets and search again.");
    }

    else
    {
     
     var selectedDate = jQuery("#date").val().split('-');
     var datLt = selectedDate[1].trim();
     var exactDate = '';
     if (datLt.length <= 1){
       exactDate = "0"+datLt;
       console.log(exactDate);
     }else{
       exactDate = datLt;
       console.log(exactDate);
     }
     var finalDate = selectedDate[2].trim()+ '-' +selectedDate[0].trim()+ '-'+ exactDate;
     var reservationDate = finalDate;
     //var merchantName = jQuery("input#merchantName").val();
     var merchantName = merchantId;

    // var quantityVal = parseInt(jQuery("#quantityReservation").val());   //No of person
     var quantity_Person = jQuery("#qty").val();

    // var merchantId = parseInt(jQuery("#merchantId").val());   //Merchant ID from argument
     var merchantId = venueid;

/* Unit Price Code Start */

   var data ={};


       var sdate = finalDate;
       console.log(sdate);

       var days = [
           'Sunday', //Sunday starts at 0
           'Monday',
           'Tuesday',
           'Wednesday',
           'Thursday',
           'Friday',
           'Saturday'
       ];


       //var date = jQuery(this).datepicker('getDate');
       //var day = jQuery.datepicker.formatDate('DD', date);
       //alert(day);
       var n = new Date(sdate);
       var w = n.getDay();
       console.log(days[w]);
       var day=days[w];


       //var qty = parseInt(jQuery("#quantityReservation").val());
       var qty=quantity_Person.charAt(0);
       var quantityVal = parseInt(qty);
       //alert(quantityVal);
       data["date_selected"] =sdate;
       data["day_selected"] =day;
       data["merchant_name"] =venueid;

       $http({
         'method': 'POST',
         'url':  blpApp.baseUrl+ "generics/_get_listing_data",
         "data": data,
         "headers": {
         "Content-Type": "application/x-www-form-urlencoded"
         }
        }).then(function(datas) {

         var nprice = parseFloat(datas.data.price).toFixed(2);




         //alert(data.data.price);
         //jQuery("#addSingleDay_quantity").val(data.data.qty);



/* Unit Price Code Ends*/

     var oneUnitPrice =nprice;
     // alert(oneUnitPrice);

     var reservationCity = jQuery("#city").val();

     var special = datas.data.special;

     var reservationTotalAmt = (oneUnitPrice*quantityVal);
     // alert (reservationTotalAmt);
     var reservationObj = {
       "reservationDate":reservationDate,
       "merchantName":merchantName,
       "quantityVal":quantityVal,
       "merchantId":merchantId,
       "oneUnitPrice":oneUnitPrice,
       "reservationCity":reservationCity,
       "reservationTotalAmt":reservationTotalAmt
     }
     $cookies.put('reservationObj', JSON.stringify(reservationObj));

     $http({
       'method': 'POST',
       "url":  blpApp.baseUrl+"listings/_setsession",
       'data':  reservationObj,
       'headers': {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
     }).then( function( data ) { });

     blpApp.getCurrentUser($http,function(currentUser) {
       $scope.currentUser = currentUser;
       if ( typeof $scope.currentUser === 'object' ){
         $scope.showIfLogged={"display":"block"};
         $scope.showIfNotLogged = {"display":"none"};
         if($scope.currentUser.model == "home.merchant"){
           $scope.showIfVenueLogged = { "display": "block" };
         }else if ($scope.currentUser.model == "home.customer"){
           $scope.showIfUserLogged = { "display": "block" };
         }else{
           $scope.showIfVenueLogged= { "display": "none" };
           $scope.showIfUserLogged= { "display": "none" };
         }
       }


         if(merchantId) {
             var  url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+reservationCity+"&merchant_id="+merchantId;
         } else {
           var url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+reservationCity;
         }
         $("div#mydivloader").show();
         $http({
           'method': 'GET',
           'url': url
         }).then(function(data) {
           var log = [];
           var roughData = [];
           angular.forEach(data.data.bars, function(value, key) {


             if(merchantId == value.merchant.pk){
               if (value.listings .length === 0) {
                 $("div#mydivloader").hide();
                 blpApp.warn("Sold out! Please pick another venue or date.");
               }

               angular.forEach(value.listings, function(listingValue, listinngKey) {
                 if(listingValue.listing.date == reservationDate.trim()){
                   $scope.currentListing = listingValue;
                   delete $scope.currentListing['merchant']['fields']['blp_merchant_description'];
                   if ($scope.currentListing) {
                     var dataCollected = {
                       "listing":$scope.currentListing,
                       "unitPrice": parseFloat($scope.currentListing['listing']['unit_price']).toFixed(2),
                       "totalPrice": parseFloat(reservationTotalAmt).toFixed(2),
                       "dateSelected": reservationDate,
                       "dateStart": reservationDate,
                       "dateEnd": reservationDate,
                       "qtySelected": parseInt(quantityVal)
                     };
                     if (special == 'True'){
                       if ( listingValue.listing.id == null) {
                         console.log('null');
                       }else {
                         $http({
                         'method': 'POST',
                         "url":  blpApp.baseUrl+"listings/_book",
                         'data':  dataCollected,
                         'headers': {
                           'Content-Type': 'application/x-www-form-urlencoded'
                         }
                       }).then( function( data ) {
                         if (data.data.status===blpApp.statusCodes.OK) {



                           if ($scope.currentQuantity.title == 'No. Of Passes')
                           {
                             alert("You have to select the number of people");
                             return;
                           }
                            var selectedDate = jQuery("#date").val();
                             var currentCity= $scope.currentCity.title;
                             var currentQuantity= $scope.currentQuantity.title;
                             // urlstr='venue_id='+venueid+'&merchantId='+merchantId+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal+'&reservationCity='+merchantaddress+'&oneUnitPrice='+oneUnitPrice+'&reservationTotalAmt='+reservationTotalAmt+'&merchantName='+merchantName;
                           var urlstr='merchantId='+merchantId+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal;

                           // blpApp.route('generics/make_payment');
                           window.location.href = 'generics/make_payment?'+urlstr;



                           // blpApp.route(data.data.data);
                           $("div#mydivloader").hide();
                           blpApp.warn("Please wait while we redirect to checkout..", "success");
                         } else {
                           $("div#mydivloader").hide();
                           blpApp.warn("Sold out! Please pick another venue or date.");
                         }
                       });
                       }
                     }else {
                       $http({
                       'method': 'POST',
                       "url":  blpApp.baseUrl+"listings/_book",
                       'data':  dataCollected,
                       'headers': {
                         'Content-Type': 'application/x-www-form-urlencoded'
                       }
                     }).then( function( data ) {
                       if (data.data.status===blpApp.statusCodes.OK) {





                          var selectedDate = jQuery("#date").val();
                           var currentCity= $scope.currentCity.title;
                           var currentQuantity= $scope.currentQuantity.title;
                           // urlstr='venue_id='+venueid+'&merchantId='+merchantId+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal+'&reservationCity='+merchantaddress+'&oneUnitPrice='+oneUnitPrice+'&reservationTotalAmt='+reservationTotalAmt+'&merchantName='+merchantName; 
                           var urlstr='merchantId='+merchantId+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal;
                         // blpApp.route('generics/make_payment');
                         window.location.href = 'generics/make_payment?'+urlstr;




                         //blpApp.route(data.data.data);
                         $("div#mydivloader").hide();
                         blpApp.warn("Please wait while we redirect to checkout..", "success");
                       } else {
                         $("div#mydivloader").hide();
                         blpApp.warn("Sold out! Please pick another venue or date.");
                       }
                     });
                     }

                   } else {
                     $("div#mydivloader").hide();
                     blpApp.warn("Sold out! Please pick another venue or date.");
                   }
                 }
               }, roughData);

             }

           }, log);

         });


     });


});
}
};
  

  jQuery(document).ready(function () {
    var cityName = document.location.href.match(/city=([^&]+)/);
    var url = blpApp.baseUrl+"generics/_get_bar_listings?city="+cityName[1];
    $http({
      'method': 'GET',
      'url': url
    }).then(function(data) {
      if (data.data.bars.length > 0) {
        $scope.noBarList = {"display":"none"};
        $scope.barList =  data.data.bars;
      }else{
        $scope.noBarList = {"display":"block"};
      }
    });
  });


}]);


blpApp.module.controller("blpAppListingsController", ['$scope', '$http', '$sce','$cookies','uiGmapGoogleMapApi', function($scope, $http, $sce, $cookies, uiGmapGoogleMapApi) {
   	$scope.reservationDisplay={"display":"none"};
    $scope.barNotSelected={"display":"none"};
    $scope.barSelected={"display":"none"};

        $scope.barDisplay = {"display":"none"};
	$scope.totalPrice = 0.0;
        $scope.currentUser = false;
	$scope.currentCity = {};
	$scope.currentListing = false;
        $scope.currentBar = false;
	$scope.reservationBoxShow = {"display":"none"};
  	$scope.agreeText = $sce.trustAsHtml("By clicking 'Checkout' you agree to our <a target='_blank' href='/pages/terms'>terms of service</a>");
        $scope.showNoBars = {"display":"none"};
        $scope.showBars = {"display": "none"};
        $scope.showCurrentBar = {"display":"block"};
        $scope.showNoListings = {"display": "none"};
        $scope.listings = [];
        $scope.listingsOnDate=[];
	$scope.expiryMonths = [];
	$scope.expiryYears = [];
  $scope.currentQuantity = '';

  $scope.areaLat = 30.7046486,
  $scope.areaLng = 76.71787259999999,
  $scope.areaZoom = 12;
  $scope.barTimeZoneId = [],
  $scope.getDataforCalendar = {};


    jQuery(document).ready( function () {

      var address = jQuery('#venueaddress').val();
      $http.get('https://maps.google.com/maps/api/geocode/json?address='+address+'&sensor=false').success(function(mapData) {        angular.extend($scope, mapData);

        $scope.areaLat = mapData.results[0].geometry.location.lat;
        $scope.areaLng = mapData.results[0].geometry.location.lng;

        $http.get('https://maps.googleapis.com/maps/api/timezone/json?location='+$scope.areaLat+','+$scope.areaLng+'&timestamp=1331161200&key=AIzaSyCNJpiJ5CwqN2nfqcG_tH9_3pFsiOn_H6U').success(function(timeZoneData) {angular.extend($scope, timeZoneData);
          $scope.barTimeZoneId = timeZoneData.timeZoneId;
        });

        uiGmapGoogleMapApi.then(function (maps) {
            $scope.map = { center: { latitude: $scope.areaLat, longitude: $scope.areaLng }, zoom: $scope.areaZoom };
            $scope.options = { scrollwheel: false };
            $scope.markers = [{
          id: "id",
          last_known_location: {
            latitude: $scope.areaLat,
            longitude: $scope.areaLng
          }
        }];
        });
        });
        //console.log($scope.areaLat);

jQuery(document).ready(function () {
     var current_qty = parseInt(jQuery('#quantityReservation').val());
     //alert(current_qty);
     //var res = jQuery.isNumeric(current_qty);
     if (!isNaN(current_qty)) {
       var unit_price = parseFloat(jQuery('#oneUnitPrice').val()).toFixed(2);
       var total = (current_qty * unit_price).toFixed(2);

       jQuery('#unitprice').html(total);
       jQuery('#allUnitPrice').val(total);
     }else {
       //alert('Please enter number');
     }
   })

   jQuery('#quantityReservation').keyup(function () {
     var current_qty = parseInt(jQuery(this).val());
     //var res = jQuery.isNumeric(current_qty);
     if (!isNaN(current_qty)) {
       var unit_price = parseFloat(jQuery('#oneUnitPrice').val()).toFixed(2);
       var total = (current_qty * unit_price).toFixed(2);
       jQuery('#unitprice').html(total);
       jQuery('#allUnitPrice').val(total);
     }else {
       //alert('Please enter number');
     }
   })

jQuery(document).ready(function () {
  var availableDates = [];
  var merchantId = parseInt(jQuery("#merchantId").val());
  var reservationCity = jQuery("input#city").val();
  if(merchantId) {
      var  url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+reservationCity+"&merchant_id="+merchantId;
  } else {
    var url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+reservationCity;
  }
  $http({
    'method': 'GET',
    'url': url
  }).then(function(data) {
    var log = [];
    var roughData = [];
    angular.forEach(data.data.bars, function(value, key) {

      if(merchantId == value.merchant.pk){

        angular.forEach(value.listings, function(listingValue, listinngKey) {
          date = listingValue.listing.date;
          d = new Date(date);
          dmy2  = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() ;
          availableDates.push(dmy2);
          /*if (availableDates == "") {
            availableDates = date;
          }else {
            availableDates = availableDates + ' , '+date;
            $scope.getDataforCalendar =  availableDates;
          }*/
        }, roughData);

      } else {
        //console.log('3');
        //blpApp.warn("Sold out! Please pick another venue or date.");
      }

    }, log);
  });
  $scope.getDataforCalendar =  availableDates;
});

function available(date) {
  var availableDates = $scope.getDataforCalendar;
  dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
  var dmy2  = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2) ;

  var currentDate = moment.tz(dmy2, $scope.barTimeZoneId);
  var dmy1  = currentDate._d.getFullYear() + "-" + (currentDate._d.getMonth()+1) + "-" + currentDate._d.getDate() ;


  if ($.inArray(dmy1, availableDates) != -1) {

    return [true, "","Available"];
  } else {
    return [false,"","unAvailable"];
  }
}
$("#venuedatepickerclick").click(function() {
   $("#venuedatepicker").datepicker( "show" );
  });

   jQuery( "#venuedatepicker" ).datepicker({
     dateFormat: 'mm-dd-yy',
     minDate: 0,
     onSelect: function(dateText, inst) {
       var data ={};
       var selectedDate = jQuery("#venuedatepicker").val().split('-');
       var finalDate = selectedDate[2]+'-'+selectedDate[0]+'-'+selectedDate[1];
       var sdate = finalDate;
       var merchantName = jQuery("#merchantName").val();
       var date = jQuery(this).datepicker('getDate');
       var day = jQuery.datepicker.formatDate('DD', date);
       var qty = parseInt(jQuery("#quantityReservation").val());
       var merchantId=parseInt(jQuery("#merchantId").val());
       

       data["date_selected"] =sdate;
       data["day_selected"] =day;
       data["merchant_name"] =merchantId;
       $http({
         'method': 'POST',
         'url':  blpApp.baseUrl+ "generics/_get_listing_data",
         "data": data,
         "headers": {
         "Content-Type": "application/x-www-form-urlencoded"
         }
        }).then(function(data) {
         var nprice = parseFloat(data.data.price).toFixed(2);
         
         jQuery("#unitprice").html((qty*nprice).toFixed(2));
         jQuery("#oneUnitPrice").val(nprice);
         jQuery("#special").val(data.data.special);
         //jQuery("#unitprice").html(qty*parseInt(data.data.price));
         jQuery("#maxQuantity").html(qty*parseInt(data.data.price));
         //alert(data.data.price);
         //jQuery("#addSingleDay_quantity").val(data.data.qty);
       });


     },
    beforeShowDay: available
 });

 })

	$scope.cardTypes = [{
		"title": "VISA",
		"value": "VISA"
	},
	{
		"title": "MasterCard",
		"value": "MasterCard"
	},
	{
		"title": "AMEX",
		"value": "AMEX"
	},
	{
		"title": "Diner's Club",
		"value": "Diner's Club"
	} ];
	 $scope.date = new Date;
	$scope.defaults={
		"minExpiryYear": $scope.date.getYear(),
		"maxExpiryYear": $scope.date.getYear()+100,
		"minExpiryMonth": 01,
		"maxExpiryMonth": 12
	};
	$scope.shows={"reservation_box":false};

	$scope.init = function() {


		var cityName = document.location.href.match(/city=([^&]+)/);


		var thanksPage = document.location.href.match(/\/(thanks|error)/);
		if (!thanksPage) {
		  cityName = cityName ? cityName[1] : null;
		  if (cityName) {
                         blpApp.getCurrentUser($http, function(currentUser) {
                          $scope.currentUser = currentUser;
                          $("div#mydivloader").show();
			  $scope.getCityAndListings(cityName, false, function(data) {
          chec = false;
                                var results = data.data.bars;
                                $scope.events =data.data.events||[];

                                        if (results.length>0) {
				  $scope.buildDefaults();
                                   $scope.currentHeading = "Bars";
                                   $scope.showNoBars={"display":"none"};
                                   $scope.showBars={"display":"block"};
                                   $scope.barNotSelected = {"display":"block"};
                                        } else {

                                      $scope.buildDefaults();
                                      $scope.showNoBars = {"display":"block"};
                                      $scope.showBars={"display": "none"};
                                        }

                                $scope.currentCity=data.data.city;
                                var newbars = {};
                                var i = 0;

                                //To select Date from URL
                                var selected_date = document.location.href.match(/date=(.*)/);

                                //To select selected quantity from URL
                                function getParameterByName(name, url) {
                                if (!url) url = window.location.href;
                                name = name.replace(/[\[\]]/g, "\\$&");
                                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                                    results = regex.exec(url);
                                if (!results) return null;
                                if (!results[2]) return '';
                                return decodeURIComponent(results[2].replace(/\+/g, " "));
                                }

                                var selected_person_qty = getParameterByName('qty').charAt(0); // "" (present with empty value)
                                var selected_person_qty = parseInt(selected_person_qty);
                                //alert(selected_person_qty);


                                if  (selected_date === null){
                                  var select_dated = new Date;
                                }else {
                                  var dateArray = selected_date[1].split("-");
                                  var select_dated = selected_date[1];
                                }

                                var tocheckdate = $scope.date;
                                angular.forEach(data.data.bars, function(value, key) {
                                  i++;
                                    angular.forEach(value.listings, function(nvalue, nkey) {
                                      var listing_date = nvalue.listing.date;
                                      d = new Date(listing_date);
                                      listing_date_converted  = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() ;

                                      select_dated = new Date(select_dated);
                                      dmy = select_dated.getFullYear() + "-" + (select_dated.getMonth()+1) + "-" + select_dated.getDate();
                                      // && (nvalue.listing.quantity_remaining>=selected_person_qty)
                                      // if (dmy == listing_date_converted ) {


                                      // if (dmy == listing_date_converted && (nvalue.listing.quantity_remaining>=selected_person_qty)) {
                                      if (dmy == listing_date_converted) {  


                                        chec = true;
                                        newbars[i] = value;
                                      }

                                    });

                                });
				$scope.bars = newbars;

        if (chec == true) {
          console.log('hi?');
            $scope.buildDefaults();
               $scope.currentHeading = "Bars";
               $scope.showNoBars={"display":"none"};
               $scope.showBars={"display":"block"};
               $scope.barNotSelected = {"display":"block"};
                    } else {
                      console.log('hiassa?');

                  $scope.buildDefaults();
                  $scope.showNoBars = {"display":"block"};
                  $scope.showBars={"display": "none"};
        }
        $("div#mydivloader").hide();

			  });
                         });

			}
		  } else {
			var which =  thanksPage[1];
			if (which === "thanks") {
				$scope.generateSale();
			}
		}
	};

  	$scope.getSelectedDate = function(){
	   	return blpApp.selectedDate;
	};
	$scope.buildDefaults = function() {
	    var iterator = 0;
		var expiryMonths=[],expiryYears=[],cardTypes=[];
	for ( iterator = $scope.defaults['minExpiryYear']; iterator != $scope.defaults['maxExpiryYear']; iterator ++ ) {
		expiryYears.push({
			"title": blpApp.ensureTwo(iterator),
			"value": blpApp.ensureTwo(iterator)
			});
	}
		for (iterator = $scope.defaults['minExpiryMonth']; iterator != $scope.defaults['maxExpiryMonth']; iterator ++ ) {
			expiryMonths.push( {
				"title": blpApp.ensureTwo(iterator),
				"value": blpApp.ensureTwo(iterator)
			});
		}
	     $scope.expiryMonths=expiryMonths;
		$scope.expiryYears=expiryYears;
	   $scope.currentExpiryYear=expiryYears[0];
	  $scope.currentExpiryMonth=expiryMonths[0];
	 $scope.currentCardType=$scope.cardTypes[0];
	};

	$scope.updatePricing = function() {
	   var qty = jQuery("#quantityReservation").val();
	   //var date = jQuery("#dateStartReservation").val();
	if ( $scope.currentListing ) {
	   var eventId = $scope.currentListing['listing']['id'];
	   var pricingSeen = parseFloat($scope.currentListing['listing']['unit_price']);
			/*
	   $http({
		"method": "POST",
		"data": {
			"qty": qty,
			"price": pricingSeen
			//"date": date,
			"_id": eventId,
		},
		"headers": {
		"Content-Type": "application/x-www-form-urlencoded"
		},
		"url": blpApp.baseUrl+"generics/_get_pricing"
		}).then(function(data) {
			$scope.totalPrice=data.data.price;
		});
	  	}
		*/

		$scope.totalPrice = (parseInt(qty)*parseFloat(pricingSeen)).toFixed(2);
		}
	  };

	$scope.getCityAndListings = function(cityName, merchantId, callback) {
			if(merchantId) {
	 		var  url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+cityName+"&merchant_id="+merchantId;
			 } else {
			var url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+cityName;
			}
			$http({
				'method': 'GET',
				'url': url
			}).then(function(data) {
				callback( data );
			});
	};

        $scope.getMerchantListingsOnDate = function(date,title) {
               $scope.currentListing = false;
               date = new Date(date.getTime() - ( (3600*(24)) *1000 ));
               var  listingsOnDate=[];



               for ( var i in $scope.currentBar.listings ) {
                       var date2 = new Date(Date.parse($scope.currentBar.listings[i].listing.date));

                        if ( date2.getFullYear()===date.getFullYear()  &&
                                date2.getMonth()===date.getMonth() &&
                                date2.getDate()===date.getDate()) {
                               listingsOnDate.push( $scope.currentBar.listings[i]);

                         }
                 }

                        if ( ! (listingsOnDate.length  > 0 ) ) {
                                $scope.showNoListings = {"display":"block"};
                        } else {
                                $scope.showNoListings = {'display': 'none'};

                        }
                        $scope.listingsOnDate=listingsOnDate;
                        $scope.startReservation2(listingsOnDate[0]);
                        var errorDiv = $('#afterDateSelectionFocus:visible').first();
                        //var scrollPos = errorDiv.offset().top-200;
                        //$(window).scrollTop(scrollPos);

                        $scope.listingsOnDate=listingsOnDate;
                        $scope.$apply();

         };
        $scope.startReservation1 = function(bar) {



                jQuery('.bar-thumbs-div').css('display','none');
                jQuery('.bar-details-div').show();



                $scope.currentBar = bar;
                $scope.calendarText = "'s Calendar ";
                $scope.calendarSelection = "Select Reservation Date:";
                $scope.showCurrentBar={"display":"block"};
                jQuery(window).trigger( 'resize' );
                var events = blpApp.generateEvents( bar.listings );
                  if (events.length<=0) {
                    $scope.showNoBars = {"display":"none"};
                    $scope.showBars = {"display":"none"};

                  }else {
                    blpApp.loadCalendar(
                       jQuery("#MerchantCalendar"),
                        [],
                        true,
                        $scope,
                       { left: '', center: '', right: '' },
                       "getMerchantListingsOnDate"
                    );

                    $scope.currentBarTitle = $scope.currentBar.merchant.fields.blp_merchant_name;
                    if ( $scope.currentBar.photos.photos.length>0) {
                        $scope.currentPhoto = $scope.currentBar.photos.photos[0];
                    } else {
                        $scope.currentPhoto = {};
                    }
                    if ( $scope.currentBar.listings.length<0 ) {
                        $scope.showNoListings={"display":"block"};
                    }
                    $scope.showNoBars = {"display":"none"};
                    $scope.showBars = {"display":"block"};
                    $scope.barNotSelected={"display":"none"};
                    $scope.barSelected={"display":"block"};
                  }
                  var selected_date = document.location.href.match(/date=(.*)/);
                  var dateArray = selected_date[1].split("-");
                  var date = new Date();
                  date.setDate(dateArray[2]);
                  date.setMonth(dateArray[1]-1);
                  date.setDate(date.getDate() + 1);
                  $scope.getMerchantListingsOnDate(date, '');
        };

	$scope.startReservation2 = function(listing) {
    $scope.currentListing=listing;
                jQuery("#quantityReservation").val(1);
                $scope.updatePricing();
		//$scope['reservationDisplay']={"display":"block"};
	};
	$scope.showSequenceIfNeeded = function(sequenceNumber) {
            if ( sequenceNumber === 3 ) {
	   if ($scope.currentListing) {
	     $scope['reservationDisplay']={"display":"block"};
	   } else {
	 $scope['reservationDisplay'] = {"display": "none"};
	    }
               return $scope['reservationDisplay'];
          } else { //  for 2
           if ($scope.currentBar) {
             $scope['barDisplay'] = {"display": "block"};
            } else {
             $scope['barDisplay'] = {"display": "none"};
            }
            return $scope['barDisplay'];
          }
	};
        $scope.switchPhoto = function(photo) {
                 $scope.currentPhoto =photo;
         };

	$scope.selectListing = function(listing) {
	  //jQuery("#currentListingId").val(listing.id);
	  $scope.currentListing = listing;
	 for ( var i in $scope.listings  ) {
			if ( $scope.listings[i].selected==="active") {
				$scope.listings[i].selected="";
			}
	}
		$scope.gotoEventDate(listing);
		listing.selected="active";
	};
	$scope.gotoEventDate = function(listing) {
		var dateOfEvent = listing.fields.blp_merchant_event_date.replace(/\s+/, "T");
		var moment = $scope.dateHandler.moment(dateOfEvent);
		$scope.dateHandler.gotoDate(moment);
	  };

	$scope.checkout = function() {
    var date = $scope.getSelectedDate();
    var selectedDate = jQuery("#venuedatepicker").val().split('-');
    var datLt = selectedDate[1].trim();
    var exactDate = '';
    if (datLt.length <= 1){
      exactDate = "0"+datLt;
      console.log(exactDate);
    }else{
      exactDate = datLt;
      console.log(exactDate);
    }
    var finalDate = selectedDate[2].trim()+ '-' +selectedDate[0].trim()+ '-'+ exactDate;
    var reservationDate = finalDate;
    var merchantName = jQuery("input#merchantName").val();
    var quantityVal = parseInt(jQuery("#quantityReservation").val());
    var merchantId = parseInt(jQuery("#merchantId").val());
    var oneUnitPrice = jQuery("input#oneUnitPrice").val();
    var reservationCity = jQuery("input#city").val();
    var special = jQuery("input#special").val();
    var reservationTotalAmt = (oneUnitPrice*quantityVal);
    var reservationObj = {
      "reservationDate":reservationDate,
      "merchantName":merchantName,
      "quantityVal":quantityVal,
      "merchantId":merchantId,
      "oneUnitPrice":oneUnitPrice,
      "reservationCity":reservationCity,
      "reservationTotalAmt":reservationTotalAmt
    }
    $cookies.put('reservationObj', JSON.stringify(reservationObj));

    $http({
      'method': 'POST',
      "url":  blpApp.baseUrl+"listings/_setsession",
      'data':  reservationObj,
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then( function( data ) { });

    blpApp.getCurrentUser($http,function(currentUser) {
      $scope.currentUser = currentUser;
      if ( typeof $scope.currentUser === 'object' ){
        $scope.showIfLogged={"display":"block"};
        $scope.showIfNotLogged = {"display":"none"};
        if($scope.currentUser.model == "home.merchant"){
          $scope.showIfVenueLogged = { "display": "block" };
        }else if ($scope.currentUser.model == "home.customer"){
          $scope.showIfUserLogged = { "display": "block" };
        }else{
          $scope.showIfVenueLogged= { "display": "none" };
          $scope.showIfUserLogged= { "display": "none" };
        }
      }

      // if ( !$scope.currentUser ) 
      //htp

      // {
      //   $('#myLoginModal').modal('show');
      // } else if($scope.currentUser.model == "home.merchant"){
      //   blpApp.warn("Sorry! you couldn't make order because you are a Venue owner.");
      // } else if(quantityVal <= 0 ){
      //      blpApp.warn("Please select an accurate quantity. Starting from 1");
      // } else if($scope.currentUser.fields.blp_customer_active == 0 ){
      //      blpApp.warn("Please verify your email to continue reservation");
      // }  else 
      {
        if(quantityVal <= 0 ){
           blpApp.warn("Please select an accurate quantity. Starting from 1");
        }

      //htp  

        if(merchantId) {
            var  url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+reservationCity+"&merchant_id="+merchantId;
        } else {
          var url = blpApp.baseUrl+"generics/_get_city_and_listings?city="+reservationCity;
        }
        $("div#mydivloader").show();
        $http({
          'method': 'GET',
          'url': url
        }).then(function(data) {
          var log = [];
          var roughData = [];
          angular.forEach(data.data.bars, function(value, key) {

            if(merchantId == value.merchant.pk){

              if (value.listings .length === 0) {
                $("div#mydivloader").hide();
                blpApp.warn("Sold out! Please pick another venue or date.");
              }

              angular.forEach(value.listings, function(listingValue, listinngKey) {
                if(listingValue.listing.date == reservationDate.trim()){
                  $scope.currentListing = listingValue;                  
                  delete $scope.currentListing['merchant']['fields']['blp_merchant_description'];
                  if ($scope.currentListing) {
                    var dataCollected = {
                      "listing":$scope.currentListing,
                      "unitPrice": parseFloat($scope.currentListing['listing']['unit_price']).toFixed(2),
                      "totalPrice": parseFloat(reservationTotalAmt).toFixed(2),
                      "dateSelected": reservationDate,
                      "dateStart": reservationDate,
                      "dateEnd": reservationDate,
                      "qtySelected": parseInt(quantityVal)
                    };
                    if (special == 'True'){
                      if ( listingValue.listing.id == null) {
                        console.log('null');
                      }else {
                        $http({
                        'method': 'POST',
                        "url":  blpApp.baseUrl+"listings/_book",
                        'data':  dataCollected,
                        'headers': {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      }).then( function( data ) {
                        if (data.data.status===blpApp.statusCodes.OK) {
                          // alert(urlstr)
                          // var urlstr='merchantId='+merchantId+'&merchantName='+merchantName+'&reservationDate='+reservationDate+'&reservationTotalAmt='+reservationTotalAmt+'&quantityVal='+quantityVal+'&oneUnitPrice='+oneUnitPrice+'&reservationCity='+reservationCity+'&special='+special;
                          // var urlstr='merchantId='+merchantId+'&merchantName='+merchantName+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal+'&reservationCity='+reservationCity+'&special='+special;
                          var urlstr='merchantId='+merchantId+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal;

                          // blpApp.route('generics/make_payment');
                          window.location.href = 'generics/make_payment?'+urlstr;

                          $("div#mydivloader").hide();
                          blpApp.warn("Please wait while we redirect to checkout..", "success");
                        } else {
                          $("div#mydivloader").hide();
                          blpApp.warn("Sold out! Please pick another venue or date.");
                        }
                      });
                      }
                    }else {
                      $http({
                      'method': 'POST',
                      "url":  blpApp.baseUrl+"listings/_book",
                      'data':  dataCollected,
                      'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                    }).then( function( data ) {
                      // alert(data,data.data.status)
                      if (data.data.status===blpApp.statusCodes.OK) 
                      {

                        // blpApp.route('generics/make_payment');
                        // var urlstr='merchantId='+merchantId+'&merchantName='+merchantName+'&reservationDate='+reservationDate+'&reservationTotalAmt='+reservationTotalAmt+'&quantityVal='+quantityVal+'&oneUnitPrice='+oneUnitPrice+'&reservationCity='+reservationCity+'&special='+special;
                        // var urlstr='merchantId='+merchantId+'&merchantName='+merchantName+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal+'&reservationCity='+reservationCity+'&special='+special;
                        var urlstr='merchantId='+merchantId+'&reservationDate='+reservationDate+'&quantityVal='+quantityVal;

                        // blpApp.route('generics/make_payment');
                        window.location.href = 'generics/make_payment?'+urlstr;
                        $("div#mydivloader").hide();
                        blpApp.warn("Please wait while we redirect to checkout..", "success");
                      } else {
                        $("div#mydivloader").hide();
                        // alert(data,data.data.status)
                        blpApp.warn("Sold out! Please pick another venue or date.");
                      }
                    });
                    }

                  } else {
                    $("div#mydivloader").hide();
                    blpApp.warn("Sold out! Please pick another venue or date.");
                  }
                }
              }, roughData);

            }

          }, log);

        });
      }

    });

    };

     $scope.getEventId = function() {
	  var matches = document.location.href.match(/event_id=(.*)/);
	   return matches[1];
	 };
     $scope.generateSale = function() { // on thank you page
		var eventId = $scope.getEventId();
		$http({
			'method': "POST",
			"url": blpApp.baseUrl+"generics/_insert_sale?id="+eventId,

			"headers": {
				"Content-Type": "application/x-www-urlencoded"
			}
		}).then(function(data) {
			if (data.data.status===blpApp.statusCodes.OK) {
				 blpApp.log("Generated Sale For User");
			}
		});
	};

     $scope.showReservationBox = function() {
	 return $scope.reservationBoxShow;
	};
    jQuery(document).ready(function() {
    $scope.init();
    });
   }]);

  blpApp.module.controller("blpAppVenueController", ['$scope', '$http', function($scope,$http) {
	$scope.bars = [];
	$scope.cities =[];
	$scope.currentListing = false;
        $scope.currentPhoto = {};
        $scope.currentBarTitle = "";
        $scope.currentBar = false;
	$scope.currentQRCode = {};
	$scope.currentMerchant = {};
	$scope.editListingDisplay = {};
	$scope.addListingDisplay = {};
	$scope.addListingButtonDisplay = {"display": "none"};
  $scope.getVenueSpecialDays = {};

  jQuery(document).ready( function () {
    jQuery('#MerchantCalendar').fullCalendar({
      dayClick: function(date, jsEvent, view) {
        //alert('Clicked on: ' + date.format());
        var data ={};
   			jQuery("#calenderDateSelected").html(date.format());
        jQuery("#addSingleDay_date").val(date.format());

   			data["date_selected"] =date.format();

               $http({
                 'method': 'POST',
                 'url':  blpApp.baseUrl+ "generics/_get_listing_days",
                 "data": data,
                 "headers": {
                 "Content-Type": "application/x-www-form-urlencoded"
                 }
                }).then(function(data) {
                 jQuery("#addSingleDay_price").val(data.data.price);
                 jQuery("#addSingleDay_quantity").val(data.data.qty);
               });
     },

     height : "auto"
            // put your options and callbacks here
    })
  })


  $scope.addSingleDayQuantity = {};
  $scope.addSingleDayPrice = {};

  $scope.addSingleDay = {
        quantity: "default",
        price: "default",
    };

	$scope.enumeratedDays = [{
		"name": "Monday",
		"value": "monday"
	},
	{
		"name": "Tuesday",
		"value": "tuesday"
	},
	{
		"name": "Wednesday",
		"value": "wednesday"
	},
	{
		"name": "Thursday",
		"value": "thursday"
	},
	{
		"name": "Friday",
		"value": "friday"
	},
	{
		"name": "Saturday",
		"value": "saturday"
	},
	{
		"name": "Sunday",
		"value": "sunday"
	}];
	$scope.init = function() {

		console.log($scope.enumeratedDays.length);
                var uploader = document.getElementById("photoUpload");
                      uploader.onchange = function() {
                             $scope.uploadPhoto();
                       };

	 	$scope.getCurrentMerchant(function(merchant) {
		  $scope.merchant=$scope.currentMerchant= merchant;
		  $scope.updateMerchantDayPricing();
		    $scope.getPhotos(function(photos) {
		      $scope.photos = photos;
		      $scope.getListings(function(events) {});
		    });
		});
	 };

   $scope.getVenueSpecialDays =  function () {

   }
	 $scope.getCurrentMerchant = function(callback) {
		$http({
			"method": "GET",
			"url": blpApp.baseUrl + "generics/_get_current_merchant"
		}).then(function(data) {
			callback(data.data.data);
		});
	  };
	 $scope.getPhotos = function(callback) {
	 	 $http({
			"method": "GET",
			"url": blpApp.baseUrl + "generics/_get_merchant_photos?merchant_id=" + $scope.currentMerchant.pk
			}).then( function( data )  {
				callback(data.data.data);
			});
	};
         $scope.showCalendar = function() {
	 };
	 $scope.showAddListing = function() {
		return $scope.addListingDisplay;
	 };
	 $scope.showAddListingButton = function() {
		return $scope.addListingButtonDisplay;
	 };
	 $scope.addListing = function(dateObj) {
	        //var dateObj = jQuery("#MerchantCalendar").fullCalendar("getDate")._d;
		//jQuery("#addListing").show();
		$scope.showListingBox(dateObj);
	 };


	 $scope.addListingButton = function(dateSelected) {
		$scope.dateSelected = dateSelected;
		//$scope.addListingButtonDisplay = {"display": "block"};
		$scope.addListing(dateSelected);
 	 };
 	 $scope.buildelement = function(input,stuff) {
		var field = jQuery("<div class='field'></div>");
		var  lbl  = jQuery("<label>"+stuff.title+"</label>");
	   	 var clr = jQuery('<div class="clear"></div>');
                if ( stuff.type==='hidden' ) {
                         jQuery(lbl).hide();
                }
		jQuery(field).append([lbl,clr,input]);
		return jQuery(field);
	 };
     	 $scope.buildinput =  function(stuff, type, value) {
		type = type || "text";
                value = value || "";
		var input = jQuery("<input type='text' class='pure-input'></input>");

		jQuery(input).attr("id",stuff.id);
		jQuery(input).attr("type", type);
                jQuery(input).val(value);
		 return $scope.buildelement(input, stuff);
	 };
	 $scope.buildtextarea = function(stuff) {
	   var textarea = jQuery("<textarea class='pure-input'></textarea>");
	    jQuery(textarea).attr("id", stuff.id);
	    return $scope.buildelement(textarea, stuff);
	 };
    	 $scope.buildnumber = function(stuff) {
	    return $scope.buildinput(stuff,"number");
	 };
	 $scope.builddate = function(stuff) {
	   return $scope.buildinput(stuff,"date");
	 };
         $scope.buildhidden = function(stuff) {
           return $scope.buildinput(stuff, "hidden", stuff.value );
        };



	 $scope.generateListingBox = function(date) {
		var elements = [{
			"id": "listingName",
			"title": "Listing Title",
			"type": "input"
		  },
	   	 {
			"id": "listingDescription",
			"title": "Listing Description",
			"type": "textarea"
		 },
		 {
			"id": "listingQty",
		  	"title": "Listing Quantity",
			"type": "number",
		 },
		{
			"id": "listingUnitPricing",
			"title": "Listing Pricing",
			"type": "number"
		},
		{
			"id": "listingDate",
			"title": "Listing Date",
                        "value": blpApp.getDate(date),
			"type": "hidden",
		}];
		var wrapper = jQuery("<div class='listing-box'></div>");
		jQuery(wrapper).append(
			jQuery("<h2>Add Special Listing</h2>"));

		for ( var i in  elements  ) {
			 var element = $scope['build'+elements[i].type](elements[i]);
			  jQuery(wrapper).append(element);
		 }
			var btn = jQuery("<button ng-click='saveListing()' class='pure-button pure-button-primary'>Save Listing</button>");
			jQuery(btn).click(function() {
				$scope.saveListing();
			});
			jQuery(wrapper).append(btn);
		 return wrapper;
	  };


	 $scope.showListingBox = function(dateObject){
	    /*$(".boxer").not(".retina, .boxer_fixed, .boxer_top, .boxer_format, .object").boxer();
	    $(".boxer .boxer_fixed").boxer({
		fixed: true
	    });
	    $(".boxer .boxer_top").boxer({
		"top": "-20px",
		"padding": "0px !important",
		"height": "auto"
	    });
	  $body = jQuery('body');
	   $.boxer($scope.generateListingBox( dateObject ));*/
	  };


	$scope.getListingDate = function(listing) {
	   return listing.fields.blp_merchant_event_date.replace(/\s/, "T");
   	 };
 	 $scope.generateEvents = function(listings) {
	   	var events = [];
		for (var i in listings ) {
      var listingDate = $scope.getListingDate(listings[i]);
			events.push({
				'title': listings[i].fields.blp_merchant_event_name,
				'description': listings[i].fields.blp_merchant_event_description,
				'start': listingDate,
				'end': listingDate
			 });
	 	 }
		return events;
	 };
	 $scope.getListings = function( callback ) {
	 	$http({
			'method': 'GET',
			'url':  blpApp.baseUrl + "generics/_get_listings"
		}).then(function(data) {
			if ( data.data.status === blpApp.statusCodes.OK) {

          blpApp.log("Events For Merchant a", data.data.data);

        $scope.listingEvents = data.data.data;
			  $scope.listingAsEvents = $scope.generateEvents( data.data.data );
			  //jQuery("#MerchantCalendar").html("");
			  //jQuery("#MerchantCalendar").fullCalendar("destroy");
			  blpApp.log("Events For Merchant", $scope.listingAsEvents);

			  /*blpApp.loadCalendar2(
                                        jQuery("#MerchantCalendar"),
                                        $scope.listingAsEvents,
                                        true,
                                        $scope,
                                        undefined,
                        "addListingButton");*/
			  callback ( data.data );
			}
		});
	 };
	$scope.editListing = function( listing ) {
		$scope.currentListing = listing;
	 };
	 $scope.showEditListing = function() {
		  if ($scope.currentListing) {
			$scope.editListingDisplay ={"display": "block"};
		}
		return $scope.editListingDisplay;
	 };
	 $scope.getDayData = function() {
	  	var data ={};
		for ( var i in $scope.enumeratedDays ) {
			var value = jQuery("#"+$scope.enumeratedDays[i].name+"_pricing").val();
			data[$scope.enumeratedDays[i].value+"_pricing"] =value;
			var qtyvalue = jQuery("#"+$scope.enumeratedDays[i].name+"_qty").val();
			data[$scope.enumeratedDays[i].value+"_qty"]=qtyvalue;
		}
		return data;
	 };

   $scope.getSingleDayData = function() {
	  	var date_selected = jQuery("#addSingleDay_date").val();
      var selectedDate = date_selected.split('-');
      var finalDate = selectedDate[2]+'-'+selectedDate[0]+'-'+selectedDate[1];
      var data ={};
      var value = jQuery("#addSingleDay_name").val();
      data["addSingleDay_name"] =value;
      var value = jQuery("#addSingleDay_description").val();
      data["addSingleDay_description"] =value;
			var value = jQuery("#addSingleDay_quantity").val();
			data["addSingleDay_quantity"] =value;
			var qtyvalue = jQuery("#addSingleDay_price").val();
			data["addSingleDay_price"]=qtyvalue;
      var datevalue = finalDate;
			data["addSingleDay_date"]=datevalue;
      var idvalue = jQuery("#addSingleDay_id").val();
      data["addSingleDay_id"]=idvalue ;
	    return data;
	 };




	 $scope.getCompliantDate = function(dateGiven,time) { //add  a start of date time
		return dateGiven.replace(/T/, " ");
	 };
   	$scope.getListingData = function() {
		return {
			"name": jQuery("#listingName").val(),
			"description": jQuery("#listingDescription").val(),
			"date": $scope.getCompliantDate(jQuery("#listingDate").val()),
			"unit_price": jQuery("#listingUnitPricing").val(),
			"qty": jQuery("#listingQty").val()
		};
	};


	$scope.updateMerchantDayPricing = function() {
	  for (var i in $scope.enumeratedDays) {
	  	jQuery("#"+$scope.enumeratedDays[i].name+"_pricing").val($scope.currentMerchant['fields']['blp_merchant_'+$scope.enumeratedDays[i].value+'_unit_pricing']);
		jQuery("#"+$scope.enumeratedDays[i].name+"_qty").val($scope.currentMerchant['fields']['blp_merchant_'+$scope.enumeratedDays[i].value+"_qty_total"]);
	   }
	 };
	$scope.getMerchantDayPricing = function(day) {
		if ($scope.merchant) {
	     	return $scope.merchant['fields']['blp_merchant_'+day.value+'_unit_pricing'];
		}
		};
 	$scope.getMerchantDayQuantity = function(day) {
		if ($scope.merchant) {
	 	return $scope.merchant['fields']['blp_merchant_'+day.value+'_qty_total'];
		}
	};

	$scope.saveListing = function() {
		$.boxer("close");
		 var listingData = $scope.getListingData();
		 if (listingData) {
			$http({
			'method': 'POST',
			'url': blpApp.baseUrl+"generics/_save_listing",
			"data": listingData,
			"headers": {
			"Content-Type": "application/x-www-form-urlencoded"
			}
		   }).then(function(response) {
			$scope.addListingDisplay={"display":"none"};
			$scope.addListingDisplayButton = {"display": "none"};
			if (response.data.status === blpApp.statusCodes.OK) {
				blpApp.warn("Listing was added successfully", "success");
				$scope.getListings();
			} else {
				blpApp.warn("Unable to add the listing");
			}
		});
		} else {
		blpApp.warn("Please verify your input");
		}
	 };

  /* $scope.getSingleDayDataDb = function() {
     $http({
       'method': 'GET',
       'url':  blpApp.baseUrl+ "generics/_get_listing_days"
      }).then(function(data) {
       callback(data.data);
      });
      };
	 };*/

$scope.deleteSingleListingData = function(date_selected) {

  var data ={};
  //jQuery("#calenderDateSelected").html(date.format());
  //jQuery("#addSingleDay_date").val(date.format());

  //data["date_selected"] =date.format();
  data["date_selected"] = date_selected;

         $http({
           'method': 'POST',
           'url':  blpApp.baseUrl+ "generics/_delete_listing_days",
           "data": data,
           "headers": {
           "Content-Type": "application/x-www-form-urlencoded"
           }
          }).then(function(data) {
           if (data.data.status ===blpApp.statusCodes.OK ) {
             $scope.getListings();
             console.log('deleted');
           }else {
            console.log('not deleted');
           }
         });

}

$scope.getSingleListingData = function(date_selected) {
   var data ={};
   //jQuery("#calenderDateSelected").html(date.format());
   //jQuery("#addSingleDay_date").val(date.format());

   //data["date_selected"] =date.format();
   data["date_selected"] = date_selected;
   var selectedDate = date_selected.split('-');
   var finalDate = selectedDate[1]+'-'+selectedDate[2]+'-'+selectedDate[0];

          $http({
            'method': 'POST',
            'url':  blpApp.baseUrl+ "generics/_get_listing_days",
            "data": data,
            "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
            }
           }).then(function(data) {
            jQuery("#addSingleDay_price").val(data.data.price);
            jQuery("#addSingleDay_date").val(finalDate);
            jQuery("#addSingleDay_name").val(data.data.name);
            jQuery("#addSingleDay_id").val(data.data.id);
            jQuery("#addSingleDay_description").val(data.data.description);
            jQuery("#addSingleDay_quantity").val(data.data.qty);
          });
        };

	$scope.saveListingDays = function( ) {

		var  dayData = $scope.getDayData();
    if ($scope.currentMerchant.fields.blp_merchant_active == 0){
      blpApp.warn("Please verify your email before continue to use this feature", "error");
    }
		else if (dayData) {
		  $http({
		  'method': 'POST',
		  'url' :  blpApp.baseUrl+"generics/_save_listing_days",
		  "data": dayData,
		  "headers": {
			  "Content-Type": "application/x-www-form-urlencoded"
		  }
		  }).then( function( response ) {
		  if (response.data.status ===blpApp.statusCodes.OK) {
			  blpApp.warn("Your listing information has been  saved", "success");
        $scope.getListings();
                  } else if (response.data.status === blpApp.statusCodes.WARNING) {
                          var notUpdated = response.data.days.join(",");
                          blpApp.warn("One or more listings dates were not updated " + notUpdated, "error");
		  }  else {
			  blpApp.warn("Could not save listing");
		  }
		  });
		} else {
		  blpApp.warn("Could not validate one or more of the day pricings", "error");
		}

	};

  $scope.saveSingleListingDays = function( ) {

    //var singleDayData = $scope.getSingleDayData();
    jQuery('.venueError').html('');
    var check = true;
		var  dayData = $scope.getSingleDayData();
    if ($scope.currentMerchant.fields.blp_merchant_active == 0){
      blpApp.warn("Please verify your email before continue to use this feature", "error");
      check = false;
    }else {
    if (dayData.addSingleDay_date == '' || isUndefined(dayData.addSingleDay_date)) {
      jQuery('#addSingleDay_date_error').html('Please select date');
      check = false;
    }

    if (dayData.addSingleDay_description == '' || isUndefined(dayData.addSingleDay_description)) {
      jQuery('#addSingleDay_description_error').html('Please enter event description');
      check = false;
    }

    if (dayData.addSingleDay_name == '' || isUndefined(dayData.addSingleDay_name)) {
      jQuery('#addSingleDay_name_error').html('Please enter event name');
      check = false;
    }

    if (dayData.addSingleDay_price == '' || isUndefined(dayData.addSingleDay_price)) {
      jQuery('#addSingleDay_price_error').html('Please enter event amount');
      check = false;
    }else  if (isNaN(dayData.addSingleDay_price)) {
      jQuery('#addSingleDay_price_error').html('Please enter number');
      check = false;
    }

    if (dayData.addSingleDay_quantity == '' || isUndefined(dayData.addSingleDay_quantity)) {
      jQuery('#addSingleDay_quantity_error').html('Please enter quantity');
      check = false;
    }


		if (check) {
		  $http({
		  'method': 'POST',
		  'url' :  blpApp.baseUrl+"generics/_save_single_listing",
		  "data": dayData,
		  "headers": {
			  "Content-Type": "application/x-www-form-urlencoded"
		  }
		  }).then( function( response ) {
		  if (response.data.status ===blpApp.statusCodes.OK) {
			  blpApp.warn("Your listing information has been  saved", "success");
        $scope.getListings();
                  } else if (response.data.status === blpApp.statusCodes.WARNING) {
                          var notUpdated = response.data.days.join(",");
                          blpApp.warn("One or more listings dates were not updated " + notUpdated, "success");
		  }else if (response.data.status ==='alreadyExist') {
        blpApp.warn("There is already an event for this day" , "error");
      }  else {
			  blpApp.warn("Could not save listing" , "error");
		  }
		  });
		} else {
		  blpApp.warn("Could not validate one or more fields", "error");
		}
  }

	};

	 $scope.editListingPost = function( listing ) {
		$http({
			'method': 'POST',
			'url': blpApp.baseUrl +"generics/edit_listing",
			'data':JSON.stringify( $scope.currentListing )
		}).then( function() {
			$scope.getListings( function(listings ) {
				$scope.listings=listings;
			});
		});
	  };
	 $scope.deleteListing = function( listing ) {
		$http({
			'method': 'POST',
			'url': blpApp.baseUrl+"generics/delete_listing?id="+ listing.id
		}).then(function( response ) {
			if (response.data.status ===blpApp.statusCodes.OK ) {
				$scope.warn("Deleted the listing successfully", "success");
				$scope.getListings(function(listings){
				$scope.listings=listings;
				});
			}
		});
	 };

         $scope.getPhotoIndex = function( photo ) {
            for ( var i in $scope.photos ) {
                 if ( $scope.photos[i].id===photo.id ) {
                        return i;
                      }
                }
          };
         $scope.downPhotoIndex = function(photo) {
                return $scope.upPhotoIndex(photo,false);
          };
         $scope.upPhotoIndex = function( photo, up ) {
            up = up || true;
            var foundSwap = false;
            var thisIdx = $scope.getPhotoIndex( photo );
            var swaps = [];
            for ( var i in  $scope.photos ) {
                 if ( up && ($scope.photos[i].fields.blp_merchant_photo_index==(photo.fields.blp_merchant_photo_index+1))) {
                               var swaps = [
                                        [$scope.photos[i]['pk'],$scope.photos[i]['fields']['blp_merchant_photo_index']-1],
                                        [photo['pk'],photo['fields']['blp_merchant_photo_index']+1]];

                  } else if (!up && ($scope.photos[i].fields.blp_merchant_photo_index===(photo.fields.blp_merchant_photo_index-1))) {
                                var swaps = [
                                        [$scope.photos[i]['pk'],$scope.photos[i]['fields']['blp_merchant_photo_index']+1],
                                        [photo['pk'],photo['fields']['blp_merchant_photo_index']-1]];
                   }
                    if (swaps.length > 0 ) {
                               var temp = $.extend({}, $scope.photos[i]);

                               $scope.photos[i]=photo;
                               var   oldIdx = $scope.photos[i]['fields']['blp_merchant_photo_index'];
                               $scope.photos[i]['fields']['blp_merchant_photo_index']=temp['fields']['blp_merchant_photo_index'];
                               $scope.photos[thisIdx]=temp;
                               $scope.photos[thisIdx]['fields']['blp_merchant_photo_index']= oldIdx;
                                for ( var i in swaps ) {
                                  $http({
                                       'method': 'POST',
                                        'url': blpApp.baseUrl+"generics/_change_photo_order",
                                        'data': { 'photo_id': swaps[i][0], 'index':  swaps[i][1] },
                                         'headers': {
                                                'Content-Type': 'application/x-www-form-urlencoded'
                                              }

                                 }).then( function(response) {
                                             blpApp.log("Changed order of photos");
                                        });
                                }
                               $scope.$apply();
                                break;
                      }
              }
        };



        $scope.removePhotoVenue = function (photo ) {
         $http({
           'method': 'POST',
           'url' : blpApp.baseUrl+"generics/_remove_photo?id="+photo
         }).then(function( data ) {
           if (data.data.status === blpApp.statusCodes.OK ) {
              blpApp.warn("Photo was deleted ", "success");
             $scope.getPhotos(function(photos) {
               $scope.photos =photos;
               //$scope.showCalendar();
             });
           } else {
             blpApp.warn("Unable to delete photo");
           }
         });
        };

	 $scope.removePhoto = function (photo ) {
		$http({
			'method': 'POST',
			'url' : blpApp.baseUrl+"generics/_remove_photo?id="+photo['pk']
		}).then(function( data ) {
			if (data.data.status === blpApp.statusCodes.OK ) {
				 blpApp.warn("Photo was deleted ", "success");
				$scope.getPhotos(function(photos) {
					$scope.photos =photos;
					//$scope.showCalendar();
				});
			} else {
				blpApp.warn("Unable to delete photo");
			}
		});
	};
	 $scope.uploadFile = function(data,ext) {
		$http({
			'method': 'POST',
			'url' :  blpApp.baseUrl+"generics/_upload_photo?ext="+ext,
			"data": data
		}).then(function(data) {
			if ( data.data.status === blpApp.statusCodes.OK ) {
				blpApp.warn("New photo was uploaded successfully", "success");
				$scope.getPhotos(function(photos) {
				   $scope.photos = photos;
				});
			} else {
				blpApp.warn("Unable to upload photo please try again");
			}
		});
	};
	  $scope.getFileExtension = function(file) {
	      var matches = file.name.match(/\.(jpg|jpeg|png|gif)$/, file.name);
	 	return matches ?  matches[1] : "";
	 };
   $scope.uploadPhotoStart = function() {
     jQuery('#photoUpload').trigger('click');
     //jQuery('#uploadPhotoStartid').css('display','none');
     //jQuery('#uploadPhotoid').show();
   }


	 $scope.uploadPhoto = function() {
	     $scope.fileReader = new FileReader;
	   var fileUploader =  document.getElementById("photoUpload");
		 if ( typeof fileUploader.files[0] !== 'undefined' ) {
		$scope.fileReader.callback = function(dataGiven){
			$scope.uploadFile(dataGiven, $scope.fileReader.ext);
		};
	       $scope.fileReader.onloadend = function() {
			  var result =  $scope.fileReader.result.replace(/.*base64.*,/, "");
			   $scope.fileReader.callback(result);
		  };
    var fileExt = $scope.getFileExtension(fileUploader.files[0] );
      if(fileExt != ''){
		    $scope.fileReader.ext =  fileExt;
        $scope.fileReader.readAsDataURL( fileUploader.files[0] );
      }else{
        blpApp.warn("Could not upload file please select valid file");
      }
		} else {
		blpApp.warn("Could not upload file please select a file");
		}
	 }


	 $scope.getQRCodeMerchant = function( merchant ) {
	};
	 $scope.getQRCode = function(callback) {
		$http({
			'method': 'POST',
			'url': blpApp.baseUrl+"generics/_get_qr_code?id="+ $scope.currentMerchant.pk
		}).then(function( response ) {

			$scope.currentQRCode = response.data.data;
			callback();
		});
	};
	  $scope.getQRLink = function() {
		return blpApp.getMediaLink($scope.currentQRCode.fileName);
	 };
	$scope.getPhotoLink = function(photo) {
		return  blpApp.getMediaLink(photo.fields.blp_merchant_photo_filename);
		};
	  $scope.textArea = function() {
	 };
         jQuery(document).ready(function() {
	  $scope.init();
          });
	}]);

  blpApp.module.controller("blpAppLoginController", ['$scope','$http', '$interval', function($scope,$http,$interval) {
	$http.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded";
	 $scope.cities = blpApp.getCities();
	$scope.loginVendors = {
		"FACEBOOK": {},
		"GOOGLE": {},
		"TWITTER": {},
		"EMAIL": {}
	};
	 $scope.init = function() {
		 //$scope.currentCity=$scope.cities[0];
		var socialAuth = document.location.href.match(/social_auth=1/);

		if (socialAuth) {
			$scope.waitForFb( function() {
			    //blpApp.redirectLogin($scope.loginSocialPost);
			    //
			    //
                             $scope.loginSocialPost();
			});
		} else {


                            $http({
                                'url': blpApp.baseUrl+"generics/_get_cities",
                                'method': 'GET',
                               }).then(function(cities) {
                                   $scope.cities =cities.data.data;
                                   $scope.currentCity=$scope.cities[0];
                                        });
                     }

			/*
		$scope.getLoginAuth(function( vendors ) {
			$scope.loginVendors = vendors;
			for ( var i in $scope.loginVendors ) {
				$scope['initVendor'+$scope.loginVendors[i].name]($scope.loginVendors[i]);
			}
			var callbackCheck = null;
			if ((callbackCheck=document.location.href.match(/callback=(.*)/))) {
				$scope['initVendor'+ callbackCheck[1].slice(0,1).toUpperCase()+callbackCheck[1].slice(1,callbackCheck[1].length)]();
			}


		});
			*/
	 };
	$scope.waitForFb = function(callback) {
		$scope.fbInterval = setInterval(function() {
			if ( blpApp.fbLoaded )  {
				callback() ;
				clearInterval($scope.fbInterval);
			}
		  }, 100);
	};

         $scope.getResetHash = function(){
                var matches = document.location.href.match(/\?hash=(.*)/);
                return matches ? matches[1] : false;
         };

         $scope.forwardReset = function(newPassword, type) {
                var hash =  $scope.getResetHash();
               if ( hash ) {
                $http({
                        "method": "POST",
                        "data": {"hash": hash, "password": newPassword},
                       "url": blpApp.baseUrl+"generics/_reset_"+ type,
                        "headers": {
                                "Content-Type": "application/x-www-form-urlencoded"
                        }
                }).then(function(responseData) {
                        if ( responseData.data.status === blpApp.statusCodes.OK ) {
                                var userObj = responseData.data.user;
                                blpApp.warn("You have reset your password. You will be redirected and logged in","success", function() {

                                        if ( type === "user" ) {
                                                $scope.forwardLogin("user",
                                                userObj.fields.blp_customer_email,
                                                newPassword,
                                                blpApp.baseUrl+"home/index");
                                       } else {
                                                 $scope.forwardLogin("venue",
                                                 userObj.fields.blp_merchant_email,
                                                newPassword,
                                                blpApp.baseUrl+"home/index");
                                        }
                                });

                        } else {
                           blpApp.warn("Could not reset the password please ensure this is a valid attempt","error");
                         }
                });
              } else {
                blpApp.warn("Could not find reset hash");
              }
         };




         $scope.forwardForgot =  function(typeOfForgot, username) {
                 $http({
                       "method": "POST",
                       "data": {"username":username},
                        "url": blpApp.baseUrl+"generics/_forgot_"+typeOfForgot,
                        "headers": {
                                "Content-Type": "application/x-www-form-urlencoded"
                        }
                  }).then(function(responseData) {
                        if ( responseData.data.status === blpApp.statusCodes.OK) {
                                blpApp.warn("Your reset instructions were emailed to you", "success");
                        } else{
                                blpApp.warn("Could not reset the password. Please make sure this is a valid account", "error");
                        }
                });
         };


	 $scope.forwardLogin = function(typeOfLogin /** user or venue  or social **/, username, password, urlAfter, socialUserFirstName, socialUserLastName) {
		$http({
			"method": "POST",
			"data": {"username": username, "password": password, "socialUserFirstName": socialUserFirstName, "socialUserLastName": socialUserLastName},
			"url": blpApp.baseUrl+"generics/_login_"+typeOfLogin,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		 }).then(function( responseData ) {
			if ( responseData.data.status === blpApp.statusCodes.OK ) {
				//if (_i
         //blpApp.route(urlAfter);
         window.location.reload();
			  } else {
				  //blpApp.warn("Could not login. Please try again");
          blpApp.popupWarn("Invalid username or password");
          blpApp.popupVenueWarn("Invalid username or password");
        }
			});
	   };

	 $scope.forwardRegister=function(typeOfRegister,registerData,urlAfter) {
		var validation  =$scope.validateRegister(registerData);
		if ( isBoolean(validation) && validation ) {
      $("div#mydivloader").show();
			$http({
				"method": "POST",
				"data": registerData,
				"url": blpApp.baseUrl+"generics/_register_"+typeOfRegister,
				"headers": {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function( responseData ) {
				if (responseData.data.status === blpApp.statusCodes.OK ) {
          $("div#mydivloader").hide();
          if (typeOfRegister == 'user') {
            blpApp.warn("Thanks for registration, Verification mail have been sent to you. Please wait for page to reload.", "success");
          }else {
            blpApp.warn("Thank you for partnering with BLP! We just sent you a Verification email. Please click on it to get started!", "success");
          }
          
          setTimeout(function(){
            blpApp.route(urlAfter);
          }, 5000);

				} else {
          $("div#mydivloader").hide();
          if (typeOfRegister == 'user') {
            blpApp.warn("This email has already been used. Please click User Login to sign in");
          }else{            
					 blpApp.warn("This email has already been used. Please click Venue Login to sign in");
          }
				}
			});
		 } else {
	  		for ( var i in validation ) {
                                var errElement = jQuery("<div class='validation-box'></div>");
                                 jQuery(errElement).text( validation[i].msg );
                                 jQuery(errElement).css({
                                                "position": "absolute",
                                                "width": jQuery(validation[i].el).outerWidth(),
                                                "height": "40px",
                                                "top": (jQuery(validation[i].el).offset()['top']+jQuery(validation[i].el).outerHeight()),
                                                "left": (jQuery(validation[i].el).offset()['left'])
                                        });
                                    jQuery(document.body).append(errElement);
			}
		}
  	 };

          $scope.checkValidation = function( type, value ) {
                return blpApp.checkValidation(type, value);
          };

  	 $scope.validateRegister = function(registerFields) {
           var anyEmpty = false;
               for ( var i in registerFields ) {
                        if ( isUndefined(registerFields[i])) {
                                anyEmpty=true;
                        }
                }
                if (anyEmpty ) {
                        blpApp.warn("Please fill in every input field");
                       return false;
                 };


		//TODO
                var registrationOK = true;
                var registrationList = [];
                var usernameFields = [
                'registerUsername','registerVenueName'];
                var passwordFields = [
                        'registerPassword', 'registerVenuePassword'];
                var emailFields =  [
                'registerEmail', 'registerVenueEmail'];
                 var keysOf = Object.keys( registerFields );
                //if ( ! isUndefined(registerFields.username) &&  !$scope.checkValidation("username",registerFields.reigisterUsername) ) {
                 //      registrationList.push({
                 //                      "el": jQuery("#"+"registerUsername"),
                 //                      "msg": "Registration username was not between 6 and 12 characters"
                 //       });
                 //}
                if ( !isUndefined(registerFields.registerPassword)  && !$scope.checkValidation("password", registerFields.registerPassword )) {
                        registrationList.push({
                                        "el": jQuery("#registerPassword"),
                                        "msg": "Registration password not between limit"
                        });
                 }
                if ( !isUndefined(registerFields.registerEmail) && !$scope.checkValidation("email", registerFields.registerEmail) ){
                        registrationList.push({
                                        "el": jQuery("#registerEmail"),
                                        "msg": "Not a valid email"
                        });
                }
                if ( !isUndefined(registerFields.venueName) && !$scope.checkValidation("username", registerFields.venueName))   {
                         registrationList.push({
                                 "el": jQuery("#registerVenueName"),
                                   "msg": "Username too short or too long"
                                });
                }
                 if ( !isUndefined(registerFields.venuePassword) && !$scope.checkValidation("password", registerFields.venuePassword)) {
                         registrationList.push({
                                "el": jQuery("#registerVenuePassword"),
                                 "msg": "Password too short or too long"
                                });
                    }
               if ( !isUndefined(registerFields.venueEmail) && !$scope.checkValidation("email", registerFields.venueEmail)) {
                        registrationList.push({
                                "el": jQuery("#registerVenueEmail"),
                                "msg": "Not a valid email"
                        });
                }

                  return registrationList.length > 0 ?registrationList : registrationOK;



	 };
	 $scope.serialize = function(objOfData) {

	    var dataString="";
	    for ( var i in objOfData ) {
		 dataString+=i+"="+encodeURIComponent(objOfData[i]);
		}
	 	return dataString;
	 };


	 $scope.loginUser = function() {
	    var username = jQuery("#loginEmail").val();
	    var password = jQuery("#loginPassword").val();
             if ((username === "" || isUndefined(username))

                 && (password === "" || isUndefined(password))) {
                  blpApp.popupWarn("Please enter your Email and Password");
              } else if ((username === "" || isUndefined(username))) {
                blpApp.popupWarn("Please enter your Email");
              } else if ((password === "" || isUndefined(password))) {
                blpApp.popupWarn("Please enter your Password");
              } else {

	    $scope.forwardLogin("user",username,password, blpApp.baseUrl+"home/index");
               }
	  };
 	 $scope.loginVenue = function() {
	    var username = jQuery("#venueEmail").val();
	    var password = jQuery("#venuePassword").val();
               if ((username === "" || isUndefined(username))
                        && (password === "" || isUndefined(password))) {
                 blpApp.popupVenueWarn("Please enter your Email and Password");
                } else if ((username === "" || isUndefined(username))) {
                  blpApp.popupVenueWarn("Please enter your Email");
                } else if ((password === "" || isUndefined(password))) {
                  blpApp.popupVenueWarn("Please enter your Password");
                } else {
	   $scope.forwardLogin("venue", username, password, blpApp.baseUrl+"user/manage_details");
                }
	 };
         $scope.forgotGeneric = function(type, username) {
             var username= jQuery("#forgotEmail").val();
            $scope.forwardForgot(type,username, function(data) {

              });
         };
         $scope.forgotVenue = function() {
           var venueName = jQuery("#forgotEmail").val();
           var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
           if ((venueName === "" || isUndefined(venueName))) {
              blpApp.warn("Please enter your Email", "error");
            } else if(!pattern.test(venueName)) {
              blpApp.warn("Please enter valid Email", "error");
            } else {
              $scope.forgotGeneric("venue");
            }
         };
         $scope.forgotUser = function() {
          var userEmail = jQuery("#forgotEmail").val();
          var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            if ((userEmail === "" || isUndefined(userEmail))) {
              blpApp.warn("Please enter your Email", "error");
            } else if(!pattern.test(userEmail)) {
              blpApp.warn("Please enter valid Email", "error");
            } else {
             $scope.forgotGeneric("user");
            }
         };
         $scope.resetGeneric = function(type) {
             var hash = $scope.getResetHash();
             var newPassword = jQuery("#resetPassword").val();
              $scope.forwardReset(newPassword,type, function(data) {
                });
         };
         $scope.resetVenue = function() {
          var resetPass = jQuery("#resetPassword").val();
          var resetConfirmPass = jQuery("#resetConfirmPassword").val();
           if (resetPass === "" || isUndefined(resetPass)) {
              blpApp.warn("Please enter new password", "error");
            } else if(resetPass.length < 6 || resetPass.length > 20) {
              blpApp.warn("New password length should be 6-20 characters", "error");
            } else if(resetConfirmPass === "" || isUndefined(resetConfirmPass)){
              blpApp.warn("Please enter confirm password", "error");
            } else if(resetPass != resetConfirmPass){
              blpApp.warn("New password and confirm password should be same", "error");
            } else {
              $scope.resetGeneric("venue");
            }
         };
         $scope.resetUser = function() {
          var resetPass = jQuery("#resetPassword").val();
          var resetConfirmPass = jQuery("#resetConfirmPassword").val();
           if (resetPass === "" || isUndefined(resetPass)) {
              blpApp.warn("Please enter new password", "error");
            } else if(resetPass.length < 6 || resetPass.length > 20) {
              blpApp.warn("New password length should be 6-20 characters", "error");
            } else if(resetConfirmPass === "" || isUndefined(resetConfirmPass)){
              blpApp.warn("Please enter confirm password", "error");
            } else if(resetPass != resetConfirmPass){
              blpApp.warn("New password and confirm password should be same", "error");
            } else {
              $scope.resetGeneric("user");
            }
         };
	 $scope.loginSocial = function(email) {
    //console.log(FB);
     	FB.getLoginStatus(function(response) {
        FB.login(function(response) {
          if (response) {
            statusChangeCallback(response, $scope);
          }
           }, {"scope": "email,public_profile"});


        });
		//$scope.forwardLogin("social", email, null, blpApp.baseUrl+"/home/index");
	  };
 	  $scope.loginSocialPost = function() {
	 	FB.getLoginStatus(function(response) {
	  	 if ( response.status === 'connected' ) {
		   var accessToken =  FB.getAccessToken();
		  FB.api("/me?fields=email,first_name,last_name",  function(response) {
           $scope.forwardLogin("social", response.email, null, blpApp.baseUrl+"home/index", response.first_name, response.last_name);
        });
	 	 }
		});
	   };
	 $scope.getUserRegisterFields = function() {
		return {
			"registerFirstName": jQuery.trim(jQuery("#registerFirstName").val()),
			"registerLastName": jQuery("#registerLastName").val(),
			"registerEmail": jQuery("#registerEmail").val(),
			"confirmEmail": jQuery("#confirmEmail").val(),
			"registerPassword": jQuery("#registerPassword").val(),
      "registerConfirmPassword": jQuery("#registerConfirmPassword").val()
		};
	};
	 	 $scope.registerUser = function() {
	  	var registerFields = $scope.getUserRegisterFields();
      var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        if(registerFields.registerFirstName == ''){
            blpApp.warn("Please enter First name", "error");
        } else if(registerFields.registerLastName == '') {
            blpApp.warn("Please enter Last name", "error");
        } else if(registerFields.registerEmail == '') {
            blpApp.warn("Please enter user Email", "error");
        } else if(registerFields.confirmEmail == '') {
            blpApp.warn("Please enter confirmation Email", "error");
        } else if(!pattern.test(registerFields.registerEmail)) {
            blpApp.warn("Please enter valid Email", "error");
        } else if(registerFields.registerEmail != registerFields.confirmEmail) {
            blpApp.warn("Email & Confirm email must be same", "error");
        } else if(registerFields.registerPassword == '') {
            blpApp.warn("Please enter Password", "error");
        } else if(registerFields.registerPassword.length < 6 || registerFields.registerPassword.length > 20) {
            blpApp.warn("Password length should be 6-20 characters", "error");
        }  else if(registerFields.registerConfirmPassword == '') {
            blpApp.warn("Please enter Confirm password", "error");
        } else if(registerFields.registerPassword != registerFields.registerConfirmPassword) {
            blpApp.warn("Password & Confirm password must be same", "error");
        } else {
	 	   $scope.forwardRegister("user", registerFields, blpApp.baseUrl+"home/index");
        }
	 };

   $scope.getVenueRegisterFields = function() {
    return {
      "venueName": jQuery.trim(jQuery("#registerVenueName").val()),
      //"venueDescription": jQuery("#registerVenueDescription").val(),
      "venuePhoneNumber": jQuery.trim(jQuery("#registerVenuePhoneNumber").val()),
      "venueEmail": jQuery.trim(jQuery("#registerVenueEmail").val()),
      "venuePassword": jQuery.trim(jQuery("#registerVenuePassword").val()),
      "venueCity": jQuery.trim(jQuery("#registerVenueCity").val()),
      "registerConfirmPassword": jQuery.trim(jQuery("#registerVenueConfirmationCode").val())
     };
   };

 	 $scope.registerVenue = function() {
    var registerFields = $scope.getVenueRegisterFields();
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    var filter =   /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if(registerFields.venueName == ''){
            blpApp.warn("Please enter Name", "error");
            $(document).find('#registerVenueName').focus();
        } else if(registerFields.venueEmail == '') {
            blpApp.warn("Please enter Email", "error");
            $(document).find('#registerVenueEmail').focus();
        } else if(!pattern.test(registerFields.venueEmail)) {
            blpApp.warn("Please enter valid Email", "error");
            $(document).find('#registerVenueEmail').focus();
        } else if(registerFields.venuePhoneNumber == '') {
            blpApp.warn("Please enter Phone number", "error");
            $(document).find('#registerVenuePhoneNumber').focus();
        } else if(!filter.test(registerFields.venuePhoneNumber)) {
              blpApp.warn("Please enter correct phone number format", "error");
              $(document).find('#venuePhoneNumber').focus();
        } else if(registerFields.venuePassword == '') {
            blpApp.warn("Please enter Password", "error");
            $(document).find('#registerVenuePassword').focus();
        } else if(registerFields.venuePassword.length < 6 || registerFields.venuePassword.length > 20) {
            blpApp.warn("Password length should be 6-20 characters", "error");
            $(document).find('#registerVenuePassword').focus();
        } else if(registerFields.registerConfirmPassword == '') {
            blpApp.warn("Please enter Confirm password", "error");
            $(document).find('#registerVenueConfirmationCode').focus();
        } else if(registerFields.venuePassword != registerFields.registerConfirmPassword) {
            blpApp.warn("Password & Confirm password should be same", "error");
            $(document).find('#registerVenueConfirmationCode').focus();
        } else {
          $scope.forwardRegister("venue", registerFields, blpApp.baseUrl+"user/manage_details");
        }
	 	 /*var registerFields = $scope.getVenueRegisterFields();
		 $scope.forwardRegister("venue", registerFields, blpApp.baseUrl+"/user/manage_details");*/
	 };

	 $scope.getLoginAuth = function(callback) {
		$http({
			'method': 'GET',
			'url': blpApp.baseUrl+'generics/_login_vendors',
		}).then(function(data) {
			return callback( data.data );
		})
	 };

	 $scope.loginWith = function(type) {
		for ( var i in $scope.loginVendors) {
			if (  $scope.loginVendors[i].name===type && $scope.loginVendors[i].enabled ) {
				$scope['loginVendor'+$scope.loginVendors[i].name]();
			}
		}
	 };
	 $scope.initVendorFacebook = function(info) {
		FB.init({
			"clientId": info.social_client_id,
			"clientSecret": info.social_client_secret
		});
	 };
	$scope.initVendorEmail =function(info) {
		return {};
	 };
	$scope.loginVendorFacebook = function() {
		FB.getCurrentUser(function( user ) {
			 if ( !user ) {
			 // authenticate the user
			$scope.loginRedirect($scope.loginVendors['FACEBOOK']['redirect_url']);
			} else {
			$scope.vendorAuth( user );
			}
		 });
	 };
	 $scope.loginVendorEmail  =function() {
		$scope.vendorAuth( {
			"username": jQuery("#login_username").val(),
			"password": jQuery("#login_password").val()
		});
	  };
	 $scope.loginVendorFacebookCallback = function() {
		FB.getCurrentUser(function( user ) {
			$scope.vendorAuth( user );
		});
	 };
	 $scope.vendorAuth = function ( user ) {
		$http({
			'method': 'POST',
			'data': JSON.stringify(user),
			'headers': {
				'Content-Type': 'application/json'
			}
		}).then(function( returnResponse ) {
			if ( returnResponse.data.status === blpApp.statusCodes.OK ) {
				$scope.gotoMain();
			} else {
				$scope.warn("Could not login..");
			}
		});
	};
	 $scope.loginRedirect = function( redirectUrl ) {
		document.location.replace(redirectUri);
	 };


	 $scope.init();
  }]);

window.fbAsyncInit = function() {
//	 angular.bootstrap(document,['blpApp']);
//
//
//
//
    blpApp.fbLoaded=true;
};
window.gmapInit = function() {
  blpApp.gmapLoaded = true;
};

jQuery(document).ready(function() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
      var warnBoxHeight = jQuery("#warn_box").outerHeight();
      var warnBoxWidth = jQuery("#warn_box").outerWidth();
      /* jQuery("#warn_box").css({
                "position": "absolute",
                "top": (windowHeight/2)-(warnBoxHeight/2),
                "left": (windowWidth/2)-(warnBoxWidth/2)
                });*/


       if ( jQuery(".fb-btn") ) {
       var  fbBtnParent = jQuery(".fb-btn").parent();
        if (fbBtnParent) {
         jQuery(".fb-btn").css({
                     "position": "relative",
                     "left":(jQuery(fbBtnParent).outerWidth()/2)-(jQuery(".fb-btn").outerWidth()/2),
         });
          }
     }
});



jQuery(document).ready(function() {
    jQuery("#addSingleDay_quantity").ForceNumericQuantityOnly();
    jQuery("#addSingleDay_price").ForceNumericOnly();
    jQuery("#quantityReservation").ForceNumericQuantityOnly();
    jQuery("#addSingleDay_quantity").attr('maxlength','5');
    jQuery("#addSingleDay_price").attr('maxlength','5');
    jQuery("#quantityReservation").attr('maxlength','5');
    jQuery('#manageVenueTabs').tabs({
      activate: function(event, ui) {
        jQuery('#MerchantCalendar').fullCalendar('render');
      }
    });
    jQuery( ".addSingleDay_datepicker" ).datepicker({
      dateFormat: 'mm-dd-yy',
      minDate: 0
    });
    jQuery('.addSingleDay_datepickers').click( function() {
      jQuery('.addSingleDay_datepicker').datepicker("show");
    })
});

// Numeric only control handler
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 ||
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

// Numeric only control handler
jQuery.fn.ForceNumericQuantityOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 ||
                key == 9 ||
                key == 13 ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

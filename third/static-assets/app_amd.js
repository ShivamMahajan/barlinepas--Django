// AMD frontend use the Angular.JS
// library in processing views, and
// any needed RESTful activity
// @author Nadir Hamid

 var appAMD =window.appAMD || {};
appAMD.defaults = {
   "ajaxURL": "https://52.32.31.49:8001/"
};
appAMD.filterOptions= [];
appAMD.buildFilterOptions = function(initialElements) {
        
         for ( var i = 0; i != initialElements.length; i ++ ) {
             for ( var j = 0 ; j != initialElements[i].elementOptions.length;  j ++) {
              if (initialElements[i].elementOptions[j].elementType === 'select') {
                  initialElements[i].elementOptions[j].elementOptions = eval(initialElements[i].elementOptions[j].elementOptions);
              }
            }
         }
         return initialElements;
      };
appAMD.getFields = function(callback) {
         var httpRequest = jQuery.ajax({ 
            'type': 'POST',
            'url': appAMD.getEndpoint("search", "get_fields"),
            'dataType': 'json'
        }).done(function(response) {
            console.log("Filter Options");
            console.log(response);
            appAMD.filterOptions =  appAMD.buildFilterOptions(response);
            callback();
        });
      };


appAMD.onLoad = function(callback) {
   appAMD.getFields(callback);
};

appAMD.getEndpoint = function(endpointName, viewName) {
    return appAMD.defaults.ajaxURL+ endpointName + "/" + viewName;
};

appAMD.ensureTwo = function(input) {
    if ( input.toString().length === 2) {
        return input;
    }
    return "0"+input;
}
appAMD.getMonths = function() {
   var start = 1;
   var list = []; 
   while  (start != 12) {
        list.push(appAMD.ensureTwo(start));
        start ++;
   }

   return ['All'].concat(list);
};
appAMD.getList = function(list ) {
    return  ['All'].concat(list);
};
appAMD.yesNo = function() {
 return appAMD.getList(['Yes', 'No']);
};

appAMD.getAircraftCategories = function() {
   return appAMD.getList([
      'Airplane', 'Helicopter', 'Glider', 'Balloon','Blimp Or Dirigible', 'Ultralight', 'Gyroplane', 'Powered-Lift', 'Weight-Shift'
    ]);
};

appAMD.getAircraftDamageOptions = function() {
   return appAMD.getList([
      'All', 'Minor', 'Substancle', 'Destroyed'
    ]);
};
appAMD.getPurposeOfFlight = function() {
  return ['All'];
};
appAMD.getEngineTypes = function() {
  return appAMD.getList( [
    'Electric', 'Hybrid Rocket', 'Liquid Rocket', 'Turbo Jet', 'Turbo Fan', 'Turbo Prop', 'Unknown', 'Reciprocating']);
};

appAMD.getSchedule = function() {
  return appAMD.getList(['Scheduled', 'Non Scheduled']);
};
appAMD.getOperation = function() {
  return appAMD.getList([
          'All General Aviation', 'Part 91: General Aviation', 'Part 103: Ultralight', 'Part 121: Air Carrier', 'Part 125:20+Pax,6000+lbs', 'Part129:Foreign', 'Part133:Rotorcraft Ext. Load', 'Part 135:Air Taxi &  Commuter', 'Part 137:Agricultural', 'Non-U-S, Commercial'
    ]);
};
appAMD.getAirCarrier = function() {
  return ['All'];
};
appAMD.getReportStatus = function() {
  return appAMD.getList(['Prelimary', 'Factural', 'Probable Case']);
};
appAMD.getWeatherOptions = function() {
 return ['None', 'VMC', 'IMC'];
};
appAMD.getBoardPhase = function() {
  return appAMD.getList(['Approach', 'Climb', 'Cruise', 'Descent', 'Go-Around', 'Landing', 'Maneuvering', 'Other', 'Standing', 'Takeoff', 'Taxi']);
};

// get  cities known
//
appAMD.getCities = function() {
    return [];
};
appAMD.getCountries = function() {
    return [];
};

appAMD.getDate = function() {
   var dateNow = new Date;
   return dateNow.getFullYear() + "-"+ dateNow+ "-" + dateNow.getMonth() + "-"+ dateNow.getDate() + " " + dateNow.getHours() + ":" +dateNow.getMinutes() + ":"+dateNow.getSeconds();

};
var applicationReady = false;

  jQuery(document).ready(function() {
     appAMD.onLoad(function() {
  var mainModule = angular.module("searchApplication",[]);
  mainModule.config(function($interpolateProvider) {
      $interpolateProvider.startSymbol("[["); 
       $interpolateProvider.endSymbol("]]");
    });
  
     mainModule.controller("searchController", ['$scope','$http','$sce', function($scope,$http,$sce) {
        $scope.results = [];
        $scope.page = 0;
        $scope.pages = 0;
        $scope.countOfResults = 0;
        $scope.prevPageEnds=0; 
      
        $scope.pagesToShow = 3;  
        $scope.size = 10;
        $scope.lat = 0.00;
        $scope.lng = 0.00;
        $scope.searchBarSkin = "broad";
        $scope.user = {};
          

        $scope.pageOptions = [];

        $scope.filterOptions =  appAMD.filterOptions;
        $scope.resultOptions = [
          { 
             "name": "publicationDate",
             "elementType": "h4"
          },
          {
              "name": "model",
              "elementType": "h3"
          },
          {
              "name": "make",
              "elementType": "h3"
          },
          {
              "name": "engineType",
              "elementType": "small"
          },
          {
              "name": "airportName",
              "elementType": "small"
          }
        ];
       
        $scope.loadOnLoad = function() {      
        $scope.next = jQuery(".next-results");
        $scope.prev = jQuery(".previous-results");
        //$scope.title = jQuery("#title");
        //$scope.latEl = jQuery("#latitude");
        //$scope.lngEl = jQuery("#longitude");
        };

        $scope.getUser = function() { 
          return {};
        };

        $scope.reverse = function(list) {
            var len = list.length-1;
            var halflen = Math.floor(len/2);
            var rlen = list.length;
            for ( var i  = len; i >  halflen ; i -- ) {  
               
               var  temp = list[i];
               var delta = len-i;
                if ( i !== delta ) {
                 list[i] = list[ delta ];
                 list[ delta ] = temp;
                } else {
                   for ( var j  in list ) {
                      if ( list[i] >  list[j]  && list[i] < list[j+1] ) {
                           var temp1 = list[j];
                           list[j] = list[i];
                           list[i] =  temp;
                       }
                    }
                }
              }
            return list;
          };
               
        $scope.enumeratePagesBefore = function(amount) {
            if ( $scope.results.length>0 ) {
              var pagesNow =  $scope.page;
              var pagesToShow = $scope.pagesToShow;
              var pageAmount = $scope.pageAmount;
              var pageDifference = (pagesNow-pagesToShow)>=0 ?  (pagesNow-pagesToShow) : 0;
              var list = [];
              for ( var i = pagesNow; i >= pageDifference; i -- ) {
                  list.push( i );
              }
              $scope.prevPageEnds = i;
              return $scope.reverse(list);
            }
            return [];
        };
        $scope.enumeratePagesAfter = function(amount) {
            if ( $scope.results.length>0) {
             var pagesNow = $scope.page+1;
             var pagesToShow = $scope.pagesToShow;
              var pagesTotal = $scope.pageAmount;
              var diffAmount =  (pagesNow+pagesToShow)> pagesTotal? pagesTotal : (pagesNow+pagesToShow);
              var list =[];
            for ( var i = pagesNow;  i<= diffAmount; i ++ ) {
              list.push (i);
            }
              return list;
            }
            return [];
        };
  
            
    
        $scope.enumeratePages = function(amount) {
           var list =[];
            return list;
        };

        $scope.getResultHeading = function() {
          if ( $scope.results.length>0) {
            return $sce.trustAsHtml("Results Found ("+  $scope.countOfResults +")");
          }
          return $sce.trustAsHtml("No Results Were Found");
        };
        $scope.getFields = function(callback) {
           var httpRequest = jQuery.ajax({ 
              'type': 'POST',
              'url': appAMD.getEndpoint("search", "get_fields"),
              'dataType': 'json'
          }).done(function(response) {
              console.log("Filter Options");
              console.log(response);
              $scope.filterOptions = $scope.buildFilterOptions(response);
              callback();
          });
        };

        $scope.getSearchResults = function() {
           $scope.searchBarSkin = "compact";
           var opts = $scope.getFilterOptions();
           var httpRequest = jQuery.ajax({
                'type': 'POST',
                'data': JSON.stringify(opts),
                'url': appAMD.getEndpoint("search", "get_results"),
                'dataType': 'json'
            }).done(function(response) {
               console.log(response);
               $scope.results = response.results;
               $scope.pageAmount = response.pages;
               $scope.countOfResults = response.count; 
                if ( $scope.countOfResults > 100 ) {
                    jQuery($scope.next).show();
                    if( $scope.page > 0 ) {
                    jQuery($scope.prev).show();
                    } else {
                    jQuery($scope.prev).hide();
                    }
                 } else {
                    jQuery($scope.next).hide();
                    if ($scope.page > 0 ) {
                    jQuery($scope.prev).show();
                    } else {
                    jQuery($scope.prev).hide();
                    }
                 }
                $scope.$apply();
                  
            });
        };
        $scope.getMoreResults = function() {
           $scope.upAPage();
           $scope.getSearchResults(function() {
              $scope.scrollToResults();
           });
        };
        $scope.getLessResults = function() {
           $scope.downAPage();
           $scope.getSearchResults(function() {
              $scope.scrollToResults();
           });
        };
        $scope.getSpecificResults = function(page) {
            if  (page !== $scope.page ) {
           $scope.gotoPage(page);
           $scope.getSearchResults(); 
            }
        };
        $scope.getPageHTML = function(pageNumber ) {
            
            if(pageNumber === $scope.page ) {
              return $sce.trustAsHtml("<b>"+$scope.page+"</b>");
            }
            return $sce.trustAsHtml( "<span>"+ pageNumber+"</span>");
         };

        $scope.updateSearchAmount = function(amount){
           $scope.changeQueryAmount(amount);
           $scope.getSearchResults();
        };

        $scope.upAPage = function() {
           $scope.page+=1;
        };
        $scope.downAPage = function() {
            $scope.page-=1;
        };
        $scope.gotoPage = function(numberGiven) {
            $scope.page = numberGiven;
        };
        $scope.changeQueryAmount = function(amount) {
          
            $scope.size =amount;
        };
  
        $scope.buildFilterOptions = function(initialElements) {
          
           for ( var i = 0; i != initialElements.length; i ++ ) {
               for ( var j = 0 ; j != initialElements[i].elementOptions.length;  j ++) {
                if (initialElements[i].elementOptions[j].elementType === 'select') {
                    initialElements[i].elementOptions[j].elementOptions = eval(initialElements[i].elementOptions[j].elementOptions);
                }
              }
           }
           return initialElements;
        };



        $scope.buildinput = function(element) {
           return "<input class='filters' type='"+ element.elementSubType +"'  name='"+ element.name +"' id='"+ element.id +"' />";
        };
        $scope.buildselect = function(element) {
          var outerDiv = jQuery("<div></div>");
          var innerSelect = jQuery("<select></select>");
          jQuery(element.elementOptions).each(function() {
             var option = jQuery("<option></option>");
            jQuery(option).attr("value", this.toString());
            jQuery(option).text(this.toString());
          jQuery( innerSelect ).append(option);
          });
          jQuery (innerSelect).attr("name", element.id);
          jQuery(innerSelect).attr("id", element.id);
          jQuery(innerSelect).attr("class", "filters");
          jQuery(outerDiv).append( innerSelect );
          return jQuery(outerDiv).html();
        };
        $scope.getResultColumns = function() {
          var columns = [];
          jQuery( $scope.filterOptions ).each(function() {
              jQuery ( this.elementOptions ).each(function() {
                if ( this.onResult ) {
                    columns.push( this );
                }
              });
            });
           return columns;
        };
        $scope.buildResults = function() {
           var results = $scope.results;
        
           var resultsContainer = jQuery("<div></div>");
           var resultsContainerUl = jQuery("<ul></ul>");
           jQuery(results).each(function() {
             var liResult = jQuery("<li class='result-single-container'></li>");
             var liResultUl = jQuery("<ul></ul>");
              var result = this;
             jQuery($scope.getResultColumns()).each(function(){
                 var liColumn = jQuery("<li class='result-column-container'></li>");
                  var label = jQuery("<label></label>");
                 var  text = jQuery("<b></b>");
                  jQuery(label).text( this.title );
                  jQuery(text).text(  result[this.id]  );
                  jQuery(liColumn).append(label);
                  jQuery(liColumn).append(text);
                  jQuery(liColumn).append(jQuery("<div class='clear'></div>")); 
                 jQuery(liResultUl).append(liColumn);
              });
        
              jQuery(liResult).append(liResultUl);
              jQuery(liResult).append(jQuery("<div class='clear'></div>"));
              jQuery(resultsContainerUl).append( liResult );
              jQuery(resultsContainer).append( resultsContainerUl );
           });
           return $sce.trustAsHtml( jQuery(resultsContainer).html() );
        };

        $scope.buildElement = function(element) {
          var fullContents = jQuery("<div></div>");
          var label = jQuery("<label></label>");
          jQuery(label).html( element.title ); 
          jQuery(fullContents).append(label);
          var rawContents = $scope['build'+element.elementType](element);
          var filterDiv = jQuery("<div></div>");
          jQuery(filterDiv).html(rawContents);
          jQuery(fullContents).append(filterDiv);

          return $sce.trustAsHtml( jQuery(fullContents).html() );
        };
        $scope.getElement = function(elementId) {
          var foundElement = {};
           jQuery($scope.filterOptions).each(function(element) {
              jQuery(this.options).each(function() {
                if (  this.id === elementId ) {
                  foundElement = this;
                }
               });
           });
          return foundElement;
        };

        $scope.dateGet = function(element) {
          return $scope.basicPromiseGet(element);
      
        };
        $scope.descriptionGet = function(element) {
           return $scope.basicPromiseGet(element);
        };
        
        $scope.tagsGet = function(element) {
           var promise = new appAMD.promise(function(callback) {
             var list = [];
                
             jQuery("."+jQuery(element).attr("class")).each(function() {
                 list.push(jQuery(this).val());
             });
             return callback(false, list);
           });
           return promise;
             
        };
        $scope.titleGet = function() {
           return jQuery($scope.title).val();
        };
        $scope.latGet = function() {
           return jQuery($scope.latEl).val();
        };
        $scope.lngGet = function() {
          return jQuery($scope.lngEl).val();
        };

        $scope.resolveLatLngDestination = function(areaName,country) {
            country = country  || true;
            queryName =  (country? "country":"city");
            var resolveCountryservice = appAMD.getEndpoint("api", "geolocation",  {
                 queryName:areaName
            });
            var promise = new appAMD.promise(function(callback) {
          
              $http.get( resolveCountryservice, function( result ) {
                if ( typeof result.lat !== 'undefined' && typeof result.lng !== 'undefined' )  {
                     $scope.lat = lat;
                     $scope.lng = lng;
                     callback(false, {"lat":lat,  "lng": lng});
                 }
              });
            });
            return promise;
         };
                  

        // lng, lat of a country
        $scope.geolocationCountryGet = function(element) {
             return $scope.resolveLatLngDestination( jQuery(element).val(),true );
        };
        $scope.geolocationCityGet = function() {
             return $scope.resolveLatLngDestination( jQuery(element).val(), false);
        };
        $scope.getFilterOptions = function(callback) {
           var outputDictionary ={};
           var outputOuter = {};
           jQuery(".filters").each(function() {
              var elementName = jQuery(this).attr("id");
              var elementValue = jQuery(this).val();
              outputDictionary[elementName] = elementValue;
           });
              //outputOuter['title'] = $scope.titleGet();
              outputOuter['offset']= $scope.page*$scope.size;
              outputOuter['limit'] = $scope.size;

              //outputOuter['lat'] = $scope.latGet();
              //outputOuter['lng'] = $scope.lngGet();
              outputOuter['filters'] = outputDictionary;
              outputOuter['user'] = $scope.getUser();
              outputOuter['query'] = "";
             //treat title seperate
             return outputOuter; 
        };
        $scope.navigate = function(result) {
            // TODO
        };
        $scope.scrollToResults = function() {
           var offset = $("#results").offset();
           document.body.scrollTop =offset['top'];
        };


        $scope.loadOnLoad(); 


    }]); 
       angular.bootstrap(document,['searchApplication']);
   });
 });
//jQuery(document).ready(function() { 
//    angular.bootstrap(document, ['search']);
//
//});

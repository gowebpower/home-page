(function(){
   'use strict';

   // ** --------------------------- app setting & value **
    var app = angular.module('BP', ['ngRoute', 'ngAnimate' , 'ngResource', 'mgcrea.ngStrap' , 'ngMessages', 'hmTouchEvents']);
    app.value('appInfo', {
        title: 'Test App',
        version: '1.0.0',
        lastUpdated: '08-01-2015'
    });

    // ** --------------------------- config  **

    app.config(config) 
    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider){  
        $routeProvider
            .when('/', {
             templateUrl: 'views/home/',
             controller: 'homeCtrl'
            })

            .when('/works', {
             templateUrl: 'views/works/',
             controller: 'workCtrl'
            })

            .when('/works/:listId', {
             templateUrl: 'views/works/detail.html',
             controller: 'workCtrl'
            })

            .when('/about-me', {
             templateUrl: 'views/about-me/',
             controller: 'aboutMeCtrl'
            })

            .when('/about-this-site', {
             templateUrl: 'views/about-this-site/',
             controller: 'aboutThisWebCtrl'
            })

            .when('/contact', {
             templateUrl: 'views/contact/',
             controller: 'contactCtrl'
            })
         
            // .when('/orders/:customderId', {
            //   templateUrl: 'views/orders/',
            //   controller: 'orderController'
            // })

            // .otherwise({ redirectTo: '/'});
    }


   
   // ** --------------------------- controller  **

   // -----------former way to assign controller
   // app.controller('customersController', ['$scope', function($scope){
   //     $scope.testing = 'name';
   // }]);


   // -----------'easier read' way to assign controller.
   // app.controller('customersController', customersController);
   // customersController.$inject = ['$scope'];
   // function customersController($scope){
   //    $scope.testing = 'name';
   // }
  



   // Main Controller

    (function(){

        app.controller('mainCtrl', mainCtrl);
        mainCtrl.$inject = ['$scope', 'appInfo', '$location', '$routeParams', 'f_preloader', 'f_isMobile'];

        function mainCtrl($scope, appInfo, $location, $routeParams, f_preloader, f_isMobile){
            $scope.appInfo = appInfo;


            // ----------------------- Get Current Location Path.
            // Somehow url must be watched in order to get the path updated.
            $scope.$watch(
                function(){
                    return $location.url();
                },
                function(newValue){
                    $scope.currentPage = newValue
                }
            );

          
            // ----------------------- Header Menu Event
            $scope.headerMenu = 'inactive';
            $scope.showHeadrMenu = function(){
                if ( $scope.headerMenu === null || $scope.headerMenu === 'inactive' ){
                    $scope.headerMenu = "active";
                }
                
                else { 
                    $scope.headerMenu = "inactive";
                }
            };
            $scope.isHeaderMenuOpen = function(){
                if( $scope.headerMenu = "active" ){
                    $scope.headerMenu = "inactive";
                }
            };


            // ----------------------- Video BG.

            /* hide video bg on ipad or other tablets */
            
            $scope.isMobile = function(){
                return f_isMobile;
            }


            // ----------------------- f_preloader
            $scope.isPreloadLoading = true;
            $scope.isPreloadSuccessful = false;
            $scope.preloadLoaded = 0;
            // I am the image SRC values to preload and display./
            // --
            // NOTE: "cache" attribute is to prevent images from caching in the
            // browser (for the sake of the demo).
            $scope.preloadImages = [
               "images/bg_global.jpg",
               "images/bg_about-me.jpg",
               "images/bg_about-me2.jpg",
               "images/bg_about-me3.jpg",
               "images/bg_about-me4.jpg"
            ]
            // Preload the images; then, update display when returned.
            f_preloader.preloadImages( $scope.preloadImages ).then(
                function handleResolve( preloadImages ) {
                    // Loading was successful.
                    $scope.isPreloadLoading = false;
                    $scope.isPreloadSuccessful = true;
                    console.info( "Preload Successful" );
                },
                function handleReject( preloadImages ) {
                    // Loading failed on at least one image.
                    $scope.isPreloadLoading = false;
                    $scope.isPreloadSuccessful = false;
                    console.error( "Image Failed", imageLocation );
                    console.info( "Preload Failure" );
                },
                function handleNotify( event ) {
                    $scope.preloadLoaded = event.percent +'%';
                    console.info( "Percent loaded:", $scope.preloadLoaded );
                }
            );

        }

    })();


    // Home Controller

    (function(){

        app.controller('homeCtrl', homeCtrl);
        homeCtrl.$inject = ['$scope', 'appInfo'];

        function homeCtrl($scope, appInfo){

            // $scope.animatedLogo;
            // var animatedLogo = function(col, row){ 
            //     var width = 0,
            //         height = 0;


            //     var runInterval = setInterval(function(){ 
            //         width -= 175;

            //         if(width === -1750) { 
            //             if ( height === -508 ){
            //                 clearInterval(runInterval);
            //                 return;
            //             }
            //             width = 0;
            //             height -= 127;

                        
            //         }

            //         $scope.animatedLogo = width + 'px ' + height +'px';
            //         $scope.$apply();
            //     }, 18);

                
            // }
            // animatedLogo(10, 6);
        }

    })();

    // Listing Page and Detail Page Controller

    (function(){

        app.controller('workCtrl', workCtrl);
        workCtrl.$inject = ['$scope', '$location', '$resource', '$routeParams', '$q','s_myWork', '$timeout'];

        function workCtrl($scope, $location, $resource, $routeParams, $q, s_myWork, $timeout){

            // Init Variables

            $scope.currentId = $routeParams.listId;
            $scope.allWorks = [];
            $scope.imageGallery = [];
            // to show loading untill the images loads.
            // var imageGalleryPromises = []; 
            // hold on untill certain actions.
            // var deferred; 
            $scope.currentWork;
            $scope.currentFilter = localStorage['BP.listingFilter'] ? localStorage['BP.listingFilter'] : '';
            $scope.showImageGallery = null;
            $scope.showLoading = true;


            // -----------------------  Listing pages

            // Save filter Setting in html local storage.
            $scope.filterSetting = function($event){
                $scope.currentFilter = $event.target.value;
                localStorage['BP.listingFilter'] = $scope.currentFilter
            }
            
            // get thumbnail for the Listing Page
            $scope.getThumnailListing = function(listId){
                return 'url("images/works/' + listId + '/thumbnail.jpg")';
            };

            // link
            $scope.gotoList = function(listId){
                $location.path('works/' + listId);
            };


            // get data from JSON. need to use .then since query returns promise(i think.)
            s_myWork.query().$promise.then(function(data){

                // $scope.currentWork = data[$scope.currentId-1];
                
                $scope.allWorks = data;

                // ----- In detail pages
                if ( $scope.currentId ) {

                    // Get Current Work.
                    $scope.currentWork = _.find($scope.allWorks, function (i) {
                        return i.id === $scope.currentId;
                    });

                    // Get Images Array for the Currrent Work
                    getImages($scope.currentWork.images);
                    console.log($scope.imageGallery);
                }


                // Show Loading Untill The Images Loads
        
                // $q.all(imageGalleryPromises).then(function(){

                //     setInterval(function (){
                //         $scope.showLoading = false;
                //         $scope.$apply();
                //     }, 430);
                // });


            });


            // -----------------------  Detail Page


            // get thumbnail for the Listing Page
            //imgPath data from getImages() -> imageGallery.thumbnail
            $scope.getThumnailDetail = {
                background: function(imgPath){
                    return 'url("' + imgPath + '") center top #eee';
                }
            };


            // ----- Slide For the Detail Page

            $scope.currentIndex = 0;

            // Show Image Gallery by clicking on thumbnails

            $scope.toggleImageGallery = function(index){
                if ( $scope.showImageGallery === null || $scope.showImageGallery === 'inactive' ){
                    $scope.setCurrentSlideIndex(index);
                    $timeout(function(){
                        $scope.showImageGallery = "active";
                    }, 50);   
                }
                else { 
                    $scope.showImageGallery = "inactive";
                }
            };
  

            // Set Current Slide
            $scope.setCurrentSlideIndex = function (index) {
                $scope.currentIndex = index;
            };

            // check if the argument is the current Slide
             $scope.isCurrentSlideIndex = function (index) {
                return $scope.currentIndex === index;
            };

            // UI Prev and Next Buttons
            $scope.nextSlide = function () {
                $scope.currentIndex = ($scope.currentIndex < $scope.imageGallery.length - 1) ? ++$scope.currentIndex : 0;
            };

            $scope.prevSlide = function () {
                $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.imageGallery.length - 1;
            };

     
            // ----- Get Images Array For The Image Gallery
            var getImages = function(quantity){
                $scope.imagePath =  'images/works/' + $routeParams.listId;
                $scope.imageGallery = [];

                // imageGalleryPromises = [];

                for ( var i = 0; i < quantity; i++) { 
                    // deferred = $q.defer();
                    
                    $scope.imageGallery.push({ 
                        image: $scope.imagePath + '/work' + i + '.jpg', 
                        thumbnail: $scope.imagePath + '/work' + i + '_t.jpg',
                        showLoading: true,
                        // resolve: deferred.resolve,

                        // run this once each thumbnail image loads from directive
                        callback: function(list){
                            
                            hideLoading(this);
                            // _this.resolve();
                            
                        }

                    });
                    // // push deferred of each thumbnail.
                    // imageGalleryPromises.push(deferred.promise);
                }


                // hideloading
                var hideLoading = function($this){
                    setTimeout(function (){
                        $this.showLoading = false;
                        // console.log(_this);
                        $scope.$apply();
                    }, 300);
                };

            };

        }

    })();



    angular.module('BP')
      .directive('loading', function(){
        return {
            restrict: 'A',
            scope: {
                isrc: '=',
                onloadimg: '&'
            },
            replace: true,
            template:'<img ng-src="{{isrc}}" class="display-none">',
            link: function(scope, ele, attr){

                ele.on('load', function(){
                    scope.onloadimg();
                    // console.log('loaded');
                });           
            }
        };
    });




    // About This Web Page Controller

    (function(){

        app.controller('aboutThisWebCtrl', aboutThisWebCtrl);
        aboutThisWebCtrl.$inject = ['$scope'];

        function aboutThisWebCtrl($scope){
            
            
        }

    })();

    // About Me Page Controller

    (function(){

        app.controller('aboutMeCtrl', aboutMeCtrl);
        aboutMeCtrl.$inject = ['$scope', 'f_carousel', 'f_aboutExperience'];

        function aboutMeCtrl($scope, f_carousel, f_aboutExperience){
            

            
            // -----------------------  f_carousel
            var carousel = f_carousel.load(4);


            // ---------- UI for the view

            $scope.carousel = {
                currentSection: function(){
                    return carousel.currentSection;
                },
                btnNext: function(){
                    return carousel.btnNext;
                }, 
                btnPre: function(){
                    return carousel.btnPre;
                },
                currentDetail: function(){
                    return carousel.currentDetail;
                },
                goNext: carousel.goNext.bind( carousel ),
                goPre: carousel.goPre.bind( carousel ),
                setCurrent: carousel.setCurrent.bind( carousel ),
                showDetail: carousel.showDetail.bind( carousel )
            }


            // -----------------------  Experience

            var aboutExperience = f_aboutExperience.load();

            // ---------- UI for the view

            $scope.aboutExperience = {
                setCurrent: aboutExperience.setCurrent.bind( aboutExperience ),
                currentSection: function(){
                    return aboutExperience.currentSection;
                }
            };
           
          
            
        }
    })();

    // Contact Page Controller
    (function(){

        app.controller('contactCtrl', contactCtrl);
        contactCtrl.$inject = ['$scope', '$http'];

        function contactCtrl($scope, $http){

            $scope.contact = {};
            $scope.isFormSent = false;

            $scope.submitForm = function() {
           
                if ($scope.contactForm.$valid) { 
                    
                    $http({
                        method  : 'POST',
                        url     : 'views/contact/send-email.php',
                        data    : $scope.contact,
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
                    }).success(function(data){
                        console.log(data);
                        if (data.success) { //success comes from the return json object
                            $scope.isFormSent = true;
                        } else {
                            $scope.messageHelper = 'Uh oh something went wrong. Please try again.';
                            $scope.showMessageHelper = true;
                        }
                    });
                } else {
                    $scope.messageHelper = 'Please write valid information in each input.';
                    $scope.showMessageHelper = true;
                }
            }
        }

    })();


})();







 
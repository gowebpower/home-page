;(function(){
    'use strict';

    //  Not using this service yet.

    angular.module('BP').factory('f_carousel', f_carousel);
    f_carousel.$inject = ['$rootScope'];

    function f_carousel($rootScope){

        // ---
        // Class ( Constructor )
        // ---

        function Carousel( totalSections ) {
            this.currentSection = 1;
            this.totalSections = totalSections;
            this.btnNext = true;
            this.btnPre = false;
            this.currentDetail = '';
        }


        // ---
        // STATIC METHODS.
        // ---
        
        // Initiate with its own obj (Creating a Class Instance)
        Carousel.load = function( totalSections ) {
            var carousel = new Carousel( totalSections );
            return( carousel );
        };


        // ---
        // INSTANCE METHODS.
        // ---

        Carousel.prototype = {

            // -------------
            // Public Methods
            // -------------

            // Click Event for the Next btn
            getCurrentSection: function getCurrentSection() {
                return this.currentSection;
                 
            },

            // Click Event for the Next btn
            goNext: function goNext() {
                if ( !this.isLastSection() ){
                    this.showDetail('');
                    this.currentSection++;
                    this.updateBtnVisibility();
                }
            },

            // Click Event for the Previous btn
            goPre: function goPre() {
                if ( !this.isFirstSection() ){
                    this.showDetail('');
                    this.currentSection--;
                    this.updateBtnVisibility();
                }
            },

            // Click Event for the bottom Navi
            setCurrent: function setCurrent( currentSection ) {
                this.showDetail('');
                this.currentSection = currentSection;
                this.updateBtnVisibility();
            },

            // Click Event for showing detail
            showDetail: function showDetail(which){
                this.currentDetail = which;
                // $scope.stopScroll = true;
                // if( $scope.currentDetail === ''){
                //     $scope.stopScroll = false; 
                // }
            },



            // Show Btns In View

            // showBtnNext: function showBtnNext(){
            //     return this.btnNext;
            // },

            // showBtnPre: function showBtnPre(){
            //     return this.btnPre;
            // },

            // -------------
            // Private Methods
            // -------------

            // Update Buttn Visiblitlity

            updateBtnVisibility: function updateBtnVisibility() {
                 
                if ( this.isLastSection() ){
                    this.btnNext = false;
                    this.btnPre = true;
                }
                else if ( this.isFirstSection() ){
                    this.btnPre = false;
                    this.btnNext = true;
                }
                else { 
                    this.btnPre = true;
                    this.btnNext = true;
                }
            },

            // is currentSection last section
            isLastSection: function isLastSection() {
                return this.currentSection == this.totalSections;
            },

            // is currentSection first section

            isFirstSection: function isFirstSection() {
                return this.currentSection == 1;
            }

        }

        // Return the factory instance.
        return( Carousel );

        
    }
})();


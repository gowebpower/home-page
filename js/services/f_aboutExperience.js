;(function(){
    'use strict';

    angular.module('BP').factory('f_aboutExperience', f_aboutExperience);
    f_aboutExperience.$inject = ['$rootScope'];

    function f_aboutExperience($rootScope){

        // ---
        // Class ( Constructor )
        // ---

        function aboutExperience() {
            this.currentSection = 1;
        }


        // ---
        // STATIC METHODS.
        // ---
        // Make own object and Initiate it
     
        aboutExperience.load = function() {
            var experience = new aboutExperience();
            return( experience );
        };


        // ---
        // INSTANCE METHODS.
        // ---

        aboutExperience.prototype = {
            // Click Event for the Navi
            setCurrent: function setCurrent( currentSection ) {
                this.currentSection = currentSection;
            }            

        }

        // Return the factory instance.
        return( aboutExperience );
        
    }
})();


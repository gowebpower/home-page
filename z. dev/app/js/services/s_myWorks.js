;(function(){
    'use strict';


    angular.module('BP').service('s_myWork', s_myWork);
    s_myWork.$inject = ['$resource'];

    function s_myWork($resource){
        return $resource('ajax/works.json');
       
    }


})();


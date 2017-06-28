(function (){
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService ($http,ApiBasePath){
        var service = this;

        service.checkTerm = function (item) {
            if ( item.description.indexOf(service.searchItem) === -1) {
                console.log("Removing item:", item, ", ",item.name)
                return false;
            }
            else {
                return true;
            }
        }
        
        service.getMatchedMenuItems = function (searchItem) {

            service.searchItem = searchItem;
            return $http({
                method: "GET",
                url: ( ApiBasePath + "/menu_items.json" )
            })
            .then(function (result) {
                // process result and only keep items that match
                var foundItems = result.data.menu_items;

                var x;
                console.log('FoundItems number:', foundItems.length);
                console.log('searchItem:', searchItem)

                if ( service.searchItem != "" ) {

                    foundItems = foundItems.filter(service.checkTerm);
                }
                
                // return processed items
                console.log('FoundItems number:', foundItems.length);
                return foundItems;
            })
            .catch(function (error){
                console.log(error)
            });
        };

    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController (MenuSearchService) {
        var narrowIt = this;

        narrowIt.searchItem = "";

        //narrowIt.found = [];

        narrowIt.getItems = function (searchItem){
            var promise = MenuSearchService.getMatchedMenuItems(searchItem);
            //console.log("Promise: ", promise);
            promise.then(function (response) {
                narrowIt.found = response;
                //console.log("Response: ", response);
                //console.log("Found2: ", narrowIt.found)
            })
            .catch(function (error) {
                console.log(error);
            });            
            //console.log("Found: ", narrowIt.found);
        };

        
        
    }
})()
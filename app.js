(function (){
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    function FoundItems( ) {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'            
            },
            controller: narrowDirectiveController,
            controllerAs: 'narrowIt',
            bindToController: true
        };

        return ddo;
    }

    function narrowDirectiveController () {
        var narrowIt = this;
    }


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
                service.fullList = foundItems.length;

                if ( service.searchItem != "" ) {

                    foundItems = foundItems.filter(service.checkTerm);
                }
                
                // return processed items
                console.log('FoundItems number:', foundItems.length);
                service.filteredList = foundItems.length;
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
        narrowIt.filteredList = 0;
        narrowIt.fullList = 0;
        //narrowIt.found = [];

        narrowIt.getItems = function (searchItem){
            var promise = MenuSearchService.getMatchedMenuItems(searchItem);
            //console.log("Promise: ", promise);
            promise.then(function (response) {
                narrowIt.found = response;
                narrowIt.filteredList = MenuSearchService.filteredList;
                narrowIt.fullList = MenuSearchService.fullList;
                //console.log("Response: ", response);
                //console.log("Found2: ", narrowIt.found)
            })
            .catch(function (error) {
                console.log(error);
            });            
            //console.log("Found: ", narrowIt.found);
        };

       narrowIt.removeItem = function (itemIndex) {
            console.log("'this' is: ", this);
            console.log("removing item:", itemIndex )
            narrowIt.found.splice(itemIndex,1);
            narrowIt.filteredList = narrowIt.found.length;
        }; 
                
    }
})()
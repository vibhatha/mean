// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' controller
angular.module('smartplugs').controller('SmartPlugsController', ['$scope', '$routeParams', '$location', 'Authentication', 'SmartPlugs',
    function($scope, $routeParams, $location, Authentication, SmartPlugs) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new articles
        $scope.create = function() {
        	// Use the form fields to create a new article $resource object
            var smartplug = new SmartPlugs({
                sid: this.sid,
                name: this.name,
                type:this.type,
                device:this.device
            });

            // Use the article '$save' method to send an appropriate POST request
            smartplug.$save(function(response) {
            	// If an article was created successfully, redirect the user to the article's page 
                $location.path('smartplugs/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of articles
        $scope.find = function() {
        	// Use the article 'query' method to send an appropriate GET request
            $scope.smartplugs = SmartPlugs.query();
        };

        // Create a new controller method for retrieving a single article
        $scope.findOne = function() {
        	// Use the article 'get' method to send an appropriate GET request
            $scope.smartplug = SmartPlugs.get({
                smartplugId: $routeParams.smartplugId
            });
        };

        // Create a new controller method for updating a single article
        $scope.update = function() {
        	// Use the article '$update' method to send an appropriate PUT request
            $scope.smartplug.$update(function() {
            	// If an article was updated successfully, redirect the user to the article's page 
                $location.path('smartplugs/' + $scope.smartplug._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single article
        $scope.delete = function(smartplug) {
        	// If an article was sent to the method, delete it
            if (smartplug) {
            	// Use the article '$remove' method to delete the article
                article.$remove(function() {
                	// Remove the article from the articles list
                    for (var i in $scope.smartplugs) {
                        if ($scope.smartplugs[i] === smartplug) {
                            $scope.smartplugs.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the article '$remove' method to delete the article
                $scope.smartplug.$remove(function() {
                    $location.path('smartplugs');
                });
            }
        };
    }
]);
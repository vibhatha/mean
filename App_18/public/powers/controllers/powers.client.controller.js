// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Powers' controller
angular.module('powers').controller('PowersController', ['$scope', '$routeParams', '$location', 'Authentication', 'Powers','Devices',
    function($scope, $routeParams, $location, Authentication, Powers,Devices) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new Powers
        $scope.create = function() {
        	// Use the form fields to create a new Power $resource object
            
            var Power = new Powers({
                pid: this.pid,
                name: this.name,
                consumption: this.consumption,
                devices: this.devices._id
            });

            // Use the Power '$save' method to send an appropriate POST request
            Power.$save(function(response) {
            	// If an Power was created successfully, redirect the user to the Power's page 
                $location.path('powers/' + response._id);
                console.log("Saved Power");
                console.log(response);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of Powers
        $scope.find = function() {
        	// Use the Power 'query' method to send an appropriate GET request
            $scope.powers = Powers.query();
            console.log("Power Length: "+$scope.powers.length);
        };

        // Create a new controller method for retrieving a single Power
        $scope.findOne = function() {
        	// Use the Power 'get' method to send an appropriate GET request
            $scope.power = Powers.get({
                powerId: $routeParams.powerId
            });
        };
        
        

        // Create a new controller method for updating a single Power
        $scope.update = function() {
        	// Use the device '$update' method to send an appropriate PUT request
            $scope.power.$update(function() {
            	// If an device was updated successfully, redirect the user to the device's page 
                $location.path('powers/' + $scope.power._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single Power
        $scope.delete = function(power) {
        	// If an Power was sent to the method, delete it
            if (power) {
            	// Use the Power '$remove' method to delete the Power
                Power.$remove(function() {
                	// Remove the Power from the Powers list
                    for (var i in $scope.powers) {
                        if ($scope.powers[i] === power) {
                            $scope.powers.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the Power '$remove' method to delete the Power
                $scope.power.$remove(function() {
                    $location.path('powers');
                });
            }
        };
        
        
        //retrieving all the Smart Plugs currently created
        
        $scope.findDevices = function() {
        	// Use the Power 'query' method to send an appropriate GET request
            $scope.deviceList = Devices.query();
            $scope.selectedDevice = $scope.deviceList[1];
            
        };
        
        $scope.findDevices();
        
        
    }
]);
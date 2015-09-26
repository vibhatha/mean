// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'devices' controller
angular.module('devices').controller('DevicesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Devices','SmartPlugs',
    function($scope, $routeParams, $location, Authentication, Devices,SmartPlugs) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new devices
        $scope.create = function() {
        	// Use the form fields to create a new device $resource object
           
            var device = new Devices({
                did: this.did,
                name: this.name,
                type: this.type,
                model: this.model,
                smartplugs: this.smartplugs
            });

            // Use the device '$save' method to send an appropriate POST request
            device.$save(function(response) {
            	// If an device was created successfully, redirect the user to the device's page 
                $location.path('devices/' + response._id);
              
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of devices
        $scope.find = function() {
        	// Use the device 'query' method to send an appropriate GET request
            $scope.devices = Devices.query();
        };

        // Create a new controller method for retrieving a single device
        $scope.findOne = function() {
        	// Use the device 'get' method to send an appropriate GET request
            $scope.device = Devices.get({
                deviceId: $routeParams.deviceId
            },function(data){
               
                    SmartPlugs.get({smartplugId:data.smartplugs[data.smartplugs.length-1]},function(data1){
                    $scope.device.smartplugs = data1._id;
                   // data.smartplugs = data1.name;
                   // data.selectedsmartplug = 1;
                    console.log('Earlier Smart Plug: '+data1.name)
                    
                })
                console.log(data)    
            });
            
            //detect the device connected smartplug
            
        };
        
        

        // Create a new controller method for updating a single device
        $scope.update = function() {
        	// Use the device '$update' method to send an appropriate PUT request
            $scope.device.$update(function() {
            	// If an device was updated successfully, redirect the user to the device's page 
                $location.path('devices/' + $scope.device._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single device
        $scope.delete = function(device) {
        	// If an device was sent to the method, delete it
            if (device) {
            	// Use the device '$remove' method to delete the device
                device.$remove(function() {
                	// Remove the device from the devices list
                    for (var i in $scope.devices) {
                        if ($scope.devices[i] === device) {
                            $scope.devices.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the device '$remove' method to delete the device
                $scope.device.$remove(function() {
                    $location.path('devices');
                });
            }
        };
        
        
        //retrieving all the Smart Plugs currently created
        
        $scope.findSmartPlugs = function() {
        	// Use the device 'query' method to send an appropriate GET request
            $scope.smartpluglist = SmartPlugs.query();
            $scope.selectedSmartPlug = $scope.smartpluglist[1];
            
        };
        
        $scope.findSmartPlugs();
        
        
    }
]);
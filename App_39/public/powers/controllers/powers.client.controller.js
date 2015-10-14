// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Powers' controller
angular.module('powers').controller('PowersController', ['$scope', '$routeParams', '$location', 'Authentication', 'Powers','Devices','SmartPlugs',
    function($scope, $routeParams, $location, Authentication, Powers,Devices,SmartPlugs) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;
        
        
        
        var powerList ={};
        
        powerList._id='';
        powerList.creator ='';
        powerList.devices='';
        powerList.smartplugs='';
        powerList.consumption='';
        powerList.pid='';
        powerList.created='';
        
        $scope.powers= powerList;
        
        
        $scope.init = function(){
            
            
        
        };
        

        // Create a new controller method for creating new Powers
        $scope.create = function() {
        	// Use the form fields to create a new Power $resource object
            
            var Power = new Powers({
                pid: this.pid,
                name: this.name,
                consumption: this.consumption,
                devices: this.devices,
                smartplugs: this.smartplugs
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
            var powers=[];
            $scope.powers = Powers.query({}, function() {
                    
                  var count=0;
                  angular.forEach($scope.powers, function(power, key) {
                            
                      
                      var idevice = Devices.get({deviceId:power.devices},function(){
                            
                           power.devices=idevice.name;
                      });
                      var ismartplug = SmartPlugs.get({smartplugId:power.smartplugs},function(){
                      
                           power.smartplugs=ismartplug.name;  
                      });
                                                    
                      
                      count++;
                  });//end of loop

                powers = $scope.powers;
            });//end of query
            
          return   powers;
        };
        

        // Create a new controller method for retrieving a single Power
        $scope.findOne = function() {
        	// Use the Power 'get' method to send an appropriate GET request
            $scope.power = Powers.get({powerId: $routeParams.powerId});
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
            $scope.devices1 = $scope.deviceList[1];
            
        };
        
       $scope.findDevices();
        
        $scope.findSmartPlugs = function() {
        	// Use the device 'query' method to send an appropriate GET request
            $scope.smartplugList = SmartPlugs.query();
            $scope.smartplugs1 = $scope.smartplugList[1];
            
        };
        
        
        
      
       $scope.findSmartPlugs();
        
           
        
        
        
    }
]);